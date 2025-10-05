import { ApiService, getApiConfig } from "../config/api.config";
import { AxiosHttpClient } from "./axios-client";
import { HttpClient } from "./http-client.interface";

export class HttpClientFactory {
  private static clients = new Map<string, HttpClient>();

  static getClient(service: ApiService, authToken?: string): HttpClient {
    const config = getApiConfig();
    const baseURL = config[service];
    
    if (!baseURL) {
      throw new Error(`API URL not configured for service: ${service}`);
    }

    const key = `${service}-${authToken || 'public'}`;
    
    if (!this.clients.has(key)) {
      const client = new AxiosHttpClient(baseURL, authToken);
      this.clients.set(key, client);
    }

    return this.clients.get(key)!;
  }

  static updateAuthToken(service: ApiService, authToken: string): void {
    const config = getApiConfig();
    const baseURL = config[service];
    const key = `${service}-${authToken}`;
    
    const client = new AxiosHttpClient(baseURL, authToken);
    this.clients.set(key, client);
  }

  static clearClients(): void {
    this.clients.clear();
  }
}