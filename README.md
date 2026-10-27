# CineScope 🎬
> **Advanced Frontend-Only Movie Discovery & Watchlist Platform**

CineScope is a colorful, expressive, production-ready cinema playground built with React 19, TypeScript, Tailwind CSS, Motion, and Zustand. It delivers a rich, tactile discovery experience with deep catalog exploration, mood-based filtering, curated film collections, persistent watchlists, viewing history tracking, taste analytics, and offline-first client architecture.

---

## 🌟 Key Features

### 1. Immersive Discovery & Art Direction
- **Hero Premiere Carousel**: High-impact rotating carousel featuring curated premiere movies, backdrop imagery, genre tags, quick overview, play/pause controls, and respect for `prefers-reduced-motion`.
- **Atmospheric Palette**: Tailored dark-mode default with electric violet (`#7657FF`), electric pink (`#FF5DA2`), tangerine (`#FF9F43`), aqua (`#49DCC6`), and sunshine yellow (`#FFE66D`), paired with a warm off-white light theme.
- **Browse by Genre**: Colorful genre cards with custom typography, glyphs, and direct routing.
- **Pick Your Mood**: Atmosphere filter (Feel-Good, Mind-Bending, Adrenaline Rush, Cozy Night, Tearjerker, Family Night, Date Night, Spooky Season) using explicit tag and genre rules.
- **Horizontal Movie Rails**: Smooth scrolling rails with next/previous controls and numbered rankings for top-rated films.

### 2. Deep Catalog & Smart Search (`/discover`)
- **Multi-Field Real-Time Search**: Search by title, original title, director, cast members, synopsis, and keywords.
- **Search Suggestions & History**: Autocomplete dropdown suggestions and locally stored recent queries with clear controls.
- **Multi-Faceted Filtering**:
  - Multiple genre selection
  - Release year range
  - Minimum rating threshold (handles missing ratings safely)
  - Maximum runtime slider
  - Mood & atmospheric tag selector
  - Watch status (All, Watched, Unwatched, In Watchlist)
- **Active Filter Chips**: Removable chips indicating all active filters with one-click "Reset all".
- **Dynamic Sorting**: CineScope picks, Highest rating, Release year (newest/oldest), Title (A-Z/Z-A), and Runtime (shortest first).
- **Dual Display Modes**: Seamless switching between responsive poster grid and compact list view.
- **URL Parameter Syncing**: Filter states and queries sync to URL parameters for shareable and bookmarkable filtered views.

### 3. Rich Movie Detail Experience (`/movie/:id`)
- **Cinematic Presentation**: Large backdrop banner, poster artwork with designer SVG/CSS fallback for missing images, synopsis, and key personnel.
- **Production Insights**: Release dates, runtime, box office, budget, and spoken language.
- **Trailer Experience**: Safe YouTube / Vimeo embed modal with strict video ID validation and direct fallback link.
- **Interactive Actions**: One-click watchlist toggle with celebratory confetti, watched status toggle, and Web Share API with clipboard copy fallback.
- **Recommendation Engine**: Dynamic related film rail scored on shared genres, thematic tags, and directors.

### 4. Personal Watchlist & Vault (`/watchlist`)
- **Tabs**: Switch between **My Watchlist** and **Viewing History**.
- **Live Badge Counter**: Real-time counter badge displayed in the navigation header and mobile nav bar.
- **In-Vault Filtering & Sorting**: Search within saved films and filter by genres.
- **Safety Dialogs**: Accessible confirmation modal for clearing the watchlist or history.

### 5. Curated Playlists (`/collections` & `/collections/:slug`)
- **Editorial Playlists**: Weekend Watchlist, Animated Worlds, Sci-Fi Essentials, Hidden Gems, Mystery Marathon, and Short on Time.
- **Dedicated Collection Pages**: Complete with description, movie count, custom accent glow, and full sorting/display controls.

### 6. Local Profile & Preferences (`/profile`)
- **Theme Selection**: Dark theme (default) or Light theme persisted in `localStorage`.
- **Viewing Analytics**: Taste breakdown graph visualizing genre distribution across saved and watched films.
- **Data Portability**:
  - **Export JSON**: Download your full CineScope state as a timestamped backup.
  - **Import JSON**: Restore backups with strict JSON validation and schema checks.
  - **Reset**: Safely wipe local application data back to defaults with confirmation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS + CSS Variables (`tokens.css`, `globals.css`) |
| **Routing** | React Router v7 (`createBrowserRouter`) |
| **State Management** | Zustand (with versioned `localStorage` synchronization) |
| **Animations** | Motion for React (`motion/react`) |
| **Icons** | Lucide React |
| **Testing** | Vitest + React Testing Library + JSDOM |
| **Celebrations** | canvas-confetti |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node v24).
- npm `v9.0.0` or higher.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cinescope.git
cd cinescope
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Automated Tests

