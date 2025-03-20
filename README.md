## 我的電影網

這是一個使用 TMDB（The Movie Database）的 API 的前端網頁專案，可以在主頁面搜尋電影並加入待看清單。
本專案也部署在 https://movie-db-pi-ruby.vercel.app/

1. **搜尋電影**：在主頁面可以搜尋電影
2. **電影詳情**：當點擊電影時，便能看到該電影的詳細資訊，包括演員陣容、預告片、導演和評論等。
3. **電影加入待看清單**：可以將電影加入待看清單，並且儲存在 local storage 讓用戶隨時都能查看
4. **RWD**：在手機與電腦都能使用！
5. **列出待看清單**：點擊 Menu 的待看清單，即可看到儲存的電影
6. **錯誤處理**：當 API 出現錯誤時會跳出 banner

## Tech Stack

- Frontend Framework: React 19
- Language: TypeScript
- UI Framework: Material UI 6
- Build Tool: Vite 6
- Routing: React Router 7
- State Management: React Hooks
- API Integration: TMDB API with custom adapter pattern

## Getting Started

# Prerequisites

- Node.js (>= 18.x)
- Yarn or npm

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/movie_db.git
   cd movie_db
   ```

2. Install dependencies

   ```bash
   yarn
   # or
   npm install
   ```

3. Create a .env file based on .env.example and add your TMDB API key

   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```

4. Start the development server

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Project Structure

# Configuration

# Development Workflow

Development: yarn dev - Start development server
Build: yarn build - Build for production
Preview: yarn preview - Preview production build
Lint: yarn lint - Run ESLint

# Code Architecture

Adapter Pattern: Used in API service to handle unstable backend responses
Lazy Loading: Implemented for route-based code splitting
Component Composition: Followed for UI element reusability
React Router: For client-side routing and navigation
Responsive Design: Using MUI's responsive layout system

# API Integration

The application uses the TMDB (The Movie Database) API for fetching movie data. A custom adapter pattern is implemented to handle data transformation and error resilience.

# Browser Support

Chrome, Firefox, Safari, Edge (latest 2 versions)
Responsive design supports mobile, tablet, and desktop views

# License

MIT License

# Acknowledgements

TMDB API for providing movie data
Material UI for the component library
Vite for the build tooling
