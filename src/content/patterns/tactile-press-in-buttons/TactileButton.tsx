import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import "./tactile.css";

interface Look {
  /** "primary" is the dark one; use one per section. "quiet" is the light one. */
  variant?: "primary" | "quiet";
  size?: "regular" | "small";
}

type ButtonProps = Look &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    current?: undefined;
  };

type LinkProps = Look &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    /** This link points at the page being shown: it stays pressed. */
    current?: boolean;
  };

// Safari on iOS shows :active only while the page has a touchstart listener;
// this empty one is enough for the press to show on a tap.
if (typeof document !== "undefined") {
  document.addEventListener("touchstart", () => {}, { passive: true });
}

/**
 * A button, or a link that looks like one when it has an `href`. The look and
 * the motion are all in tactile.css; this only picks the element and classes.
 */
export function TactileButton(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "regular", current, className, ...rest } = props;
  const classes = [
    "tactile",
    variant === "quiet" && "tactile-quiet",
    size === "small" && "tactile-small",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (rest.href !== undefined) {
    return <a {...rest} className={classes} aria-current={current ? "page" : undefined} />;
  }

  return <button type="button" {...rest} className={classes} />;
}
