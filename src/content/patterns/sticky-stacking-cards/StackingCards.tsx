import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./stacking-cards.css";

export interface StackCard {
  /** Unique; also the label in the side index. */
  key: string;
  title: string;
  text: string;
}

export function StackingCards({ cards }: { cards: StackCard[] }) {
  const list = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // The pinning is all CSS. This only lights the index entry for the card
  // being read: the last one whose top has passed 55% of the window.
  useEffect(() => {
    const items = [...(list.current?.children ?? [])] as HTMLElement[];
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let next = 0;
      items.forEach((card, i) => {
        if (card.getBoundingClientRect().top < line) next = i;
      });
      setActive(next);
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
  }, [cards.length]);

  return (
    <section className="stack" style={{ "--n": cards.length } as CSSProperties}>
      <ol className="stack-index" aria-hidden="true">
        {cards.map((card, i) => (
          <li key={card.key} className={i === active ? "on" : undefined}>
            {card.key}
          </li>
        ))}
      </ol>

      <div className="stack-cards" ref={list}>
        {cards.map((card, i) => (
          <article key={card.key} className="stack-card" style={{ "--i": i } as CSSProperties}>
            <header className="stack-strip">
              <span className="stack-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{card.title}</h3>
            </header>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
