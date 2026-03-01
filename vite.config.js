import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        shop: 'shop.html',
        cart: 'cart.html',
        checkout: 'checkout.html',
        login: 'login.html',
        admin: 'admin.html',
        product: 'product.html',
      }
    }
  }
});
