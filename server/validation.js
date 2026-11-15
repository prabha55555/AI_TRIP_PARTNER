/**
 * Validates the body of POST /api/generate-trip. The browser already limits these choices,
 * but the server must not trust the browser: anyone can call the API directly.
 *
 * ALLOWED_* must match src/create/option.jsx (a test keeps them in sync).
 */
export const MAX_DAYS = 6;
export const ALLOWED_TRAVELERS = ["1 people", "2 people", "4 to 6 people", "3+ people"];
export const ALLOWED_BUDGETS = ["Low Budget", "Medium Budget", "High Budget"];

/** Single line, no control characters, so the text cannot smuggle extra instructions in on new lines. */
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROL_CHARS = /[\u0000-\u001f\u007f]+/g;

const cleanText = (value) => String(value).replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();

/** Returns { value } on success or { error } with a message safe to show the user. */
export function validateTripRequest(body) {
    const destination = typeof body?.destination === "string" ? cleanText(body.destination) : "";
    if (destination.length < 2 || destination.length > 120) {
        return { error: "Destination must be between 2 and 120 characters." };
    }
    const days = Number(body?.days);
    if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS) {
        return { error: `Days must be a whole number from 1 to ${MAX_DAYS}.` };
    }
    if (!ALLOWED_TRAVELERS.includes(body?.travelers)) return { error: "Unknown travel group." };
    if (!ALLOWED_BUDGETS.includes(body?.budget)) return { error: "Unknown budget." };
    return { value: { destination, days, travelers: body.travelers, budget: body.budget } };
}
