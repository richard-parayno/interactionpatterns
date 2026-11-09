// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Canonical origin for the sitemap; change once the site has its own domain
  site: "https://interactionpatterns.mgrp.workers.dev",
  // Pages carry little CSS; inlining it removes render-blocking requests
  build: { inlineStylesheets: "always" },
  integrations: [sitemap()],
});
