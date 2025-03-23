import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { api, Movie } from "services/api";

interface MovieCardProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
}

export const MovieCard = ({
  movie,
  onMovieClick,
  isInWatchlist,
  onToggleWatchlist,
}: MovieCardProps) => {
  const imageUrl = api.getImageUrl(movie.poster_path);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          transform: "scale(1.02)",
          transition: "transform 0.2s",
        },
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={movie.title}
        sx={{
          cursor: "pointer",
          height: 400,
          objectFit: "cover",
        }}
        onClick={() => onMovieClick(movie)}
        onError={() => {
          console.log("Error loading image");
          return <Skeleton variant="rectangular" height={400} />;
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "50%",
        }}
      >
        <Tooltip title={isInWatchlist ? "從待看清單移除" : "加入待看清單"}>
          <IconButton
            onClick={() => onToggleWatchlist(movie)}
            sx={{ color: "white" }}
          >
            {isInWatchlist ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.release_date.split("-")[0]}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {movie.overview}
        </Typography>
      </CardContent>
    </Card>
  );
};
