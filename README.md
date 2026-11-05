# TravelBeam – AI Trip Planner

Enter a destination, number of days, budget and travel group. TravelBeam asks Google Gemini for a structured itinerary (hotels + day-by-day places), enriches it with real photos from the Google Places API, saves it to Firestore and lets you revisit or share it.

## Features
- Google sign-in (OAuth 2.0 implicit flow via `@react-oauth/google`)
- Destination autocomplete (Google Places)
- AI-generated hotels and day-by-day itinerary (Gemini 2.0 Flash, JSON mode)
- Place/hotel photos from Places API (cached, with fallbacks)
- Saved trips (Firestore), shareable trip links, "Open in Google Maps"
- Responsive UI with loading, empty and error states

## Tech stack
| Layer | Choice |
|---|---|
| UI | React 18, Vite 6, React Router 6 (data router, lazy routes) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens), Radix primitives (shadcn-style), lucide icons, sonner toasts |
| Auth | Google OAuth (`useGoogleLogin`), profile kept in `localStorage`, exposed through `AuthProvider` |
| AI | `@google/generative-ai` – Gemini Flash with automatic model fallback (retired/busy models are skipped), `responseMimeType: application/json` |
| Data | Firebase Firestore, collection `AI-Trips` |
| Destination search | Open-Meteo geocoding API (free, no key) |
| Photos | Wikipedia API (free, no key); Google Places optional via `VITE_USE_GOOGLE_PLACES=true` (needs billing) |

## Getting started
```bash
cd mu
cp .env.example .env.local   # fill in your keys
npm install
npm run dev
npm run lint
npm test          # Vitest unit + component tests
npm run build
```
Required: a Gemini API key (Generative Language API), a Google OAuth web client id, and a Firebase project with Firestore. No Google Maps/Places billing is needed: destination search and photos use free public APIs. To prefer Google Places photos, enable billing + Places API (New) and set `VITE_USE_GOOGLE_PLACES=true`.

## Project structure
```
src/
  main.jsx                 Router, providers, lazy-loaded routes
  index.css                Tailwind v4 import + design tokens
  lib/auth.jsx             AuthProvider / useAuth (login, logout, session)
  lib/trips.js             Pure trip helpers (labels, days, sorting, overview), unit-tested`n  lib/utils.js             cn() class-name helper
  AI/AIModel.jsx           generateTripPlan(): prompt, JSON parsing, validation
  AI/GlobalApi.jsx         Photo lookup (Wikipedia, optional Google), promise cache, usePlacePhoto hook
  AI/geocode.js            Destination search (Open-Meteo)
  AI/firebase.jsx          Firestore init
  components/custom/       Layout, Header, Home/Hero, LoginDialog, PlacePhoto, ShareButton, SiteFooter, RouteError
  components/ui/           Button, Badge, Skeleton, StatCard, EmptyState, SectionHeading, form controls, Dialog, Popover, Toaster
  create/                  Trip form (+ option.jsx: budget/group options)
  my-trips/                List of the user's saved trips
  view-trip/               Trip page: InfoSection, Hotels, PlacesToVisit, cards
```

## Data flow
`Create form → generateTripPlan() → Gemini returns JSON → validated → setDoc(AI-Trips/<uuid>) → navigate(/view-trip/<uuid>) → getDoc → components render; each card calls usePlacePhoto(name) → Wikipedia → photo URL.`

## Security notes (read before deploying)
- All keys are `VITE_*`, so they are **bundled into the browser**. Restrict each key in Google Cloud (HTTP referrer + API restrictions) or move Gemini/Places calls behind a server/Cloud Function.
- Auth is client-side only and Firestore is queried by `userEmail`. Production needs Firebase Authentication plus Firestore rules, e.g. `allow create: if request.auth.token.email == request.resource.data.userEmail; allow read: if true` (shareable by unguessable id) with `allow update, delete: if request.auth.token.email == resource.data.userEmail`.
- `firestore.rules` in this repo is the target rule set; it only takes effect once users sign in via Firebase Auth.
- Never commit `.env.local`. If keys were ever pushed to a public repo, rotate them.

