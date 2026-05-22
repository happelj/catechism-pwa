import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: [
        "assets/apple-touch-icon.svg",
        "assets/icon.svg",
        "assets/maskable-icon.svg",
      ],
      manifest: {
        background_color: "#ffffff",
        description: "Practice the Westminster Shorter Catechism offline.",
        display: "standalone",
        icons: [
          {
            purpose: "any",
            sizes: "512x512",
            src: "/assets/icon.svg",
            type: "image/svg+xml",
          },
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "/assets/maskable-icon.svg",
            type: "image/svg+xml",
          },
        ],
        name: "Westminster Catechizer",
        orientation: "portrait",
        scope: "/",
        short_name: "Catechizer",
        start_url: "/",
        theme_color: "#2196f3",
      },
      registerType: "autoUpdate",
      workbox: {
        navigateFallback: "index.html",
      },
    }),
  ],
});
