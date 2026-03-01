"use client";

import React, { useEffect, useRef } from "react";
import { useSnackbar, useHideSnackbar } from "@/application/stores/useSnackbarStore";

export function GlobalSnackbar() {
  const { open, message, severity, duration } = useSnackbar();
  const hideSnackbar = useHideSnackbar();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(hideSnackbar, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, duration, hideSnackbar]);

  if (!open) return null;

  return (
    <div className={`snackbar snackbar--${severity}`} role="alert" aria-live="polite">
      <span className="snackbar__message">{message}</span>
      <button className="snackbar__close" onClick={hideSnackbar} aria-label="Cerrar">
        ✕
      </button>
    </div>
  );
}
