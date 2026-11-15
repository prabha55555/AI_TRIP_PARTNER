// The Gemini call now happens on OUR server (see /server). The browser only sends the user's
// choices plus their Google login token, so the Gemini API key never reaches the browser.
// In dev, Vite proxies /api to the local server; in production set VITE_API_URL to the server's address.
const API_URL = import.meta.env.VITE_API_URL ?? "";

/** Failure reported by our backend. `code` is the server's machine-readable reason (e.g. "rate_limited"). */
export class ApiError extends Error {
    constructor(message, { status, code } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}

export async function generateTripPlan({ destination, days, travelers, budget }, token) {
    let res;
    try {
        res = await fetch(`${API_URL}/api/generate-trip`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ destination, days, travelers, budget }),
        });
    } catch (cause) {
        throw new ApiError("Could not reach the server.", { code: "network", cause });
    }

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        // Our server always sends an `error` code. 404/405 without one means the page was served by something
        // that is not our API (e.g. a static host with no backend deployed), so say that clearly.
        if (!body.error && [404, 405].includes(res.status)) {
            throw new ApiError("The backend server was not found.", { status: res.status, code: "backend_missing" });
        }
        throw new ApiError(body.message ?? `Server error ${res.status}`, { status: res.status, code: body.error });
    }
    if (!body.tripData) throw new ApiError("The server sent an empty response.", { status: res.status, code: "bad_response" });
    return body.tripData;
}
