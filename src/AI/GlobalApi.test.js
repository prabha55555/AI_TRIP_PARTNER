import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const wiki = (pages) => ({ ok: true, json: async () => ({ query: { pages } }) });
const page = (index, title, source) => ({ index, title, ...(source && { thumbnail: { source } }) });

let getPlacePhoto;

beforeEach(async () => {
    vi.resetModules(); // fresh in-memory cache per test
    vi.stubGlobal("fetch", vi.fn());
    ({ getPlacePhoto } = await import("./GlobalApi.jsx"));
});
afterEach(() => vi.unstubAllGlobals());

describe("getPlacePhoto (Wikipedia)", () => {
    it("returns null without any request for an empty query", async () => {
        expect(await getPlacePhoto("")).toBeNull();
        expect(fetch).not.toHaveBeenCalled();
    });

    it("picks the best-ranked page that has a picture", async () => {
        fetch.mockResolvedValue(wiki({ 1: page(3, "Other", "https://x/other.jpg"), 2: page(1, "Eiffel Tower", "https://x/eiffel.jpg"), 3: page(2, "No pic") }));
        expect(await getPlacePhoto("Eiffel Tower")).toBe("https://x/eiffel.jpg");
    });

    it("skips a better-ranked page that has no picture", async () => {
        fetch.mockResolvedValue(wiki({ 1: page(1, "No pic"), 2: page(2, "Has pic", "https://x/p.jpg") }));
        expect(await getPlacePhoto("Somewhere")).toBe("https://x/p.jpg");
    });

    it("returns null when nothing matches or no result has a picture", async () => {
        fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
        expect(await getPlacePhoto("Nowhere")).toBeNull();
        fetch.mockResolvedValue(wiki({ 1: page(1, "No pic") }));
        expect(await getPlacePhoto("Nothing")).toBeNull();
    });

    it("searches only the first part of a comma-separated label", async () => {
        fetch.mockResolvedValue(wiki({}));
        await getPlacePhoto("Paris, Île-de-France Region, France");
        expect(decodeURIComponent(fetch.mock.calls[0][0])).toContain("gsrsearch=Paris&");
    });

    it("de-duplicates concurrent requests for the same place", async () => {
        fetch.mockResolvedValue(wiki({ 1: page(1, "Rome", "https://x/r.jpg") }));
        await Promise.all([getPlacePhoto("Rome"), getPlacePhoto("Rome"), getPlacePhoto("Rome")]);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("returns null on failure and retries next time", async () => {
        fetch.mockResolvedValueOnce({ ok: false, status: 503 });
        expect(await getPlacePhoto("Oslo")).toBeNull();
        fetch.mockResolvedValueOnce(wiki({ 1: page(1, "Oslo", "https://x/oslo.jpg") }));
        expect(await getPlacePhoto("Oslo")).toBe("https://x/oslo.jpg");
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
