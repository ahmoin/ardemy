"use client";

import { ChevronRight, SquareTerminal } from "lucide-react";
import type * as React from "react";
import { SidebarSiteButton } from "@/components/sidebar-site-button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarSiteButton />
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarMenu>
						<Collapsible
							asChild
							defaultOpen={true}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={"AI Features"}>
										<SquareTerminal />
										<span>AI Features</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{/* {item.items?.map((subItem) => ( */}
										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												{/* <a href="#"> */}
												<span>Work in Progress</span>
												{/* </a> */}
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										{/* ))} */}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>Footer</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
