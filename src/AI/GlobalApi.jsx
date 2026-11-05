import { useEffect, useState } from "react";

/**
 * Place photos.
 *
 * Default provider: Wikipedia (free, no key, no billing, CORS-enabled).
 * Optional provider: Google Places (New). It needs billing, so it is only used when
 * VITE_USE_GOOGLE_PLACES=true and is tried first, with Wikipedia as the fallback.
 */
const WIKI_URL = "https://en.wikipedia.org/w/api.php";
const GOOGLE_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const USE_GOOGLE = import.meta.env.VITE_USE_GOOGLE_PLACES === "true" && Boolean(GOOGLE_KEY);

/** "Paris, Île-de-France Region, France" -> "Paris" (the specific part searches best). */
const searchTerm = (query) => query.split(",")[0].trim();

async function wikipediaPhoto(query, width) {
    const params = new URLSearchParams({
        action: "query",
        generator: "search",
        gsrsearch: searchTerm(query),
        gsrlimit: "3",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: String(width),
        format: "json",
        origin: "*",
    });
    const res = await fetch(`${WIKI_URL}?${params}`);
    if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
    const pages = Object.values((await res.json())?.query?.pages ?? {});
    // Results come back unordered; take the best-ranked page that has a picture.
    const best = pages.filter((p) => p.thumbnail?.source).sort((a, b) => a.index - b.index)[0];
    return best?.thumbnail.source ?? null;
}

async function googlePhoto(query, width) {
    const res = await fetch(GOOGLE_SEARCH_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.photos",
        },
        body: JSON.stringify({ textQuery: query }),
    });
    if (!res.ok) throw new Error(`Places API ${res.status}`);
    const photos = (await res.json())?.places?.[0]?.photos ?? [];
    // Prefer the 4th photo (usually a good landscape) but never assume it exists.
    const name = photos[3]?.name ?? photos[0]?.name;
    return name
        ? `https://places.googleapis.com/v1/${name}/media?maxHeightPx=${Math.round(width * 0.75)}&maxWidthPx=${width}&key=${GOOGLE_KEY}`
        : null;
}

async function findPhoto(query, width) {
    if (USE_GOOGLE) {
        try {
            const url = await googlePhoto(query, width);
            if (url) return url;
        } catch (err) {
            console.warn("Google Places photo failed, using Wikipedia:", err.message);
        }
    }
    return wikipediaPhoto(query, width);
}

/**
 * query -> Promise<url|null>. Caching the *promise* de-duplicates concurrent
 * requests for the same place and avoids repeat network calls on re-render.
 */
const photoCache = new Map();

/** `large` requests a 1600px image for full-bleed heroes; cards use 800px. */
export function getPlacePhoto(query, { large = false } = {}) {
    if (!query) return Promise.resolve(null);
    const width = large ? 1600 : 800;
    const key = `${query}|${width}`;
    if (!photoCache.has(key)) {
        const p = findPhoto(query, width).catch((err) => {
            console.warn("Place photo lookup failed:", query, err.message);
            photoCache.delete(key); // allow a retry later
            return null;
        });
        photoCache.set(key, p);
    }
    return photoCache.get(key);
}

/** React hook: { url, loading }. `url` is null when no photo exists; callers render a placeholder. */
export function usePlacePhoto(query, { large = false } = {}) {
    const [state, setState] = useState({ url: null, loading: Boolean(query) });

    useEffect(() => {
        if (!query) {
            setState({ url: null, loading: false });
            return;
        }
        let cancelled = false;
        setState((s) => ({ ...s, loading: true }));
        getPlacePhoto(query, { large }).then((url) => {
            if (!cancelled) setState({ url, loading: false });
        });
        return () => {
            cancelled = true;
        };
    }, [query, large]);

    return state;
}
