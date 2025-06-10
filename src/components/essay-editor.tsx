"use client";

import type {
	SerializedEditorState,
	SerializedLexicalNode,
	SerializedTextNode,
} from "lexical";
import { useEffect, useState } from "react";
import { Editor } from "@/components/blocks/editor-x/editor";

interface SerializedContainerNode extends SerializedLexicalNode {
	children: SerializedLexicalNode[];
	direction?: "ltr" | "rtl" | null;
	format?: string;
	indent?: number;
}

function isSerializedTextNode(
	node: SerializedLexicalNode,
): node is SerializedTextNode {
	return node.type === "text" && "text" in node; // Check for 'text' property existence
}

function isSerializedContainerNode(
	node: SerializedLexicalNode,
): node is SerializedContainerNode {
	return "children" in node && Array.isArray(node.children);
}

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

function extractTextFromEditorState(
	serializedEditorState: SerializedEditorState,
): string {
	const extractedText: string[] = [];

	function traverse(node: SerializedLexicalNode | undefined | null) {
		if (node && typeof node === "object") {
			if (isSerializedTextNode(node)) {
				extractedText.push(node.text);
			} else if (isSerializedContainerNode(node)) {
				node.children.forEach((child: SerializedLexicalNode) =>
					traverse(child),
				);
			}
		}
	}

	traverse(serializedEditorState?.root);

	return extractedText.join("\n");
}

export function EssayEditor({ ...props }) {
	const [serializedEditorState, setSerializedEditorState] =
		useState<SerializedEditorState>(initialValue);

	useEffect(() => {
		const text = extractTextFromEditorState(serializedEditorState);
		if (text) {
			fetch("https://ai.hackclub.com/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [{ role: "user", content: text }],
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("AI Completion:", data);
				})
				.catch((error) => {
					console.error("Error fetching AI completion:", error);
				});
		}
	}, [serializedEditorState]);
	return (
		<Editor
			editorSerializedState={serializedEditorState}
			onSerializedChange={(value) => setSerializedEditorState(value)}
			{...props}
		/>
	);
}
