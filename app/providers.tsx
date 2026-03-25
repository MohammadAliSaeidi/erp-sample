"use client";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getQueryClient } from "@/features/shared/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	ClientSideRowModelModule,
	RowSelectionModule,
} from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import type * as React from "react";

const modules = [RowSelectionModule, ClientSideRowModelModule];

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<DirectionProvider dir="rtl" direction="rtl">
				<TooltipProvider>
					<AgGridProvider modules={modules}>
						{children}
					</AgGridProvider>
				</TooltipProvider>
			</DirectionProvider>
			{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
		</QueryClientProvider>
	);
}
