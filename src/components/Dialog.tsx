import type { ReactNode } from "react";

type DialogProps = {
  children: ReactNode;
  onDismiss: () => void;
  title: string;
};

export function Dialog({ children, onDismiss, title }: DialogProps) {
  return (
    <div className="dialog-layer" role="presentation">
      <button
        aria-label="Close dialog"
        className="dialog-backdrop"
        onClick={onDismiss}
        type="button"
      />
      <section aria-modal="true" className="dialog-surface" role="dialog">
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}
