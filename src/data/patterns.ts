import { getCollection, type CollectionEntry } from "astro:content";
import type { Code } from "astro:components";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import type { ComponentProps } from "astro/types";

// Demos and sample code sit next to each pattern's index.md; Vite bundles
// them at build time, keyed by path relative to this file.
const demos = import.meta.glob<AstroComponentFactory>(
  "../content/patterns/*/Demo.astro",
  { eager: true, import: "default" },
);
const sources = import.meta.glob<string>(
  "../content/patterns/*/*.{astro,html,css,js,ts,jsx,tsx,svelte,vue}",
  { eager: true, query: "?raw", import: "default" },
);

type Lang = ComponentProps<typeof Code>["lang"];

export interface CodeFile {
  name: string;
  lang: Lang;
  code: string;
}

export interface Pattern {
  entry: CollectionEntry<"patterns">;
  prompt: string;
  Demo: AstroComponentFactory;
  code: CodeFile[];
}

const langs: Record<string, Lang> = {
  astro: "astro",
  html: "html",
  css: "css",
  js: "js",
  ts: "ts",
  jsx: "jsx",
  tsx: "tsx",
  svelte: "svelte",
  vue: "vue",
};

export async function getPatterns(): Promise<Pattern[]> {
  const entries = await getCollection("patterns");

  return entries
    .sort((a, b) => b.data.added.getTime() - a.data.added.getTime())
    .map((entry) => {
      const folder = `../content/patterns/${entry.id}`;
      const Demo = demos[`${folder}/Demo.astro`];

      if (!Demo) {
        throw new Error(`Pattern "${entry.id}" needs a Demo.astro in ${folder}/`);
      }

      const code = entry.data.code.map((name) => {
        const source = sources[`${folder}/${name}`];

        if (source === undefined) {
          throw new Error(`Pattern "${entry.id}" lists code file "${name}", which is not in ${folder}/`);
        }

        return { name, lang: langs[name.split(".").pop() ?? ""] ?? "plaintext", code: source };
      });

      return { entry, prompt: (entry.body ?? "").trim(), Demo, code };
    });
}
