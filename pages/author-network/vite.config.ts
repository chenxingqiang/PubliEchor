import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@packages': path.resolve(__dirname, '../../packages'),
    },
  },
  build: {
    outDir: '../../dist/author-network',
    emptyOutDir: true,
  },
});
