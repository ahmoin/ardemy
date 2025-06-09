"use client";

import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/lib/config";

export function SidebarSiteButton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Button asChild variant="ghost" size="icon" className="size-8">
						<Link href="/">
							<Icons.logo className="size-5" />
							<span className="sr-only">{siteConfig.name}</span>
						</Link>
					</Button>
					<span>{siteConfig.name}</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
