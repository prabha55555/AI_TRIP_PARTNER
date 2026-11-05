# TravelBeam – Interview Study Guide

Written for: you, preparing to explain and defend this project in technical interviews.

## 1. The 30-second pitch
"TravelBeam is a React single-page app where a signed-in user enters a destination, days, budget and group type. The app calls Google's Gemini model, which returns a structured JSON itinerary with hotels and daily places. I validate it, store it in Firestore under an unguessable id, and render it with photos fetched from the Google Places API. Users can reopen their trips and share the link."

## 2. Architecture
```
Browser (React SPA, Vite)
 ├─ Google Identity (OAuth)  → profile {name,email,picture} → localStorage via AuthProvider
 ├─ Gemini API               → trip JSON  (called directly from the browser)
 ├─ Firestore                → collection "AI-Trips" (one doc per trip)
 └─ Places API (New)         → photos for destination / hotels / places
```
There is **no backend of your own**. That is the central design trade-off: fast to build and host (Vercel static + `vercel.json` SPA rewrite) but secrets and authorization live in the client (see §6).

### Request flow: creating a trip
1. `create/index.jsx`: controlled form state `{destination, DaysCount, Budget, PeopleCount}`.
2. Click "Generate": not signed in → `requestLogin(generate)`; the callback runs with the fresh profile after login.
3. `generateTripPlan()` (`AI/AIModel.jsx`): `systemInstruction` defines the JSON schema; `responseMimeType: "application/json"` asks for JSON; we strip stray code fences, `JSON.parse`, then check `hotelOptions` and `itinerary` exist.
4. `setDoc(doc(db,"AI-Trips", crypto.randomUUID()), {...})`.
5. `navigate('/view-trip/:id')` → `getDoc` → `InfoSection`, `Hotels`, `PlacesToVisit`.
6. Each card calls `usePlacePhoto(name)` → `getPlacePhoto` → Places `searchText` → photo URL; results are cached in a `Map` of promises.

### Data model (Firestore, NoSQL)
```
AI-Trips/{id}
  id: string (uuid)            createdAt: number (ms)
  userEmail: string            ← ownership key, used in where('userEmail','==',email)
  userLocation: { destination:{label}, DaysCount, Budget, PeopleCount }
  tripData: { tripDetails, hotelOptions[], itinerary:{ day1:{theme,bestTimeToVisit,plan[]}, ... } }
```
Why Firestore: schema-less (AI output varies), no server to run, one document read renders a whole trip. Downside: AI output is stored unvalidated, and there is no relational querying/analytics.

## 3. Module walkthrough
| File | Role | Key idea |
|---|---|---|
| `main.jsx` | Router + providers | `createBrowserRouter`, `lazy()` routes (code-splitting), `Layout` route with `<Outlet/>`, `errorElement`, 404 |
| `lib/auth.jsx` | Auth context | One login implementation; `useMemo` on context value; `requestLogin(callback)` pattern |
| `AI/AIModel.jsx` | LLM call | Stateless `generateContent`, system instruction, JSON mode, validation |
| `AI/GlobalApi.jsx` | Photos | Promise cache dedups concurrent requests; hook with cancel flag; fallback image |
| `create/` | Form | Controlled inputs, validation, loading overlay, error handling |
| `my-trips/` | List | Firestore query, client sort, loading/empty/error states, route guard |
| `view-trip/` | Detail | status state machine `loading/ready/missing/error` |
| `components/ui` | shadcn-style primitives | Radix gives accessible Dialog/Popover; `cva` for Button variants; `cn` = `clsx`+`tailwind-merge` |

## 4. Bugs found in the original and why they mattered
Be ready to tell this as a story: *"When I revisited it I audited my own code and fixed…"*

