"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { encryptionService } from "@/infrastructure";

interface AuthStore {
  // State
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // Indica si el store ya se hidrato desde localStorage

  // Actions
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
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
      isAuthenticated: false,
      isHydrated: false,

      // Actions
      setAccessToken: (token: string) => {
        set({
          accessToken: token,
          isAuthenticated: true,
        });

        // Emitir cookie de sesión ligera para el middleware (sin CryptoJS)
        fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        }).catch(() => {});
      },

      clearAuth: () => {
        set({
          accessToken: null,
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
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();

        // Si el usuario ya tenía sesión, renovar la cookie de middleware
        if (globalThis.window !== undefined && state?.isAuthenticated && state?.accessToken) {
          fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: state.accessToken }),
          }).catch(() => {});
        }
      },
    }
  )
);

// Selectors
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);
export const useSetAccessToken = () => useAuthStore((state) => state.setAccessToken);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);
