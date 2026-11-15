import { createConfiguredApp } from "../server/create.js";

/**
 * Vercel entry point. Vercel runs every file in /api as a serverless function; vercel.json sends all
 * /api/* requests here, and the Express app inside decides which route to run.
 * Built on the first request (not at import time) so a missing setting gives a clear JSON error.
 */
let app;
let setupError;

export default function handler(req, res) {
    if (!app && !setupError) {
        try {
            app = createConfiguredApp();
        } catch (err) {
            setupError = err;
            console.error(err.message);
        }
    }
    if (setupError) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "server_not_configured", message: "The server is missing its settings." }));
    }
    return app(req, res);
}
