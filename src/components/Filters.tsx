export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectConfig {
  key: string;
  value: string;
  options: FilterOption[];
}

interface FiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selects: FilterSelectConfig[];
  onSelectChange: (key: string, value: string) => void;
  onReset: () => void;
  resultCount?: number;
}

// Generic search + multi-select filter bar, driven entirely by config.
export function Filters({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  selects,
  onSelectChange,
  onReset,
  resultCount,
}: FiltersProps) {
  return (
    <div className="filters">
      <input
        type="text"
        className="filters__search"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      {selects.map((select) => (
        <select
          key={select.key}
          value={select.value}
          onChange={(event) => onSelectChange(select.key, event.target.value)}
        >
          {select.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      <button type="button" className="filters__reset" onClick={onReset}>
        Reset
      </button>

      {resultCount !== undefined && <span className="filters__count">{resultCount} results</span>}
    </div>
  );
}