Run the test suite via Vitest:
```bash
npm run test
```

To run in watch mode during development:
```bash
npm run test:watch
```

### What is tested:
- ✅ Case-insensitive movie search across title, director, cast, and tags
- ✅ Genre and year filtering logic
- ✅ Handling of missing ratings and runtimes in sorting algorithms
- ✅ Watchlist add, remove, and duplicate protection
- ✅ Watched vs unwatched toggling
- ✅ Storage parsing, schema migration, and graceful recovery from corrupt data
- ✅ Strict JSON backup export and import validation

---

## 📦 Production Build & Preview

Build the optimized, code-split production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```
Open [http://localhost:4173](http://localhost:4173) to inspect the production bundle.

---

## ☁️ Deployment Instructions

CineScope is a **100% frontend-only SPA** and requires zero backend configuration or database setup.

### Deploying to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. Ensure the following settings are detected:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. The included [`vercel.json`](./vercel.json) handles SPA route rewrites for direct navigation to `/discover`, `/movie/:id`, and `/collections/:slug`.

### Deploying to Netlify
1. Push your repository to GitHub.
2. Sign in to [Netlify](https://netlify.com) and click **Add new site** > **Import an existing project**.
3. Select your repository.
4. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy site**.
6. The included [`netlify.toml`](./netlify.toml) and [`public/_redirects`](./public/_redirects) automatically configure single-page application fallback routing.

---

## ⚙️ Environment Variables

CineScope requires **no environment variables** to function. All features run out of the box with the bundled dataset.

For optional third-party client integrations, refer to [`.env.example`](./.env.example):
```env
# Optional TMDB API key (bundled client-side)
# VITE_TMDB_API_KEY=your_key_here
```
> **Security Notice**: Any variable prefixed with `VITE_` is baked into the public client-side JavaScript bundle and is readable by anyone who inspects the site. Never place private secrets or database credentials in client environment files.

---

## 📂 Architecture & Directory Structure

```
cinescope/
├── public/
│   ├── favicon.svg             # Brand SVG favicon
│   └── _redirects              # Netlify SPA redirect rule
├── src/
│   ├── app/
│   │   ├── App.tsx             # Root layout with header, footer & mobile nav
│   │   └── router.tsx          # Code-split client route definitions
│   ├── components/
│   │   ├── feedback/           # Toasts, ConfirmDialog, and EmptyState
│   │   ├── layout/             # AppHeader, MobileNavigation, PageContainer, Footer
│   │   ├── movie/              # MovieCard, MovieGrid, MovieRail, MoviePoster, MovieHero
│   │   └── search/             # SearchBar, FilterPanel, FilterDrawer, SortControl
│   ├── data/
│   │   ├── movies.ts           # 48 detailed bundled movie records
│   │   ├── collections.ts      # Curated playlist collections
│   │   ├── genres.ts           # Genre metadata, gradients, and icons
│   │   └── moods.ts            # Atmosphere tags and selection rules
│   ├── hooks/                  # useWatchlist, useTheme, useRecentlyViewed
│   ├── lib/
│   │   ├── storage.ts          # Versioned localStorage with memory fallback
│   │   ├── movieFilters.ts     # Pure filtering, searching, and sorting engine
│   │   ├── recommendations.ts  # Thematic similarity scoring algorithm
│   │   ├── exportImport.ts     # JSON backup serialization & validation
│   │   └── urlValidation.ts    # Safe trailer URL parser & embed generator
│   ├── pages/                  # Home, Discover, Movie, Watchlist, Collections, Genre, Profile, 404
│   ├── services/
│   │   └── movieService.ts     # Catalog data access layer
│   ├── store/
│   │   └── appStore.ts         # Unified Zustand store with local persistence
│   ├── styles/
│   │   ├── tokens.css          # Dark/Light theme design variables & tokens
│   │   └── globals.css         # Tailwind base styles and custom utilities
│   ├── test/                   # Automated Vitest test suites
│   ├── types/
│   │   └── movie.ts            # Strict TypeScript domain interfaces
│   └── main.tsx                # App entrypoint & DOM mounting
├── netlify.toml                # Netlify deployment configuration
├── vercel.json                 # Vercel deployment configuration
├── .env.example                # Example environment variables
└── package.json                # Project dependencies and npm scripts
```

---

## 🔒 Privacy & Persistence Notice

CineScope respects user privacy:
- Data is stored strictly on your local device via the browser’s `localStorage` API.
- No analytics trackers or user profiling services are embedded.
- Backups can be exported and imported at any time from the `/profile` page as formatted JSON.

---

## 📄 License & Attribution

- Built as an open-source demonstration platform.
- Imagery sourced under permissible photography licenses via Unsplash.
- CineScope is a discovery tool and does not host, stream, or pirate copyrighted media files.
