import { ApiService, getApiConfig } from "../config/api.config";
import { AxiosHttpClient } from "./axios-client";
import { HttpClient } from "./http-client.interface";
import { useAuthStore } from "@/application/stores/useAuthStore";

export class HttpClientFactory {
  // Un cliente por servicio. El token NO forma parte de la clave: el cliente lo
  // lee vivo del store en cada request vía el tokenProvider, así que no hay
  // instancias obsoletas ni fugas al renovar/rotar el token.
  private static readonly clients = new Map<ApiService, HttpClient>();

  static getClient(service: ApiService): HttpClient {
    const baseURL = getApiConfig()[service];

    if (!baseURL) {
      throw new Error(`API URL not configured for service: ${service}`);
    }

    if (!this.clients.has(service)) {
      const client = new AxiosHttpClient(
        baseURL,
        () => useAuthStore.getState().accessToken
      );
      this.clients.set(service, client);
    }

    return this.clients.get(service)!;
  }
}
