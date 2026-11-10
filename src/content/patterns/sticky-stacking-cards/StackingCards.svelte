<script lang="ts">
  import "./stacking-cards.css";

  interface StackCard {
    /** Unique; also the label in the side index. */
    key: string;
    title: string;
    text: string;
  }

  let { cards }: { cards: StackCard[] } = $props();
  let list: HTMLDivElement;
  let active = $state(0);

  // The pinning is all CSS. This only lights the index entry for the card
  // being read: the last one whose top has passed 55% of the window.
  $effect(() => {
    cards.length; // set up again when the cards change
    const items = [...list.children] as HTMLElement[];
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let next = 0;
      items.forEach((card, i) => {
        if (card.getBoundingClientRect().top < line) next = i;
      });
      active = next;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  });
</script>

<section class="stack" style:--n={cards.length}>
  <ol class="stack-index" aria-hidden="true">
    {#each cards as card, i (card.key)}
      <li class:on={i === active}>{card.key}</li>
    {/each}
  </ol>

  <div class="stack-cards" bind:this={list}>
    {#each cards as card, i (card.key)}
      <article class="stack-card" style:--i={i}>
        <header class="stack-strip">
          <span class="stack-num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{card.title}</h3>
        </header>
        <p>{card.text}</p>
      </article>
    {/each}
  </div>
</section>
