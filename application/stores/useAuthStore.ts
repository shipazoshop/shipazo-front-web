"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
// Import directo (no el barrel @/infrastructure) para evitar un ciclo:
// barrel → security → session.service → useAuthStore → barrel.
import { encryptionService } from "@/infrastructure/security/encryption.service";

interface AuthStore {
  // State
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // Indica si el store ya se hidrato desde localStorage

  // Actions
  setAccessToken: (token: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

/**
 * Emite/renueva la cookie de sesión ligera que consume el middleware (Edge).
 * Se dispara al establecer tokens (login o refresh). Silenciosa a propósito: un
 * fallo aquí no debe romper el flujo del cliente, pero se registra en consola.
 */
function syncSessionCookie(accessToken: string): void {
  if (globalThis.window === undefined) return;
  fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  }).catch((error) => {
    console.warn("No se pudo sincronizar la cookie de sesión:", error);
  });
}

// Storage encriptado personalizado
const encryptedStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const encryptedValue = localStorage.getItem(name);
    if (!encryptedValue) return null;

    try {
      // Desencriptar el valor completo del storage
      const decrypted = encryptionService.decrypt(encryptedValue);
      return decrypted || null;
    } catch (error) {
      console.error('Error al desencriptar storage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      // Encriptar el valor completo antes de guardarlo
      const encrypted = encryptionService.encrypt(value);
      localStorage.setItem(name, encrypted);
    } catch (error) {
      console.error('Error al encriptar storage:', error);
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      // Actions
      setAccessToken: (token: string) => {
        set({
          accessToken: token,
          isAuthenticated: true,
        });

        // Emitir cookie de sesión ligera para el middleware (sin CryptoJS)
        syncSessionCookie(token);
      },

      // Establece el par de tokens (login vía exchange y renovación vía refresh).
      setTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        syncSessionCookie(accessToken);
      },

      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        // Eliminar cookie de sesión del middleware
        fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});

        // Eliminar la cookie de autenticación del cliente
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      storage: createJSONStorage(() => encryptedStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();

        // Si el usuario ya tenía sesión, renovar la cookie de middleware
        if (globalThis.window !== undefined && state?.isAuthenticated && state?.accessToken) {
          syncSessionCookie(state.accessToken);
        }
      },
    }
  )
);

// Sincronización entre pestañas: cuando otra pestaña actualiza el storage (p.ej.
// tras un refresh que rota los tokens), rehidratamos este store para no quedarnos
// con un refreshToken viejo en memoria que ya fue invalidado.
if (globalThis.window !== undefined) {
  globalThis.addEventListener("storage", (event) => {
    if (event.key === "auth-storage") {
      useAuthStore.persist.rehydrate();
    }
  });
}

// Selectors
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);
export const useSetAccessToken = () => useAuthStore((state) => state.setAccessToken);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);
