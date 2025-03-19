import {
  Bookmark as BookmarkIcon,
  Movie as MovieIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MenuDrawer = ({ open, onClose }: MenuDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isWatchlist = location.pathname === "/watchlist";
  const handleHomeClick = () => {
    navigate("/");
    onClose();
  };
  const handleWatchlistClick = () => {
    navigate("/watchlist");
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width: "240px",
        flexShrink: 0,
      }}
    >
      <Box sx={{ mt: 2 }}>
        <List>
          <ListItemButton onClick={handleHomeClick} selected={isHome}>
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary="探索電影" />
          </ListItemButton>
          <ListItemButton onClick={handleWatchlistClick} selected={isWatchlist}>
            <ListItemIcon>
              <BookmarkIcon />
            </ListItemIcon>
            <ListItemText primary="待看清單" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
