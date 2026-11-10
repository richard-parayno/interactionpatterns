<script lang="ts">
  import TactileButton from "./TactileButton.svelte";

  interface NavItem {
    href: string;
    label: string;
  }

  // A row of nav links as small quiet buttons. The one whose `href` is
  // `current` stays pressed and is announced as the current page.
  //
  //   <header class="tactile-surface">
  //     <TactileNav label="Main" {items} current={page.url.pathname} />
  //   </header>
  let {
    label,
    items,
    current,
  }: { label: string; items: NavItem[]; current: string } = $props();
</script>

<nav class="tactile-nav" aria-label={label}>
  <ul>
    {#each items as item (item.href)}
      <li>
        <TactileButton
          href={item.href}
          variant="quiet"
          size="small"
          current={item.href === current}
        >
          {item.label}
        </TactileButton>
      </li>
    {/each}
  </ul>
</nav>
