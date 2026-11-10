<script lang="ts">
  import type { Snippet } from "svelte";
  import "./mac-window.css";

  interface Props {
    /** Centred in the title bar: the name the app would give its window. */
    title: string;
    /** What the picture shows, for anyone who cannot see it. */
    label: string;
    /** The chrome only. The mock inside paints its own colours. */
    appearance?: "light" | "dark";
    /** The mock: plain elements, with no links, buttons or inputs. */
    children: Snippet;
  }

  // The one frame for every product mock on the site:
  //
  //   <MacWindow title="Slate" label="Today's tasks in Slate" appearance="dark">
  //     <TasksMock />
  //   </MacWindow>
  //
  // The window is a picture. role="img" hides everything inside it from
  // assistive technology and `label` stands in for it.
  let { title, label, appearance = "light", children }: Props = $props();
</script>

<div class="mac-window" role="img" aria-label={label}>
  <div class="mac-window-frame" data-appearance={appearance}>
    <div class="mac-bar">
      <span class="mac-lights"><i></i><i></i><i></i></span>
      <span class="mac-title">{title}</span>
    </div>
    <div class="mac-body">{@render children()}</div>
  </div>
</div>
