import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const vendorChunk = (id: string): string | undefined => {
  if (id.indexOf('node_modules') === -1) return undefined;
  if (id.indexOf('/react/') !== -1 || id.indexOf('/react-dom/') !== -1 || id.indexOf('/scheduler/') !== -1) return 'vendor-react';
  if (id.indexOf('/framer-motion/') !== -1) return 'vendor-motion';
  if (id.indexOf('/lucide-react/') !== -1) return 'vendor-icons';
  if (id.indexOf('/zustand/') !== -1) return 'vendor-state';
  if (id.indexOf('/date-fns/') !== -1) return 'vendor-date';
  return 'vendor';
};

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'GamificationWidget',
      formats: ['es'],
      fileName: (format) => `gamification-widget.${format}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: 'gamification-widget.[ext]',
        manualChunks: vendorChunk,
      },
    },
  },
});
