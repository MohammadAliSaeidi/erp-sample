"use client";

import type { ReactNode } from "react";
import { useComboboxAdapter } from "./use-combobox-adapter";
import { ComboboxProvider } from "./combobox.context";
import type { ComboboxAdapterProps } from "./combobox.adapter.types";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

type Props<T> = ComboboxAdapterProps<T> & {
  children: ReactNode; // usually <ComboboxTrigger />
  menu: ReactNode; // usually <ComboboxList />
  className?: string;
  contentClassName?: string;
};

export function Combobox<T>(props: Props<T>) {
  const { children, menu, className, contentClassName, ...adapterProps } =
    props;
  const cb = useComboboxAdapter<T>(adapterProps);
  const menuProps = cb.getMenuProps({}, { suppressRefError: true });

  return (
    <ComboboxProvider value={cb}>
      <Popover
        open={cb.isOpen}
        onOpenChange={(open) => {
          if (open) {
            cb.setInputValue("");
            cb.openMenu();
          } else {
            cb.closeMenu();
          }
        }}
      >
        <PopoverAnchor className={className}>{children}</PopoverAnchor>

        <PopoverContent
          {...menuProps}
          align="start"
          sideOffset={6}
          className={contentClassName}
          onMouseDown={(e) => e.preventDefault()} // keep input focus
        >
          {menu}
        </PopoverContent>
      </Popover>
    </ComboboxProvider>
  );
}
