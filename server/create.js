import { createApp } from "./app.js";
import { createTokenVerifier } from "./auth.js";
import { createPlanGenerator } from "./gemini.js";
import { createRateLimiter } from "./rateLimit.js";

/**
 * Builds the real app from environment variables. Shared by `server/index.js` (runs on your computer)
 * and `api/index.js` (runs on Vercel), so both behave the same.
 * The old VITE_* names still work, so an existing .env.local keeps working unchanged.
 */
export function createConfiguredApp(env = process.env) {
    const apiKey = env.GEMINI_API_KEY || env.VITE_GOOGLE_GEMINI_AI_API_KEY;
    const clientId = env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_AUTH_CLIENT_ID;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY. Add it to .env.local (or the Vercel project settings).");
    if (!clientId) {
        console.warn("GOOGLE_CLIENT_ID is not set: tokens from ANY Google app would be accepted. Set it before deploying.");
    }

    return createApp({
        verifyToken: createTokenVerifier({ clientId }),
        generatePlan: createPlanGenerator({ apiKey, pinnedModel: env.GEMINI_MODEL || env.VITE_GEMINI_MODEL }),
        checkRate: createRateLimiter({ limit: Number(env.TRIPS_PER_HOUR) || 10, windowMs: 60 * 60 * 1000 }),
        allowedOrigin: env.ALLOWED_ORIGIN,
    });
}
