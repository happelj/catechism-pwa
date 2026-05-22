type AppToolbarProps = {
  onOpenMenu: () => void;
  title: string;
};

export function AppToolbar({ onOpenMenu, title }: AppToolbarProps) {
  return (
    <header className="app-toolbar">
      <button
        aria-label="Open menu"
        className="hamburger-button"
        onClick={onOpenMenu}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
      <h1>{title}</h1>
    </header>
  );
}
