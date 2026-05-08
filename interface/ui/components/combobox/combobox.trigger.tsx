// combobox.trigger.tsx
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComboboxContext } from "./combobox.context";

export function ComboboxTrigger<T>({ className }: { className?: string }) {
  const {
    itemToString,
    selectedItems,
    getToggleButtonProps,
    placeholder,
    selectedItem,
    multiple,
    clearAll,
  } = useComboboxContext<T>();

  const hasValue = multiple ? selectedItems.length > 0 : !!selectedItem;

  const valueLabel = multiple
    ? selectedItems.map((item) => itemToString(item)).join(", ")
    : selectedItem
      ? itemToString(selectedItem)
      : "";

  const toggleButtonProps = getToggleButtonProps();

  return (
    <div
      {...toggleButtonProps}
      className={cn(
        "flex min-h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm",
        className,
      )}
    >
      <span
        className={cn(
          "flex-1 truncate text-left",
          !hasValue && "text-muted-foreground",
        )}
      >
        {hasValue ? valueLabel : placeholder}
      </span>

      {hasValue && (
        <button
          type="button"
          className="mr-1 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            clearAll();
          }}
          aria-label="Clear"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
