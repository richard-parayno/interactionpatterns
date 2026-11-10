import { TactileButton } from "./TactileButton";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * A row of nav links as small quiet buttons. The one whose `href` is
 * `current` stays pressed and is announced as the current page.
 *
 *   <header className="tactile-surface">
 *     <TactileNav label="Main" items={items} current={pathname} />
 *   </header>
 */
export function TactileNav({
  label,
  items,
  current,
}: {
  label: string;
  items: NavItem[];
  current: string;
}) {
  return (
    <nav className="tactile-nav" aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <TactileButton
              href={item.href}
              variant="quiet"
              size="small"
              current={item.href === current}
            >
              {item.label}
            </TactileButton>
          </li>
        ))}
      </ul>
    </nav>
  );
}
