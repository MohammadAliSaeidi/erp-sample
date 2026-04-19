import { PropsWithChildren } from "react";

export function TypographyBlackQuote({ children }: PropsWithChildren) {
	return (
		<blockquote className="mt-6 border-s-2 ps-6 italic">
			{children}
		</blockquote>
	);
}
