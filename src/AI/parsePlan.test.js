import { describe, expect, it } from "vitest";
import { assertValidPlan, parseModelJson } from "./parsePlan";

const validPlan = { hotelOptions: [{ hotelName: "A" }], itinerary: { day1: { plan: [] } } };

describe("parseModelJson", () => {
    it("parses plain JSON", () => {
        expect(parseModelJson('{"a":1}')).toEqual({ a: 1 });
    });
    it("strips ```json fences", () => {
        expect(parseModelJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    });
    it("strips bare ``` fences and whitespace", () => {
        expect(parseModelJson('  ```\n{"a":2}\n```  ')).toEqual({ a: 2 });
    });
    it("throws SyntaxError on invalid JSON", () => {
        expect(() => parseModelJson("not json")).toThrow(SyntaxError);
    });
    it("throws on empty/undefined input", () => {
        expect(() => parseModelJson(undefined)).toThrow();
    });
});

describe("assertValidPlan", () => {
    it("returns a valid plan unchanged", () => {
        expect(assertValidPlan(validPlan)).toBe(validPlan);
    });
    it.each([
        ["null", null],
        ["no hotels", { itinerary: { day1: {} } }],
        ["hotels not an array", { hotelOptions: {}, itinerary: { day1: {} } }],
        ["no itinerary", { hotelOptions: [] }],
        ["empty itinerary", { hotelOptions: [], itinerary: {} }],
    ])("rejects %s", (_name, plan) => {
        expect(() => assertValidPlan(plan)).toThrow(/missing hotels or an itinerary/);
    });
});
