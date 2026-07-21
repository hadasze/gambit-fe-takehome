import type { ReactNode } from "react";

interface ListProps<T> {
  items: T[];
  getItemId: (item: T) => string;
  renderHeader: (item: T) => ReactNode;
  renderDetail?: (item: T) => ReactNode;
  expandedId?: string | null;
  onToggleExpand?: (id: string) => void;
  emptyMessage?: string;
}

// Generic expandable list: each item renders a header (always visible) and
// an optional detail section revealed when the item is expanded.
export function List<T>({
  items,
  getItemId,
  renderHeader,
  renderDetail,
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
            <button
              type="button"
              className="list__header"
              onClick={() => onToggleExpand?.(id)}
              aria-expanded={isExpanded}
            >
              {renderHeader(item)}
              {onToggleExpand && <span className="list__chevron">{isExpanded ? "−" : "+"}</span>}
            </button>
            {isExpanded && renderDetail?.(item)}
          </li>
        );
      })}
    </ul>
  );
}
