import Link from "next/link";
import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function GitHubLink() {
	return (
		<Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
			<Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
				<Icons.gitHub />
				<React.Suspense fallback={<Skeleton className="h-4 w-8" />}>
					<StarsCount />
				</React.Suspense>
			</Link>
		</Button>
	);
}

// TODO: remove/change this once 1 star is reached
export async function StarsCount() {
	const data = await fetch("https://api.github.com/repos/ahmoin/ardemy", {
		next: { revalidate: 86400 },
	});
	const json = await data.json();

	return (
		<span
			className={cn(
				"text-muted-foreground text-xs tabular-nums w-8",
				json.stargazers_count === 0 ? "sm:w-40 text-yellow-400" : "",
			)}
		>
			{json.stargazers_count >= 1000
				? `${(json.stargazers_count / 1000).toFixed(1)}k`
				: json.stargazers_count.toLocaleString()}{" "}
			{json.stargazers_count === 0 ? (
				<span className="font-serif italic hidden sm:inline">
					–Become the first stargazer
				</span>
			) : null}
		</span>
	);
}
