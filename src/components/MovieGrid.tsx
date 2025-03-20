import { Box, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Movie } from "services/api";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  hasMore: boolean;
  onMovieClick: (movie: Movie) => void;
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
}

export const MovieGrid = ({
  movies,
  loading,
  hasMore,
  onMovieClick,
  watchlist,
  onToggleWatchlist,
}: MovieGridProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={movie.id}>
            <MovieCard
              movie={movie}
              onMovieClick={onMovieClick}
              isInWatchlist={watchlist.some((item) => item.id === movie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && !loading && movies.length > 0 && (
        <Typography color="text.secondary">沒有更多電影了</Typography>
      )}
    </Box>
  );
};
