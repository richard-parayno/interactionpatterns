---
name: Hold to confirm
summary: A destructive action that only fires after the button is held down for a moment, replacing the "Are you sure?" dialog.
screenshot: ./screenshot.png
screenshotAlt: A grey "Keep holding" button about halfway filled with orange from the left.
added: 2026-11-09
---

Replace the confirmation dialog for this destructive action with a hold-to-confirm button.

Behavior:
- The action fires only after the user holds the button for 1.2 seconds. A single click or tap does nothing except start the hold.
- While held, a fill sweeps across the button from left to right at a constant rate, so the remaining time is always visible. When the fill reaches the end, run the action.
- Releasing early, moving focus away, or the pointer being cancelled stops the hold and drains the fill back to empty in about 200 ms. Nothing happens.
- Change the label while holding ("Keep holding") and after success ("Deleted"), then return to the idle label after 1.5 seconds.

Input:
- Use pointer events with pointer capture so mouse, touch, and pen behave the same and dragging off the button does not cancel the hold.
- Keyboard: holding Space or Enter behaves like holding the pointer. Ignore key repeat.
- Set `touch-action: none` and `user-select: none` on the button so a long press on touch devices does not open a context menu or select text.

Accessibility:
- Keep it a real `<button>`. Announce label changes with `aria-live="polite"`.
- Do not use this for actions that must be fast or repeated; it is for rare, costly actions.

Implementation:
- Drive the fill with a CSS transition on `transform: scaleX()` and treat the transition's `transitionend` as the confirmation, so the visual and the trigger cannot drift apart.
- Keep the hold duration in one CSS custom property.
