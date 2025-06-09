import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

// TODO: create custom metadata for root page
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<SiteHeader />
			{children}
		</div>
	);
}
