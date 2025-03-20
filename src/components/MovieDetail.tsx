import { Close } from "@mui/icons-material";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { api, MovieDetails } from "../services/api";

interface MovieDetailProps {
  movie: MovieDetails | null;
  open: boolean;
  onClose: () => void;
}

export const MovieDetail = ({ movie, open, onClose }: MovieDetailProps) => {
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [castImagesLoaded, setCastImagesLoaded] = useState<{
    [key: number]: boolean;
  }>({});

  if (!movie) return null;

  const trailer = movie.videos.results.find(
    (video) => video.type === "Trailer"
  );

  const handleBackdropLoad = () => setBackdropLoaded(true);
  const handleCastImageLoad = (id: number) => {
    setCastImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{movie.title}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            mb: 3,
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: "56.25%", // 16:9 aspect ratio
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          {!backdropLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "8px",
              }}
            />
          )}
          <img
            src={api.getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover",
              borderRadius: "8px",
              display: backdropLoaded ? "block" : "none",
            }}
            onLoad={handleBackdropLoad}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            概述
          </Typography>
          <Typography variant="body1">{movie.overview}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          {movie.genres.map((genre) => (
            <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1">
              上映日期: {movie.release_date}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1">
              片長: {movie.runtime} 分鐘
            </Typography>
          </Grid>
        </Grid>

        {trailer && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              預告片
            </Typography>
            <Box
              sx={{ position: "relative", paddingTop: "56.25%", width: "100%" }}
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube video player"
                style={{
                  border: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </Box>
        )}

        <Typography variant="h6" gutterBottom>
          演員陣容
        </Typography>
        <Grid container spacing={2}>
          {movie.credits.cast.slice(0, 6).map((actor) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={actor.id}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "150%", // 2:3 aspect ratio typical for actor photos
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                >
                  {!castImagesLoaded[actor.id] && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <img
                    src={api.getImageUrl(actor.profile_path, "w185")}
                    alt={actor.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      objectFit: "cover",
                      borderRadius: "4px",
                      display: castImagesLoaded[actor.id] ? "block" : "none",
                    }}
                    onLoad={() => handleCastImageLoad(actor.id)}
                    onError={() => handleCastImageLoad(actor.id)}
                  />
                </Box>
                <Typography variant="subtitle2">{actor.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {actor.character}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
