import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import useDialog from "hooks/useDialog";
import MenuDrawer from "./MenuDrawer";

interface MovieAppBarProps {
  onSearchInputChange: (query: string) => void;
}

const MovieAppBar = ({ onSearchInputChange }: MovieAppBarProps) => {
  const theme = useTheme();
  const {
    dialogOpen: menuOpen,
    openDialog: openMenuDialog,
    closeDialog: closeMenuDialog,
  } = useDialog();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 0,
              display: { xs: "none", sm: "block" },
              marginRight: 2,
              width: "fit-content",
            }}
          >
            我的電影網
          </Typography>

          {/* 搜尋欄 */}
          <Box
            sx={{
              position: "relative",
              borderRadius: 1,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)" },
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: "100%",
                position: "absolute",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="搜尋電影..."
              onChange={(e) => onSearchInputChange(e.target.value)}
              sx={{
                color: "inherit",
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                width: "100%",
              }}
            />
          </Box>
          {/* Menu Icon - Adjust the box to prevent overflow */}
          <IconButton
            color="inherit"
            sx={{
              borderRadius: "4px",
              padding: { xs: 1, sm: 2 },
            }}
            onClick={openMenuDialog}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MenuDrawer open={menuOpen} onClose={closeMenuDialog} />
    </>
  );
};

export default MovieAppBar;
