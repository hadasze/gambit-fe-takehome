import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: (ids: string[]) => void;
  emptyMessage?: string;
}

// Generic data table: pass column definitions and a row array, optionally
// wire up row selection. Knows nothing about the shape of `T`.
export function Table<T>({
  columns,
  rows,
  getRowId,
  getRowLabel,
  selectedIds,
  onToggleRow,
  onToggleAll,
  emptyMessage = "No data to show.",
}: TableProps<T>) {
  const selectable = Boolean(selectedIds && onToggleRow);
  const rowIds = rows.map(getRowId);
  const allSelected = selectable && rowIds.length > 0 && rowIds.every((id) => selectedIds!.has(id));

  if (rows.length === 0) {
    return <p className="table__empty">{emptyMessage}</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {selectable && (
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onToggleAll?.(rowIds)}
                aria-label="Select all rows"
              />
            </th>
          )}
          {columns.map((column) => (
            <th key={column.key} className={column.align === "right" ? "text-right" : undefined}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const id = getRowId(row);
          const isSelected = selectable && selectedIds!.has(id);
          return (
            <tr key={id} className={isSelected ? "is-selected" : undefined}>
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds!.has(id)}
                    onChange={() => onToggleRow?.(id)}
                    aria-label={`Select ${getRowLabel?.(row) ?? id}`}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className={column.align === "right" ? "text-right" : undefined}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
