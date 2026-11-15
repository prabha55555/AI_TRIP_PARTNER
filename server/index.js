import { createApp } from "./app.js";
import { createTokenVerifier } from "./auth.js";
import { createPlanGenerator } from "./gemini.js";
import { createRateLimiter } from "./rateLimit.js";

// The old VITE_* names still work, so an existing .env.local keeps working unchanged.
const env = process.env;
const apiKey = env.GEMINI_API_KEY || env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const clientId = env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_AUTH_CLIENT_ID;
const port = Number(env.PORT) || 8787;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY. Add it to .env.local (see .env.example).");
    process.exit(1);
}
if (!clientId) {
    console.warn("GOOGLE_CLIENT_ID is not set: tokens from ANY Google app would be accepted. Set it before deploying.");
}

const app = createApp({
    verifyToken: createTokenVerifier({ clientId }),
    generatePlan: createPlanGenerator({ apiKey, pinnedModel: env.GEMINI_MODEL || env.VITE_GEMINI_MODEL }),
    checkRate: createRateLimiter({ limit: Number(env.TRIPS_PER_HOUR) || 10, windowMs: 60 * 60 * 1000 }),
    allowedOrigin: env.ALLOWED_ORIGIN,
});

app.listen(port, () => console.log(`TravelBeam API listening on http://localhost:${port}`));
