"use client";

import { ChevronRight, SquareTerminal } from "lucide-react";
import type * as React from "react";
import { SidebarNavUser } from "@/components/sidebar-nav-user";
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

export async function AppSidebar({
	userProfile,
	signOutUrl,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	// biome-ignore lint/suspicious/noExplicitAny: userProfile type has any in it
	userProfile: Record<string, any> | null;
	signOutUrl: string;
}) {
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
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarNavUser
							userProfile={userProfile}
							signOutUrl={signOutUrl}
							isSidebar
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
