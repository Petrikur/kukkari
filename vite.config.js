import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react() , pluginRewriteAll()],
  build: {
    rollupOptions: {
      external: ['socket.io-client'],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_SERVER_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  }
});
