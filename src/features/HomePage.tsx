import { Box, Typography } from "@mui/material";
import { MovieDetail } from "components/MovieDetail";
import { MovieGrid } from "components/MovieGrid";
import MovieAppBar from "features/MovieAppBar";
import useDialog from "hooks/useDialog";
import { useCallback, useEffect, useState } from "react";
import { api, Movie, MovieDetails } from "services/api";
import { useError } from "./ErrorContext";

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });
  const [hasMore, setHasMore] = useState(true);
  const {
    dialogOpen: movieDetailOpen,
    openDialog: openMovieDetailDialog,
    closeDialog: closeMovieDetailDialog,
  } = useDialog();
  const { showError } = useError();
  const loadMovies = useCallback(async () => {
    if (!hasMore) return;

    try {
      const data = searchQuery
        ? await api.searchMovies(searchQuery, page)
        : await api.getPopularMovies(page);

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setMovies((prev) => {
        // 確保沒有重複的電影
        const newMovieIds = new Set(data.map((m) => m.id));
        const uniquePrevMovies = prev.filter((m) => !newMovieIds.has(m.id));
        return [...uniquePrevMovies, ...data];
      });
    } catch (error) {
      showError(`Error loading movies, ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, page, searchQuery, showError]);

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

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setMovies([]);
    setHasMore(true);
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

  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setIsLoading(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  window.addEventListener("scroll", debounce(handleScroll, 500));

  useEffect(() => {
    if (isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies, page]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <Box component="main">
      <MovieAppBar onSearchInputChange={handleSearchInputChange} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          熱門電影
        </Typography>
        <MovieGrid
          movies={movies}
          loading={isLoading}
          hasMore={hasMore}
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

export default HomePage;
