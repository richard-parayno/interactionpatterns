import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One folder per pattern: src/content/patterns/<slug>/
//   index.md        frontmatter below; the Markdown body is the agent prompt
//   Demo.astro      the live demo rendered on the pattern page
//   screenshot.png  (or any image) referenced by `screenshot`
const patterns = defineCollection({
  loader: glob({
    base: "./src/content/patterns",
    pattern: "*/index.md",
    // The folder name is the slug: sticky-stacking-cards/index.md -> /patterns/sticky-stacking-cards/
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      summary: z.string(),
      screenshot: image(),
      // Files in the pattern folder shown as sample code, in order
      code: z.array(z.string()).default(["Demo.astro"]),
      added: z.coerce.date(),
    }),
});

export const collections = { patterns };
