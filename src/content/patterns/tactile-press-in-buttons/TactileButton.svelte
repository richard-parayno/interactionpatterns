<script lang="ts" module>
  // Safari on iOS shows :active only while the page has a touchstart
  // listener; this empty one is enough for the press to show on a tap.
  if (typeof document !== "undefined") {
    document.addEventListener("touchstart", () => {}, { passive: true });
  }
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import "./tactile.css";

  interface Look {
    /** "primary" is the dark one; use one per section. "quiet" is the light one. */
    variant?: "primary" | "quiet";
    size?: "regular" | "small";
    children: Snippet;
  }

  type ButtonProps = Look &
    HTMLButtonAttributes & {
      href?: undefined;
      current?: undefined;
    };

  type LinkProps = Look &
    HTMLAnchorAttributes & {
      href: string;
      /** This link points at the page being shown: it stays pressed. */
      current?: boolean;
    };

  // A button, or a link that looks like one when it has an `href`. The look
  // and the motion are all in tactile.css; this only picks the element and
  // classes.
  let {
    variant = "primary",
    size = "regular",
    current = false,
    class: className,
    children,
    ...rest
  }: ButtonProps | LinkProps = $props();

  const classes = $derived([
    "tactile",
    variant === "quiet" && "tactile-quiet",
    size === "small" && "tactile-small",
    className,
  ]);
</script>

{#if rest.href !== undefined}
  <a {...rest} class={classes} aria-current={current ? "page" : undefined}>
    {@render children()}
  </a>
{:else}
  <button type="button" {...rest} class={classes}>
    {@render children()}
  </button>
{/if}
