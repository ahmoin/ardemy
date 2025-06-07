import Image from "next/image";
import Link from "next/link";
import { getUserDetails } from "@/app/actions";
import { GitHubLink } from "@/components/github-link";
import { ModeSwitcher } from "@/components/mode-switcher";
import { SiteConfig } from "@/components/site-config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { stackServerApp } from "@/stack";

export async function SiteHeader() {
	const user = await stackServerApp.getUser();
	const app = stackServerApp.urls;
	const userProfile = await getUserDetails(user?.id);

	return (
		<header className="bg-background sticky top-0 z-50 w-full">
			<div className="container-wrapper 3xl:fixed:px-0 px-6">
				<div className="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
					{/* <Button
						asChild
						variant="ghost"
						size="icon"
						className="hidden size-8 lg:flex"
					>
						<Link href="/">
							<Icons.logo className="size-5" />
							<span className="sr-only">{siteConfig.name}</span>
						</Link>
					</Button> */}
					{user ? (
						<div className="flex items-center gap-4">
							<span className="inline-flex h-8 items-end flex-col">
								{userProfile?.name && (
									<span className="text-[14px] text-gray-600 dark:text-gray-300">
										{`Hello, ${userProfile?.name.split(" ")[0]}`}
									</span>
								)}
								<Link
									href={app.signOut}
									className="bg-gray-50 px-1 underline text-[11px]  hover:no-underline"
								>
									Sign Out
								</Link>
							</span>
							{userProfile?.raw_json.profile_image_url && (
								<Image
									src={userProfile?.raw_json.profile_image_url}
									alt="User avatar"
									width={32}
									height={32}
									className="rounded-full"
								/>
							)}
						</div>
					) : (
						<div className="flex items-center gap-3">
							<Button asChild>
								<Link href={app.signIn}>Log In</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link href={app.signUp}>Sign Up</Link>
							</Button>
						</div>
					)}
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
