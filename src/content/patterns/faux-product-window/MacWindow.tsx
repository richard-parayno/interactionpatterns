import type { ReactNode } from "react";
import "./mac-window.css";

export interface MacWindowProps {
  /** Centred in the title bar: the name the app would give its window. */
  title: string;
  /** What the picture shows, for anyone who cannot see it. */
  label: string;
  /** The chrome only. The mock inside paints its own colours. */
  appearance?: "light" | "dark";
  /** The mock: plain elements, with no links, buttons or inputs. */
  children: ReactNode;
}

// The one frame for every product mock on the site:
//
//   <MacWindow title="Slate" label="Today's tasks in Slate" appearance="dark">
//     <TasksMock />
//   </MacWindow>
//
// The window is a picture. role="img" hides everything inside it from
// assistive technology and `label` stands in for it.
export function MacWindow({ title, label, appearance = "light", children }: MacWindowProps) {
  return (
    <div className="mac-window" role="img" aria-label={label}>
      <div className="mac-window-frame" data-appearance={appearance}>
        <div className="mac-bar">
          <span className="mac-lights">
            <i />
            <i />
            <i />
          </span>
          <span className="mac-title">{title}</span>
        </div>
        <div className="mac-body">{children}</div>
      </div>
    </div>
  );
}
