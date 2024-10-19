import { writable } from 'svelte/store';
import type { ChatState } from '../../features/chat/types/chat-types';

const initialState: ChatState = {
  messages: [
    { id: '1', role: 'assistant', content: 'Hello! How can I assist you today?' }
  ],
  isLoading: false,
  error: null,
};

export const chatState = writable<ChatState>(initialState);
