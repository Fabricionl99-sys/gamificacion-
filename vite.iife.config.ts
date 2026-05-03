import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/main.tsx',
      name: 'GamificationWidget',
      formats: ['iife'],
      fileName: () => 'gamification-widget.iife.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'gamification-widget.[ext]',
      },
    },
  },
});
