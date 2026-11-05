import { beforeEach, describe, expect, it, vi } from "vitest";
import { AiUnavailableError, isRetryable, tryModels } from "./fallback";

const http = (status) => Object.assign(new Error(`HTTP ${status}`), { status });

beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));

describe("isRetryable", () => {
    it.each([404, 429, 500, 503])("retries on HTTP %i", (s) => expect(isRetryable(http(s))).toBe(true));
    it.each([400, 401, 403])("does not retry on HTTP %i (our request or key is wrong)", (s) => expect(isRetryable(http(s))).toBe(false));
    it("retries on unparseable or incomplete output", () => {
        expect(isRetryable(new SyntaxError("bad json"))).toBe(true);
        expect(isRetryable(new Error("The AI response was missing hotels or an itinerary."))).toBe(true);
    });
    it("does not retry on unknown errors", () => expect(isRetryable(new Error("boom"))).toBe(false));
});

describe("tryModels", () => {
    it("returns the first success and stops", async () => {
        const run = vi.fn().mockResolvedValue("ok");
        expect(await tryModels(["a", "b"], run)).toBe("ok");
        expect(run).toHaveBeenCalledTimes(1);
    });
    it("skips retired (404) and busy (503) models", async () => {
        const run = vi.fn(async (m) => {
            if (m === "old") throw http(404);
            if (m === "busy") throw http(503);
            return `from ${m}`;
        });
        expect(await tryModels(["old", "busy", "good"], run)).toBe("from good");
        expect(run.mock.calls.map((c) => c[0])).toEqual(["old", "busy", "good"]);
    });
    it("ignores undefined/duplicate model names", async () => {
        const run = vi.fn().mockResolvedValue(1);
        await tryModels([undefined, "a", "a"], run);
        expect(run).toHaveBeenCalledTimes(1);
        expect(run).toHaveBeenCalledWith("a");
    });
    it("throws immediately on a bad key (403) without trying others", async () => {
        const run = vi.fn().mockRejectedValue(http(403));
        await expect(tryModels(["a", "b"], run)).rejects.toMatchObject({ status: 403 });
        expect(run).toHaveBeenCalledTimes(1);
    });
    it("throws AiUnavailableError when every model fails", async () => {
        const run = vi.fn().mockRejectedValue(http(503));
        const err = await tryModels(["a", "b"], run).catch((e) => e);
        expect(err).toBeInstanceOf(AiUnavailableError);
        expect(run).toHaveBeenCalledTimes(2);
    });
});
