import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        capitalGains: fileURLToPath(new URL('./src/capital-gains/index.html', import.meta.url)),
        mortgageCrusher: fileURLToPath(new URL('./src/mortgage-crusher/index.html', import.meta.url)),
      }
    }
  }
});
