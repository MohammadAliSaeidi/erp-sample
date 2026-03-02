"use client";
import { DirectionProvider } from "@/components/ui/direction";
import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type * as React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<DirectionProvider dir="rtl" direction="rtl">
				{children}
			</DirectionProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}
