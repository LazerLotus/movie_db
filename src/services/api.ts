// 檢查環境變數是否存在
if (!import.meta.env.VITE_TMDB_API_KEY) {
  throw new Error("TMDB API key is not defined in environment variables");
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// 創建通用的 fetch 函數
const fetchTMDB = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`; // 不再附加 API key 到 URL

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`, // 使用 Bearer token
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.status_message || `TMDB API Error: ${response.status}`
    );
  }

  return response.json();
};

export const api = {
  // 搜尋電影
  searchMovies: (query: string, page: number = 1) =>
    fetchTMDB(
      `/search/movie?query=${encodeURIComponent(
        query
      )}&page=${page}&language=zh-TW`
    ),

  // 獲取熱門電影
  getPopularMovies: (page: number = 1) =>
    fetchTMDB(`/movie/popular?page=${page}&language=zh-TW`),

  // 獲取電影詳情
  getMovieDetails: (movieId: number) =>
    fetchTMDB(
      `/movie/${movieId}?language=zh-TW&append_to_response=videos,credits`
    ),

  // 獲取電影圖片 (這個不需要 API key)
  getImageUrl: (path: string | null, size: string = "w500") =>
    path ? `${IMAGE_BASE_URL}/${size}${path}` : "/placeholder-image.jpg",
};

// API 響應類型定義
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

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

// 錯誤類型
export class TMDBError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "TMDBError";
  }
}
