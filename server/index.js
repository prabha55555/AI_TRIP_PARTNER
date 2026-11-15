import { createConfiguredApp } from "./create.js";

const port = Number(process.env.PORT) || 8787;

let app;
try {
    app = createConfiguredApp();
} catch (err) {
    console.error(err.message);
    process.exit(1);
}

app.listen(port, () => console.log(`TravelBeam API listening on http://localhost:${port}`));
