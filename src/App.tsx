import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  InputBase,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MovieDetail } from "./components/MovieDetail";
import { MovieGrid } from "./components/MovieGrid";
import MenuDrawer from "./features/MenuDrawer";
import useDialog from "./hooks/useDialog";
import { api, Movie, MovieDetails } from "./services/api";

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

// Create separate components for Home and Watchlist views
function HomeView({
  movies,
  isLoading,
  hasMore,
  watchlist,
  onMovieClick,
  onToggleWatchlist,
}: {
  movies: Movie[];
  isLoading: boolean;
  hasMore: boolean;
  watchlist: Set<number>;
  onMovieClick: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
}) {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        熱門電影
      </Typography>
      <MovieGrid
        movies={movies}
        loading={isLoading}
        hasMore={hasMore}
        onMovieClick={onMovieClick}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
      />
    </>
  );
}

function WatchlistView({
  movies,
  watchlist,
  onMovieClick,
  onToggleWatchlist,
}: {
  movies: Movie[];
  watchlist: Set<number>;
  onMovieClick: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
}) {
  const watchlistMovies = movies.filter((movie) => watchlist.has(movie.id));

  return (
    <>
      <Typography variant="h4" gutterBottom>
        待看清單
      </Typography>
      <MovieGrid
        movies={watchlistMovies}
        loading={false}
        hasMore={false}
        onMovieClick={onMovieClick}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
      />
    </>
  );
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [watchlist, setWatchlist] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      // Convert the stored array back to a Set
      return new Set(JSON.parse(saved));
    }
    return new Set<number>();
  });
  const [hasMore, setHasMore] = useState(true);
  const {
    dialogOpen: movieDetailOpen,
    openDialog: openMovieDetailDialog,
    closeDialog: closeMovieDetailDialog,
  } = useDialog();
  const {
    dialogOpen: menuOpen,
    openDialog: openMenuDialog,
    closeDialog: closeMenuDialog,
  } = useDialog();

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
      console.error("Error loading movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, page, searchQuery]);

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

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setMovies([]);
    setHasMore(true);
  };

  const handleToggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(movie.id)) {
        newWatchlist.delete(movie.id);
      } else {
        newWatchlist.add(movie.id);
      }
      return newWatchlist;
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
    // Convert Set to Array before storing (Sets can't be directly stringified)
    localStorage.setItem("watchlist", JSON.stringify([...watchlist]));
  }, [watchlist]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* App Bar */}
        <Stack sx={{ height: "100svh", width: "100svw" }}>
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
                  width: "100%",
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
                  onChange={(e) => handleSearchInputChange(e.target.value)}
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

          {/* 側邊欄 */}
          <MenuDrawer open={menuOpen} onClose={closeMenuDialog} />

          {/* 主要內容區域 */}
          <Container maxWidth="xl">
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
              }}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomeView
                      movies={movies}
                      isLoading={isLoading}
                      hasMore={hasMore}
                      watchlist={watchlist}
                      onMovieClick={(movie) => handleOpenMovieDetail(movie.id)}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  }
                />
                <Route
                  path="/watchlist"
                  element={
                    <WatchlistView
                      movies={movies}
                      watchlist={watchlist}
                      onMovieClick={(movie) => handleOpenMovieDetail(movie.id)}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  }
                />
              </Routes>
            </Box>
          </Container>
        </Stack>
        <MovieDetail
          movie={selectedMovie}
          open={movieDetailOpen}
          onClose={closeMovieDetailDialog}
        />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
