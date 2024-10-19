<script lang="ts">
    import { setContext } from 'svelte';
    import { chatState } from './chat-store';
    import { errorModalState, closeErrorModal } from './chat-controller';
    import type { ChatState, ChatMessage } from '../../features/chat/types/chat-types';
    import ChatBubble from './chat-bubble.svelte';
    import ChatInput from './chat-input.svelte';
    import ErrorDetailsModal from '../ui/ErrorDetailsModal.svelte';
    import type { App } from 'obsidian';
    import { Toaster } from 'svelte-sonner';
    import { getPluginSettings } from '../../features/settings/settings';
    
    export let title: string = "Vault Assistant";
    export let app: App;

    setContext('app', app);

    // Type the subscription using the ChatState interface
    $: ({ messages, isLoading } = $chatState);

    function isStreaming(message: ChatMessage): boolean {
        return message.role === 'assistant' && $chatState.isLoading && message === messages[messages.length - 1];
    }

    function areOpenAISettingsValid(): boolean {
        const settings = getPluginSettings();
        return !!(settings.openAIBaseURL && settings.openAIKey && settings.openAIModelName);
    }

    function openPluginSettings() {
        app.setting.open();
        app.setting.openTabById('obsidian-tribe-plugin');
    }
</script>

<div class="chat-view">
    <h2 class="text-2xl font-semibold mb-4">{title}</h2>
    
    <div class="message-container">
        {#each $chatState.messages as message (message.id)}
            <ChatBubble content={message.content} role={message.role} isStreaming={isStreaming(message)} />
        {/each}
    </div>
    
    <ChatInput />

    {#if !areOpenAISettingsValid()}
        <div class="settings-overlay">
            <div class="settings-message">
                <p>OpenAI settings must be entered to use the chat feature.</p>
                <button on:click={openPluginSettings}>Go to Plugin Settings</button>
            </div>
        </div>
    {/if}
</div>

<ErrorDetailsModal 
    open={$errorModalState.isOpen} 
    errorMessage={$errorModalState.errorMessage} 
    errorDetails={$errorModalState.errorDetails}
    on:close={closeErrorModal}
/>

<Toaster />

<style>
    .chat-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
    }
    
    .message-container {
        flex-grow: 1;
        overflow-y: auto;
        padding: 20px;
    }
    
    h2 {
        text-align: center;
    }

    .settings-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .settings-message {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .settings-message button {
        margin-top: 10px;
        padding: 5px 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .settings-message button:hover {
        background-color: #45a049;
    }
</style>
