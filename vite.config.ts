import { defineConfig } from "vite";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import react from "@vitejs/plugin-react";
import Unfonts from 'unplugin-fonts/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    Unfonts({
      google: {
        families: [
          "Nabla",
          "Tomorrow",
          "Azeret Mono",
        ]
      }
    }),
    eslintPlugin(),
  ],
  base: "/wdingle/",
  esbuild: {
    legalComments: 'none',
  },
});
