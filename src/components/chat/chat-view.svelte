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
    import { Button } from '../ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
    
    export let title: string = "Vault Assistant";
    export let app: App;

    setContext('app', app);

    // Type the subscription using the ChatState interface
    $: ({ messages, isLoading } = $chatState);

    let showSettingsModal = false;

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

    function getCurrentSettings() {
        console.log('Getting current settings');
        const settings = getPluginSettings();
        return Object.entries(settings).map(([key, value]) => `${key}: ${value || 'Not set'}`).join('\n');
    }

    function toggleSettingsModal() {
        console.log('Toggling settings modal');
        showSettingsModal = !showSettingsModal;
    }
</script>

<div class="chat-view">
    <div class="chat-header">
        <h2 class="text-2xl font-semibold mb-4">{title}</h2>
        <Button on:click={toggleSettingsModal} variant="ghost" size="icon" class="config-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </Button>
    </div>
    
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

<Dialog bind:open={showSettingsModal}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Current Settings</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            <pre>{getCurrentSettings()}</pre>
        </DialogDescription>
    </DialogContent>
</Dialog>

<Toaster />

<style>
    .chat-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
    }
    
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
    }

    .config-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }

    .config-button:hover {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
    }
    
    .message-container {
        flex-grow: 1;
        overflow-y: auto;
        padding: 20px;
        max-width: 100%; /* Ensure the container takes full width */
    }
    
    h2 {
        margin: 0;
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

    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
