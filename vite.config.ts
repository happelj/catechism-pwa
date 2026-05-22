import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: [
        "assets/apple-touch-icon-180.png",
        "assets/favicon-32.png",
        "assets/icon-192.png",
        "assets/icon-512.png",
        "assets/maskable-icon-192.png",
        "assets/maskable-icon-512.png",
      ],
      manifest: {
        background_color: "#ffffff",
        description: "Practice the Westminster Shorter Catechism offline.",
        display: "standalone",
        icons: [
          {
            purpose: "any",
            sizes: "192x192",
            src: "/assets/icon-192.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "/assets/icon-512.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "192x192",
            src: "/assets/maskable-icon-192.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "/assets/maskable-icon-512.png",
            type: "image/png",
          },
        ],
        name: "Westminster Catechizer",
        orientation: "portrait",
        scope: "/",
        short_name: "Catechizer",
        start_url: "/",
        theme_color: "#2196f3",
      },
      manifestFilename: "manifest.json",
      registerType: "autoUpdate",
      workbox: {
        navigateFallback: "index.html",
      },
    }),
  ],
});
