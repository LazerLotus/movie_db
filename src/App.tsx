import { createTheme, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { ErrorBanner } from "features/ErrorBanner";
import { ErrorProvider } from "features/ErrorContext";
import MainRouter from "./features/MainRouter";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ErrorProvider>
        <CssBaseline />
        <Stack sx={{ height: "100svh", width: "100svw" }}>
          <MainRouter />
        </Stack>
        <ErrorBanner />
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default App;
