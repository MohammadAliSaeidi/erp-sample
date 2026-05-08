export type ComboboxMode = "client" | "server";

export type FilterFn<T> = (items: T[], query: string) => T[];

export type SearchConfig<T> = {
  /** server-side search */
  mode: "server";
  onSearch: (query: string) => Promise<T[]>;
  debounceMs?: number;
  minChars?: number;
};

export type ClientSearchConfig<T> = {
  mode?: "client";
  filter?: FilterFn<T>;
};

export type ComboboxCoreProps<T> = {
  items?: T[]; // optional because in server mode items may be ignored

  value?: T | T[] | null;
  onChange?: (value: T | T[] | null) => void;

  multiple?: boolean;

  /** used for display + filtering */
  itemToString?: (item: T | null) => string;

  /** equality by key or comparator (optional) */
  itemToKey?: (item: T) => string | number;
  isItemEqual?: (a: T, b: T) => boolean;

  /** input behavior */
  initialInputValue?: string;
  clearInputOnSelect?: boolean;
  openOnFocus?: boolean;

  /** search behavior */
  search?: SearchConfig<T> | ClientSearchConfig<T>;
};

export type ComboboxCoreReturn<T> = {
  // state
  items: T[];
  inputValue: string;
  setInputValue: (v: string) => void;

  isOpen: boolean;
  highlightedIndex: number;

  // selection
  multiple: boolean;
  selectedItem: T | null;
  selectedItems: T[];
  setSelectedItems: (updater: (prev: T[]) => T[]) => void;

  addSelectedItem: (item: T) => void;
  removeSelectedItem: (item: T) => void;
  clearSelection: () => void;

  // downshift api
  getInputProps: import("downshift").UseComboboxReturnValue<T>["getInputProps"];
  getMenuProps: import("downshift").UseComboboxReturnValue<T>["getMenuProps"];
  getItemProps: import("downshift").UseComboboxReturnValue<T>["getItemProps"];
  getToggleButtonProps: import("downshift").UseComboboxReturnValue<T>["getToggleButtonProps"];

  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  // status
  isLoading: boolean;
  error: string | null;

  // config passthrough
  openOnFocus: boolean;
};
