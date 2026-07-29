import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      html2canvas: path.resolve(__dirname, "src/stubs/html2canvas.js"),
      dompurify: path.resolve(__dirname, "src/stubs/dompurify.js"),
      canvg: path.resolve(__dirname, "src/stubs/canvg.js"),
    },
  },
});
