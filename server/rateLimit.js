/**
 * Fixed-window limiter, kept in memory: `limit` calls per `windowMs` for each key (we use the user's email).
 * Every Gemini call costs money or quota, so one user must not be able to run up the bill.
 * In memory is fine for one server; with several servers use a shared store such as Redis.
 */
export function createRateLimiter({ limit, windowMs, now = Date.now }) {
    const hits = new Map();

    return function check(key) {
        const time = now();
        // Drop expired windows so the map cannot grow forever.
        if (hits.size > 5000) {
            for (const [k, v] of hits) if (v.resetAt <= time) hits.delete(k);
        }
        let entry = hits.get(key);
        if (!entry || entry.resetAt <= time) {
            entry = { count: 0, resetAt: time + windowMs };
            hits.set(key, entry);
        }
        if (entry.count >= limit) {
            return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - time) / 1000) };
        }
        entry.count += 1;
        return { allowed: true, remaining: limit - entry.count };
    };
}
