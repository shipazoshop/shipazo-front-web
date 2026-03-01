"use client";

import { type ReactNode, useState, useEffect } from "react";

type Props = Readonly<{ children: ReactNode }>;

/**
 * Carga ThemeProvider + CssBaseline de MUI de forma diferida.
 * Los children se renderizan inmediatamente — MUI hidrata en segundo plano.
 * Esto evita que el bundle de MUI bloquee el render inicial de las rutas
 * que lo necesitan (/admin, /configurations, /orders).
 */
export default function MuiProvider({ children }: Props) {
  const [Provider, setProvider] = useState<React.ComponentType<Props> | null>(null);

  useEffect(() => {
    Promise.all([
      import("@mui/material/styles"),
      import("@mui/material/CssBaseline"),
      import("@/presentation/theme/adminTheme"),
    ]).then(([{ ThemeProvider }, { default: CssBaseline }, { adminTheme }]) => {
      const Wrapped = ({ children }: Props) => (
        <ThemeProvider theme={adminTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      );
      Wrapped.displayName = "MuiThemeWrapper";
      setProvider(() => Wrapped);
    });
  }, []);

  // Renderiza children directamente mientras MUI carga.
  // Los skeletons de cada sección ya manejan el estado visual de carga.
  if (!Provider) return <>{children}</>;

  return <Provider>{children}</Provider>;
}
