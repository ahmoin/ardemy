import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isAtNodeEnd } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import type { BaseSelection, NodeKey } from "lexical";
import {
	$createTextNode,
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	$isTextNode,
	$setSelection,
	COMMAND_PRIORITY_LOW,
	KEY_ARROW_RIGHT_COMMAND,
	KEY_TAB_COMMAND,
} from "lexical";
import { type JSX, useCallback, useEffect, useRef } from "react";
import { getAICompletion } from "@/app/actions";
import { useSharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context";
import { useDebounce } from "@/components/editor/editor-hooks/use-debounce";
import {
	$createAutocompleteNode,
	AutocompleteNode,
} from "@/components/editor/nodes/autocomplete-node";
import { addSwipeRightListener } from "@/components/editor/utils/swipe";

type SearchPromise = {
	dismiss: () => void;
	promise: Promise<null | string>;
};

export const uuid = Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, "")
	.substr(0, 5);

function $search(selection: null | BaseSelection): [boolean, string] {
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

function useAIQuery(): (searchText: string) => SearchPromise {
	return useCallback((searchText: string) => {
		let isDismissed = false;
		const dismiss = () => {
			isDismissed = true;
		};

		const promiseFn = async (searchText: string): Promise<string | null> => {
			if (!searchText) {
				return null;
			}
			try {
				const completion = await getAICompletion(
					searchText,
					localStorage.getItem("geminiKey"),
				);
				if (!isDismissed) {
					return completion;
				}
				return null;
			} catch (error) {
				console.error("Error fetching AI completion:", error);
				return null;
			}
		};

		return {
			dismiss,
			promise: promiseFn(searchText),
		};
	}, []);
}

export function AIAutocompletePlugin(): JSX.Element | null {
	const [editor] = useLexicalComposerContext();
	const [, setSuggestion] = useSharedAutocompleteContext();
	const query = useAIQuery();

	const handleUpdate = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			const [hasMatch, match] = $search(selection);
			if (!hasMatch) {
				$clearSuggestionRef.current();
				return;
			}
			if (match === lastMatchRef.current) {
				return;
			}
			$clearSuggestionRef.current();
			searchPromiseRef.current = query(match);
			searchPromiseRef.current.promise
				.then((newSuggestion) => {
					if (searchPromiseRef.current !== null) {
						updateAsyncSuggestion(searchPromiseRef.current, newSuggestion);
					}
				})
				.catch((_e) => {
					// console.error(e)
				});
			lastMatchRef.current = match;
		});
	}, [editor, query]);

	const debouncedHandleUpdate = useDebounce(handleUpdate, 200);

	const lastMatchRef = useRef<string | null>(null);
	const searchPromiseRef = useRef<SearchPromise | null>(null);
	const autocompleteNodeKeyRef = useRef<NodeKey | null>(null);
	const lastSuggestionRef = useRef<string | null>(null);

	const $clearSuggestionRef = useRef(() => {
		const autocompleteNode =
			autocompleteNodeKeyRef.current !== null
				? $getNodeByKey(autocompleteNodeKeyRef.current)
				: null;
		if (autocompleteNode?.isAttached()) {
			autocompleteNode.remove();
			autocompleteNodeKeyRef.current = null;
		}
		if (searchPromiseRef.current !== null) {
			searchPromiseRef.current.dismiss();
			searchPromiseRef.current = null;
		}
		lastMatchRef.current = null;
		lastSuggestionRef.current = null;
		setSuggestion(null);
	});

	function updateAsyncSuggestion(
		refSearchPromise: SearchPromise,
		newSuggestion: null | string,
	) {
		if (
			searchPromiseRef.current !== refSearchPromise ||
			newSuggestion === null ||
			newSuggestion.trim() === ""
		) {
			return;
		}
		editor.update(
			() => {
				const selection = $getSelection();
				const [hasMatch, match] = $search(selection);
				if (
					!hasMatch ||
					match !== lastMatchRef.current ||
					!$isRangeSelection(selection)
				) {
					return;
				}
				const selectionCopy = selection.clone();
				const node = $createAutocompleteNode(uuid);
				autocompleteNodeKeyRef.current = node.getKey();
				selection.insertNodes([node]);
				$setSelection(selectionCopy);
				const currentText = selection.getTextContent();
				const lastChar = currentText[currentText.length - 1];
				if ([".", "?", "!"].includes(lastChar)) {
					newSuggestion = ` ${newSuggestion}`;
				}
				lastSuggestionRef.current = newSuggestion;
				setSuggestion(newSuggestion);
			},
			{ tag: "history-merge" },
		);
	}

	function $handleAutocompleteNodeTransform(node: AutocompleteNode) {
		const key = node.getKey();
		if (node.__uuid === uuid && key !== autocompleteNodeKeyRef.current) {
			$clearSuggestionRef.current();
		}
	}

	function $handleAutocompleteIntent(): boolean {
		if (
			lastSuggestionRef.current === null ||
			autocompleteNodeKeyRef.current === null
		) {
			return false;
		}
		const autocompleteNode = $getNodeByKey(autocompleteNodeKeyRef.current);
		if (autocompleteNode === null) {
			return false;
		}
		const textNode = $createTextNode(lastSuggestionRef.current);
		autocompleteNode.replace(textNode);
		textNode.selectNext();
		$clearSuggestionRef.current();
		return true;
	}

	function $handleKeypressCommand(e: Event) {
		if ($handleAutocompleteIntent()) {
			e.preventDefault();
			return true;
		}
		return false;
	}

	function handleSwipeRight(_force: number, e: TouchEvent) {
		editor.update(() => {
			if ($handleAutocompleteIntent()) {
				e.preventDefault();
			}
		});
	}

	function unmountSuggestion() {
		editor.update(() => {
			$clearSuggestionRef.current();
		});
	}

	const rootElem = editor.getRootElement();

	useEffect(() => {
		const unmount = mergeRegister(
			editor.registerNodeTransform(
				AutocompleteNode,
				$handleAutocompleteNodeTransform,
			),
			editor.registerUpdateListener(debouncedHandleUpdate),
			editor.registerCommand(
				KEY_TAB_COMMAND,
				$handleKeypressCommand,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				KEY_ARROW_RIGHT_COMMAND,
				$handleKeypressCommand,
				COMMAND_PRIORITY_LOW,
			),
			...(rootElem !== null
				? [addSwipeRightListener(rootElem, handleSwipeRight)]
				: []),
			() => unmountSuggestion(),
		);

		return () => {
			unmount();
			unmountSuggestion();
		};
	}, [editor, debouncedHandleUpdate, rootElem]);

	return null;
}
