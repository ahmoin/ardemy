"use client";

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
import { debounce } from "lodash-es";
import { type JSX, useCallback, useEffect } from "react";
import { getAICompletion } from "@/app/actions";
import { useSharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context";
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
				const completion = await getAICompletion(searchText);
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

	useEffect(() => {
		let autocompleteNodeKey: null | NodeKey = null;
		let lastMatch: null | string = null;
		let lastSuggestion: null | string = null;
		let searchPromise: null | SearchPromise = null;

		function $clearSuggestion(reason: string) {
			console.log("cleared suggestion", reason);
			const autocompleteNode =
				autocompleteNodeKey !== null
					? $getNodeByKey(autocompleteNodeKey)
					: null;
			if (autocompleteNode?.isAttached()) {
				autocompleteNode.remove();
				autocompleteNodeKey = null;
			}
			if (searchPromise !== null) {
				searchPromise.dismiss();
				searchPromise = null;
			}
			lastMatch = null;
			lastSuggestion = null;
			setSuggestion(null);
		}

		function updateAsyncSuggestion(
			refSearchPromise: SearchPromise,
			newSuggestion: null | string,
		) {
			if (searchPromise !== refSearchPromise || newSuggestion === null) {
				return;
			}
			editor.update(
				() => {
					const selection = $getSelection();
					const [hasMatch, match] = $search(selection);
					if (
						!hasMatch ||
						match !== lastMatch ||
						!$isRangeSelection(selection)
					) {
						return;
					}
					const selectionCopy = selection.clone();
					const node = $createAutocompleteNode(uuid);
					autocompleteNodeKey = node.getKey();
					selection.insertNodes([node]);
					$setSelection(selectionCopy);
					lastSuggestion = newSuggestion;
					setSuggestion(newSuggestion);
				},
				{ tag: "history-merge" },
			);
		}

		function $handleAutocompleteNodeTransform(node: AutocompleteNode) {
			const key = node.getKey();
			if (node.__uuid === uuid && key !== autocompleteNodeKey) {
				$clearSuggestion(
					"(node.__uuid === uuid && key !== autocompleteNodeKey)",
				);
			}
		}

		// biome-ignore lint/correctness/useHookAtTopLevel: testing for now
		const debouncedHandleUpdate = useCallback(
			debounce(() => {
				editor.update(() => {
					const selection = $getSelection();
					const [hasMatch, match] = $search(selection);
					if (!hasMatch) {
						$clearSuggestion("!hasMatch");
						return;
					}
					if (match === lastMatch) {
						return;
					}
					$clearSuggestion("match !== lastMatch");
					searchPromise = query(match);
					searchPromise.promise
						.then((newSuggestion) => {
							if (searchPromise !== null) {
								updateAsyncSuggestion(searchPromise, newSuggestion);
							}
						})
						.catch((_e) => {
							// console.error(e)
						});
					lastMatch = match;
				});
			}, 200),
			[],
		);

		function $handleAutocompleteIntent(): boolean {
			if (lastSuggestion === null || autocompleteNodeKey === null) {
				console.log(
					"(lastSuggestion === null || autocompleteNodeKey === null)",
				);
				return false;
			}
			const autocompleteNode = $getNodeByKey(autocompleteNodeKey);
			if (autocompleteNode === null) {
				console.log("autocompleteNode === null");
				return false;
			}
			const textNode = $createTextNode(lastSuggestion);
			console.log(
				"replacing autocompleteNode with textNode",
				autocompleteNode,
				textNode,
			);
			autocompleteNode.replace(textNode);
			textNode.selectNext();
			$clearSuggestion("$handleAutocompleteIntent");
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
				$clearSuggestion("unmountSuggestion");
			});
		}

		const rootElem = editor.getRootElement();

		return mergeRegister(
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
			unmountSuggestion,
		);
	}, [editor, query, setSuggestion]);

	return null;
}
