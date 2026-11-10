import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./pinned-story.css";

export interface StoryBeat {
  /** Unique; the caption's heading. */
  title: string;
  text: string;
}

/**
 * Props for an element inside the window: shown from beat `from` and, when
 * `until` is given, hidden again from beat `until`. Spread them on the element:
 * `<li {...part(1)}>` or `<span {...part(0, 3)}>Draft</span>`.
 */
export type StoryPart = (from: number, until?: number) => { className: string; "data-until"?: number };

export function PinnedStory({
  beats,
  children,
}: {
  beats: StoryBeat[];
  /** The window. It must be the same size on every beat. */
  children: (part: StoryPart) => ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);
  const count = beats.length;

  // The pinning is all CSS. This only reads how far the pin has travelled
  // through its track, so scrolling back up rewinds the story.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!track.current || !pin.current) return;
      // Every beat, the last one included, gets one step of scrolling.
      const step = (track.current.offsetHeight - pin.current.offsetHeight) / count;
      if (step <= 0) return; // not pinned: the CSS shows the last state

      const pinTop = parseFloat(getComputedStyle(pin.current).top) || 0;
      const travelled = (pinTop - track.current.getBoundingClientRect().top) / step;
      setBeat(Math.min(count - 1, Math.max(0, Math.floor(travelled))));
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
  }, [count]);

  const part: StoryPart = (from, until) => ({
    className: beat >= from && (until === undefined || beat < until) ? "story-part on" : "story-part",
    "data-until": until,
  });

  return (
    <section className="story" style={{ "--beats": count } as CSSProperties}>
      <div className="story-track" ref={track}>
        <div className="story-pin" ref={pin}>
          {/* The window is a picture; the captions tell the story. */}
          <div className="story-window" aria-hidden="true">
            {children(part)}
          </div>

          <ol className="story-captions">
            {beats.map((item, i) => (
              <li key={item.title} className={i === beat ? "story-caption on" : "story-caption"}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
