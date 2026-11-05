import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatPlace, searchDestinations } from "./geocode";

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => vi.unstubAllGlobals());

describe("formatPlace", () => {
    it("joins name, region and country", () => {
        expect(formatPlace({ name: "Paris", admin1: "Île-de-France", country: "France" })).toBe("Paris, Île-de-France, France");
    });
    it("drops repeats and missing parts", () => {
        expect(formatPlace({ name: "Singapore", admin1: "Singapore", country: "Singapore" })).toBe("Singapore");
        expect(formatPlace({ name: "Atlantis" })).toBe("Atlantis");
    });
});

describe("searchDestinations", () => {
    it("does not call the API for fewer than 2 characters", async () => {
        expect(await searchDestinations(" p ")).toEqual([]);
        expect(fetch).not.toHaveBeenCalled();
    });
    it("maps and de-duplicates results", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ results: [
                { id: 1, name: "Paris", admin1: "Île-de-France", country: "France" },
                { id: 2, name: "Paris", admin1: "Île-de-France", country: "France" },
                { id: 3, name: "Paris", admin1: "Texas", country: "United States" },
            ] }),
        });
        const out = await searchDestinations("Paris");
        expect(out.map((r) => r.label)).toEqual(["Paris, Île-de-France, France", "Paris, Texas, United States"]);
    });
    it("returns [] when there are no results", async () => {
        fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
        expect(await searchDestinations("zzzzzz")).toEqual([]);
    });
    it("throws on an HTTP error so the UI can fall back to typed text", async () => {
        fetch.mockResolvedValue({ ok: false, status: 500 });
        await expect(searchDestinations("Paris")).rejects.toThrow(/Geocoding 500/);
    });
});
