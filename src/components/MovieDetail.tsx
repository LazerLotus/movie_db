import { Close } from "@mui/icons-material";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { api, MovieDetails } from "../services/api";

interface MovieDetailProps {
  movie: MovieDetails | null;
  open: boolean;
  onClose: () => void;
}

export const MovieDetail = ({ movie, open, onClose }: MovieDetailProps) => {
  if (!movie) return null;

  const trailer = movie.videos.results.find(
    (video) => video.type === "Trailer"
  );

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
        <Box sx={{ mb: 3 }}>
          <img
            src={api.getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          概述
        </Typography>
        <Typography paragraph>{movie.overview}</Typography>

        <Box sx={{ mb: 2 }}>
          {movie.genres.map((genre) => (
            <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              上映日期: {movie.release_date}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
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
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        )}

        <Typography variant="h6" gutterBottom>
          演員陣容
        </Typography>
        <Grid container spacing={2}>
          {movie.credits.cast.slice(0, 6).map((actor) => (
            <Grid item xs={6} sm={4} md={2} key={actor.id}>
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={api.getImageUrl(actor.profile_path, "w185")}
                  alt={actor.name}
                  style={{
                    width: "100%",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                />
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
