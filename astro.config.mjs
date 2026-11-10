// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Canonical origin for the sitemap, canonical links and og:url
  site: "https://interactionpatterns.parayno.dev",
  // Pages carry little CSS; inlining it removes render-blocking requests
  build: { inlineStylesheets: "always" },
  integrations: [sitemap()],
});
