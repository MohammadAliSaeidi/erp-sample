import { PropsWithChildren } from "react";

export function TypographySmall({ children }: PropsWithChildren) {
	<small className="text-sm leading-none font-medium">{children}</small>;
}
