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
	const [editorState, setEditorState] =
		useState<SerializedEditorState>(initialValue);

	console.log("editorState", editorState);
	return (
		<Editor
			editorSerializedState={editorState}
			onSerializedChange={(value) => setEditorState(value)}
			{...props}
		/>
	);
}
