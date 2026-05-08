import { type MouseEvent, useCallback, useMemo } from "react";
import type {
  UseComboboxGetInputPropsOptions,
  UseComboboxGetItemPropsOptions,
} from "downshift";
import type {
  ComboboxValue,
  ComboboxAdapterProps,
  ComboboxAdapterReturn,
  DefaultItem,
} from "./combobox.adapter.types";
import { useComboboxCore } from "./combobox.core";

const defaultItemToKey = <T extends DefaultItem>(item: T) => item.id;
const defaultItemToString = <T extends DefaultItem>(item: T | null) =>
  item?.label ?? "";
const isItemKey = (value: unknown): value is string | number =>
  typeof value === "string" || typeof value === "number";

export function useComboboxAdapter<T>(
  props: ComboboxAdapterProps<T>,
): ComboboxAdapterReturn<T> {
  const {
    items: propsItems = [],
    value,
    onChange,
    multiple = false,
    valueKey,
    labelKey,
    maxSelected,
    onMaxSelected,

    itemToKey,
    itemToString,
    isItemDisabled = () => false,

    placeholder,
    emptyText = "No results",
    loadingText = "Loading...",

    getInputProps,
    renderItem,

    ...coreProps
  } = props;

  const itemToKeyResolved = useCallback(
    (item: T): string | number => {
      if (itemToKey) return itemToKey(item);
      if (valueKey != null) {
        const maybeKey = (item as Record<PropertyKey, unknown>)[valueKey];
        if (isItemKey(maybeKey)) return maybeKey;
      }
      return defaultItemToKey(item as DefaultItem);
    },
    [itemToKey, valueKey],
  );

  const itemToStringResolved = useCallback(
    (item: T | null): string => {
      if (itemToString) return itemToString(item);
      if (item == null) return "";
      if (labelKey != null) {
        const maybeLabel = (item as Record<PropertyKey, unknown>)[labelKey];
        if (typeof maybeLabel === "string") return maybeLabel;
        if (typeof maybeLabel === "number") return String(maybeLabel);
      }
      return defaultItemToString(item as unknown as DefaultItem | null);
    },
    [itemToString, labelKey],
  );

  const valueByKeyMode = valueKey != null;
  const findItemByKey = useCallback(
    (key: string | number): T | null =>
      propsItems.find((item) => itemToKeyResolved(item) === key) ?? null,
    [propsItems, itemToKeyResolved],
  );

  const coreValue = useMemo<T | T[] | null | undefined>(() => {
    if (!valueByKeyMode) return value as T | T[] | null | undefined;
    if (value == null) return null;

    if (Array.isArray(value)) {
      if (value.length === 0) return [];
      if (isItemKey(value[0])) {
        return (value as (string | number)[])
          .map((key) => findItemByKey(key))
          .filter((item): item is T => item != null);
      }
      return value as T[];
    }

    if (isItemKey(value)) return findItemByKey(value);
    return value as T;
  }, [valueByKeyMode, value, findItemByKey]);

  const handleCoreChange = useCallback(
    (next: T | T[] | null) => {
      if (!onChange) return;
      if (!valueByKeyMode) {
        onChange(next as ComboboxValue<T>);
        return;
      }

      if (Array.isArray(next)) {
        onChange(next.map((item) => itemToKeyResolved(item)));
        return;
      }

      onChange(next ? itemToKeyResolved(next) : null);
    },
    [onChange, valueByKeyMode, itemToKeyResolved],
  );

  const core = useComboboxCore<T>({
    ...coreProps,
    items: propsItems,
    value: coreValue,
    onChange: handleCoreChange,
    multiple,
    itemToString: itemToStringResolved,
    itemToKey: itemToKeyResolved,
  });

  const isItemSelected = useCallback(
    (item: T) =>
      core.multiple
        ? core.selectedItems.some(
            (s) => itemToKeyResolved(s) === itemToKeyResolved(item),
          )
        : core.selectedItem != null &&
          itemToKeyResolved(core.selectedItem) === itemToKeyResolved(item),
    [core.multiple, core.selectedItem, core.selectedItems, itemToKeyResolved],
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
    type GuardedItemOptions = UseComboboxGetItemPropsOptions<T> & {
      disabled?: boolean;
      onClick?: (e: MouseEvent<HTMLElement>) => void;
    };

    const guarded = ((options: unknown) => {
      const typedOptions = options as GuardedItemOptions;
      const item = typedOptions?.item as T | undefined;
      const disabledByLimit =
        core.multiple &&
        item != null &&
        !canSelectMore &&
        !isItemSelected(item);

      return orig({
        ...typedOptions,
        disabled: typedOptions.disabled || disabledByLimit,
        onClick: (e: MouseEvent<HTMLElement>) => {
          if (
            disabledByLimit &&
            item != null &&
            typeof maxSelected === "number"
          ) {
            e.preventDefault();
            onMaxSelected?.(maxSelected, item);
            return;
          }
          typedOptions.onClick?.(e);
        },
      } as GuardedItemOptions);
    }) as typeof core.getItemProps;

    return guarded;
  }, [core, canSelectMore, isItemSelected, maxSelected, onMaxSelected]);

  return {
    ...core,
    getItemProps: getItemPropsGuarded,

    maxSelected,
    placeholder,
    emptyText,
    loadingText,

    itemToKey: itemToKeyResolved,
    itemToString: itemToStringResolved,
    isItemDisabled,

    renderItem,

    isItemSelected,
    canSelectMore,

    removeItem,
    removeLast,
    clearAll,

    getInputPropsMerged,
  } as ComboboxAdapterReturn<T>;
}
