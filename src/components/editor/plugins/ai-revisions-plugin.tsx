import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isAtNodeEnd } from "@lexical/selection";
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { useCallback, useEffect, useRef } from "react";
import { getAIRevisions } from "@/app/actions";
import { useDebounce } from "@/components/editor/editor-hooks/use-debounce";

function $search(): [boolean, string] {
	const selection = $getSelection();
	if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
		return [false, ""];
	}
	const node = selection.getNodes()[0];
	const anchor = selection.anchor;
	if (!$isTextNode(node) || !node.isSimpleText() || !$isAtNodeEnd(anchor)) {
		return [false, ""];
	}
	const text = node.getTextContent();

	if (text.length === 0) {
		return [false, ""];
	}

	return [true, text];
}

export function AIRevisionsPlugin() {
	const [editor] = useLexicalComposerContext();
	const lastTextContent = useRef<string | null>(null);

	const handleUpdate = useCallback(() => {
		editor.update(() => {
			const [hasMatch, textContent] = $search();
			if (!hasMatch) {
				return;
			}

			if (textContent === lastTextContent.current) {
				return;
			}

			getAIRevisions(textContent, localStorage.getItem("geminiKey"))
				.then((revision) => {
					console.log("AI Revisions:", revision);
				})
				.catch((error) => {
					console.error("Error getting AI revisions:", error);
				});

			lastTextContent.current = textContent;
		});
	}, [editor]);

	const debouncedHandleUpdate = useDebounce(handleUpdate, 500);

	useEffect(() => {
		return editor.registerUpdateListener(debouncedHandleUpdate);
	}, [editor, debouncedHandleUpdate]);

	return null;
}
