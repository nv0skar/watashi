import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';


export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: "index.html"
            },
        },
    },
    plugins: [imagetools()]
})