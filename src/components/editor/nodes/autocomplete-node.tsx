import type {
	EditorConfig,
	EditorThemeClassName,
	LexicalEditor,
	NodeKey,
	SerializedLexicalNode,
	Spread,
} from "lexical";
import { DecoratorNode } from "lexical";
import type { JSX } from "react";

import { useSharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context";
import { uuid as UUID } from "@/components/editor/plugins/ai-autocomplete-plugin";
import { useIsMobile } from "@/hooks/use-mobile";

declare global {
	interface Navigator {
		userAgentData?: {
			mobile: boolean;
		};
	}
}

export type SerializedAutocompleteNode = Spread<
	{
		uuid: string;
	},
	SerializedLexicalNode
>;

export class AutocompleteNode extends DecoratorNode<JSX.Element | null> {
	/**
	 * A unique uuid is generated for each session and assigned to the instance.
	 * This helps to:
	 * - Ensures max one Autocomplete node per session.
	 * - Ensure that when collaboration is enabled, this node is not shown in
	 *   other sessions.
	 * See https://github.com/facebook/lexical/blob/master/packages/lexical-playground/src/plugins/AutocompletePlugin/index.tsx#L39
	 */
	__uuid: string;

	static clone(node: AutocompleteNode): AutocompleteNode {
		return new AutocompleteNode(node.__uuid, node.__key);
	}

	static getType(): "autocomplete" {
		return "autocomplete";
	}

	static importJSON(
		serializedNode: SerializedAutocompleteNode,
	): AutocompleteNode {
		const node = $createAutocompleteNode(serializedNode.uuid);
		return node;
	}

	exportJSON(): SerializedAutocompleteNode {
		return {
			...super.exportJSON(),
			type: "autocomplete",
			uuid: this.__uuid,
			version: 1,
		};
	}

	constructor(uuid: string, key?: NodeKey) {
		super(key);
		this.__uuid = uuid;
	}

	updateDOM(
		_prevNode: unknown,
		_dom: HTMLElement,
		_config: EditorConfig,
	): boolean {
		return false;
	}

	createDOM(_config: EditorConfig): HTMLElement {
		return document.createElement("span");
	}

	decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element | null {
		if (this.__uuid !== UUID) {
			return null;
		}
		return <AutocompleteComponent className={config.theme.autocomplete} />;
	}
}

export function $createAutocompleteNode(uuid: string): AutocompleteNode {
	return new AutocompleteNode(uuid);
}

function AutocompleteComponent({
	className,
}: {
	className: EditorThemeClassName;
}): JSX.Element {
	const [suggestion] = useSharedAutocompleteContext();
	const isMobile = useIsMobile();

	return (
		<span className={className} spellCheck="false">
			{suggestion} {isMobile ? "(SWIPE \u2B95)" : "(TAB)"}
		</span>
	);
}
