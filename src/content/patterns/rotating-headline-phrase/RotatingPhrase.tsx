import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import "./rotating-phrase.css";

const HOLD_MS = 3100; // from one change to the next
const LEAVE_MS = 700; // the 0.4s leave plus the last word's stagger, with headroom
const REST = { on: 0, out: -1 }; // the first phrase, and nothing leaving

/**
 * Goes after the fixed words of a heading:
 *
 *   <h1>Patterns I reuse, each one with <RotatingPhrase phrases={[…]} /></h1>
 *
 * The first phrase is the one assistive technology reads, and the only one
 * shown without JavaScript or with reduced motion.
 */
export function RotatingPhrase({ phrases }: { phrases: string[] }) {
  const root = useRef<HTMLSpanElement>(null);
  const [{ on, out }, setShown] = useState(REST);
  const count = phrases.length;

  // The motion is all CSS. This only moves `is-on` to the next phrase.
  useEffect(() => {
    setShown(REST);
    if (!root.current || count < 2) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;
    let timer = 0;
    let settle = 0;

    const step = () => {
      setShown(({ on }) => ({ on: (on + 1) % count, out: on }));
      // Once the old phrase has faded, let it drop back below the line.
      settle = window.setTimeout(() => setShown(({ on }) => ({ on, out: -1 })), LEAVE_MS);
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
      if (reduced.matches) setShown(REST);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      window.clearInterval(timer);
      window.clearTimeout(settle);
    };
  }, [count]);

  return (
    <span className="rotating" ref={root}>
      <span className="rotating-label">{phrases[0]}</span>
      {phrases.map((phrase, i) => (
        <span
          key={phrase}
          className={`rotating-phrase${i === on ? " is-on" : i === out ? " is-out" : ""}`}
          aria-hidden="true"
        >
          {phrase.split(" ").map((word, j) => (
            <Fragment key={j}>
              <span className="rotating-word" style={{ "--i": j } as CSSProperties}>
                {word}
              </span>{" "}
            </Fragment>
          ))}
        </span>
      ))}
    </span>
  );
}
