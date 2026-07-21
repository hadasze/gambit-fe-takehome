interface ActionBarProps {
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

// Generic floating bar: a status message plus up to two actions.
export function ActionBar({ message, primaryLabel, onPrimary, secondaryLabel, onSecondary }: ActionBarProps) {
  return (
    <div className="action-bar">
      <span>{message}</span>
      <div className="action-bar__actions">
        {secondaryLabel && onSecondary && (
          <button type="button" className="button button--ghost" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        )}
        <button type="button" className="button button--primary" onClick={onPrimary}>
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
