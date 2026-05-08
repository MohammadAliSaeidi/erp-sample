import type { ReactNode } from "react";
import type { UseComboboxGetInputPropsOptions } from "downshift";
import type { ComboboxCoreProps, ComboboxCoreReturn } from "./combobox.types";

export type ItemKey = string | number;

export type DefaultItem = {
  id: ItemKey;
  label: string;
  disabled?: boolean;
  meta?: unknown;
};

export type ItemToKey<T> = (item: T) => ItemKey;
export type ItemToString<T> = (item: T | null) => string;

export type ComboboxAdapterProps<T> = ComboboxCoreProps<T> & {
  maxSelected?: number;
  onMaxSelected?: (limit: number, item: T) => void;

  itemToKey?: ItemToKey<T>;
  itemToString?: ItemToString<T>;
  isItemDisabled?: (item: T) => boolean;

  placeholder?: string;
  emptyText?: string;
  loadingText?: string;

  renderItem?: (
    item: T,
    state: { isSelected: boolean; isHighlighted: boolean; isDisabled: boolean }
  ) => ReactNode;

  /** allow user to extend/override input props */
  getInputProps?: (
    base: UseComboboxGetInputPropsOptions
  ) => UseComboboxGetInputPropsOptions;
};

export type ComboboxAdapterReturn<T> = ComboboxCoreReturn<T> & {
  maxSelected?: number;
  placeholder?: string;
  emptyText: string;
  loadingText: string;

  itemToKey: ItemToKey<T>;
  itemToString: ItemToString<T>;
  isItemDisabled: (item: T) => boolean;

  renderItem?: ComboboxAdapterProps<T>["renderItem"];

  isItemSelected: (item: T) => boolean;
  canSelectMore: boolean;

  removeItem: (item: T) => void;
  removeLast: () => void;
  clearAll: () => void;

  getInputPropsMerged: (
    user?: UseComboboxGetInputPropsOptions
  ) => UseComboboxGetInputPropsOptions;
};
