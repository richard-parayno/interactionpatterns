---
name: Pinned scroll story
summary: One window stays pinned in the centre of the screen while the page scrolls, and its contents change beat by beat. It arrives and leaves already centred.
screenshot: ./screenshot.png
added: 2026-11-10
code:
  - file: PinnedStory.tsx
    framework: React
  - file: PinnedStory.svelte
    framework: Svelte
  - pinned-story.css
---

Turn this section into a pinned scroll story: one product window stays pinned in the vertical centre of the screen while the reader scrolls, and what is inside it changes one beat at a time, with a short caption under it for the current beat. After the last beat the window scrolls away with the page.

The pinning is plain `position: sticky`, not scroll-jacking. The page scrolls normally the whole time; JavaScript only reads the scroll position to decide which beat is showing. Do not snap, scroll for the reader, or switch the window to `position: fixed`.

Use this once per page, for the one story that needs several steps. Every other feature stays a single static screenshot.

Structure:
- `<section class="story">` › `.story-track` › `.story-pin`, which holds the window and an `<ol class="story-captions">` with one `<li>` per beat: an `<h3>` and one or two sentences of plain text.
- Three to six beats. Set `--beats` to their number on `.story`. Beat 0 is the state the window arrives in.
- `--top`: the sticky header's height, 0 without one. `--step: 60svh`: the scroll distance each beat gets.
- `.story-track { height: calc(100svh - var(--top) + var(--beats) * var(--step)); }`: one screen for the pin plus one step per beat.
- `.story-pin { position: sticky; top: var(--top); height: calc(100svh - var(--top)); display: grid; align-content: center; gap: 24px; }`. The window and the captions share one max-width (640px to 820px) and are centred in the pin as one unit.

Alignment, the part to get exactly right:
- The pin is in normal flow, one screen high, and the unit is always centred in it. So the window scrolls into view already at the spot it will hold, pins without a jump, and leaves from that same spot.
- The window is the same size on every beat. Keep room for everything that appears later: hide parts with `opacity: 0`, never `display: none`, and put parts that replace each other in one grid cell (`grid-area: 1 / 1`).
- Put every caption in one grid cell too. The caption block is then always as tall as the longest caption, so the window does not move when the caption changes.
- Spacing around the track is the same above and below it, so the gap from the content above to the window as the pin starts equals the gap from the caption to the content below as the pin ends.
- The window, the gap and the tallest caption fit inside the pin at every supported screen size. If they do not, make the window smaller.

Beats:
- On `scroll` (passive listener, throttled with `requestAnimationFrame`) and on `resize`: `step = (track.offsetHeight - pin.offsetHeight) / N`, `travelled = (pinTop - track.getBoundingClientRect().top) / step` where `pinTop` is the pin's computed `top`, and `beat = clamp(floor(travelled), 0, N - 1)`. Every beat, the last one included, gets one step of scrolling.
- Work the beat out from the scroll position every time, never from a counter or a timer, so scrolling back up rewinds the story.
- Each part of the window names the beat it shows from and, if it goes away, the beat it hides from (`data-until`). Give the parts of the current beat an `on` class. Caption `i` is `on` only on beat `i`.
- A part or caption fades in with a 4px rise over 450ms after a 120ms delay, and fades out over 200ms. Nothing else moves. Under `prefers-reduced-motion: reduce` drop the transition and the rise; the beats still change with the scroll.

The window is a picture of the product:
- Nothing in it scrolls: no `overflow: auto` or `scroll`, no wheel or touch handlers. A second scroller fights the reader's scroll. If a list outgrows the window, drop its oldest items.
- Nothing in it looks or acts clickable: `aria-hidden="true"`, no hover states, no pointer cursor, nothing focusable.
- The captions are the only text that tells the story. Do not add a numbered step navigation, progress dots, or a hint to scroll.

Fallbacks:
- In `@media (max-height: 639px), (scripting: none)`, unpin: the track is `height: auto`, the pin is `position: static; height: auto` with the page's normal section padding, every caption is listed under the window, and the window shows its last state (parts with `data-until` hidden, the rest shown).
- Hide captions with opacity only, so a screen reader reads the whole story in order without scrolling. Keep links out of captions, because a link in a hidden caption can still take focus.

Pitfalls:
- `position: sticky` does nothing if any ancestor between the pin and the scroller has `overflow: hidden`, `auto` or `scroll`. Use `overflow: clip` if something must be clipped.
- Use `svh`, not `vh` or `dvh`. With `dvh` the track changes height when a phone's browser bars slide away, and the story jumps.
- Check the result with viewport screenshots at several scroll positions; full-page screenshots do not show pinning.
- Verify at 390px and 1440px wide: at the first pinned position, mid-story and the last pinned position, the window's `getBoundingClientRect().top` is the same and the unit's centre is within 1px of the centre of the screen below the header. Just before the pin starts and just after it ends, the window's offset inside `.story-pin` has not changed.
