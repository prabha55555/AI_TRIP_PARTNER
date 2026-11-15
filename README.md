# TravelBeam – AI Trip Planner

Enter a destination, number of days, budget and travel group. TravelBeam asks Google Gemini for a structured itinerary (hotels + day-by-day places), enriches it with real photos from the Google Places API, saves it to Firestore and lets you revisit or share it.

## Features
- Google sign-in (OAuth 2.0 implicit flow via `@react-oauth/google`)
- Destination autocomplete (Google Places)
- AI-generated hotels and day-by-day itinerary (Gemini Flash, JSON mode, called from the backend)
- Place/hotel photos from Places API (cached, with fallbacks)
- Saved trips (Firestore), shareable trip links, "Open in Google Maps"
- Responsive UI with loading, empty and error states

## Tech stack
| Layer | Choice |
|---|---|
| UI | React 18, Vite 6, React Router 6 (data router, lazy routes) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens), Radix primitives (shadcn-style), lucide icons, sonner toasts |
| Auth | Google OAuth (`useGoogleLogin`), profile kept in `localStorage`, exposed through `AuthProvider` |
| Backend | Node + Express (`server/`): verifies the Google token, validates input, rate-limits per user, calls Gemini with the server-side key |
| AI | `@google/generative-ai` (server-side) – Gemini Flash with automatic model fallback (retired/busy models are skipped), `responseMimeType: application/json` |
| Data | Firebase Firestore, collection `AI-Trips` |
| Destination search | Open-Meteo geocoding API (free, no key) |
| Photos | Wikipedia API (free, no key); Google Places optional via `VITE_USE_GOOGLE_PLACES=true` (needs billing) |

## Getting started
```bash
cd mu
cp .env.example .env.local   # fill in your keys
npm install
npm run server    # backend on :8787 (terminal 1)
npm run dev       # frontend (terminal 2); Vite proxies /api to the backend
npm run lint
npm test          # Vitest unit + component tests
npm run build
```
Put the Gemini key in `GEMINI_API_KEY` (server only, see `.env.example`). Required: a Gemini API key (Generative Language API), a Google OAuth web client id, and a Firebase project with Firestore. No Google Maps/Places billing is needed: destination search and photos use free public APIs. To prefer Google Places photos, enable billing + Places API (New) and set `VITE_USE_GOOGLE_PLACES=true`.

## Project structure
```
src/
  main.jsx                 Router, providers, lazy-loaded routes
  index.css                Tailwind v4 import + design tokens
  lib/auth.jsx             AuthProvider / useAuth (login, logout, session)
  lib/trips.js             Pure trip helpers (labels, days, sorting, overview), unit-tested
  lib/utils.js             cn() class-name helper
  AI/AIModel.jsx           generateTripPlan(): calls the backend with the user's token
  AI/GlobalApi.jsx         Photo lookup (Wikipedia, optional Google), promise cache, usePlacePhoto hook
  AI/geocode.js            Destination search (Open-Meteo)
  AI/firebase.jsx          Firestore init
  components/custom/       Layout, Header, Home/Hero, LoginDialog, PlacePhoto, ShareButton, SiteFooter, RouteError
  components/ui/           Button, Badge, Skeleton, StatCard, EmptyState, SectionHeading, form controls, Dialog, Popover, Toaster
server/
  index.js                 Starts the API (reads env, wires dependencies)
  app.js                   Routes: POST /api/generate-trip, GET /api/health
  auth.js                  Verifies Google access tokens (cached)
  rateLimit.js             Per-user limit (default 10 trips/hour)
  validation.js            Checks the request body
  gemini.js                Prompt, model fallback, Gemini call (API key lives here)
  server.test.js           API tests
src/ (continued)
  create/                  Trip form (+ option.jsx: budget/group options)
  my-trips/                List of the user's saved trips
  view-trip/               Trip page: InfoSection, Hotels, PlacesToVisit, cards
```

## Data flow
`Create form → generateTripPlan() → POST /api/generate-trip (Bearer token) → server verifies token, validates, rate-limits → Gemini returns JSON → validated → browser setDoc(AI-Trips/<uuid>) → navigate(/view-trip/<uuid>) → getDoc → components render; each card calls usePlacePhoto(name) → Wikipedia → photo URL.`

## Security notes (read before deploying)
- The Gemini key lives only on the backend (`GEMINI_API_KEY`). Other `VITE_*` values (Firebase web config, OAuth client id, optional Places key) are public by design: restrict them in Google Cloud.
- The backend checks every request's Google token with Google, accepts only tokens issued to this app (`GOOGLE_CLIENT_ID`), validates input and rate-limits per user. In production set `ALLOWED_ORIGIN` and `VITE_API_URL`.
- Still client-side: saving/reading trips goes straight to Firestore. Next step: move trip CRUD behind the API with firebase-admin.
- Auth is client-side only and Firestore is queried by `userEmail`. Production needs Firebase Authentication plus Firestore rules, e.g. `allow create: if request.auth.token.email == request.resource.data.userEmail; allow read: if true` (shareable by unguessable id) with `allow update, delete: if request.auth.token.email == resource.data.userEmail`.
- `firestore.rules` in this repo is the target rule set; it only takes effect once users sign in via Firebase Auth.
- Never commit `.env.local`. If keys were ever pushed to a public repo, rotate them.

