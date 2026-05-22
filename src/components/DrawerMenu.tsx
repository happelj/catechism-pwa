import { useNavigate } from "react-router-dom";
import { useCatechizer } from "../state/CatechizerContext";

type DrawerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const externalLinks = [
  {
    href: "https://music.youtube.com/playlist?list=PL2nTRrbReT_E1sObY4z2m6M92cKPMcK4l&si=vVodfpJLoavXn6Zm",
    label: "Shorter Catechism Songs",
  },
  {
    href: "https://www.grangepress.com/product/the-shorter-catechism-deck/",
    label: "Shorter Catechism Deck",
  },
  {
    href: "https://thewestminsterstandard.org/",
    label: "The Westminster Standard",
  },
  {
    href: "https://jerusalemchamber.com/category/podcast/",
    label: "The Jerusalem Chamber",
  },
  {
    href: "https://youtube.com/playlist?list=PLAPRJrLRX0WxwfbBSk9af9pQCKDD6Li7K&si=y981cPrsw0lCRji1",
    label: "Westminster Shorter Catechism",
  },
];

export function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const navigate = useNavigate();
  const { toggleTheme } = useCatechizer();

  function goTo(path: string) {
    onClose();
    navigate(path);
  }

  return (
    <div className={`drawer-layer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <button aria-label="Close menu" className="drawer-scrim" onClick={onClose} type="button" />
      <nav className="drawer-panel" aria-label="Main menu">
        <button onClick={toggleTheme} type="button">Toggle Dark Mode</button>
        <button onClick={() => goTo("/profiles")} type="button">Switch Profile</button>
        <button onClick={() => goTo("/stats")} type="button">View Stats</button>
        {externalLinks.map((item) => (
          <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
