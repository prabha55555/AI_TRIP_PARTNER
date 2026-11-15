import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    // In dev the browser calls /api on the Vite port; Vite forwards it to the Express server (npm run server).
    server: { proxy: { "/api": "http://localhost:8787" } },
    test: { environment: "jsdom", include: ["src/**/*.test.{js,jsx}", "server/**/*.test.js"] },
    build: {
        rollupOptions: {
            output: {
                // Vendor chunks cache independently of app code between deploys.
                manualChunks: {
                    firebase: ["firebase/app", "firebase/firestore"],
                    react: ["react", "react-dom", "react-router-dom"],
                },
            },
        },
    },
});
