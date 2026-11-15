# TravelBeam: what to say in the interview (simple words)

Practise saying these out loud. Short sentences are better than big words.

## 1. The 30-second answer
"TravelBeam is a web app that plans trips with AI. You sign in with Google, then tell it where you want to go, for how many days, your budget, and who is travelling. My server asks the Gemini AI to write a full plan with hotels and a day-by-day itinerary. The app saves it, so you can open it again from My Trips or share the link."

## 2. The problem it solves
"Planning a trip means many tabs and a lot of time. I wanted one place where you answer four questions and get a complete plan in about 15 seconds."

## 3. How it works, step by step
1. You sign in with Google.
2. You fill in the four questions: destination, days, budget, group.
3. The browser sends them, with your Google token, to my Express server.
4. The server checks the token, checks the input, then asks Gemini. Gemini replies with a trip plan in a fixed JSON format.
5. The server checks the reply is complete and sends it back. The app saves it in Firebase under a random ID.
6. The trip page shows the hotels, the days and the places, with photos.
7. My Trips lists all your saved trips. You can search, sort and delete them.

## 3b. The backend (say this clearly)
"I added a small Node and Express backend. The browser never talks to Gemini directly. It sends the trip details and the user's Google token to my server. The server does four things:
1. **Checks who is calling.** It asks Google if the token is real and was made for my app. A fake token gets a 401.
2. **Checks the input.** Days, budget and group must be valid. Bad requests get a 400, so nobody can send strange text to the AI.
3. **Limits each user.** 10 trips per hour, so one person can't use up my AI quota. Too many gets a 429.
4. **Calls Gemini with the secret key.** The key lives only on the server, so it is not in the browser code."

- **Why a backend?** "Keys in a front-end app can be copied by anyone. A server keeps them secret and lets me add rules."
- **What is still on the front end?** "Saving and reading trips still goes straight to Firestore. The next step is to move that behind the server too, with Firebase Authentication."
- **How did you test it?** "24 automated tests for the server: fake token, bad input, rate limit, AI failure. I also started the real server and sent a fake token to check it is rejected."

## 4. The technology, and why
- **React + Vite:** React builds the screens from small reusable pieces. Vite makes development fast.
- **Node + Express:** a small server that holds the secret key, checks users and limits usage.
- **Tailwind CSS:** I can style quickly and keep the design consistent.
- **Firebase Firestore:** it stores each trip as one document. AI output changes shape, so a flexible database suits it.
- **Google sign-in:** users don't need a new password, and I get their name, email and photo.
- **Gemini AI:** it writes the plan. I ask for JSON so the app can read it.
- **Free helpers:** Open-Meteo for destination search and Wikipedia for photos. They cost nothing.

## 5. What I did to improve it (say this with pride)
"I built this in college. Before my interviews I went back and reviewed it like someone else's code. I found real problems and fixed them."
- **Crash fixes:** a missing trip page crashed, and a photo lookup crashed when a place had few photos. Both now show friendly messages.
- **AI chat bug:** the old code reused one AI conversation for everyone, so it got bigger and slower with every trip. Each request is now separate.
- **Secret key:** the Gemini key used to be in the browser. It is now on my own server.
- **Safer links:** trip IDs used to be the time, which is easy to guess. They are now random IDs.
- **Billing ended:** my free Google credit ran out, so Maps and Places stopped working. I replaced them with free services.
- **Retired AI model:** Google switched off the model I used. I added a fallback list, so if one model is old or busy, the app tries the next.
- **Faster:** I compressed images from 8.9 MB to 1.2 MB and split the code so pages load on demand.
- **New design:** I rebuilt the whole look in a clean, photo-first style, and added loading, empty and error screens everywhere.
- **Tests:** I added 100 automated tests and ran the app in a real browser.

## 6. Be honest about limits
These are the questions interviewers love. Say them first.
- "Saving trips still goes from the browser to Firestore. The next step is Firebase Authentication with security rules, so the database itself checks who owns a trip."
- "The rate limit is kept in the server's memory. With several servers I would use Redis."
- "The AI can be wrong about prices or opening hours. The app tells users to double-check."
- "I haven't added things like editing a trip or a map view yet."

## 7. Short answers to common questions
- **Why Firebase?** "It's quick to set up and needs no server. One read loads a whole trip."
- **How does the AI part work?** "My server sends a prompt that says exactly what JSON to return. It checks the reply before sending it on."
- **How does Google login work?** "Google gives my app a token. The app uses it to read the user's name, email and photo, and sends it to my server, which asks Google if it is real."
- **Context API or Redux?** "Context. The only shared data is the logged-in user, so Redux would be too much."
- **What is useEffect?** "It runs code after the screen appears, like loading a trip. It can also clean up, for example to ignore an old response."
- **What is AI hallucination?** "When the AI sounds sure but is wrong. I reduce the risk by using real photos instead of AI image links and by showing a warning."
- **How do you protect API keys?** "The Gemini key stays on my Express server and never goes to the browser. The other keys, like Firebase's, are meant to be public, and I restrict them in Google Cloud."
- **What are Firestore security rules?** "Rules on the server that decide who can read or change each document. For example, only the owner can delete their trip."
- **What stops someone abusing the API?** "Token check, input check and a limit of 10 trips per hour per user."
- **Hardest problem?** "Making the AI output dependable. I fixed it with a clear format, JSON mode, a check on the reply, and a fallback to another model."

## 8. If they ask for a demo
Landing page → Sign in → Create a trip (show the live summary card) → wait for the loading screen → show the trip page (photos, hotels, collapsible days, Google Maps links) → Share → My Trips (search, sort, delete). Then open `server/app.js` and walk through the four steps.

## 9. One-line ending
"The project taught me that shipping is only half the job: keeping it working, safe and easy to use is the other half."
