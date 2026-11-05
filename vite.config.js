import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },
    test: { environment: "jsdom", include: ["src/**/*.test.{js,jsx}"] },
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
