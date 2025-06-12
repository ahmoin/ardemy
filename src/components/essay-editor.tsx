"use client";

import type { SerializedEditorState } from "lexical";
import { useState } from "react";
import { Editor } from "@/components/blocks/editor-x/editor";

export const initialValue = {
	root: {
		children: [
			{
				children: [
					{
						detail: 0,
						format: 0,
						mode: "normal",
						style: "",
						text: "",
						type: "text",
						version: 1,
					},
				],
				direction: "ltr",
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1,
			},
		],
		direction: "ltr",
		format: "",
		indent: 0,
		type: "root",
		version: 1,
	},
} as unknown as SerializedEditorState;

export function EssayEditor({ ...props }) {
	const [serializedEditorState, setSerializedEditorState] =
		useState<SerializedEditorState>(initialValue);

	return (
		<Editor
			editorSerializedState={serializedEditorState}
			onSerializedChange={(value) => setSerializedEditorState(value)}
			{...props}
		/>
	);
}
