import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {},
  build: {
    outDir: 'email_sign_dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-venders': ['react', 'react-dom'],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      modifyVars: {},
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
