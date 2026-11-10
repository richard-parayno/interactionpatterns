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
      // Files in the pattern folder shown as sample code, in order. A file
      // with a `framework` shows under that tab ("React", "Svelte"); a bare
      // file name shows under every tab.
      code: z
        .array(
          z.union([
            z.string().transform((file) => ({ file, framework: undefined })),
            z.object({ file: z.string(), framework: z.string().optional() }),
          ]),
        )
        .default([{ file: "Demo.astro", framework: undefined }]),
      added: z.coerce.date(),
    }),
});

export const collections = { patterns };
