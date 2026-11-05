/** A usable signed-in profile always has an email (it is the key trips are saved under). */
export function isValidProfile(p) {
    return Boolean(p) && typeof p === "object" && typeof p.email === "string" && p.email.includes("@");
}

/** Parse a stored profile; returns null for missing, corrupt or empty data so the user is simply signed out. */
export function parseStoredProfile(raw) {
    try {
        const p = JSON.parse(raw);
        return isValidProfile(p) ? p : null;
    } catch {
        return null;
    }
}

/** One uppercase letter for the avatar fallback, or "" when there is nothing usable. */
export function profileInitial(p) {
    return String(p?.name || p?.email || "").trim().charAt(0).toUpperCase();
}
