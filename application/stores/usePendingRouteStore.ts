"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Store de "ruta pendiente".
 *
 * Guarda a dónde debe volver el usuario después de iniciar sesión cuando su
 * sesión no existía o expiró en medio de un proceso (checkout, validación de
 * NIT, formularios, etc.). El flujo típico:
 *
 *   1. Un 401 (o una acción que exige login) llama a `savePendingRoute()`.
 *   2. Se redirige a /login y luego al OAuth de Google.
 *   3. Al volver, /callback llama a `consumePendingRoute()` y navega ahí.
 *
 * Se persiste en sessionStorage para sobrevivir el full-reload y el ida-y-vuelta
 * del OAuth, y se limpia al consumirse para evitar redirecciones fantasma.
 */
interface PendingRouteState {
  hasPendingRoute: boolean;
  route: string | null;
  setPendingRoute: (route: string) => void;
  clearPendingRoute: () => void;
}

export const usePendingRouteStore = create<PendingRouteState>()(
  persist(
    (set) => ({
      hasPendingRoute: false,
      route: null,
      setPendingRoute: (route) => set({ hasPendingRoute: true, route }),
      clearPendingRoute: () => set({ hasPendingRoute: false, route: null }),
    }),
    {
      name: "pending-route",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// Rutas que nunca deben guardarse como pendientes (evita bucles de redirección).
const EXCLUDED_ROUTES = new Set(["/login", "/callback", "/home/callback", "/home", "/"]);

/**
 * Guarda una ruta pendiente. Si no se pasa `route`, usa la ruta actual del
 * navegador (pathname + query). Usable fuera de React (ej. interceptor de axios).
 */
export const savePendingRoute = (route?: string): void => {
  if (typeof window === "undefined") return;

  const path = route ?? window.location.pathname + window.location.search;
  const pathnameOnly = path.split("?")[0];

  if (EXCLUDED_ROUTES.has(pathnameOnly)) return;

  usePendingRouteStore.getState().setPendingRoute(path);
};

/**
 * Lee y limpia la ruta pendiente. Devuelve la ruta guardada o `null` si no hay.
 * Usable fuera de React.
 */
export const consumePendingRoute = (): string | null => {
  const { hasPendingRoute, route, clearPendingRoute } = usePendingRouteStore.getState();
  if (hasPendingRoute && route) {
    clearPendingRoute();
    return route;
  }
  return null;
};

// Selectors (para uso reactivo dentro de componentes)
export const useHasPendingRoute = () => usePendingRouteStore((s) => s.hasPendingRoute);
export const usePendingRoute = () => usePendingRouteStore((s) => s.route);
