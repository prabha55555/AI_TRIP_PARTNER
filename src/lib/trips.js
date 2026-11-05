/** Pure helpers over saved trips / Gemini output. No React, so they are unit-testable. */

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

export const tripLabel = (trip) => trip?.userLocation?.destination?.label ?? "";
export const tripDays = (trip) => toNumber(trip?.userLocation?.DaysCount);

/** Older trips have no createdAt, but their id was Date.now(). New ids are UUIDs (NaN -> 0). */
export const tripTimestamp = (trip) => {
    const t = toNumber(trip?.createdAt ?? trip?.id);
    return t > 0 ? t : 0;
};

/** Totals shown on the My Trips dashboard, computed only from the loaded trips. */
export function tripStats(trips) {
    const destinations = new Set(trips.map((t) => tripLabel(t).trim().toLowerCase()).filter(Boolean));
    return {
        totalTrips: trips.length,
        totalDays: trips.reduce((sum, t) => sum + tripDays(t), 0),
        destinations: destinations.size,
    };
}

export const SORT_OPTIONS = {
    newest: "Newest first",
    oldest: "Oldest first",
    days: "Most days",
};

/** Case-insensitive destination search + sort. Returns a new array. */
export function filterAndSortTrips(trips, query = "", sort = "newest") {
    const q = query.trim().toLowerCase();
    const filtered = q ? trips.filter((t) => tripLabel(t).toLowerCase().includes(q)) : [...trips];
    const by = {
        newest: (a, b) => tripTimestamp(b) - tripTimestamp(a),
        oldest: (a, b) => tripTimestamp(a) - tripTimestamp(b),
        days: (a, b) => tripDays(b) - tripDays(a) || tripTimestamp(b) - tripTimestamp(a),
    }[sort] ?? ((a, b) => tripTimestamp(b) - tripTimestamp(a));
    return filtered.sort(by);
}

export const firstName = (user) => (user?.name ?? "").trim().split(/\s+/)[0] || "traveller";

const validCoords = (g) => Number.isFinite(g?.latitude) && Number.isFinite(g?.longitude);

/**
 * Google Maps link for one day. Uses real coordinates when every stop has them,
 * otherwise the place names. Google accepts at most 9 waypoints.
 */
export function dayRouteUrl(plan, destinationLabel = "") {
    const stops = (Array.isArray(plan) ? plan : []).filter((p) => p?.placeName);
    if (stops.length === 0) return null;
    const point = (p, useCoords) =>
        useCoords ? `${p.geoCoordinates.latitude},${p.geoCoordinates.longitude}` : `${p.placeName}, ${destinationLabel}`;
    if (stops.length === 1) {
        return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(point(stops[0], validCoords(stops[0].geoCoordinates)));
    }
    const limited = stops.slice(0, 11); // origin + destination + 9 waypoints
    const useCoords = limited.every((p) => validCoords(p.geoCoordinates));
    const [origin, ...rest] = limited;
    const destination = rest.pop();
    const params = new URLSearchParams({
        api: "1",
        origin: point(origin, useCoords),
        destination: point(destination, useCoords),
        travelmode: "walking",
    });
    if (rest.length) params.set("waypoints", rest.map((p) => point(p, useCoords)).join("|"));
    return "https://www.google.com/maps/dir/?" + params.toString();
}

export const dayNumber = (key) => parseInt(String(key).replace(/\D/g, ""), 10) || 0;

const asArray = (v) => (Array.isArray(v) ? v : []);

/** Day keys of the itinerary in numeric order (day2 before day10). */
export const itineraryDays = (trip) =>
    Object.keys(trip?.tripData?.itinerary ?? {}).sort((a, b) => dayNumber(a) - dayNumber(b));

/** Counts taken straight from the Gemini output. */
export function tripCounts(trip) {
    const days = itineraryDays(trip);
    return {
        hotels: asArray(trip?.tripData?.hotelOptions).length,
        days: days.length,
        places: days.reduce((n, k) => n + asArray(trip.tripData.itinerary[k]?.plan).length, 0),
    };
}

/** Names to look up photos for in the gallery: first hotel, then the first stops of the itinerary. */
export function galleryQueries(trip, max = 4) {
    const hotel = asArray(trip?.tripData?.hotelOptions)[0]?.hotelName;
    const places = itineraryDays(trip).flatMap((k) => asArray(trip.tripData.itinerary[k]?.plan).map((p) => p?.placeName));
    return [...new Set([hotel, ...places].filter(Boolean))].slice(0, max);
}

/** One plain-language sentence summarising the trip, built only from the user's inputs and real counts. */
export function tripOverview(trip) {
    const loc = trip?.userLocation ?? {};
    const { hotels, places } = tripCounts(trip);
    const days = tripDays(trip);
    const parts = [
        `${days || "A"}-day ${(loc.Budget ?? "").replace(/ budget$/i, "").toLowerCase()} trip`.replace("  ", " "),
        loc.PeopleCount ? `for ${loc.PeopleCount}` : null,
        tripLabel(trip) ? `to ${tripLabel(trip)}` : null,
    ].filter(Boolean);
    const counts = [hotels && `${hotels} hotel ${hotels === 1 ? "option" : "options"}`, places && `${places} ${places === 1 ? "place" : "places"} to visit`].filter(Boolean);
    return `${parts.join(" ")}.${counts.length ? ` Includes ${counts.join(" and ")}.` : ""}`;
}
