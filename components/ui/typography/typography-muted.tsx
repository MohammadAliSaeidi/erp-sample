import { PropsWithChildren } from "react";

export function TypographyMuted({ children }: PropsWithChildren) {
	return <div className="text-lg font-semibold">{children}</div>;
}
