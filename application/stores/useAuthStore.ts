import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  // State
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

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
