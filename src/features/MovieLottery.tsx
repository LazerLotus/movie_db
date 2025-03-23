import CasinoIcon from "@mui/icons-material/Casino";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import canvasConfetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRandomMovies } from "utils/movieUtils";
import { Movie } from "../services/api";

interface MovieLotteryProps {
  watchlist: Movie[];
  open: boolean;
  onClose: () => void;
}

const MovieLotteryDialog = ({
  watchlist,
  open,
  onClose,
}: MovieLotteryProps) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const spinIntervalRef = useRef<number | null>(null);

  // Initialize random movies for the slot machine
  const getMoviesForDisplay = useCallback(
    (count: number): Movie[] => {
      return getRandomMovies(watchlist, count);
    },
    [watchlist]
  );

  // Reset canvas and state when dialog opens
  useEffect(() => {
    if (open) {
      // Clear any running spin interval
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }

      // Clear the canvas
      if (confettiCanvasRef.current) {
        const context = confettiCanvasRef.current.getContext("2d");
        if (context) {
          context.clearRect(
            0,
            0,
            confettiCanvasRef.current.width,
            confettiCanvasRef.current.height
          );
        }
      }

      setSpinning(false);
      setSelectedMovie(null);

      // Initialize with random movies
      if (watchlist.length > 0) {
        setVisibleMovies(getMoviesForDisplay(5));
      }
    }

    // Cleanup on dialog close
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
    };
  }, [open, watchlist, getMoviesForDisplay]);

  // Resize canvas
  useEffect(() => {
    const resizeCanvas = () => {
      if (confettiCanvasRef.current) {
        confettiCanvasRef.current.width = confettiCanvasRef.current.offsetWidth;
        confettiCanvasRef.current.height =
          confettiCanvasRef.current.offsetHeight;
      }
    };

    if (open) {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [open]);

  // Early return if not open or no watchlist
  if (!open || watchlist.length === 0) {
    return null;
  }

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = canvasConfetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });

      myConfetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    }
  };

  const spinSlots = () => {
    if (spinning || watchlist.length === 0) return;

    setSpinning(true);
    setSelectedMovie(null);

    // Choose the winning movie just once
    const winningMovie =
      watchlist[Math.floor(Math.random() * watchlist.length)];

    // Define phases of the spin animation
    const TOTAL_SPINS = 30;
    const FAST_PHASE = 15; // Fast spinning for first 15 ticks
    const SLOW_PHASE = TOTAL_SPINS - FAST_PHASE; // Gradually slowing down for the rest

    let spinCount = 0;

    // Store interval ID for cleanup
    spinIntervalRef.current = window.setInterval(() => {
      spinCount++;

      setVisibleMovies((prev) => {
        // During fast phase, completely randomize
        if (spinCount <= FAST_PHASE) {
          return getMoviesForDisplay(prev.length);
        }
        // During slowing phase, gradually stabilize on winning movie
        else {
          const progress = (spinCount - FAST_PHASE) / SLOW_PHASE; // 0 to 1
          const stabilityFactor = Math.pow(progress, 2); // Non-linear stabilization

          return prev.map((movie, index) => {
            // Center position always shows winning movie as we slow down
            if (index === 3) return winningMovie;

            // Other positions gradually stabilize
            const shouldStabilize = Math.random() < stabilityFactor;
            return shouldStabilize ? movie : getMoviesForDisplay(1)[0];
          });
        }
      });

      // End the spinning animation
      if (spinCount >= TOTAL_SPINS) {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
          spinIntervalRef.current = null;
        }
        setSelectedMovie(winningMovie);
        setSpinning(false);
        triggerConfetti();
      }
    }, 100);
  };

  return (
    <Dialog
      open={open}
      onClose={spinning ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">今晚看什麼？</Typography>
          {!spinning && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            p: 4,
          }}
        >
          {/* Confetti Canvas */}
          <canvas
            ref={confettiCanvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />

          {/* Slot Machine Container */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 500,
              height: 300,
              borderRadius: 4,
              bgcolor: "#121212",
              border: "8px solid #333",
              boxShadow:
                "inset 0 0 20px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              mb: 4,
            }}
          >
            {/* Slot machine display */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 2,
                position: "relative",
              }}
            >
              {/* Slot machine window */}
              <Box
                sx={{
                  height: "180px",
                  border: "4px solid #555",
                  borderRadius: 2,
                  bgcolor: "#222",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Center highlight strip */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "60px",
                    bgcolor: "rgba(255,255,255,0.08)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    borderLeft: "none",
                    borderRight: "none",
                    zIndex: 10,
                  }}
                />

                {/* Vertical list of movies (slot reel) */}
                <Box
                  sx={{
                    height: "100%",
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    position: "relative",
                  }}
                >
                  <AnimatePresence>
                    {visibleMovies.map((movie, index) => (
                      <motion.div
                        key={`${movie.id}-${index}-${
                          spinning ? "spin" : "idle"
                        }`}
                        initial={{
                          y: -60,
                          opacity: 0,
                        }}
                        animate={{
                          y: (index - 2) * 60,
                          opacity: 1,
                        }}
                        exit={{
                          y: 240,
                          opacity: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: spinning ? 100 : 300,
                          damping: spinning ? 10 : 30,
                          mass: 1,
                        }}
                        style={{
                          position: "absolute",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          height: "60px",
                          width: "100%",
                          zIndex: index === 2 ? 5 : 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          sx={{
                            color: "white",
                            fontWeight: index === 2 ? "bold" : "normal",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                            px: 2,
                            maxWidth: "100%",
                          }}
                        >
                          {movie.title}
                        </Typography>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </Box>
            </Box>

            {/* Slot machine handle/lever (optional) */}
            <Box
              component={motion.div}
              whileHover={
                !spinning ? { right: -15, backgroundColor: "#f44336" } : {}
              }
              whileTap={!spinning ? { right: -5, rotateZ: 10 } : {}}
              sx={{
                position: "absolute",
                right: -20,
                top: "40%",
                height: "100px",
                width: "20px",
                bgcolor: "#d32f2f",
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                cursor: spinning ? "default" : "pointer",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: 0,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  bgcolor: "#b71c1c",
                },
              }}
              onClick={spinning ? undefined : spinSlots}
            />
          </Box>

          {/* Spin Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CasinoIcon />}
            onClick={spinSlots}
            disabled={spinning}
            sx={{
              mt: 2,
              mb: 4,
              minWidth: 200,
              borderRadius: 8,
              bgcolor: spinning ? "#555" : "#d32f2f",
              "&:hover": {
                bgcolor: "#f44336",
              },
              py: 1.5,
            }}
          >
            {spinning ? "轉動中..." : "拉下拉霸"}
          </Button>

          {/* Selected Movie Display */}
          <AnimatePresence>
            {selectedMovie && !spinning && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", maxWidth: 500 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 4,
                    bgcolor: "primary.dark",
                    border: "2px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
                    今晚就看這個！
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    {selectedMovie.title}
                  </Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MovieLotteryDialog;
