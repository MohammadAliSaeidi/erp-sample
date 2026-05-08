import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComboboxContext } from "./combobox.context";

type ComboboxListType = { className?: string };

export function ComboboxList<T>(props: ComboboxListType) {
  const { className } = props;

  const {
    isOpen,
    getInputProps,
    placeholder,
    loadingText,
    isItemSelected,
    getItemProps,
    getInputPropsMerged,
    highlightedIndex,
    renderItem,
    isLoading,
    items,
    itemToKey,
    isItemDisabled,
    emptyText,
    itemToString,
  } = useComboboxContext<T>();

  const inputProps = getInputProps(
    getInputPropsMerged({
      placeholder: placeholder,
      autoFocus: true,
    }),
  );

  return (
    <div
      className={cn(
        "w-[--radix-popover-trigger-width] rounded-md border bg-popover p-1 text-sm shadow",
        !isOpen && "hidden",
        className,
      )}
    >
      <div className="border-b p-1">
        <input
          {...inputProps}
          className="h-9 w-full rounded-md bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <ul className="max-h-56 overflow-auto">
        {isOpen && (
          <>
            {isLoading && (
              <li className="flex items-center gap-2 px-2 py-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {loadingText}
              </li>
            )}

            {!isLoading && items.length === 0 && (
              <li className="px-2 py-2 text-muted-foreground">{emptyText}</li>
            )}

            {!isLoading &&
              items.map((item, index) => {
                const isSelected = isItemSelected(item);
                const isDisabled = isItemDisabled(item);
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={itemToKey(item)}
                    {...getItemProps({
                      item,
                      index,
                      disabled: isDisabled,
                    })}
                    className={cn(
                      "flex cursor-pointer select-none items-center rounded px-2 py-1.5",
                      isHighlighted && "bg-accent text-accent-foreground",
                      isSelected && "font-medium",
                      isDisabled && "pointer-events-none opacity-50",
                    )}
                  >
                    {renderItem
                      ? renderItem(item, {
                          isSelected,
                          isHighlighted,
                          isDisabled,
                        })
                      : itemToString(item)}
                  </li>
                );
              })}
          </>
        )}
      </ul>
    </div>
  );
}
