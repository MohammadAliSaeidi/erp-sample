import { PropsWithChildren } from "react";
import { cn } from "@/features/shared/lib/utils";

export function TypographyH3({ children, className }: PropsWithChildren<{ className?: string }>) {
	return (
		<h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
			{children}
		</h3>
	);
}
