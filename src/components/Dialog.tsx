import { useEffect, type ReactNode } from "react";

interface DialogProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

// Generic modal shell: overlay, escape-to-close, click-outside-to-close.
// Content (forms, summaries, etc.) is passed in as children.
export function Dialog({ title, subtitle, onClose, children }: DialogProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(event) => event.stopPropagation()}>
        <h2>{title}</h2>
        {subtitle && <p className="dialog__subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
