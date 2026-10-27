# Day 2: Data Architecture, Bundled Catalog & State Layer

## 🎯 Day 2 Objective
Establish the entire data layer for **CineScope**. Create strict TypeScript domain models, assemble a rich 48-movie offline-ready catalog with deep metadata, build curated collections and atmospheric moods, design a versioned `localStorage` persistence layer, and implement the unified Zustand application store.

---

## 📋 Tasks & Milestones

### 1. TypeScript Domain Models (`src/types/movie.ts`)
- [x] Create strict interfaces:
  - `Movie`: `id`, `slug`, `title`, `originalTitle`, `releaseDate`, `year`, `genres`, `overview`, `runtimeMinutes`, `rating`, `ratingSource`, `posterUrl`, `backdropUrl`, `director`, `cast`, `tags`, `trailerUrl`, `language`, `budget`, `revenue`.
  - `Collection`: `id`, `slug`, `title`, `description`, `coverImage`, `accentColor`, `movieIds`, `icon`.
  - `Mood`: `id`, `name`, `description`, `icon`, `accentColor`, `matchingTags`, `matchingGenres`.
  - `FilterState`: `query`, `genres`, `yearMin`, `yearMax`, `minRating`, `maxRuntime`, `mood`, `status`, `sortBy`.
  - `StoredUserData`: Versioned snapshot of watchlist, watched, recently viewed, searches, and preferences.

### 2. Bundled Local Catalog (`src/data/`)
- [x] **48 Movies Dataset** ([movies.ts](file:///d:/comeBack/CineScope/src/data/movies.ts)):
  - Across 13 genres (Sci-Fi, Crime, Horror, Comedy, Animation, Adventure, Romance, Drama, Documentary, etc.)
  - Realistic metadata: directors, ensemble cast, runtimes, ratings with sources, synopsis, budget/box-office numbers, and tags.
- [x] **Curated Collections** ([collections.ts](file:///d:/comeBack/CineScope/src/data/collections.ts)):
  - *Weekend Watchlist*
  - *Animated Worlds*
  - *Sci-Fi Essentials*
  - *Hidden Gems*
  - *Mystery Marathon*
  - *Short on Time* (high-impact films <100 minutes)
- [x] **Mood Categories** ([moods.ts](file:///d:/comeBack/CineScope/src/data/moods.ts)):
  - 8 distinct atmospheres with explicit matching rules: Feel-Good, Mind-Bending, Adrenaline Rush, Cozy Night, Tearjerker, Family Night, Date Night, Spooky Season.
- [x] **Genres Directory** ([genres.ts](file:///d:/comeBack/CineScope/src/data/genres.ts)):
  - 13 genres with descriptions, icons, and curated Tailwind gradient tokens.

### 3. Versioned Local Storage Persistence (`src/lib/storage.ts`)
- [x] Support versioned storage key (`cinescope_user_data_v1`).
- [x] Graceful fallback to `MemoryStorage` if `localStorage` is disabled or restricted in private browsing.
- [x] Safe JSON parsing with automatic recovery to default state if corrupted data is detected.
- [x] Storage cleanup function.

### 4. Shared State Store (`src/store/appStore.ts`)
- [x] Setup Zustand store tracking:
  - `watchlist: string[]`
  - `watched: string[]`
  - `recentlyViewed: string[]`
  - `recentSearches: string[]`
  - `preferences: UserPreferences`
  - `toasts: ToastMessage[]`
- [x] Atomic actions:
  - `toggleWatchlist(id, title)`
  - `toggleWatched(id, title)`
  - `clearWatchlist()`, `clearWatched()`
  - `addRecentlyViewed(id)`, `clearRecentlyViewed()`
  - `addRecentSearch(q)`, `clearRecentSearches()`
  - `updatePreferences(partial)`
  - `importUserData(data)`, `resetAllData()`
- [x] Synchronize state updates immediately with `localStorage`.

### 5. Custom Reactive Hooks (`src/hooks/`)
- [x] `useWatchlist`: Provides derived movie arrays, live counts (`watchlistCount`, `watchedCount`), and toggles.
- [x] `useRecentlyViewed`: Tracks explored movie IDs and resolves full movie records.
- [x] `useTheme`: Controls dark/light mode and DOM class synchronization.

---

## 🔍 Day 2 Verification Checklist
- Run `npm run test` on `src/test/storage.test.ts` and `src/test/appStore.test.ts`:
  - Confirm initial load returns valid defaults.
  - Confirm watchlist add, remove, and toggle update state correctly.
  - Confirm corrupt localStorage data recovers safely without crashing.
- Inspect movie dataset in console to ensure all 48 movies have unique IDs and valid slugs.

---

## 📦 Key Deliverable Files for Day 2
- `src/types/movie.ts`
- `src/data/movies.ts`
- `src/data/collections.ts`
- `src/data/moods.ts`
- `src/data/genres.ts`
- `src/lib/storage.ts`
- `src/store/appStore.ts`
- `src/hooks/useWatchlist.ts`
- `src/hooks/useRecentlyViewed.ts`
- `src/test/storage.test.ts`
- `src/test/appStore.test.ts`
