import type { Metadata } from "next";
import { getUserDetails } from "@/app/actions";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { stackServerApp } from "@/stack";

// TODO: create custom metadata for essay page
const title = "Create a project.";
const description =
	"Choose from a variety of templates to kickstart your project. Whether it's an essay, resume, or math project, we have you covered.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: [
			{
				url: `/og?title=${encodeURIComponent(
					title,
				)}&description=${encodeURIComponent(description)}`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: [
			{
				url: `/og?title=${encodeURIComponent(
					title,
				)}&description=${encodeURIComponent(description)}`,
			},
		],
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await stackServerApp.getUser();
	const app = stackServerApp.urls;
	const userProfile = await getUserDetails(user?.id);

	return (
		<SidebarProvider>
			<AppSidebar userProfile={userProfile} signOutUrl={app.signOut} />
			<SidebarTrigger className="sm:hidden mt-12" />
			{children}
		</SidebarProvider>
	);
}
