import { defineConfig } from "vite";
import viteImagemin from "vite-plugin-imagemin";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  build: {
    target: "es2019",
    minify: "esbuild",
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        shop: resolve(__dirname, "shop.html"),
        product: resolve(__dirname, "product.html"),
        cart: resolve(__dirname, "cart.html"),
        checkout: resolve(__dirname, "checkout.html"),
        login: resolve(__dirname, "login.html"),
        admin: resolve(__dirname, "admin.html")
      },
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
