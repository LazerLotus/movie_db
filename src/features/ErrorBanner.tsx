import CloseIcon from "@mui/icons-material/Close";
import { Alert, IconButton, Snackbar } from "@mui/material";
import { useError } from "./ErrorContext";

export const ErrorBanner = () => {
  const { error, clearError } = useError();
  const isErrorShow = Boolean(error);

  return (
    <Snackbar
      open={isErrorShow}
      autoHideDuration={5000}
      onClose={clearError}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity="error"
        variant="filled"
        elevation={6}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={clearError}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    </Snackbar>
  );
};
