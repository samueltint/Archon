import { ThemeProvider } from "@mui/material/styles";
import { type Theme as MuiTheme, createTheme } from "@mui/material/styles";
import OBR, { type Theme } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

/**
 * Create a MUI theme based off of the current OBR theme
 */
function getTheme(theme?: Theme) {
  return createTheme({
    typography: {
      fontFamily: '"Red Hat Text", serif',
      fontSize: 18,
      lineHeight: 1.45,
      letterSpacing: "0.18px",
      h1: {
        fontSize: "56px",
        fontWeight: 500,
        letterSpacing: "-1.68px",
        margin: "32px 0",
      },
      h2: {
        fontSize: "24px",
        fontWeight: 500,
        letterSpacing: "-0.24px",
        margin: "0 0 8px",
        lineHeight: "118%",
      },
    },
    palette: theme
      ? {
          mode: theme.mode === "LIGHT" ? "light" : "dark",
          text: theme.text,
          primary: theme.primary,
          secondary: theme.secondary,
          background: theme?.background,
        }
      : undefined,
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  });
}

/**
 * Provide a MUI theme with the same palette as the parent OBR window
 */
export function PluginThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [theme, setTheme] = useState<MuiTheme>(() => getTheme());
  useEffect(() => {
    const updateTheme = (theme: Theme) => {
      setTheme(getTheme(theme));
    };
    OBR.theme.getTheme().then(updateTheme);
    return OBR.theme.onChange(updateTheme);
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
