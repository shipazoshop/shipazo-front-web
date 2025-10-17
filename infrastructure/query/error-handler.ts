import { ApiError, NotFoundError, UnauthorizedError } from "@/domain/errors/api.errors";
import axios from "axios";

export interface ErrorHandler {
  handle(error: any): void;
}

export class ApiErrorHandler implements ErrorHandler {
  constructor(
    private readonly onUnauthorized?: () => void,
    private readonly onNotFound?: () => void,
    private readonly onServerError?: (error: ApiError) => void
  ) {}

  handle(error: any): void {
    if (axios.isAxiosError(error)) {
      // Error de red (sin respuesta del servidor)
      if (!error.response) {
        const networkError = new ApiError(
          0,
          error.code === 'ECONNABORTED'
            ? 'Request timeout - El servidor no respondió a tiempo'
            : error.code === 'ERR_NETWORK' || error.message.includes('Network Error')
            ? 'Error de red - No se pudo conectar al servidor'
            : error.message
        );
        if (this.onServerError) {
          this.onServerError(networkError);
        }
        throw networkError;
      }

      // Error con respuesta del servidor
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      switch (status) {
        case 401:
          if (this.onUnauthorized) {
            this.onUnauthorized();
          }
          throw new UnauthorizedError(message);

        case 404:
          if (this.onNotFound) {
            this.onNotFound();
          }
          throw new NotFoundError(message);

        case 500:
        case 502:
        case 503:
          const serverError = new ApiError(status, message);
          if (this.onServerError) {
            this.onServerError(serverError);
          }
          throw serverError;

        default:
          throw new ApiError(status, message);
      }
    }

    throw error;
  }
}