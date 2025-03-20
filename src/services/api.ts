// 檢查環境變數是否存在
if (!import.meta.env.VITE_TMDB_API_KEY) {
  throw new Error("TMDB API key is not defined in environment variables");
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const api = {
  // 搜尋電影
  searchMovies: (query: string, page: number = 1) =>
    fetchTMDB(
      `/search/movie?query=${encodeURIComponent(
        query
      )}&page=${page}&language=zh-TW`,
      (data) => MovieAdapter.toMovieList(data)
    ),

  // 獲取熱門電影
  getPopularMovies: (page: number = 1) =>
    fetchTMDB(`/movie/popular?page=${page}&language=zh-TW`, (data) =>
      MovieAdapter.toMovieList(data)
    ),

  // 獲取電影詳情
  getMovieDetails: (movieId: number) =>
    fetchTMDB(
      `/movie/${movieId}?language=zh-TW&append_to_response=videos,credits`,
      (data) => MovieAdapter.toMovieDetails(data)
    ),

  // 獲取電影圖片 (這個不需要 API key)
  getImageUrl: (path: string | null, size: string = "w500") =>
    path ? `${IMAGE_BASE_URL}/${size}${path}` : "/placeholder-image.jpg",
};

// API 響應類型定義
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string | null;
}

export interface MovieDetails extends Movie {
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  videos: {
    results: Array<{
      key: string;
      type: string;
      site: string;
    }>;
  };
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

export class TMDBError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "TMDBError";
  }
}

// Add adapter implementation
class MovieAdapter {
  static toMovie(data: unknown): Movie {
    // Handle null or undefined data
    if (!data || typeof data !== "object") {
      return this.getDefaultMovie();
    }

    const rawData = data as Record<string, unknown>;

    return {
      id:
        typeof rawData.id === "number"
          ? rawData.id
          : typeof rawData.id === "string"
          ? parseInt(rawData.id, 10)
          : 0,
      title: typeof rawData.title === "string" ? rawData.title : "未知標題",
      poster_path:
        typeof rawData.poster_path === "string" ? rawData.poster_path : null,
      overview: typeof rawData.overview === "string" ? rawData.overview : "",
      release_date:
        typeof rawData.release_date === "string" ? rawData.release_date : "",
      vote_average:
        typeof rawData.vote_average === "number" ? rawData.vote_average : 0,
      backdrop_path:
        typeof rawData.backdrop_path === "string"
          ? rawData.backdrop_path
          : null,
    };
  }

  static toMovieList(data: unknown): Movie[] {
    if (!data || typeof data !== "object") {
      return [];
    }

    const rawData = data as Record<string, unknown>;
    const results = Array.isArray(rawData.results) ? rawData.results : [];

    return results
      .map((item) => this.toMovie(item))
      .filter((movie) => movie.id > 0); // Filter out invalid movies
  }

  static toMovieDetails(data: unknown): MovieDetails {
    // Base movie data
    const movie = this.toMovie(data);

    if (!data || typeof data !== "object") {
      return this.getDefaultMovieDetails(movie);
    }

    const rawData = data as Record<string, unknown>;

    // Process genres
    const genres = Array.isArray(rawData.genres)
      ? rawData.genres.map((g) => ({
          id: typeof g.id === "number" ? g.id : 0,
          name: typeof g.name === "string" ? g.name : "",
        }))
      : [];

    // Process videos
    const videos: MovieDetails["videos"] = { results: [] };
    if (rawData.videos && typeof rawData.videos === "object") {
      const videosObj = rawData.videos as Record<string, unknown>;
      videos.results = Array.isArray(videosObj.results)
        ? videosObj.results
            .filter((v) => typeof v === "object" && v !== null)
            .map((v) => ({
              key: typeof v.key === "string" ? v.key : "",
              type: typeof v.type === "string" ? v.type : "",
              site: typeof v.site === "string" ? v.site : "",
            }))
        : [];
    }

    // Process credits
    const credits: MovieDetails["credits"] = { cast: [] };
    if (rawData.credits && typeof rawData.credits === "object") {
      const creditsObj = rawData.credits as Record<string, unknown>;
      credits.cast = Array.isArray(creditsObj.cast)
        ? creditsObj.cast
            .filter((c) => typeof c === "object" && c !== null)
            .map((c) => ({
              id: typeof c.id === "number" ? c.id : 0,
              name: typeof c.name === "string" ? c.name : "",
              character: typeof c.character === "string" ? c.character : "",
              profile_path:
                typeof c.profile_path === "string" ? c.profile_path : null,
            }))
        : [];
    }

    return {
      ...movie,
      genres,
      runtime: typeof rawData.runtime === "number" ? rawData.runtime : 0,
      videos,
      credits,
    };
  }

  private static getDefaultMovie(): Movie {
    return {
      id: 0,
      title: "未知電影",
      poster_path: null,
      overview: "暫無簡介",
      release_date: "",
      vote_average: 0,
      backdrop_path: null,
    };
  }

  private static getDefaultMovieDetails(baseMovie: Movie): MovieDetails {
    return {
      ...baseMovie,
      genres: [],
      runtime: 0,
      videos: { results: [] },
      credits: { cast: [] },
    };
  }
}

// Modify your fetch function to use the adapter
const fetchTMDB = async <T>(
  endpoint: string,
  adapter: (data: unknown) => T
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }

  const data = await response.json();
  return adapter(data);
};
