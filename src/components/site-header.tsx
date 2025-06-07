import Link from "next/link";
import { GitHubLink } from "@/components/github-link";
import { Icons } from "@/components/icons";
import { ModeSwitcher } from "@/components/mode-switcher";
import { SiteConfig } from "@/components/site-config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";

export function SiteHeader() {
	return (
		<header className="bg-background sticky top-0 z-50 w-full">
			<div className="container-wrapper 3xl:fixed:px-0 px-6">
				<div className="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
					<Button
						asChild
						variant="ghost"
						size="icon"
						className="hidden size-8 lg:flex"
					>
						<Link href="/">
							<Icons.logo className="size-5" />
							<span className="sr-only">{siteConfig.name}</span>
						</Link>
					</Button>
					<div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
						<GitHubLink />
						<Separator orientation="vertical" className="3xl:flex hidden" />
						<SiteConfig className="3xl:flex hidden" />
						<Separator orientation="vertical" />
						<ModeSwitcher />
					</div>
				</div>
			</div>
		</header>
	);
}
