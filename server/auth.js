const TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";
const MAX_CACHE = 1000;

/**
 * Checks a Google access token with Google itself and returns { email }, or null if it is not valid.
 * Anyone can type "Bearer abc" into a request, so we never trust the browser's word for who the user is.
 *
 * If `clientId` is set, the token must have been issued to OUR app (not some other site's token).
 * Results are cached briefly so a burst of requests does not hit Google every time.
 */
export function createTokenVerifier({ clientId, fetchImpl = fetch, ttlMs = 5 * 60 * 1000, now = Date.now } = {}) {
    const cache = new Map();

    return async function verifyToken(token) {
        if (!token || token.length > 4096) return null;

        const hit = cache.get(token);
        if (hit && hit.expires > now()) return hit.user;
        cache.delete(token);

        let res;
        try {
            res = await fetchImpl(`${TOKENINFO_URL}?access_token=${encodeURIComponent(token)}`);
        } catch {
            return null; // Google unreachable: fail closed.
        }
        if (!res.ok) return null;

        const info = await res.json();
        if (clientId && info.aud !== clientId && info.azp !== clientId) return null;
        if (!info.email || info.email_verified === "false" || info.email_verified === false) return null;

        const user = { email: String(info.email).toLowerCase() };
        const lifetimeMs = Number(info.expires_in) * 1000 || ttlMs;
        if (cache.size >= MAX_CACHE) cache.clear();
        cache.set(token, { user, expires: now() + Math.min(ttlMs, lifetimeMs) });
        return user;
    };
}
