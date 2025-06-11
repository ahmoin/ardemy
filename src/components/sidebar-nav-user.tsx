"use client";

import { NavUser } from "@/components/nav-user";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNavUser({
	userProfile,
	signOutUrl,
	isSidebar,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: userProfile type has any in it
	userProfile: Record<string, any> | null;
	signOutUrl: string;
	isSidebar?: boolean;
}) {
	const { isMobile } = useSidebar();

	return (
		<NavUser
			userProfile={userProfile}
			signOutUrl={signOutUrl}
			side={isMobile ? "bottom" : "right"}
			isSidebar={isSidebar}
		/>
	);
}
