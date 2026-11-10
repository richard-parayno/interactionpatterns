<script lang="ts">
  import "./rotating-phrase.css";

  const HOLD_MS = 3100; // from one change to the next
  const LEAVE_MS = 700; // the 0.4s leave plus the last word's stagger, with headroom

  // Goes after the fixed words of a heading:
  //
  //   <h1>Patterns I reuse, each one with <RotatingPhrase phrases={[…]} /></h1>
  //
  // The first phrase is the one assistive technology reads, and the only one
  // shown without JavaScript or with reduced motion.
  let { phrases }: { phrases: string[] } = $props();
  let root: HTMLSpanElement;
  let on = $state(0);
  let out = $state(-1);

  // The motion is all CSS. This only moves `is-on` to the next phrase.
  $effect(() => {
    const count = phrases.length; // set up again when the phrases change
    on = 0;
    out = -1;
    if (count < 2) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;
    let timer = 0;
    let settle = 0;

    const step = () => {
      out = on;
      on = (on + 1) % count;
      // Once the old phrase has faded, let it drop back below the line.
      settle = window.setTimeout(() => (out = -1), LEAVE_MS);
    };

    // Rotate only while the heading is on screen, the tab is visible and
    // motion is welcome. With reduced motion, rest on the first phrase.
    const sync = () => {
      const run = inView && !document.hidden && !reduced.matches;
      if (run && !timer) timer = window.setInterval(step, HOLD_MS);
      if (!run && timer) {
        window.clearInterval(timer);
        timer = 0;
      }
      if (reduced.matches) {
        on = 0;
        out = -1;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      window.clearInterval(timer);
      window.clearTimeout(settle);
    };
  });
</script>

<span class="rotating" bind:this={root}>
  <span class="rotating-label">{phrases[0]}</span>
  {#each phrases as phrase, i (phrase)}
    <span class="rotating-phrase" class:is-on={i === on} class:is-out={i === out} aria-hidden="true">
      {#each phrase.split(" ") as word, j}
        <span class="rotating-word" style:--i={j}>{word}</span>{" "}
      {/each}
    </span>
  {/each}
</span>
