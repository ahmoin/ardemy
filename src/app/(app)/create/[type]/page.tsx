import { notFound, redirect } from "next/navigation";
import { createProject } from "@/app/actions";
import { stackServerApp } from "@/stack";

interface CreatePageProps {
	params: Promise<{
		type: string;
	}>;
}

const projectTypes = [
	"essay",
	"resume",
	"math",
	"slides",
	"whiteboard",
	"cheatsheet",
] as const;
type ProjectType = (typeof projectTypes)[number];

export async function generateStaticParams() {
	return projectTypes.map((type) => ({
		type,
	}));
}

export default async function CreatePage({ params }: CreatePageProps) {
	const { type } = await params;

	if (!projectTypes.includes(type as ProjectType)) {
		return notFound();
	}

	const projectType = type as ProjectType;

	const user = await stackServerApp.getUser();
	const projectUrl = await createProject(user?.id, projectType);

	return redirect(projectUrl);
}
