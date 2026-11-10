---
name: Rotating headline phrase
summary: The closing phrase of a headline changes every few seconds, each word of the new one fading up out of a blur a beat after the last.
screenshot: ./screenshot.png
added: 2026-11-10
code:
  - file: RotatingPhrase.tsx
    framework: React
  - file: RotatingPhrase.svelte
    framework: Svelte
  - rotating-phrase.css
---

Make the closing phrase of this headline rotate through a short list of phrases. The fixed words stay where they are. Every 3.1 seconds the phrase changes: its words rise a little and fade out, and the words of the next phrase fade up out of a blur, one after another.

This is CSS transitions plus a timer that moves one class from phrase to phrase. Do not add an animation library or a typewriter effect, and do not measure or animate the heading's height. Keep the motion quiet: nothing bounces, overshoots or moves sideways, and the heading and everything below it stay exactly where they are while the phrase changes.

Structure:
- Inside the heading, after the fixed words, a `<span class="rotating">` with `display: grid`. It is block-level, so the phrase starts on its own line; its text follows the heading's `text-align`.
- One `<span class="rotating-phrase" aria-hidden="true">` per phrase, every one with `grid-area: 1 / 1` and `text-wrap: balance`. Sharing one grid cell makes the heading as tall as the tallest phrase. Do not use a fixed height or `position: absolute` instead: a fixed height leaves empty space or clips when a phrase wraps, and absolute phrases hold no height at all.
- Each word in its own `<span class="rotating-word" style="--i: 0">` (`--i: 1`, …) with `display: inline-block`, because a transform does nothing on an inline box. Keep an ordinary space between the word spans so a phrase can still wrap.
- The first phrase once more in a visually hidden span, positioned absolutely so it takes no grid cell. The visible phrases are `aria-hidden`, so a screen reader hears the heading once, ending in the first phrase, and is never told about the changes.

Motion:
- A hidden word: `opacity: 0; transform: translateY(0.35em); filter: blur(6px)`.
- A word in the phrase with `.is-on`: `opacity: 1; transform: none; filter: none`. Transition all three over 0.6s with `cubic-bezier(0.22, 0.61, 0.36, 1)`, and `transition-delay: calc(var(--i) * 45ms)` for the stagger.
- A word in the phrase with `.is-out`: `transform: translateY(-0.3em)` and `transition-duration: 0.4s`, so the word keeps rising as it fades instead of dropping back to where it came from.
- Every 3100ms, move `is-on` to the next phrase and put `is-out` on the phrase it left; take `is-out` off 700ms later. Both phrases move at once and cross over in the same cell. Do not wait for one to finish before starting the other.
- Run the timer only while the heading is on screen (`IntersectionObserver`) and the tab is visible (`visibilitychange`).

Without motion:
- Under `@media (prefers-reduced-motion: reduce), (scripting: none)`, give every phrase that is not `.is-on` `display: none` and the words `transition: none`. The heading then shows the first phrase alone and holds no space for the others.
- In the script, do not start the timer while reduced motion is on. Listen for the setting changing, and go back to the first phrase if it turns on mid-visit.

Copy and style:
- Three to five phrases of similar length, six words at most, each one finishing the sentence on its own. Put the strongest first: it is the only one search engines, screen readers and reduced-motion readers get.
- Set the phrase apart from the fixed words by tone alone, for example the fixed words in the secondary text colour and the phrase in the main one, both at WCAG AA contrast. No underline, highlight, pill, glow, gradient or text cursor on the phrase, and no label above the heading.
- No dots or arrows beside it. The phrase is not a carousel and must not look like a control.

Pitfalls:
- The 700ms covers the 0.4s leave plus the last word's delay. With more than six words in a phrase, raise it, or the last words snap back while still visible.
- Size the heading's column so the longest phrase fits on one line at desktop widths. On a phone the long phrases wrap and the cell holds that many lines for all of them, which is why the phrases should be of similar length.
- `overflow: hidden` on the heading with a tight `line-height` clips the words as they rise and the blur at their edges. Leave the heading's overflow visible.
- A single screenshot does not show the stagger. Check with a recording, or screenshots about 150ms apart across one change.
- Verify at 390px and 1440px wide: across a full cycle nothing below the heading moves and no phrase runs off the screen, and with reduced motion emulated the first phrase shows alone with no gap beneath it.
