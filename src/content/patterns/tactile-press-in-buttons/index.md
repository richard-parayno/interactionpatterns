---
name: Tactile press-in buttons
summary: Buttons and panes with their depth on the inside. A button lifts a little on hover, presses in on click, and the current nav item stays pressed.
screenshot: ./screenshot.png
added: 2026-11-10
code:
  - file: TactileButton.tsx
    framework: React
  - file: TactileNav.tsx
    framework: React
  - file: TactileButton.svelte
    framework: Svelte
  - file: TactileNav.svelte
    framework: Svelte
  - tactile.css
---

Give the buttons, nav items and raised panes in this project a tactile look: slightly skeuomorphic, but only on the inside of each shape, not the outside. A button lifts a little when hovered and presses in when clicked, and the nav item for the current page stays pressed.

Keep it subtle. If the gradient or the shadow is noticed before the label, lower the opacities below; do not add layers, borders or glow. Apply one style to every button and nav item of the same kind, so none are left flat next to textured ones.

Texture, at rest:
- No border. The gradient and a very small shadow separate the shape from the page.
- A soft vertical gradient, lighter at the top. Set the fill as `background-color` and put a see-through layer over it, `background-image: linear-gradient(rgb(255 255 255 / 0.14), rgb(255 255 255 / 0))`, because a colour can transition between states and a gradient cannot.
- `box-shadow` with three layers, always in this order: a 1px highlight under the top edge, `inset 0 1px 0 rgb(255 255 255 / 0.22)`; an inner shadow, off at rest, `inset 0 1px 2px rgb(0 0 0 / 0)`; a very small drop shadow, `0 1px 2px rgb(0 0 0 / 0.24)`. Every state lists the same three layers and sets the unused ones to alpha 0, so the shadow fades between states and does not jump.
- Radius 6px (4 to 8px, never a full pill). Height at least 44px, 36px for small ones. Label weight 600, on one line (`white-space: nowrap`).
- Two variants, using the project's own colours. Primary: the main action colour with a light label, at most one per section. Quiet: a near-white fill with a dark label, for secondary buttons and nav items; on a light fill use gradient alpha 1, highlight 0.9, drop shadow 0.16 and pressed inner shadow 0.16.
- A raised pane (card, toolbar, header) gets the same texture and never moves: `linear-gradient(#fdfdfd, #f4f4f4)`, `inset 0 1px 0 #fff`, and `0 1px 2px rgb(0 0 0 / 0.1), 0 2px 6px rgb(0 0 0 / 0.06)`.

States:
- Hover, inside `@media (hover: hover)` so the lift does not stick after a tap on a touch screen: `transform: translateY(-2px)` and the drop shadow lengthens to `0 5px 10px -2px` at the same alpha.
- Transitions: `background-color 150ms ease, box-shadow 200ms ease, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)`. The 1.56 carries the lift about 10% past 2px before it settles; that is the whole bounce. No keyframes, no scaling, no spring library.
- Press (`:active`): `translateY(1px)` with `transition-duration: 80ms`, `background-image: none`, the fill 9% darker (`color-mix(in srgb, <fill>, #000 9%)`), highlight alpha 0, inner shadow alpha 0.45, drop shadow alpha 0.
- Current nav item: the link has `aria-current="page"`, and the pressed look is styled from that attribute (`[aria-current]:not([aria-current="false"])`), not from a separate class. It has `transform: none` in every state: it is already down.
- Focus: a `:focus-visible` outline, 2px solid, offset 3px. Disabled: no gradient, no shadow, 50% opacity, no movement.

Pitfalls:
- A lifted button moves away from a pointer resting on its bottom edge, loses hover, drops back and flickers. Give the button `position: relative`, and while hovered an `::after { content: ""; position: absolute; inset: 0 0 -3px; }` that keeps its resting area under the pointer. While pressed, the same with `inset: -1px 0 0`, so a press on the top pixel row still releases on the button and the click is not lost.
- Safari on iOS shows `:active` only while the page has a touchstart listener. Add one empty one: `document.addEventListener("touchstart", () => {}, { passive: true })`.
- Under `prefers-reduced-motion: reduce`, set `transform: none` for rest, hover and press. The shading still changes.
- Under `forced-colors: active` the gradient and shadows are removed. Add `border: 1px solid ButtonText`, and give the current item `Highlight` and `HighlightText` with `forced-color-adjust: none`.
- Leave at least 6px between neighbouring buttons and between a button and the edge of a pane that clips, so a lifted button and its shadow are not cut off.

When not to use it: this look clashes with a flat design. If the rest of the page has no gradients or shadows, do not add it to a few buttons; tell me, and I will decide whether the whole page changes.

Verify in a browser with a real pointer, not from the code:
- Hovering moves the button 2px up and pressing moves it 1px down. Resting the pointer on the bottom edge does not make it flicker, and a click on the top pixel row still fires.
- The current nav item looks pressed and does not move when hovered.
- Separately at 390px wide with touch: no button stays lifted after a tap, the press shows during the tap, and every label is on one line.
- With the keyboard, every button and nav item shows the focus outline.
