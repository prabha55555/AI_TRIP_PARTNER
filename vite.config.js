import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:5173/api/v1beta2/models/text-bison-001:generateText',

                changeOrigin: true,
                secure: false, 
                rewrite: (path) => path.replace(/^\/api/, 'v1beta2/models/text-bison-001:generateText')
            }
        }
    }
});
