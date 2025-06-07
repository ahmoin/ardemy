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

const title = "Build your Component Library";
const description =
	"A set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks. Open Source. Open Code.";

export const dynamic = "force-static";
export const revalidate = false;

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

export default function IndexPage() {
	return (
		<div className="flex flex-1 flex-col">
			<PageHeader>
				<Announcement />
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href="/sign-in">Get Started</Link>
					</Button>
					{/* <Button asChild size="sm" variant="ghost">
						<Link href="/blocks">Browse Blocks</Link>
					</Button> */}
				</PageActions>
			</PageHeader>
			{/* TODO: add index page illustration
			<div className="container-wrapper section-soft flex-1 pb-6">
				<div className="container overflow-hidden"></div>
			</div> */}
		</div>
	);
}
