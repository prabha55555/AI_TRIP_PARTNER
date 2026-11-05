import { describe, expect, it } from "vitest";
import { isValidProfile, parseStoredProfile, profileInitial } from "./profile";

describe("parseStoredProfile", () => {
    it("accepts a normal profile", () => {
        expect(parseStoredProfile('{"name":"Asha","email":"a@b.com","picture":"x"}')).toMatchObject({ email: "a@b.com" });
    });
    it("rejects empty/partial profiles that caused the '?' avatar", () => {
        expect(parseStoredProfile("{}")).toBeNull();
        expect(parseStoredProfile('{"picture":"x"}')).toBeNull();
        expect(parseStoredProfile('{"name":"No Email"}')).toBeNull();
    });
    it("rejects missing, null and corrupt data", () => {
        expect(parseStoredProfile(null)).toBeNull();
        expect(parseStoredProfile("null")).toBeNull();
        expect(parseStoredProfile("not json")).toBeNull();
    });
});

describe("isValidProfile", () => {
    it("requires an email-like string", () => {
        expect(isValidProfile({ email: "x" })).toBe(false);
        expect(isValidProfile({ email: "x@y.z" })).toBe(true);
    });
});

describe("profileInitial", () => {
    it("uses the name, falling back to the email", () => {
        expect(profileInitial({ name: "asha", email: "z@y.com" })).toBe("A");
        expect(profileInitial({ name: "", email: "zed@y.com" })).toBe("Z");
    });
    it("returns an empty string when there is nothing to show", () => {
        expect(profileInitial({})).toBe("");
        expect(profileInitial(null)).toBe("");
    });
});
