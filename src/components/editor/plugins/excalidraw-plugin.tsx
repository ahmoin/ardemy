"use client";

import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement } from "@lexical/utils";
import {
	$createParagraphNode,
	$insertNodes,
	$isRootOrShadowRoot,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	type LexicalCommand,
} from "lexical";
import { type JSX, useEffect, useState } from "react";

import type { ExcalidrawInitialElements } from "@/components/editor/editor-ui/excalidraw-modal";
import { ExcalidrawModal } from "@/components/editor/editor-ui/excalidraw-modal";
import {
	$createExcalidrawNode,
	ExcalidrawNode,
} from "@/components/editor/nodes/excalidraw-node";

export const INSERT_EXCALIDRAW_COMMAND: LexicalCommand<void> = createCommand(
	"INSERT_EXCALIDRAW_COMMAND",
);

export function ExcalidrawPlugin(): JSX.Element | null {
	const [editor] = useLexicalComposerContext();
	const [isModalOpen, setModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (!editor.hasNodes([ExcalidrawNode])) {
			throw new Error(
				"ExcalidrawPlugin: ExcalidrawNode not registered on editor",
			);
		}

		return editor.registerCommand(
			INSERT_EXCALIDRAW_COMMAND,
			() => {
				setModalOpen(true);
				return true;
			},
			COMMAND_PRIORITY_EDITOR,
		);
	}, [editor]);

	const onClose = () => {
		setModalOpen(false);
	};

	const onDelete = () => {
		setModalOpen(false);
	};

	const onSave = (
		elements: ExcalidrawInitialElements,
		appState: Partial<AppState>,
		files: BinaryFiles,
	) => {
		editor.update(() => {
			const excalidrawNode = $createExcalidrawNode();
			excalidrawNode.setData(
				JSON.stringify({
					appState,
					elements,
					files,
				}),
			);
			$insertNodes([excalidrawNode]);
			if ($isRootOrShadowRoot(excalidrawNode.getParentOrThrow())) {
				$wrapNodeInElement(excalidrawNode, $createParagraphNode).selectEnd();
			}
		});
		setModalOpen(false);
	};
	return (
		<ExcalidrawModal
			initialElements={[]}
			initialAppState={{} as AppState}
			initialFiles={{}}
			isShown={isModalOpen}
			onDelete={onDelete}
			onClose={onClose}
			onSave={onSave}
			closeOnClickOutside={false}
		/>
	);
}
