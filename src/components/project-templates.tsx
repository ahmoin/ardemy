"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ProjectTemplates({
	className,
	...props
}: React.ComponentProps<"h1">) {
	const router = useRouter();

	return (
		<div
			className={cn("flex flex-row items-center justify-evenly", className)}
			{...props}
		>
			<Card>
				<CardHeader>
					<CardTitle>Essay</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button
						className="w-full"
						onClick={() => {
							router.push("/create/essay");
						}}
					>
						Create project
					</Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Resume</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button
						className="w-full"
						onClick={() => {
							router.push("/create/resume");
						}}
					>
						Create project
					</Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Math Project</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button
						className="w-full"
						onClick={() => {
							router.push("/create/math");
						}}
					>
						Create project
					</Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Whiteboard</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button
						className="w-full"
						onClick={() => {
							router.push("/create/whiteboard");
						}}
					>
						Create project
					</Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Slides</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button
						className="w-full"
						onClick={() => {
							router.push("/create/slides");
						}}
					>
						Create project
					</Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Cheatsheet</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button
						className="w-full"
						onClick={() => {
							router.push("/create/cheatsheet");
						}}
					>
						Create project
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
