"use client";
import { DirectionProvider } from "@/src/presentation/components/ui/direction";
import { TooltipProvider } from "@/src/presentation/components/ui/tooltip";
import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	ClientSideRowModelModule,
	RowSelectionModule,
} from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import type * as React from "react";

const modules = [RowSelectionModule, ClientSideRowModelModule];

export default function Providers({
	children,
	dir,
}: {
	children: React.ReactNode;
	dir: "ltr" | "rtl";
}) {
	const queryClient = getQueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<DirectionProvider dir={dir} direction={dir}>
				<TooltipProvider>
					<AgGridProvider modules={modules}>
						{children}
					</AgGridProvider>
				</TooltipProvider>
			</DirectionProvider>
			{process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
		</QueryClientProvider>
	);
}
