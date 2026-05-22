import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "./Dialog";
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
  const {
    disableChildMode,
    enableChildMode,
    settings,
    toggleTheme,
  } = useCatechizer();
  const [childModeAction, setChildModeAction] = useState<"enable" | "disable" | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  function closeChildModeDialog() {
    setChildModeAction(null);
    setPin("");
    setConfirmPin("");
    setPinError("");
  }

  function submitChildMode() {
    if (childModeAction === "enable") {
      if (!/^\d{4,}$/.test(pin)) {
        setPinError("Enter at least 4 digits.");
        return;
      }

      if (pin !== confirmPin) {
        setPinError("PINs do not match.");
        return;
      }

      enableChildMode(pin);
      closeChildModeDialog();
      onClose();
      return;
    }

    if (!disableChildMode(pin)) {
      setPinError("Incorrect PIN.");
      return;
    }

    closeChildModeDialog();
    onClose();
  }

  function goTo(path: string) {
    onClose();
    navigate(path);
  }

  return (
    <>
      <div className={`drawer-layer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <button aria-label="Close menu" className="drawer-scrim" onClick={onClose} type="button" />
        <nav className="drawer-panel" aria-label="Main menu">
          <button onClick={toggleTheme} type="button">Toggle Dark Mode</button>
          <button onClick={() => goTo("/profiles")} type="button">Switch Profile</button>
          <button onClick={() => goTo("/stats")} type="button">View Stats</button>
          <button
            onClick={() => setChildModeAction(settings.childModeEnabled ? "disable" : "enable")}
            type="button"
          >
            {settings.childModeEnabled ? "Disable Child Mode" : "Enable Child Mode"}
          </button>
          {!settings.childModeEnabled && externalLinks.map((item) => (
            <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {childModeAction && (
        <Dialog
          onDismiss={closeChildModeDialog}
          title={childModeAction === "enable" ? "Enable Child Mode" : "Disable Child Mode"}
        >
          <p className="dialog-copy">
            {childModeAction === "enable"
              ? "Set a PIN with at least 4 digits. Child mode blocks outside web links until it is disabled with this PIN."
              : "Enter the parent PIN to turn child mode off."}
          </p>
          <label className="dialog-field">
            <span>{childModeAction === "enable" ? "Enter PIN" : "Enter PIN to disable"}</span>
            <input
              autoFocus
              inputMode="numeric"
              onChange={(event) => setPin(event.target.value)}
              type="password"
              value={pin}
            />
          </label>
          {childModeAction === "enable" && (
            <label className="dialog-field">
              <span>Confirm PIN</span>
              <input
                inputMode="numeric"
                onChange={(event) => setConfirmPin(event.target.value)}
                type="password"
                value={confirmPin}
              />
            </label>
          )}
          {pinError && <p className="dialog-error">{pinError}</p>}
          <div className="dialog-actions">
            <button onClick={closeChildModeDialog} type="button">Cancel</button>
            <button onClick={submitChildMode} type="button">
              {childModeAction === "enable" ? "Enable Child Mode" : "Disable"}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
