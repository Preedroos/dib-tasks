interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ placeholder, value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container border border-outline/20 text-xs focus:outline-primary placeholder:text-on-surface-variant/60 text-on-surface"
      />
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant/60">
        search
      </span>
    </div>
  );
}
