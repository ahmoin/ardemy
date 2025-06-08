import { ProjectTemplates } from "@/components/project-templates";

export const dynamic = "force-static";
export const revalidate = false;

export default function DashboardPage() {
	return (
		<div className="@container/page flex flex-1 flex-col gap-8 p-6">
			<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
				Start a new project
			</h1>
			<ProjectTemplates />
		</div>
	);
}
