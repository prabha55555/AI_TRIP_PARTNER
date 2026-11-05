/** Pure helpers for turning raw model output into a trip plan (kept separate so they are unit-testable). */

/** Models sometimes wrap JSON in ```json fences even in JSON mode. */
export function parseModelJson(text) {
    const cleaned = String(text ?? "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    return JSON.parse(cleaned);
}

/** Throws if the plan lacks what the UI needs to render. */
export function assertValidPlan(plan) {
    const hasHotels = Array.isArray(plan?.hotelOptions);
    const itinerary = plan?.itinerary;
    const hasDays = itinerary && typeof itinerary === "object" && Object.keys(itinerary).length > 0;
    if (!hasHotels || !hasDays) {
        throw new Error("The AI response was missing hotels or an itinerary.");
    }
    return plan;
}
