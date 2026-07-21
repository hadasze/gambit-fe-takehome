interface SelectionActionBarProps {
  selectedCount: number;
  onCreateClick: () => void;
  onClear: () => void;
}

export function SelectionActionBar({ selectedCount, onCreateClick, onClear }: SelectionActionBarProps) {
  return (
    <div className="selection-bar">
      <span>
        {selectedCount} resource{selectedCount === 1 ? "" : "s"} selected
      </span>
      <div className="selection-bar__actions">
        <button type="button" className="button button--ghost" onClick={onClear}>
          Clear
        </button>
        <button type="button" className="button button--primary" onClick={onCreateClick}>
          Create Application
        </button>
      </div>
    </div>
  );
}