| # | Problem (original) | Impact | Fix |
|---|---|---|---|
| 1 | `toast` not imported in trip viewer | ReferenceError on a missing trip, blank page | Proper `missing/error` states |
| 2 | `photos[3].name` assumed ≥4 photos | Uncaught promise rejection; cards stuck | Safe fallback chain `photos[3] ?? photos[0]` → local image |
| 3 | Global `chatSession` with history | Each trip appended to one growing chat: rising latency/cost, cross-user context bleed | Stateless `generateContent` |
| 4 | `Date.now()` as doc id | Shareable URLs guessable/enumerable | `crypto.randomUUID()` |
| 5 | Access token in URL query string | Leaks via logs/history | `Authorization` header |
| 6 | `window.location.reload()` after login/logout, `<a href>` links | Full reloads, lost state, slow | Context state + `<Link>`; Header moved inside router |
| 7 | Login code duplicated in Header and Create; photo fetch copied 4× | Drift/bugs | `useAuth`, `usePlacePhoto` |
| 8 | `setUserTrips` in a loop; no empty/error state; `animate-pulsse` typo | Many re-renders, spinner forever | Single `setTrips`, states |
| 9 | `.replace("{DaysCount}")` replaced only first match | Prompt bug | Template literals |
| 10 | Days limit hacked via `e.target.value = 6` | Uncontrolled/inconsistent | Controlled input + clamp |
| 11 | Invalid inline `<script>` using `import.meta` in `index.html` | Console error, dead code | Removed (autocomplete lib loads Maps itself) |
| 12 | `class=` instead of `className`, missing `key`, typo classes (`xl:pd-56`, `bg-amper-50`) | Warnings, broken styles | Fixed |
| 13 | 10 unused heavy deps (MUI, Emotion, Material Tailwind, Vue plugin…) and Tailwind v3 config mixed with v4 | 1.5 MB bundle, 115 KB CSS | Removed; now largest JS chunk 331 KB, CSS 49 KB |
| 14 | Bogus dev proxy to `text-bison` (retired model) | Dead config | Removed |
| 15 | README described Redux and files that don't exist | Credibility risk in interview | Rewritten to match code |
| 16 | 94 ESLint errors | Code quality signal | 0 |
| 18 | Hard-coded `gemini-2.0-flash` was retired by Google; Google Maps/Places stopped when trial billing ended | Trip generation and destination search failed in production | Model fallback chain (`AI/fallback.js`) that skips retired/busy models; free providers for search (Open-Meteo) and photos (Wikipedia) |
| 17 | 3.9 MB hero image, 2 MB PNG | Slow first load | Compressed (all images 8.9 MB → 1.2 MB) |

## 5. Likely interview questions (with answer outlines)

**Architecture & design**
- *Why no backend?* Speed of delivery and cost; Firebase + direct API calls. Trade-off: secrets exposed, no server-side authz or rate limiting. Next step: Cloud Function/Express proxy for Gemini and Places.
- *Why Vite over CRA/Next?* Fast HMR/build, CRA deprecated; SPA is enough since pages are behind login and not SEO-critical. Next.js would allow server-side key handling and SSR for shared trip links (OG previews).
- *Why Context rather than Redux?* State is tiny (a user object); trip data is fetched per page. Redux is overkill. If caching/refetching grows, use TanStack Query.
- *How does routing work / what is code-splitting?* `createBrowserRouter`, `lazy()` + `Suspense`; each route is a separate chunk. `vercel.json` rewrites all paths to `/` so deep links work.

**Frontend/React**
- Controlled vs uncontrolled inputs (days field). `useEffect` cleanup & stale responses (`cancelled` flag). Why `key` matters. Why `useMemo` on the context value. Stale-closure issue I hit: after login the `generate` callback closed over `user === null`, so I pass the fresh profile into the callback.
- Why a hook for photos? Reuse, caching, loading/fallback logic in one place.
- Accessibility: `aria-pressed` on option cards, labelled inputs/buttons, focus ring, reduced-motion media query, Radix focus trapping.
- Performance: lazy routes, vendor chunks, `loading="lazy"` images, promise cache, skeletons.

