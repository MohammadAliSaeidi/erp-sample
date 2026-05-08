"use client";

import { createContext, useContext } from "react";
import type { ComboboxAdapterReturn } from "./combobox.adapter.types";

const ComboboxContext = createContext<ComboboxAdapterReturn<unknown> | null>(
  null,
);

function ComboboxProviderInner<T>({
  value,
  children,
}: {
  value: ComboboxAdapterReturn<T>;
  children: React.ReactNode;
}) {
  return (
    <ComboboxContext.Provider
      value={value as unknown as ComboboxAdapterReturn<unknown>}
    >
      {children}
    </ComboboxContext.Provider>
  );
}

export const ComboboxProvider = ComboboxProviderInner;

export function useComboboxContext<T>() {
  const ctx = useContext(ComboboxContext);
  if (!ctx)
    throw new Error("Combobox components must be used within <Combobox />");
  return ctx as unknown as ComboboxAdapterReturn<T>;
}
