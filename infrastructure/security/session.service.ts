import axios, { AxiosInstance } from "axios";
import { getApiConfig, URL_DICTIONARY } from "../config/api.config";
import { RefreshTokenResponse } from "@/domain/entities/auth.entity";
import { useAuthStore } from "@/application/stores/useAuthStore";
import { savePendingRoute } from "@/application/stores/usePendingRouteStore";

/**
 * Coordinador de sesión: única puerta al refresh de tokens y al logout forzado.
 *
 * El refresh se hace con un axios "pelado" (sin interceptores) para que un 401 en
 * el propio endpoint de refresh NO dispare otro refresh (evita recursión).
 *
 * Las llamadas concurrentes se deduplican con una promesa compartida: si varias
 * peticiones reciben 401 a la vez, solo se ejecuta un refresh y todas reusan su
 * resultado. Esto es imprescindible porque el backend ROTA el refreshToken: dos
 * refresh en paralelo con el mismo token harían que el segundo falle y cerraría
 * la sesión sin motivo.
 */

// axios sin interceptores. Lazy para no leer la config en tiempo de import.
let bareClient: AxiosInstance | null = null;
function getBareClient(): AxiosInstance {
  if (!bareClient) {
    bareClient = axios.create({ baseURL: getApiConfig().scrapper });
  }
  return bareClient;
}

// Promesa de refresh en curso (dedup de llamadas concurrentes).
let refreshPromise: Promise<string> | null = null;

/**
 * Renueva el accessToken usando el refreshToken del store.
 * Devuelve el nuevo accessToken o lanza si no hay refreshToken o el backend lo rechaza.
 */
export function refreshAccessToken(): Promise<string> {
  refreshPromise ??= (async () => {
    // Leer SIEMPRE fresco del store (soporta rotación y sincronía entre pestañas).
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      throw new Error("No hay refreshToken disponible");
    }

    const { data } = await getBareClient().post<RefreshTokenResponse>(
      URL_DICTIONARY.AUTH_REFRESH,
      { refreshToken }
    );

    const tokens = data?.data;
    if (!tokens?.accessToken) {
      throw new Error("Respuesta de refresh inválida");
    }

    // Guardar el par nuevo (rotación) y renovar la cookie del middleware.
    useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

/**
 * Cierra la sesión y lleva al login. Único punto de logout: lo usan tanto el
 * interceptor (cuando el refresh falla) como cualquier flujo que necesite salir.
 */
export function forceLogout(): void {
  useAuthStore.getState().clearAuth();
  if (globalThis.window !== undefined) {
    // Recordar a dónde volver tras re-loguearse.
    savePendingRoute();
    globalThis.location.href = "/login";
  }
}
