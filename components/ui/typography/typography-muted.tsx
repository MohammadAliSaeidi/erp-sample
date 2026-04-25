import { PropsWithChildren } from "react";

export function TypographyMuted({ children }: PropsWithChildren) {
	return <div className="text-lg text-muted-foreground font-semibold">{children}</div>;
}
