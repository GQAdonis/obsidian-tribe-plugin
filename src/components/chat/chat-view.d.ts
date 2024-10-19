import { SvelteComponentTyped } from "svelte";
import type { App } from 'obsidian';

export interface ChatViewProps {
  title: string;
  app: App;
}

export default class ChatView extends SvelteComponentTyped<ChatViewProps> {}
