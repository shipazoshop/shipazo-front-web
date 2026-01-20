"use client";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  duration: number;
  showSnackbar: (message: string, severity: SnackbarSeverity, duration?: number) => void;
  hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  duration: 4000, // duración por defecto
  showSnackbar: (message: string, severity: SnackbarSeverity, duration = 4000) => {
    set({ open: true, message, severity, duration });
  },
  hideSnackbar: () => {
    set({ open: false });
  },
}));

// Selectores con shallow equality para evitar re-renders innecesarios
export const useSnackbar = () => useSnackbarStore(
  useShallow((state) => ({
    open: state.open,
    message: state.message,
    severity: state.severity,
    duration: state.duration,
  }))
);

export const useShowSnackbar = () => useSnackbarStore((state) => state.showSnackbar);
export const useHideSnackbar = () => useSnackbarStore((state) => state.hideSnackbar);
