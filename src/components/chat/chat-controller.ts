import { chatState } from './chat-store';
import type { ChatMessage } from '../../features/chat/types/chat-types';
import { streamOpenAiResponse } from '../../lib/ai/open-ai';
import { toast } from 'svelte-sonner';
import { get, writable } from 'svelte/store';

export const errorModalState = writable({
    isOpen: false,
    errorMessage: '',
    errorDetails: ''
});

export async function sendMessage(content: string) {
    const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: ''
    };

    chatState.update(state => ({
        ...state,
        messages: [...state.messages, userMessage, assistantMessage],
        isLoading: true
    }));

    try {
        await streamOpenAiResponse(content, (partialResponse) => {
            chatState.update(state => {
                const updatedMessages = state.messages.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, content: msg.content + partialResponse } : msg
                );
                return {
                    ...state,
                    messages: updatedMessages,
                };
            });
        });
    } catch (error) {
        console.error('Error in AI response:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        const errorDetails = error instanceof Error && error.stack ? error.stack : 'No stack trace available';

        chatState.update(state => {
            const updatedMessages = state.messages.map(msg => 
                msg.id === assistantMessageId ? { ...msg, content: 'Sorry, there was an error processing your request.' } : msg
            );
            return {
                ...state,
                messages: updatedMessages,
            };
        });

        toast.error('Error in AI response', {
            description: errorMessage,
            action: {
                label: 'View Details',
                onClick: () => showErrorDetails(errorMessage, errorDetails),
            },
        });
    } finally {
        chatState.update(state => ({
            ...state,
            isLoading: false
        }));
    }
}

function showErrorDetails(errorMessage: string, errorDetails: string) {
    errorModalState.set({
        isOpen: true,
        errorMessage,
        errorDetails
    });
}

export function closeErrorModal() {
    errorModalState.set({
        isOpen: false,
        errorMessage: '',
        errorDetails: ''
    });
}
