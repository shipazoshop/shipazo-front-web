import { createTheme } from "@mui/material/styles";

// Tema personalizado para el módulo admin que coincide con los colores de la marca
export const adminTheme = createTheme({
  palette: {
    primary: {
      main: "#ff3d3d", // Brand Red
      dark: "#D80027", // Brand Red Dark
      light: "#ff6b6b",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#004ec3", // Brand Blue
      dark: "#003a92",
      light: "#3d7dd8",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ff3d3d",
      light: "#ff6b6b",
      dark: "#D80027",
    },
    warning: {
      main: "#FCB500", // Brand Yellow
      light: "#FFDC00",
      dark: "#d89e00",
    },
    info: {
      main: "#004ec3", // Brand Blue
      light: "#3d7dd8",
      dark: "#003a92",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#ebebeb",
      300: "#e1e1e1",
      400: "#BFC6CC",
      500: "#909090",
      600: "#73787d",
      700: "#505050",
      800: "#333e48",
      900: "#333333",
    },
    text: {
      primary: "#333333",
      secondary: "#505050",
      disabled: "#909090",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    divider: "#e1e1e1",
  },
  typography: {
    fontFamily: 'var(--font-inter), "Inter", sans-serif',
    h1: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // Botones sin mayúsculas
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8, // Bordes más redondeados y modernos
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 4px 8px rgba(0, 0, 0, 0.08)",
    "0px 8px 16px rgba(0, 0, 0, 0.1)",
    "0px 12px 24px rgba(0, 0, 0, 0.12)",
    "0px 16px 32px rgba(0, 0, 0, 0.14)",
    "0px 20px 40px rgba(0, 0, 0, 0.16)",
    "0px 24px 48px rgba(0, 0, 0, 0.18)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 20px",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "0px 2px 4px rgba(255, 61, 61, 0.2)",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(255, 61, 61, 0.3)",
          },
        },
        outlined: {
          borderWidth: 1.5,
          "&:hover": {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        },
        elevation1: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        },
        elevation2: {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
        },
        colorSuccess: {
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          borderColor: "#4caf50",
        },
        colorWarning: {
          backgroundColor: "#fff8e1",
          color: "#f57c00",
          borderColor: "#FCB500",
        },
        colorError: {
          backgroundColor: "#ffebee",
          color: "#c62828",
          borderColor: "#ff3d3d",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#fafafa",
          fontWeight: 700,
          color: "#333333",
          borderBottom: "2px solid #e1e1e1",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
});
