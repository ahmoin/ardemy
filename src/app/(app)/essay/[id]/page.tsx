import { getProjectFromDatabase } from "@/app/actions";
import { EssayEditor } from "@/components/essay-editor";
import { stackServerApp } from "@/stack";

interface EssayPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EssayPage({ params }: EssayPageProps) {
	const { id } = await params;

	const user = await stackServerApp.getUser();

	const essayData = await getProjectFromDatabase(id, user?.id);

	if (!essayData) {
		return <div>Essay not found.</div>;
	}

	return (
		<div className="@container/page flex flex-1 flex-col gap-8 p-6">
			<h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				Essay
			</h1>
			<EssayEditor />
		</div>
	);
}
