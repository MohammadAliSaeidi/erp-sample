// use-combobox-adapter.tsx
import { useCallback, useMemo } from "react";
import type { UseComboboxGetInputPropsOptions } from "downshift";
import type {
  ComboboxAdapterProps,
  ComboboxAdapterReturn,
  DefaultItem,
  ItemToKey,
  ItemToString,
} from "./combobox.adapter.types";
import { useComboboxCore } from "./combobox.core";

const defaultItemToKey = <T extends DefaultItem>(item: T) => item.id;
const defaultItemToString = <T extends DefaultItem>(item: T | null) =>
  item?.label ?? "";

export function useComboboxAdapter<T>(
  props: ComboboxAdapterProps<T>,
): ComboboxAdapterReturn<T> {
  const {
    multiple = false,
    maxSelected,
    onMaxSelected,

    itemToKey = defaultItemToKey as ItemToKey<T>,
    itemToString = defaultItemToString as ItemToString<T>,
    isItemDisabled = () => false,

    placeholder,
    emptyText = "No results",
    loadingText = "Loading...",

    getInputProps,
    renderItem,

    ...coreProps
  } = props;

  const core = useComboboxCore<T>({
    ...coreProps,
    multiple,
    itemToString,
    itemToKey,
  });

  const isItemSelected = useCallback(
    (item: T) =>
      core.multiple
        ? core.selectedItems.some((s) => itemToKey(s) === itemToKey(item))
        : core.selectedItem != null &&
          itemToKey(core.selectedItem) === itemToKey(item),
    [core.multiple, core.selectedItem, core.selectedItems, itemToKey],
  );

  const canSelectMore =
    !core.multiple ||
    typeof maxSelected !== "number" ||
    core.selectedItems.length < maxSelected;

  const removeItem = (item: T) => {
    if (!core.multiple) return;
    core.removeSelectedItem(item);
  };

  const removeLast = () => {
    if (!core.multiple) return;
    core.setSelectedItems((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    core.clearSelection();
    core.setInputValue("");
  };

  const getInputPropsMerged = (user: UseComboboxGetInputPropsOptions = {}) => {
    const base: UseComboboxGetInputPropsOptions = {
      ...user,
      onKeyDown: (e) => {
        if (
          core.multiple &&
          e.key === "Backspace" &&
          core.inputValue === "" &&
          core.selectedItems.length > 0
        ) {
          removeLast();
        }
        user.onKeyDown?.(e);
      },
    };

    return getInputProps ? getInputProps(base) : base;
  };

  // guard selecting when max reached (multi only)
  const getItemPropsGuarded = useMemo(() => {
    const orig = core.getItemProps;
    return (options: any) => {
      const item = options?.item as T | undefined;
      const disabledByLimit =
        core.multiple &&
        item != null &&
        !canSelectMore &&
        !isItemSelected(item);

      return orig({
        ...options,
        disabled: options.disabled || disabledByLimit,
        onClick: (e: any) => {
          if (
            disabledByLimit &&
            item != null &&
            typeof maxSelected === "number"
          ) {
            e.preventDefault();
            onMaxSelected?.(maxSelected, item);
            return;
          }
          options.onClick?.(e);
        },
      });
    };
  }, [core, canSelectMore, isItemSelected, maxSelected, onMaxSelected]);

  return {
    ...core,
    getItemProps: getItemPropsGuarded,

    maxSelected,
    placeholder,
    emptyText,
    loadingText,

    itemToKey,
    itemToString,
    isItemDisabled,

    renderItem,

    isItemSelected,
    canSelectMore,

    removeItem,
    removeLast,
    clearAll,

    getInputPropsMerged,
  };
}
