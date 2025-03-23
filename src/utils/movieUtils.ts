import { Movie } from "../services/api"; // Adjust import path as needed

/**
 * Returns a specified number of random movies from the provided watchlist
 * @param watchlist Array of movies to select from
 * @param count Number of movies to return
 * @returns Array of randomly selected movies
 */
export function getRandomMovies(watchlist: Movie[], count: number): Movie[] {
  // Validate inputs
  if (watchlist.length === 0) {
    throw new Error("No movies available");
  }

  if (count < 1) {
    throw new Error("Count must be greater than 0");
  }

  if (count > watchlist.length) {
    throw new Error("Cannot select more movies than available");
  }

  // Create a copy of the array to avoid modifying the original
  const moviesCopy = [...watchlist];
  const result: Movie[] = [];

  // Fisher-Yates shuffle algorithm to select random movies
  for (let i = 0; i < count; i++) {
    // Get random index from remaining movies
    const randomIndex = Math.floor(Math.random() * (moviesCopy.length - i));

    // Swap the randomly selected item to the end of the working portion of the array
    const temp = moviesCopy[randomIndex];
    moviesCopy[randomIndex] = moviesCopy[moviesCopy.length - 1 - i];
    moviesCopy[moviesCopy.length - 1 - i] = temp;

    // Add the selected movie to our result
    result.push(temp);
  }

  return result;
}

/**
 * Gets a single random movie from a watchlist
 * @param watchlist Array of movies to choose from
 * @returns A randomly selected movie or null if watchlist is empty
 */
export function getRandomMovie(watchlist: Movie[]): Movie | null {
  if (watchlist.length === 0) return null;
  return watchlist[Math.floor(Math.random() * watchlist.length)];
}
