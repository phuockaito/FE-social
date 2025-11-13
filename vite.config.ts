import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
        server: {
            port: 8080,
            proxy: {
                "/api": {
                    target: env.VITE_APP_URL_API,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
        base: "/",
        build: {
            outDir: "dist",
        },
        environments: {
            production: {
                define: {
                    __APP_ENV__: JSON.stringify("production"),
                },
            },
            development: {
                define: {
                    __APP_ENV__: JSON.stringify("development"),
                },
            },
        },
    };
});
