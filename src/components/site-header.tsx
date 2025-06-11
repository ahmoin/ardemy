import Link from "next/link";
import { getUserDetails } from "@/app/actions";
import { GitHubLink } from "@/components/github-link";
import { Icons } from "@/components/icons";
import { ModeSwitcher } from "@/components/mode-switcher";
import { NavUser } from "@/components/nav-user";
import { SiteConfig } from "@/components/site-config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";
import { stackServerApp } from "@/stack";

export async function SiteHeader() {
	const user = await stackServerApp.getUser();
	const app = stackServerApp.urls;
	const userProfile = await getUserDetails(user?.id);

	return (
		<header className="bg-background sticky top-0 z-50 w-full">
			<div className="container-wrapper 3xl:fixed:px-0 px-6">
				<div className="3xl:fixed:container flex justify-between h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
					<Button
						asChild
						variant="ghost"
						size="icon"
						className="hidden size-8 lg:flex"
					>
						<Link href={user ? "/dashboard" : "/"}>
							<Icons.logo className="size-5" />
							<span className="sr-only">{siteConfig.name}</span>
						</Link>
					</Button>
					<div className="flex flex-row items-center justify-between w-full sm:w-1/2 sm:justify-end">
						{user ? (
							<NavUser
								userProfile={userProfile}
								signOutUrl={app.signOut}
								isSidebar={false}
							/>
						) : (
							<div className="flex items-center gap-3">
								<Button asChild>
									<Link href={app.signUp}>Start your project</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href={app.signIn}>Sign In</Link>
								</Button>
							</div>
						)}
						<div className="sm:ml-4 flex items-center gap-2">
							<Separator orientation="vertical" className="lg:flex hidden" />
							<GitHubLink className="lg:flex hidden" />
							<Separator orientation="vertical" className="3xl:flex hidden" />
							<SiteConfig className="3xl:flex hidden" />
							<Separator orientation="vertical" />
							<ModeSwitcher />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
