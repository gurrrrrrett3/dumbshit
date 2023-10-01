import { defineConfig } from "vite";

module.exports = defineConfig({

    build: {
        assetsDir: "client",
        rollupOptions: {
            input: {
                index: "./client/index.html",
            },
            output: {
                dir: "./client/dist",
                format: "esm",
            },
        }
    }

})