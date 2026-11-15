import cors from "cors";
import express from "express";
import { validateTripRequest } from "./validation.js";

/**
 * The HTTP layer. Every dependency is passed in, so tests can run the real routes
 * with fake Google/Gemini and no network:
 *   verifyToken(token) -> { email } | null     generatePlan(request) -> plan     checkRate(key) -> { allowed, ... }
 */
export function createApp({ verifyToken, generatePlan, checkRate, allowedOrigin, log = console }) {
    const app = express();
    app.disable("x-powered-by");
    // No allowedOrigin = same-origin only (the Vite proxy / one host serving both). Otherwise exactly that site.
    app.use(cors({ origin: allowedOrigin || false }));
    app.use(express.json({ limit: "10kb" }));

    app.get("/api/health", (_req, res) => res.json({ ok: true }));

    app.post("/api/generate-trip", async (req, res) => {
        // 1. Who is calling? Ask Google; never trust the browser's claim.
        const match = /^Bearer (.+)$/.exec(req.get("authorization") ?? "");
        const user = match ? await verifyToken(match[1]) : null;
        if (!user) return res.status(401).json({ error: "unauthorized", message: "Please sign in again." });

        // 2. Are they within their allowance?
        const rate = checkRate(user.email);
        if (!rate.allowed) {
            res.set("Retry-After", String(rate.retryAfterSec));
            return res.status(429).json({ error: "rate_limited", message: "Trip limit reached. Try again later.", retryAfterSec: rate.retryAfterSec });
        }

        // 3. Is the request sane?
        const parsed = validateTripRequest(req.body);
        if (parsed.error) return res.status(400).json({ error: "invalid_request", message: parsed.error });

        // 4. Ask the AI with the server-side key.
        try {
            const tripData = await generatePlan(parsed.value);
            return res.json({ tripData });
        } catch (err) {
            if (err?.name === "AiUnavailableError") {
                return res.status(503).json({ error: "ai_unavailable", message: "The AI service is busy. Try again in a minute." });
            }
            log.error("Trip generation failed:", err?.status ?? "", err?.message ?? err);
            // 400/401/403 from Gemini means our key or request is wrong: the user can do nothing about it.
            const code = [400, 401, 403].includes(err?.status) ? "ai_misconfigured" : "ai_error";
            return res.status(502).json({ error: code, message: "The AI service could not create a plan." });
        }
    });

    app.use("/api", (_req, res) => res.status(404).json({ error: "not_found" }));

    // Bad JSON bodies and anything unexpected: a JSON error, never a stack trace.
    // eslint-disable-next-line no-unused-vars
    app.use((err, _req, res, _next) => {
        if (err?.type === "entity.parse.failed" || err?.type === "entity.too.large") {
            return res.status(400).json({ error: "invalid_request", message: "Request body is not valid." });
        }
        log.error("Unhandled server error:", err);
        return res.status(500).json({ error: "server_error", message: "Something went wrong." });
    });

    return app;
}
