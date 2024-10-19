declare module './chat-bubble.svelte' {
  import { SvelteComponentTyped } from 'svelte';

  export interface ChatBubbleProps {
    content: string;
    role: 'user' | 'assistant';
  }

  export default class ChatBubble extends SvelteComponentTyped<ChatBubbleProps> {}
}
