import { ApiError, NotFoundError, UnauthorizedError } from "@/domain/errors/api.errors";
import axios from "axios";

export interface ErrorHandler {
  handle(error: any): void;
}

export class ApiErrorHandler implements ErrorHandler {
  constructor(
    private onUnauthorized?: () => void,
    private onNotFound?: () => void,
    private onServerError?: (error: ApiError) => void
  ) {}

  handle(error: any): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

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
          throw new ApiError(status || 500, message);
      }
    }

    throw error;
  }
}