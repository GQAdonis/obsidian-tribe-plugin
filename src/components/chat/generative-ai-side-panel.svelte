<script lang="ts">
import ChatView from './chat-view.svelte';
import type { App } from 'obsidian';

export let app: App;
</script>

<div class="generative-ai-side-panel">
  <h1 class="text-xl font-bold mb-4">Vault Assistant</h1>
  <ChatView {app} />
</div>

<style>
  .generative-ai-side-panel {
    padding: 16px;
  }
</style>
