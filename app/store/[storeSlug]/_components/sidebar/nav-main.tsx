"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export type NavMainItem = {
	title: string;
	url: string;
	icon: ReactNode;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
		icon: ReactNode;
	}[];
};

export type NavMainProps = {
	items: NavMainItem[];
};

export function NavMain(props: NavMainProps) {
	const { items } = props;

	return (
		<SidebarMenu>
			{items.map((item) => (
				<Collapsible key={item.title} asChild defaultOpen={item.isActive}>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip={item.title}>
							<Link href={item.url}>
								{item.icon}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
						{item.items?.length ? (
							<>
								<CollapsibleTrigger asChild>
									<SidebarMenuAction className="data-[state=open]:rotate-90">
										<ChevronRightIcon />
										<span className="sr-only">Toggle</span>
									</SidebarMenuAction>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton asChild>
													<Link href={subItem.url}>
														<span>{subItem.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</>
						) : null}
					</SidebarMenuItem>
				</Collapsible>
			))}
		</SidebarMenu>
	);
}
