import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
            },
        },
    },
    server: {
        allowedHosts: ["mac.nv0skar.lab"],
    },
    plugins: [imagetools()],
});
