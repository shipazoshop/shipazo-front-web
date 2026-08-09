"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { adminTheme } from "@/presentation/theme/adminTheme";

type Props = Readonly<{ children: ReactNode }>;

/**
 * Provee el tema de MUI de forma SÍNCRONA (SSR + primer render de cliente).
 *
 * El wrapper `.mui-scope` marca todo el subárbol MUI (admin/configurations/orders)
 * para que los estilos globales del storefront (SCSS legacy: reset y _form.scss)
 * no se filtren a los componentes MUI. `display: contents` evita que el div
 * genere una caja propia y altere el layout de los shells.
 *
 * El orden de inyección de Emotion lo garantiza AppRouterCacheProvider (root layout),
 * de modo que las clases de MUI ganan por especificidad a las reglas legacy a nivel
 * de elemento desde el primer paint (sin flash ni FOUC).
 */
export default function MuiProvider({ children }: Props) {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <div className="mui-scope" style={{ display: "contents" }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
