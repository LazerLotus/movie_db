import { Box, Typography } from "@mui/material";
import { MovieDetail } from "components/MovieDetail";
import { MovieGrid } from "components/MovieGrid";
import useDialog from "hooks/useDialog";
import { useEffect, useState } from "react";
import { api, Movie, MovieDetails } from "services/api";
import MovieAppBar from "./MovieAppBar";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      // Convert the stored array back to a Set
      return JSON.parse(saved);
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const {
    dialogOpen: movieDetailOpen,
    openDialog: openMovieDetailDialog,
    closeDialog: closeMovieDetailDialog,
  } = useDialog();

  const filteredWatchlist = watchlist.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const loadMovieDetails = async (movieId: number) => {
    try {
      setSelectedMovie(null);
      const data = await api.getMovieDetails(movieId);
      setSelectedMovie(data);
    } catch (error) {
      console.error("Error loading movie details:", error);
    }
  };

  const handleOpenMovieDetail = (movieId: number) => {
    loadMovieDetails(movieId);
    openMovieDetailDialog();
  };

  const handleToggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      // Check if movie is already in watchlist
      const index = prev.findIndex((item) => item.id === movie.id);

      if (index >= 0) {
        // Remove movie if it exists
        return prev.filter((item) => item.id !== movie.id);
      } else {
        // Add movie if it doesn't exist
        return [...prev, movie];
      }
    });
  };

  return (
    <Box component="main">
      <MovieAppBar onSearchInputChange={handleSearchInputChange} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          待看清單
        </Typography>
        <MovieGrid
          movies={filteredWatchlist}
          loading={false}
          hasMore={false}
          onMovieClick={(movie) => handleOpenMovieDetail(movie.id)}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
        />
      </Box>
      <MovieDetail
        movie={selectedMovie}
        open={movieDetailOpen}
        onClose={closeMovieDetailDialog}
      />
    </Box>
  );
};

export default WatchlistPage;
