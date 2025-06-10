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
import { type JSX, useCallback, useEffect } from "react";

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

		const promise: Promise<null | string> = new Promise((resolve) => {
			if (!searchText) {
				resolve(null);
				return;
			}

			const prompt = `Complete the following sentence or paragraph. Only provide the completion, do not repeat the original text: "${searchText}"`;

			fetch("https://ai.hackclub.com/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [{ role: "user", content: prompt }],
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (!isDismissed) {
						if (data.choices && data.choices.length > 0) {
							const completion = data.choices[0].message.content;
							resolve(completion);
						} else {
							resolve(null);
						}
					}
				})
				.catch((error) => {
					console.error("Error fetching AI completion:", error);
					resolve(null); // Resolve with null in case of error to avoid unhandled promise rejection.
				});
		});

		return {
			dismiss,
			promise,
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

		function $clearSuggestion() {
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
				$clearSuggestion();
			}
		}

		function handleUpdate() {
			editor.update(() => {
				const selection = $getSelection();
				const [hasMatch, match] = $search(selection);
				if (!hasMatch) {
					$clearSuggestion();
					return;
				}
				if (match === lastMatch) {
					return;
				}
				$clearSuggestion();
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
		}

		function $handleAutocompleteIntent(): boolean {
			if (lastSuggestion === null || autocompleteNodeKey === null) {
				return false;
			}
			const autocompleteNode = $getNodeByKey(autocompleteNodeKey);
			if (autocompleteNode === null) {
				return false;
			}
			const textNode = $createTextNode(lastSuggestion);
			autocompleteNode.replace(textNode);
			textNode.selectNext();
			$clearSuggestion();
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
				$clearSuggestion();
			});
		}

		const rootElem = editor.getRootElement();

		return mergeRegister(
			editor.registerNodeTransform(
				AutocompleteNode,
				$handleAutocompleteNodeTransform,
			),
			editor.registerUpdateListener(handleUpdate),
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
