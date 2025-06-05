import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5", // Indigo
      light: "#818cf8",
      dark: "#3730a3",
      gradient: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
    },
    secondary: {
      main: "#10b981", // Emerald
      light: "#34d399",
      dark: "#059669",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
      gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          "&:hover": {
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            transform: "translateY(-1px)",
            transition: "all 0.2s ease-in-out",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover fieldset": {
              borderColor: "#4f46e5",
            },
          },
        },
      },
    },
  },
});

export default theme;
