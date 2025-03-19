import { useCallback, useState } from "react";

const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);
  return {
    dialogOpen,
    openDialog,
    closeDialog,
  };
};

export default useDialog;
