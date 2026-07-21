import type { ReactNode } from "react";

interface ListProps<T> {
  items: T[];
  getItemId: (item: T) => string;
  renderHeader: (item: T) => ReactNode;
  renderSubheader?: (item: T) => ReactNode;
  renderDetail?: (item: T) => ReactNode;
  renderActions?: (item: T) => ReactNode;
  expandedId?: string | null;
  onToggleExpand?: (id: string) => void;
  emptyMessage?: string;
}

// Generic expandable list: a single-line header row (title + actions, all
// vertically centered), an optional secondary line below it, and an
// optional detail section revealed when the item is expanded.
export function List<T>({
  items,
  getItemId,
  renderHeader,
  renderSubheader,
  renderDetail,
  renderActions,
  expandedId,
  onToggleExpand,
  emptyMessage = "Nothing here yet.",
}: ListProps<T>) {
  if (items.length === 0) {
    return <p className="list__empty">{emptyMessage}</p>;
  }

  return (
    <ul className="list">
      {items.map((item) => {
        const id = getItemId(item);
        const isExpanded = expandedId === id;
        return (
          <li key={id} className="list__item">
            <div className="list__row">
              <button
                type="button"
                className="list__toggle"
                onClick={() => onToggleExpand?.(id)}
                aria-expanded={isExpanded}
              >
                {renderHeader(item)}
                {onToggleExpand && <span className="list__chevron">{isExpanded ? "−" : "+"}</span>}
              </button>
              {renderActions && <div className="list__actions">{renderActions(item)}</div>}
            </div>
            {renderSubheader && <div className="list__subheader">{renderSubheader(item)}</div>}
            {isExpanded && renderDetail?.(item)}
          </li>
        );
      })}
    </ul>
  );
}
