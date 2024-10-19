import { ItemView, WorkspaceLeaf } from "obsidian";
import ChatView from "../../../components/chat/chat-view.svelte";

export const VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL = "generative-ai-side-panel";

export class GenerativeAISidePanelView extends ItemView {
	component: ChatView | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL;
	}

	getDisplayText() {
		return "Generative AI Side Panel";
	}

	async onOpen() {
		this.component = new ChatView({
			target: this.contentEl,
			props: {
				title: "Vault Assistant",
				app: this.app
			} as any
		});
	}

	async onClose() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}
