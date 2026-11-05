/**
 * Model fallback. Gemini model names get retired (404) and popular ones are sometimes busy (503/429),
 * so one hard-coded name eventually breaks the whole app. We try each model in order and move on when
 * the failure is about the model, not about us.
 */
export class AiUnavailableError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "AiUnavailableError";
        this.cause = cause;
    }
}

/** True when trying a different model could help. */
export function isRetryable(err) {
    // Bad/unparseable output from one model: another may do better.
    if (err instanceof SyntaxError || /missing hotels or an itinerary/.test(err?.message ?? "")) return true;
    // 404 retired, 429 quota/rate, 5xx overloaded. (400/401/403 mean *our* request or key is wrong.)
    return [404, 429, 500, 502, 503, 504].includes(err?.status);
}

/** Runs `run(modelName)` for each model until one succeeds; throws the first non-retryable error as is. */
export async function tryModels(models, run) {
    const unique = [...new Set(models.filter(Boolean))];
    let last;
    for (const name of unique) {
        try {
            return await run(name);
        } catch (err) {
            if (!isRetryable(err)) throw err;
            console.warn(`Model ${name} failed (${err.status ?? err.name}); trying the next one.`);
            last = err;
        }
    }
    throw new AiUnavailableError("All AI models are busy or unavailable right now.", last);
}
