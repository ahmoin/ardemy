"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function NavUser({
	userProfile,
	signOutUrl,
	side,
	isSidebar,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: userProfile type has any in it
	userProfile: Record<string, any> | null;
	signOutUrl: string;
	side?: "top" | "bottom" | "left" | "right";
	isSidebar?: boolean;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{isSidebar ? (
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={userProfile?.raw_json.profile_image_url}
								alt={userProfile?.name}
							/>
							<AvatarFallback className="rounded-lg">
								{userProfile?.name.substring(0, 2).toUpperCase() || ""}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{userProfile?.name}</span>
							<span className="truncate text-xs">{userProfile?.email}</span>
						</div>
						<ChevronsUpDown className="ml-auto size-4" />
					</SidebarMenuButton>
				) : (
					<Button variant={"ghost"}>
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={userProfile?.raw_json.profile_image_url}
								alt={userProfile?.name}
							/>
							<AvatarFallback className="rounded-lg">
								{userProfile?.name.substring(0, 2).toUpperCase() || ""}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{userProfile?.name}</span>
							<span className="truncate text-xs">{userProfile?.email}</span>
						</div>
						<ChevronsUpDown className="ml-auto size-4" />
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				side={side}
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={userProfile?.raw_json.profile_image_url}
								alt={userProfile?.name}
							/>
							<AvatarFallback className="rounded-lg">
								{userProfile?.name.substring(0, 2).toUpperCase() || ""}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{userProfile?.name}</span>
							<span className="truncate text-xs">{userProfile?.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Sparkles />
						Upgrade to Pro
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheck />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Bell />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<LogOut />
					<Link href={signOutUrl}>Sign out</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
