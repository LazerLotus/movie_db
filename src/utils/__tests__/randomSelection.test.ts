import { Movie } from "services/api";
import { describe, expect, it } from "vitest";
import { getRandomMovies } from "../movieUtils";

describe("Movie Selection Utils", () => {
  // Sample data for testing
  const sampleWatchlist = [
    { id: 1, title: "Inception" },
    { id: 2, title: "The Dark Knight" },
    { id: 3, title: "Interstellar" },
    { id: 4, title: "Dunkirk" },
    { id: 5, title: "Tenet" },
  ] as Movie[];

  describe("getRandomMovies", () => {
    it("should return a single random movie when count is 1", () => {
      const selections = new Set();
      for (let i = 0; i < 30; i++) {
        const selected = getRandomMovies(sampleWatchlist, 1)[0];
        selections.add(selected.id);

        // Verify the returned movie exists in the original watchlist
        expect(sampleWatchlist).toContainEqual(selected);
      }

      // Check randomness (should have selected at least 2 different movies)
      expect(selections.size).toBeGreaterThan(1);
    });

    it("should return multiple random movies when count > 1", () => {
      const count = 3;
      const result = getRandomMovies(sampleWatchlist, count);

      // Should return exactly the requested number of movies
      expect(result.length).toBe(count);

      // Each returned movie should be in the original watchlist
      result.forEach((movie) => {
        expect(sampleWatchlist).toContainEqual(movie);
      });

      // Movies should be unique (no duplicates)
      const resultIds = result.map((movie) => movie.id);
      expect(new Set(resultIds).size).toBe(count);
    });

    it("should return all movies when count equals watchlist size", () => {
      const result = getRandomMovies(sampleWatchlist, sampleWatchlist.length);

      expect(result.length).toBe(sampleWatchlist.length);

      // Should contain all the same movies (though potentially in different order)
      const resultIds = new Set(result.map((movie) => movie.id));
      const watchlistIds = new Set(sampleWatchlist.map((movie) => movie.id));
      expect(resultIds).toEqual(watchlistIds);
    });

    it("should throw an error when count exceeds watchlist size", () => {
      expect(() =>
        getRandomMovies(sampleWatchlist, sampleWatchlist.length + 1)
      ).toThrow("Cannot select more movies than available");
    });

    it("should throw an error when watchlist is empty", () => {
      expect(() => getRandomMovies([], 1)).toThrow("No movies available");
    });

    it("should throw an error when count is less than 1", () => {
      expect(() => getRandomMovies(sampleWatchlist, 0)).toThrow(
        "Count must be greater than 0"
      );
      expect(() => getRandomMovies(sampleWatchlist, -1)).toThrow(
        "Count must be greater than 0"
      );
    });
  });
});
