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
        "assets/wc-apple-touch-icon-180.png",
        "assets/wc-favicon-32.png",
        "assets/wc-icon-192.png",
        "assets/wc-icon-512.png",
        "assets/wc-maskable-icon-192.png",
        "assets/wc-maskable-icon-512.png",
        "favicon.ico",
      ],
      manifest: {
        background_color: "#ffffff",
        description: "Practice the Westminster Shorter Catechism offline.",
        display: "standalone",
        id: "/",
        icons: [
          {
            purpose: "any",
            sizes: "192x192",
            src: "/assets/wc-icon-192.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "/assets/wc-icon-512.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "192x192",
            src: "/assets/wc-maskable-icon-192.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "/assets/wc-maskable-icon-512.png",
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
      manifestFilename: "westminster-catechizer.webmanifest",
      registerType: "autoUpdate",
      workbox: {
        navigateFallback: "index.html",
      },
    }),
  ],
});
