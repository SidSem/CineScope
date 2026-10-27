# CineScope — 5-Day Implementation Roadmap

A structured 5-day engineering roadmap for developing **CineScope**, an advanced frontend-only movie discovery and watchlist platform.

---

## 📅 Roadmap Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CINESCOPE 5-DAY PLAN                             │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────────┤
│    DAY 1    │    DAY 2    │    DAY 3    │    DAY 4    │        DAY 5        │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────────────┤
│ Foundation  │ Data Models │ Discovery   │ Full Pages  │ Analytics, Testing, │
│ & Layout    │ & Storage   │ Components  │ & Routing   │ Hardening & Deploy  │
│             │             │             │             │                     │
│ • Vite/TS   │ • 48 Movies │ • Cards     │ • Home      │ • Taste SVG Charts  │
│ • Tokens    │ • Zustand   │ • Rails     │ • Discover  │ • JSON Backup/Sync  │
│ • Header    │ • Storage   │ • Search    │ • Details   │ • Vitest Suites     │
│ • MobileNav │ • Moods     │ • Filters   │ • Watchlist │ • Vercel & Netlify  │
│ • Theme     │ • Hooks     │ • Modals    │ • Collects  │ • WCAG 2.2 AA       │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────────────┘
```

---

## 🎯 Daily Milestones Summary

### [Day 1: Project Foundation, Design System & Core Shell](./DAY-1.md)
- **Goal**: Initialize repository, setup Tailwind CSS + typography, create responsive app shell and theme engine.
- **Deliverables**:
  - Vite + React 19 + TypeScript configuration.
  - Tailwind tokens: Electric Violet (`#7657FF`), Electric Pink (`#FF5DA2`), Tangerine (`#FF9F43`), Aqua (`#49DCC6`), Sunshine (`#FFE66D`).
  - Google Fonts: *Space Grotesk* (headings) & *Plus Jakarta Sans* (body).
  - Responsive App Shell: `AppHeader`, `DesktopNavigation`, `MobileNavigation`, `PageContainer`, and `Footer`.
  - Dark / Light mode switching with localStorage persistence.
  - Client-side routing scaffold with error boundaries.

---

### [Day 2: Data Architecture, Bundled Catalog & State Layer](./DAY-2.md)
- **Goal**: Build rich TypeScript movie domain types, 48-film bundled local dataset, versioned storage, and Zustand store.
- **Deliverables**:
  - Strict interfaces: `Movie`, `Collection`, `Mood`, `FilterState`, `UserPreferences`.
  - Rich 48-movie dataset spanning diverse genres, eras, directors, cast, runtimes, and ratings.
  - Versioned `localStorage` persistence layer with memory fallback.
  - Unified Zustand store: watchlist, watched status, recently viewed, search history.
  - Custom reactive hooks: `useWatchlist`, `useTheme`, `useRecentlyViewed`.

---

### [Day 3: Reusable Discovery Components & Smart Filters](./DAY-3.md)
- **Goal**: Build interactive UI components for viewing, previewing, and filtering movies.
- **Deliverables**:
  - `MoviePoster` with gradient SVG/CSS fallback for missing artwork.
  - `MovieCard` with hover lift, poster zoom, rating badge, and quick actions.
  - `MovieRail` with horizontal smooth scrolling and numbered top picks.
  - `QuickDetailsModal` for instant inspection without route change.
  - `TrailerModal` supporting safe YouTube / Vimeo video playback.
  - `SearchBar` with autocomplete suggestions and recent queries.
  - `FilterPanel` & mobile `FilterDrawer` for multi-genre, year, rating, and runtime filtering.

---

### [Day 4: Page Assembly & Interactive User Flows](./DAY-4.md)
- **Goal**: Construct all core pages and complete the user discovery journey.
- **Deliverables**:
  - **Home Page**: Hero carousel with autoplay/pause, trending rail, mood discovery, genre tiles.
  - **Discover Page**: Search and multi-filter catalog with URL parameter sync (`?q=`, `?genre=`).
  - **Movie Details Page**: Hero backdrop, synopsis, credits, financials, confetti watchlist toggle, and Web Share.
  - **Watchlist Page**: Dual tabs for saved films and viewing history, in-vault search.
  - **Collections & Genre Pages**: Curated film playlists and genre spotlight pages.

---

### [Day 5: Personalization, Testing, Accessibility & Deployment](./DAY-5.md)
- **Goal**: Implement viewing analytics, data portability, comprehensive unit tests, accessibility, and production deployment.
- **Deliverables**:
  - **Profile Page**: Cinema taste distribution SVG visualizer, preferences editor.
  - **Data Portability**: Full JSON export and strict schema-validated import.
  - **Accessibility**: Full WCAG 2.2 AA compliance, visible keyboard focus, reduced motion support.
  - **Automated Tests**: Vitest test suites covering filtering, sorting, storage, and validation (100% pass rate).
  - **Production Deployment**: Configured for Vercel (`vercel.json`) and Netlify (`netlify.toml` + `_redirects`).
