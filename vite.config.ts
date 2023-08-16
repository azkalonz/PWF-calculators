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
        capitalGains: fileURLToPath(
          new URL('./src/calculators/capital-gains/index.html', import.meta.url)
        ),
        mortgageCrusher: fileURLToPath(
          new URL('./src/calculators/mortgage-crusher/index.html', import.meta.url)
        ),
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2/.test(extType)) {
            extType = 'css';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },

        chunkFileNames: 'assets/js/[name]-[hash].js',

        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});
