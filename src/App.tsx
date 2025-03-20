import { createTheme, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import MainRouter from "./features/MainRouter";

// 創建深色主題
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
      <CssBaseline />
      <Stack sx={{ height: "100svh", width: "100svw" }}>
        <MainRouter />
      </Stack>
    </ThemeProvider>
  );
};

export default App;
