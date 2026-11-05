/**
 * Destination search via Open-Meteo's free geocoding API (no key, no billing, CORS-enabled).
 * Replaces the Google Places Autocomplete widget, which stopped working once billing ended.
 */
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

/** "Paris" + "Île-de-France Region" + "France" -> "Paris, Île-de-France Region, France" (no repeats). */
export function formatPlace({ name, admin1, country }) {
    const parts = [name, admin1, country].filter(Boolean);
    return parts.filter((p, i) => parts.indexOf(p) === i).join(", ");
}

/** Resolves to [{ id, label }]; rejects on network errors (AbortError when cancelled). */
export async function searchDestinations(text, { signal } = {}) {
    const q = text.trim();
    if (q.length < 2) return [];
    const params = new URLSearchParams({ name: q, count: "6", language: "en", format: "json" });
    const res = await fetch(`${GEOCODE_URL}?${params}`, { signal });
    if (!res.ok) throw new Error(`Geocoding ${res.status}`);
    const results = (await res.json())?.results ?? [];
    const seen = new Set();
    return results
        .map((r) => ({ id: r.id, label: formatPlace(r) }))
        .filter((r) => (seen.has(r.label) ? false : seen.add(r.label)));
}
