---
name: Sticky stacking cards
summary: Cards pin as you scroll, each one sliding over the last until only their title strips show, then the whole stack leaves together.
screenshot: ./screenshot.png
added: 2026-11-09
---

Turn this list of sections into sticky stacking cards: as the reader scrolls, each card pins near the top of the window, the next card slides over it, and earlier cards stay visible as a pile of title strips. When the list ends, the whole stack scrolls away together.

This is plain `position: sticky`, not scroll-jacking. The page scrolls normally and there are no scroll-driven animations; do not add any scroll-linked JavaScript to move the cards.

Structure:
- A container `.cards` holding N `<article class="card">` elements, in normal block flow (not flex or grid, because the layout relies on margin collapsing) and with `display: flow-root`, so the last card's bottom margin stays inside it.
- Each card starts with a title strip (`<header>` with a two-digit number and the card title) of fixed height `--strip`. Everything else in the card goes below the strip.
- Give each card its index as a custom property, `style="--i: 0"`, `--i: 1`, …, and set `--n` (the card count) on the container.
- All cards must have the same height. If they differ, they release at different moments and the stack breaks apart while leaving.
- Cards need an opaque background, so a card hides the one it slides over, plus a soft upward shadow (for example `box-shadow: 0 -18px 28px -12px rgb(0 0 0 / 0.35)`) so the overlap reads.

Sticky math:
- `--strip`: 52px on small screens, 64px from 760px wide. `--pin`: the sticky header height plus 8px (16px from 760px). `--gap`: 24px between cards in normal flow.
- `top: calc(var(--pin) + var(--i) * var(--strip))`, so each card pins one strip lower than the card before.
- `margin-bottom: calc((var(--n) - var(--i)) * var(--strip))`. The extra margin is one strip longer for each earlier card, cancelling out its higher pin, so every card's margin box ends at the same point and all of them hit the end of `.cards` at the same scroll position.
- `.card + .card { margin-top: calc(var(--gap) - (var(--n) + 1 - var(--i)) * var(--strip)); }`. This negative margin collapses with the previous card's bottom margin, so the visible gap stays `--gap`.
- Wrap the sticky rules in `@media (min-height: 700px)`. On short windows a whole card cannot fit under the stack, so let the cards flow normally there.

Side index (optional, from 1000px wide):
- Make the section a two-column grid: a narrow index column (about 176px) and the cards. The index is an `<ol aria-hidden="true">` of short card labels, `position: sticky` at about `--pin + 22px`, hidden below 1000px.
- Highlight the entry for the card being read: on `scroll` (passive listener, throttled with `requestAnimationFrame`), the active card is the last one whose `getBoundingClientRect().top` is above 55% of `innerHeight`. Toggle an `on` class; transition only `color`, over 200ms, and turn the transition off under `prefers-reduced-motion: reduce`.

Pitfalls:
- `position: sticky` does nothing if any ancestor between the card and the scroller has `overflow: hidden`, `auto` or `scroll`. Use `overflow: clip` if something must be clipped.
- An image inside a card must not set the card's height; position it absolutely inside a sized box, or the cards stop matching.
- Check the result with viewport screenshots at several scroll positions; full-page screenshots do not show pinning.
- Verify at 390px and 1440px wide: mid-scroll the strips stack 52px or 64px apart, and at the end all cards move up together with no strip clipped.
