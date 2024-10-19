
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
}

