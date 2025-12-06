import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { encryptionService } from "@/infrastructure";

interface AuthStore {
  // State
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
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

      // Actions
      setAccessToken: (token: string) => {
        set({
          accessToken: token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      storage: createJSONStorage(() => encryptedStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useSetAccessToken = () => useAuthStore((state) => state.setAccessToken);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);