**AI/LLM**
- How do you get reliable JSON? System instruction with schema + `responseMimeType: application/json` + defensive parse + validation. Better: `responseSchema` (structured output) and zod validation.
- Hallucination? Hotel prices/URLs may be wrong; hence we ignore model image URLs and fetch real photos from Places, and the footer disclaims. Better: ground with Places data.
- Cost/latency/rate-limits? Stateless call, token cap 8192, loading UI; add caching, per-user quota, server-side proxy.
- Prompt injection? Only the place label and constrained options reach the prompt; free-text input would need sanitising.

**Auth & security (expect pressure here)**
- *How does auth work?* OAuth implicit flow gets an access token; I call Google's userinfo endpoint with a Bearer header and store `{name,email,picture}` in localStorage.
- *Weakness?* The "session" is just localStorage: anyone can edit it to impersonate an email, and Firestore isn't enforcing identity. Fix: Firebase Auth (`signInWithCredential`) and security rules using `request.auth.token.email`; or auth-code flow with a backend session cookie (HttpOnly).
- *XSS & localStorage?* Tokens in localStorage are readable by injected scripts; we don't store the access token, only the profile. React escapes output by default; external links use `rel="noopener noreferrer"`.
- *API keys in frontend?* Anything `VITE_*` ships to the browser. Mitigate with HTTP-referrer and API restrictions, quotas, and ultimately a proxy.

**Database**
- Why NoSQL here; how would you index/query? `where('userEmail','==',…)` uses an automatic single-field index; I sort client-side to avoid a composite index. For scale use `orderBy('createdAt')` with a composite index and pagination (`limit`, `startAfter`).
- Data duplication/denormalisation: the whole AI output is embedded in one document (1 MB doc limit; fine here).
- How would you do delete/edit? Needs rules restricting to the owner.

**Challenges you can talk about**
1. Making LLM output dependable. 2. Places photo quota/caching. 3. Stale closure after login. 4. Replacing a bloated dependency set and a mixed Tailwind setup.

## 6. Known limitations (say them before they ask)
- Auth/authorization is client-side; keys exposed (see README for the fix).
- Trip pages are public to anyone with the link (by design for sharing; UUID makes them unguessable, not secret).
- Tests: 23 unit/component tests (Vitest + React Testing Library) cover JSON parsing/validation, the photo lookup (cache, fallbacks, retry) and trip rendering. Not covered: the real Gemini/Firestore/Google-login round trip. Add Playwright e2e with a Firebase emulator.
- No TypeScript. Prop types disabled in lint; TS migration would fix it.
- Old trips saved before this refactor have no `createdAt`; sorting falls back to the id timestamp.
- Gemini/Places calls are not rate-limited per user.

## 7. Improvement roadmap (industry-standard next steps)
1. **Backend proxy** (Cloud Functions / Express) for Gemini and Places; keys server-side; rate-limit per user.
2. **Firebase Auth + Firestore security rules**; owner-only update/delete; add delete/rename trip.
3. **Structured output** (`responseSchema`) + zod validation; retry on invalid JSON; stream progress.
4. **TypeScript**, **TanStack Query**, tests (Vitest/RTL/Playwright), CI (lint + test + build on PR).
5. Features: edit/regenerate a day, map view (Maps JS markers using the returned coordinates), PDF export, weather, budget breakdown, interests/preferences, pagination, dark mode, i18n.
6. Observability: Sentry for errors, analytics for funnel (create → generated → saved).
7. SEO/share: SSR or pre-render for share links with Open Graph images (Next.js).

## 8. Walk-through script for a live demo
Landing → Sign in → Create (show validation) → loading overlay → trip page (hero, hotels, itinerary timeline) → Share button → My Trips. Then open `AI/AIModel.jsx` and explain the prompt contract and validation, and `lib/auth.jsx` for the session model.
