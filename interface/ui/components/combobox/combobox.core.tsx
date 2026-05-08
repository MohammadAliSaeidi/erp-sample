import { useCombobox } from "downshift";

import type {
  UseComboboxGetInputPropsOptions,
  UseComboboxState,
  UseComboboxStateChangeOptions,
} from "downshift";

import { FocusEvent, useEffect, useMemo, useRef, useState } from "react";
import type {
  ComboboxCoreProps,
  ComboboxMode,
  SearchConfig,
} from "./combobox.types";
import {
  createDefaultFilter,
  defaultItemToString,
  isEqual,
  useControlledState,
  useDebouncedValue,
} from "./combobox.utils";
import { scheduleMicrotask } from "@/lib/schedule.microtask";

export function useComboboxCore<T>(props: ComboboxCoreProps<T>) {
  const {
    items: propsItems = [],
    value,
    onChange,
    multiple = false,
    itemToString = defaultItemToString,
    itemToKey,
    isItemEqual,
    search,
    initialInputValue = "",
    clearInputOnSelect = multiple,
    openOnFocus = true,
  } = props;

  const mode: ComboboxMode = search?.mode ?? "client";
  const filter =
    search?.mode === "client"
      ? (search?.filter ?? createDefaultFilter(itemToString))
      : createDefaultFilter(itemToString);

  const debounceMs = (search as SearchConfig<T>)?.debounceMs ?? 0;
  const minChars = (search as SearchConfig<T>)?.minChars ?? 0;

  // -----------------------------
  // Input state
  // -----------------------------
  const [inputValue, setInputValue] = useState(initialInputValue);
  const debouncedInput = useDebouncedValue(inputValue, debounceMs);

  // -----------------------------
  // Selected state (single vs multi)
  // -----------------------------
  const [selectedItem, setSelectedItem, isSingleControlled] =
    useControlledState<T | null>(
      !multiple ? (value as T | null | undefined) : undefined,
      null,
    );

  const [selectedItems, _setSelectedItems, isMultiControlled] =
    useControlledState<T[]>(
      multiple ? ((value as T[] | undefined) ?? []) : undefined,
      [],
    );

  // expose setSelectedItems always (for adapter)
  const setSelectedItems = (updater: (prev: T[]) => T[]) => {
    if (!multiple) return;
    const next = updater(selectedItems);
    if (!isMultiControlled) _setSelectedItems(next);
    onChange?.(next);
  };

  // -----------------------------
  // Server search state
  // -----------------------------
  const [serverItems, setServerItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (mode !== "server") return;

    const cfg = search as SearchConfig<T>;
    if (!cfg?.onSearch) return;

    const query = debouncedInput ?? "";
    if (query.length < minChars) {
      scheduleMicrotask(() => {
        setServerItems([]);
        setIsLoading(false);
        setError(null);
      });
      return;
    }

    const reqId = ++requestIdRef.current;
    scheduleMicrotask(() => {
      setIsLoading(true);
      setError(null);
    });

    cfg
      .onSearch(query)
      .then((result: T[]) => {
        if (reqId !== requestIdRef.current) return;
        setServerItems(result ?? []);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (reqId !== requestIdRef.current) return;
        setError(e instanceof Error ? e.message : "Search failed");
        setIsLoading(false);
      });
  }, [mode, search, debouncedInput, minChars]);

  // -----------------------------
  // Visible items
  // -----------------------------
  const baseItems = useMemo(() => {
    return mode === "server" ? serverItems : propsItems;
  }, [mode, serverItems, propsItems]);

  const visibleItems = useMemo(() => {
    if (mode === "server") return baseItems;
    return filter(baseItems, inputValue);
  }, [mode, baseItems, filter, inputValue]);

  // -----------------------------
  // Selection helpers
  // -----------------------------
  const addSelectedItem = (item: T) => {
    if (!multiple) return;
    const exists = selectedItems.some((x) =>
      isEqual(x, item, { isItemEqual, itemToKey }),
    );
    if (exists) return;

    const next = [...selectedItems, item];
    if (!isMultiControlled) _setSelectedItems(next);
    onChange?.(next);
  };

  const removeSelectedItem = (item: T) => {
    if (!multiple) return;
    const next = selectedItems.filter(
      (x) => !isEqual(x, item, { isItemEqual, itemToKey }),
    );
    if (!isMultiControlled) _setSelectedItems(next);
    onChange?.(next);
  };

  const clearSelection = () => {
    if (multiple) {
      if (!isMultiControlled) _setSelectedItems([]);
      onChange?.([]);
    } else {
      if (!isSingleControlled) setSelectedItem(null);
      onChange?.(null);
    }
  };

  // -----------------------------
  // Downshift combobox
  // -----------------------------
  const combobox = useCombobox<T>({
    items: visibleItems,
    itemToString,
    inputValue,
    selectedItem: multiple ? null : selectedItem,
    onInputValueChange: ({ inputValue, type }) => {
      if (
        type === useCombobox.stateChangeTypes.InputKeyDownEnter ||
        type === useCombobox.stateChangeTypes.ItemClick ||
        type === useCombobox.stateChangeTypes.FunctionSelectItem ||
        type === useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem
      ) {
        return;
      }
      setInputValue(inputValue ?? "");
    },
    onSelectedItemChange: ({ selectedItem: next }) => {
      if (!next) return;

      if (multiple) {
        addSelectedItem(next);
        if (clearInputOnSelect) setInputValue("");
      } else {
        if (!isSingleControlled) setSelectedItem(next);
        onChange?.(next);
        if (clearInputOnSelect) setInputValue(itemToString(next));
      }
    },
    stateReducer: (
      state: UseComboboxState<T>,
      actionAndChanges: UseComboboxStateChangeOptions<T>,
    ) => {
      const { changes, type } = actionAndChanges;
      if (!multiple) return changes;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true,
            inputValue: clearInputOnSelect ? "" : state.inputValue,
          };
        default:
          return changes;
      }
    },
  });

  const getInputProps = combobox.getInputProps;

  const getInputPropsWithFocus = (
    userProps: UseComboboxGetInputPropsOptions = {},
  ) =>
    getInputProps({
      ...userProps,
      onFocus: (e: FocusEvent<HTMLInputElement>) => {
        if (openOnFocus) combobox.openMenu();
        userProps.onFocus?.(e);
      },
    });

  return {
    // state
    items: visibleItems,
    inputValue,
    setInputValue,

    isOpen: combobox.isOpen,
    highlightedIndex: combobox.highlightedIndex ?? -1,

    // selection
    multiple,
    selectedItem: multiple ? null : selectedItem,
    selectedItems: multiple ? selectedItems : [],
    setSelectedItems,

    addSelectedItem,
    removeSelectedItem,
    clearSelection,

    // downshift
    getInputProps: getInputPropsWithFocus,
    getMenuProps: combobox.getMenuProps,
    getItemProps: combobox.getItemProps,
    getToggleButtonProps: combobox.getToggleButtonProps,

    openMenu: combobox.openMenu,
    closeMenu: combobox.closeMenu,
    toggleMenu: combobox.toggleMenu,

    // status
    isLoading,
    error,

    openOnFocus,
  };
}
