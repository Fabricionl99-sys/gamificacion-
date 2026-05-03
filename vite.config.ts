import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'GamificationWidget',
      formats: ['es', 'iife'],
      fileName: (format) => `gamification-widget.${format}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: 'gamification-widget.[ext]',
      },
    },
  },
});
