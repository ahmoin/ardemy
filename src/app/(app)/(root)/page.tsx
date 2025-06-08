import type { Metadata } from "next";
import Link from "next/link";

import { Announcement } from "@/components/announcement";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { stackServerApp } from "@/stack";

const title = "Streamline your AI-Powered Writing";
const description =
	"Tell more engaging stories and write more genuine essays. Use Ardemy's easy-to-use toolkit to transform your writing.";

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

export default async function IndexPage() {
	const user = await stackServerApp.getUser();
	const app = stackServerApp.urls;

	return (
		<div className="flex flex-1 flex-col -mb-4">
			<PageHeader>
				<Announcement />
				<PageHeaderHeading>
					Streamline your
					<br />
					AI-Powered Writing
				</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<PageActions>
					<Button asChild size="lg">
						<Link href={user ? "/dashboard" : app.signUp}>
							Start your project
						</Link>
					</Button>
					{user ? null : (
						<Button asChild size="lg" variant="outline">
							<Link href={app.signIn}>Sign In</Link>
						</Button>
					)}
				</PageActions>
			</PageHeader>
			{/* TODO: add index page illustration
			<div className="container-wrapper section-soft flex-1 pb-6">
				<div className="container overflow-hidden"></div>
			</div> */}
		</div>
	);
}
