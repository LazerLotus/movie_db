import CasinoIcon from "@mui/icons-material/Casino";
import { Box, Button, Stack, Typography } from "@mui/material";
import { MovieDetail } from "components/MovieDetail";
import { MovieGrid } from "components/MovieGrid";
import useDialog from "hooks/useDialog";
import { useEffect, useState } from "react";
import { api, Movie, MovieDetails } from "services/api";
import { useError } from "./ErrorContext";
import MovieAppBar from "./MovieAppBar";
import MovieLotteryDialog from "./MovieLottery";

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
  const {
    dialogOpen: lotteryOpen,
    openDialog: openLottery,
    closeDialog: closeLottery,
  } = useDialog();
  const { showError } = useError();

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
      showError(`Error loading movie details, ${error}`);
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
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" gutterBottom>
            待看清單
          </Typography>
          {watchlist.length > 5 ? (
            <Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CasinoIcon />}
                onClick={openLottery}
              >
                隨機選片
              </Button>
            </Box>
          ) : (
            <Typography variant="body1">
              再多選 {6 - watchlist.length} 部電影才能玩拉霸！
            </Typography>
          )}
        </Stack>
        {watchlist.length === 0 ? (
          <Typography variant="body1">
            你的待看清單是空的。請從探索電影中添加電影。
          </Typography>
        ) : (
          <MovieGrid
            movies={filteredWatchlist}
            loading={false}
            hasMore={false}
            onMovieClick={(movie) => handleOpenMovieDetail(movie.id)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}
      </Box>
      <MovieDetail
        movie={selectedMovie}
        open={movieDetailOpen}
        onClose={closeMovieDetailDialog}
      />
      <MovieLotteryDialog
        watchlist={watchlist}
        open={lotteryOpen}
        onClose={closeLottery}
      />
    </Box>
  );
};

export default WatchlistPage;
