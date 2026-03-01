import { defineConfig } from "vite";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  build: {
    target: "es2019",
    minify: "esbuild",
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
          charts: ["chart.js/auto"],
          stripe: ["@stripe/stripe-js"]
        }
      }
    }
  },
  plugins: [
    viteImagemin({
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.7, 0.85] },
      webp: { quality: 75 }
    })
  ]
});
