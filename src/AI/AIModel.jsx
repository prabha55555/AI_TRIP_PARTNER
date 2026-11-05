import { GoogleGenerativeAI } from "@google/generative-ai";
import { tryModels } from "./fallback";
import { assertValidPlan, parseModelJson } from "./parsePlan";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);

/**
 * The JSON contract between the model and the UI. The view-trip components
 * read exactly these keys, so it is spelled out in the system instruction.
 */
const SYSTEM_INSTRUCTION = `You are a travel-planning assistant. Reply with a single JSON object and nothing else, in this exact shape:
{
  "tripDetails": { "location": string, "duration": string, "budget": string, "travelers": string },
  "hotelOptions": [
    { "hotelName": string, "hotelAddress": string, "price": string, "hotelImageUrl": string,
      "geoCoordinates": { "latitude": number, "longitude": number }, "rating": number, "description": string }
  ],
  "itinerary": {
    "day1": { "theme": string, "bestTimeToVisit": string,
      "plan": [ { "placeName": string, "placeDetails": string, "placeImageUrl": string,
        "geoCoordinates": { "latitude": number, "longitude": number },
        "ticketPricing": string, "rating": number, "timeTravel": string } ] }
  }
}
Use keys "day1", "day2", ... for each day. Give 3-4 hotel options and 3-5 places per day. Use real, existing places.`;

// Models are tried in order; retired or busy ones are skipped (see fallback.js).
// VITE_GEMINI_MODEL lets you pin a model without a code change.
const MODELS = [
    import.meta.env.VITE_GEMINI_MODEL,
    "gemini-flash-latest", // Google's alias for the current Flash model, so it survives retirements
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
];

const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 40,
    // Newer Gemini models "think" before answering and that counts against this limit.
    maxOutputTokens: 16384,
    responseMimeType: "application/json",
};

// Stateless: one call per trip. (The previous version reused one global chat session,
// so history - and token cost - grew with every trip.)
const askModel = (name, prompt) =>
    genAI.getGenerativeModel({ model: name, systemInstruction: SYSTEM_INSTRUCTION, generationConfig }).generateContent(prompt);

export async function generateTripPlan({ destination, days, travelers, budget }) {
    const prompt =
        `Generate a travel plan for ${destination}, for ${days} day(s), ` +
        `for ${travelers}, with a ${budget}. Include hotel options (name, address, price, image url, ` +
        `coordinates, rating, description) and a ${days}-day itinerary with, for each place: name, details, ` +
        `image url, coordinates, ticket pricing, rating and travel time, plus the best time to visit each day.`;

    return tryModels(MODELS, async (name) => {
        const result = await askModel(name, prompt);
        return assertValidPlan(parseModelJson(result.response.text()));
    });
}
