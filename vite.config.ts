import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: "src/pages",
      extensions: ["tsx", "ts"],
      exclude: [
        "**/components/**",
        "**/config/**",
        "**/print/**",
        "**/dialogs/**",
        "**/catalog/**",
        "**/tables/**",
        "**/PacketHelper/**",
        "**/LengthHelper/**",
        "**/KgHelper/**",
        "**/Helpers/**",
        "**/AddItemPanel/**",
      ],
    }),
  ],
  resolve: {
    alias: [
      { find: "@/app", replacement: path.resolve(__dirname, "src/pages") },
      { find: "@", replacement: path.resolve(__dirname, ".") },
    ],
  },
  server: {
    port: 3000,
  },
});
