import { describe, expect, it } from "vitest";
import { dayNumber, dayRouteUrl, filterAndSortTrips, firstName, galleryQueries, itineraryDays, tripCounts, tripOverview, tripStats } from "./trips";

const trip = (id, label, days, createdAt) => ({
    id,
    createdAt,
    userLocation: { destination: { label }, DaysCount: days },
});

const trips = [
    trip("a", "Paris, France", 3, 300),
    trip("b", "Tokyo, Japan", 5, 100),
    trip("c", "paris, france", 2, 200), // same destination, different case
    trip("1700000000000", "Rome, Italy", "4", undefined), // legacy: id was Date.now(), days stored as string
];

describe("tripStats", () => {
    it("computes totals from real trips only", () => {
        expect(tripStats(trips)).toEqual({ totalTrips: 4, totalDays: 14, destinations: 3 });
    });
    it("is all zeros for no trips", () => {
        expect(tripStats([])).toEqual({ totalTrips: 0, totalDays: 0, destinations: 0 });
    });
    it("ignores missing / garbage data", () => {
        expect(tripStats([{}, { userLocation: { DaysCount: "x" } }])).toEqual({ totalTrips: 2, totalDays: 0, destinations: 0 });
    });
});

describe("filterAndSortTrips", () => {
    const ids = (list) => list.map((t) => t.id);
    it("newest first by default, legacy ids use their timestamp", () => {
        expect(ids(filterAndSortTrips(trips))).toEqual(["1700000000000", "a", "c", "b"]);
    });
    it("oldest first", () => {
        expect(ids(filterAndSortTrips(trips, "", "oldest"))).toEqual(["b", "c", "a", "1700000000000"]);
    });
    it("most days first, ties broken by newest", () => {
        expect(ids(filterAndSortTrips(trips, "", "days"))).toEqual(["b", "1700000000000", "a", "c"]);
    });
    it("filters by destination, case-insensitive and trimmed", () => {
        expect(ids(filterAndSortTrips(trips, "  PARIS "))).toEqual(["a", "c"]);
    });
    it("returns an empty list when nothing matches", () => {
        expect(filterAndSortTrips(trips, "zzz")).toEqual([]);
    });
    it("does not mutate the input", () => {
        const copy = [...trips];
        filterAndSortTrips(trips, "", "oldest");
        expect(trips).toEqual(copy);
    });
    it("falls back to newest for an unknown sort key", () => {
        expect(ids(filterAndSortTrips(trips, "", "bogus"))[0]).toBe("1700000000000");
    });
});

describe("firstName", () => {
    it("takes the first word", () => expect(firstName({ name: "Ada Lovelace" })).toBe("Ada"));
    it("falls back when missing", () => expect(firstName(null)).toBe("traveller"));
});

describe("dayRouteUrl", () => {
    const g = (lat, lng) => ({ latitude: lat, longitude: lng });
    it("returns null with no stops", () => expect(dayRouteUrl([], "Paris")).toBeNull());
    it("single stop becomes a search link", () => {
        expect(dayRouteUrl([{ placeName: "Louvre" }], "Paris")).toContain("/maps/search/?api=1&query=Louvre%2C%20Paris");
    });
    it("uses coordinates when every stop has them", () => {
        const url = dayRouteUrl(
            [
                { placeName: "A", geoCoordinates: g(1, 2) },
                { placeName: "B", geoCoordinates: g(3, 4) },
                { placeName: "C", geoCoordinates: g(5, 6) },
            ],
            "X"
        );
        const p = new URL(url).searchParams;
        expect(p.get("origin")).toBe("1,2");
        expect(p.get("destination")).toBe("5,6");
        expect(p.get("waypoints")).toBe("3,4");
    });
    it("falls back to names if any stop lacks coordinates", () => {
        const url = dayRouteUrl([{ placeName: "A", geoCoordinates: g(1, 2) }, { placeName: "B", geoCoordinates: null }], "Rome");
        const p = new URL(url).searchParams;
        expect(p.get("origin")).toBe("A, Rome");
        expect(p.get("destination")).toBe("B, Rome");
        expect(p.get("waypoints")).toBeNull();
    });
    it("caps waypoints at 9", () => {
        const plan = Array.from({ length: 15 }, (_, i) => ({ placeName: `P${i}`, geoCoordinates: g(i, i) }));
        expect(new URL(dayRouteUrl(plan, "X")).searchParams.get("waypoints").split("|")).toHaveLength(9);
    });
    it("skips stops without a name", () => {
        expect(dayRouteUrl([{ placeName: "" }, null], "X")).toBeNull();
    });
});

describe("dayNumber", () => {
    it("parses day keys", () => {
        expect(dayNumber("day10")).toBe(10);
        expect(dayNumber("nonsense")).toBe(0);
    });
});

describe("trip content helpers", () => {
    const full = {
        userLocation: { destination: { label: "Paris, France" }, DaysCount: 2, Budget: "Medium Budget", PeopleCount: "2 people" },
        tripData: {
            hotelOptions: [{ hotelName: "Hotel A" }, { hotelName: "Hotel B" }],
            itinerary: {
                day10: { plan: [{ placeName: "Louvre" }] },
                day2: { plan: [{ placeName: "Eiffel Tower" }, { placeName: "Louvre" }, { placeName: "" }] },
            },
        },
    };
    it("itineraryDays sorts numerically", () => expect(itineraryDays(full)).toEqual(["day2", "day10"]));
    it("tripCounts reads real counts", () => expect(tripCounts(full)).toEqual({ hotels: 2, days: 2, places: 4 }));
    it("tripCounts tolerates missing data", () => expect(tripCounts({})).toEqual({ hotels: 0, days: 0, places: 0 }));
    it("galleryQueries: hotel first, then unique places, capped", () => {
        expect(galleryQueries(full)).toEqual(["Hotel A", "Eiffel Tower", "Louvre"]);
        expect(galleryQueries(full, 2)).toEqual(["Hotel A", "Eiffel Tower"]);
    });
    it("tripOverview describes the trip from real fields", () => {
        expect(tripOverview(full)).toBe("2-day medium trip for 2 people to Paris, France. Includes 2 hotel options and 4 places to visit.");
    });
    it("tripOverview survives an empty trip", () => expect(tripOverview({})).toBe("A-day trip."));
});
