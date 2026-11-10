<script lang="ts">
  import type { Snippet } from "svelte";
  import "./pinned-story.css";

  interface StoryBeat {
    /** Unique; the caption's heading. */
    title: string;
    text: string;
  }

  /**
   * Attributes for an element inside the window: shown from beat `from` and,
   * when `until` is given, hidden again from beat `until`. Spread them on the
   * element: `<li {...part(1)}>` or `<span {...part(0, 3)}>Draft</span>`.
   */
  type StoryPart = (from: number, until?: number) => { class: string; "data-until"?: number };

  let {
    beats,
    children,
  }: {
    beats: StoryBeat[];
    /** The window. It must be the same size on every beat. */
    children: Snippet<[StoryPart]>;
  } = $props();

  let track: HTMLDivElement;
  let pin: HTMLDivElement;
  let beat = $state(0);

  const part: StoryPart = (from, until) => ({
    class: beat >= from && (until === undefined || beat < until) ? "story-part on" : "story-part",
    "data-until": until,
  });

  // The pinning is all CSS. This only reads how far the pin has travelled
  // through its track, so scrolling back up rewinds the story.
  $effect(() => {
    const count = beats.length; // set up again when the beats change
    let frame = 0;

    const update = () => {
      frame = 0;
      // Every beat, the last one included, gets one step of scrolling.
      const step = (track.offsetHeight - pin.offsetHeight) / count;
      if (step <= 0) return; // not pinned: the CSS shows the last state

      const pinTop = parseFloat(getComputedStyle(pin).top) || 0;
      const travelled = (pinTop - track.getBoundingClientRect().top) / step;
      beat = Math.min(count - 1, Math.max(0, Math.floor(travelled)));
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      cancelAnimationFrame(frame);
    };
  });
</script>

<section class="story" style:--beats={beats.length}>
  <div class="story-track" bind:this={track}>
    <div class="story-pin" bind:this={pin}>
      <!-- The window is a picture; the captions tell the story. -->
      <div class="story-window" aria-hidden="true">
        {@render children(part)}
      </div>

      <ol class="story-captions">
        {#each beats as item, i (item.title)}
          <li class="story-caption" class:on={i === beat}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</section>
