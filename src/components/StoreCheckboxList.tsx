import type { Stores } from '../types';

interface StoreCheckboxListProps {
  availableStores: Stores[];
  selectedStoreIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function StoreCheckboxList({
  availableStores,
  selectedStoreIds,
  onChange,
}: StoreCheckboxListProps) {
  const handleToggle = (storeId: string, isChecked: boolean) => {
    if (isChecked) {
      onChange(selectedStoreIds.filter((id) => id !== storeId));
    } else {
      onChange([...selectedStoreIds, storeId]);
    }
  };

  return (
    <div className="border border-outline-variant/60 rounded-xl bg-surface-container-low max-h-36 overflow-y-auto p-3 space-y-2">
      {availableStores.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Nenhuma loja ativa cadastrada.
        </p>
      ) : (
        availableStores.map((store) => {
          const isChecked = selectedStoreIds.includes(store.id);
          return (
            <label
              key={store.id}
              className="flex items-center gap-3 cursor-pointer select-none text-body-md text-on-surface hover:bg-surface-container p-1.5 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(store.id, isChecked)}
                className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span>{store.name}</span>
            </label>
          );
        })
      )}
    </div>
  );
}
