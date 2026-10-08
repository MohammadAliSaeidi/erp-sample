import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input"> & {
  endIcon?: React.ReactElement;
  startIcon?: React.ReactElement;
  containerClassName?: string
}

function Input(props: InputProps) {

  const {
    className,
    type,
    endIcon,
    startIcon,
    containerClassName,
    ...rest
  } = props
  
  return (
    <div className={cn("relative", containerClassName)}>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 file:text-foreground placeholder:text-muted-foreground h-8 w-full min-w-0 rounded-none border bg-transparent px-2.5 py-1 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1 md:text-xs",
          className,
          endIcon && "pe-6",
          startIcon && "ps-6",
        )}
        {...rest}
      />
      {endIcon && <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">{endIcon}</div>}
      {startIcon && <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center">{startIcon}</div>}
    </div>
  );
}

export { Input };
