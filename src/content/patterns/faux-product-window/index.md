---
name: Faux product window
summary: A product mock framed as a real macOS window, with the dark rim outside and the light edge inside that macOS draws. One frame for every mock, shrunk whole on phones.
screenshot: ./screenshot.png
added: 2026-11-10
code:
  - file: MacWindow.tsx
    framework: React
  - file: MacWindow.svelte
    framework: Svelte
  - mac-window.css
---

Frame this product mock as a real macOS window: a title bar with the three traffic lights and a centred title, the two borders macOS draws around a window, and a soft shadow. Only the chrome is macOS; the mock inside keeps the product's own colours. Build it as one component and use it for every product mock on the site, replacing any other frame (browser chrome, a plain card), so they all look the same.

It must read as a recreation of an actual Mac window, not a toy version of one: no oversized dots, no thick or offset shadow, no glow, no coloured frame, no tilt. It is static: no entrance animation and no hover lift.

Structure:
- `.mac-window`: the outer wrapper, with `role="img"` and an `aria-label` that says what the picture shows. It is also the size container (`container: mac-window / inline-size`) and draws nothing itself.
- `.mac-window-frame` inside it: the window. `position: relative`, `border-radius: 12px`, an opaque background.
- `.mac-bar`: the title bar, 36px high, padding `0 14px`, top corners rounded 12px. A grid of `1fr auto 1fr` with the lights in the first column and the title in the second, so the title is centred on the window and not on the space beside the lights.
- `.mac-lights`: three 12px circles, 8px apart: `#ff5f57`, `#febc2e`, `#28c840`, each with an inset 0.5px ring one shade darker (`#e0443e`, `#dea123`, `#1aab29`). No glyphs inside them; macOS shows those only on hover.
- `.mac-title`: 13px, weight 600, on one line with an ellipsis.
- `.mac-body`: holds the mock. `overflow: hidden`, bottom corners rounded 12px, `isolation: isolate`.

The two borders, both drawn with `box-shadow` because a `border` would inset the bar and the mock:
- Outer rim: `0 0 0 1px` in an opaque colour on the frame. Opaque, so the edge looks the same on a light or a dark page.
- Inner edge: a `::after` on the frame (`position: absolute; inset: 0; border-radius: inherit; pointer-events: none`) with `box-shadow: inset 0 0 0 1px` in translucent white and a `z-index` above the content, so the mock cannot paint over it.
- Shadow, after the rim in the same `box-shadow`: `0 2px 4px rgb(0 0 0 / 0.06), 0 24px 56px -20px` in the shade below. Nothing heavier.

Chrome colours, chosen with `data-appearance` to suit the mock inside:
- Light: rim `#b4b4b4`, edge `rgb(255 255 255 / 0.7)`, bar `linear-gradient(#f6f6f6, #e4e4e4)` with a bottom line `inset 0 -1px 0 rgb(0 0 0 / 0.14)`, title `#4a4a4a`, shade `rgb(0 0 0 / 0.3)`.
- Dark: rim `#0b0b0c`, edge `rgb(255 255 255 / 0.13)`, bar `linear-gradient(#3c3c3e, #303032)` with a bottom line `inset 0 -1px 0 rgb(0 0 0 / 0.5)`, title `#b9b9bd`, shade `rgb(0 0 0 / 0.5)`.

Type: set the frame to `13px / 1.4 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif` and reset `letter-spacing` and `text-transform`, so the page's own fonts stay out of the window. Size the mock in px on that base.

A picture, not an app:
- Build the mock from `div`, `span` and `svg` only. No links, buttons or inputs, so nothing in it takes focus.
- `cursor: default` and `user-select: none` on the frame, and no hover, focus or pressed styles anywhere inside. A selected row may be drawn; it does not react.

Phones:
- When the wrapper is narrower than 560px, shrink the whole window as a screenshot would shrink: `zoom: 0.82` on the frame, set through a custom property (`--mac-scale`) inside `@container mac-window (max-width: 560px)`. `zoom` scales layout as well as paint, so the window still fills its column; `transform: scale()` would leave a gap around it.
- Give both borders and the bar's bottom line a width of `calc(1px / var(--mac-scale))`, so they stay one pixel on screen.
- In the same container query the mock drops its secondary panes (a sidebar, a metadata column) instead of squeezing them. Every label stays on one line.

Pitfalls:
- A size container has no width of its own. Where the parent centres or shrink-wraps the wrapper (flex, or grid with `place-items: center`), give the wrapper `width: 100%` and a `max-width`, or it collapses to nothing.
- The shadow reaches about 60px below the window. An ancestor with `overflow: hidden` needs that much padding under it or it cuts the shadow off.
- Verify at 390px and 1440px wide, on a light and on a dark page. In a zoomed-in screenshot of the window's top left corner, the rim sits outside the light edge and both follow the corner. The title is centred on the window, no label wraps, the Tab key never stops inside the window, and nothing in it changes under the pointer.
