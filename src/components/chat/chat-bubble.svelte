<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { marked } from 'marked';
  import hljs from 'highlight.js';
  import mermaid from 'mermaid';
  import { createNote, copyToClipboard } from '../../lib/obsidian-utils';
  import { getContext } from 'svelte';
  import { Button } from "$components/ui/button";
  import { Copy, FileText } from 'lucide-svelte';

  /** @type {string} */
  export let content: string;

  /** @type {'user' | 'assistant'} */
  export let role: 'user' | 'assistant';

  /** @type {boolean} */
  export let isStreaming: boolean = false;

  let renderedContent: string = '';
  const app: any = getContext('app');

  onMount(() => {
    mermaid.initialize({ startOnLoad: true });
  });

  afterUpdate(() => {
    renderContent();
  });

  async function renderContent() {
    const markedOptions = {
      highlight: (code: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
    };

    marked.setOptions(markedOptions as any);

    renderedContent = await marked(content);

    // Render mermaid diagrams
    setTimeout(() => {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }, 0);

    // Add copy and create note buttons to code blocks
    setTimeout(() => {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach((block, index) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'code-block-buttons';

        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
        copyButton.className = 'shadcn-button';
        copyButton.onclick = () => copyCodeBlock(block.textContent || '', index);

        const createNoteButton = document.createElement('button');
        createNoteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>';
        createNoteButton.className = 'shadcn-button';
        createNoteButton.onclick = () => createNoteFromCodeBlock(block.textContent || '', index);

        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(createNoteButton);
        block.parentNode?.insertBefore(buttonContainer, block);
      });
    }, 0);
  }

  function copyCodeBlock(text: string, index: number) {
    copyToClipboard(text);
    const button = document.querySelectorAll('.code-block-buttons .shadcn-button')[index * 2];
    button.classList.add('copied');
    setTimeout(() => {
      button.classList.remove('copied');
    }, 2000);
  }

  async function createNoteFromMessage() {
    try {
      const file = await createNote(app, content, `Chat Message - ${new Date().toISOString()}`);
      console.log('Note created:', file.path);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  async function createNoteFromCodeBlock(codeContent: string, index: number) {
    try {
      const file = await createNote(app, codeContent, `Code Block - ${new Date().toISOString()}`);
      console.log('Note created from code block:', file.path);
    } catch (error) {
      console.error('Error creating note from code block:', error);
    }
  }
</script>

<div class="bubble {role === 'user' ? 'user-bubble' : 'assistant-bubble'} {isStreaming ? 'streaming' : ''}">
  <div class="content">
    {@html renderedContent}
  </div>
  {#if !isStreaming}
    <div class="actions">
      <Button on:click={() => copyToClipboard(content)} size="icon" variant="outline">
        <Copy class="h-4 w-4" />
      </Button>
      <Button on:click={createNoteFromMessage} size="icon" variant="outline">
        <FileText class="h-4 w-4" />
      </Button>
    </div>
  {/if}
</div>

<style>
  .bubble {
    padding: 10px;
    border-radius: 12px;
    margin-bottom: 10px;
    max-width: 70%;
    transition: all 0.3s ease;
  }

  .user-bubble {
    background-color: #4caf50;
    color: white;
    margin-left: auto;
  }

  .assistant-bubble {
    background-color: #f1f1f1;
    color: black;
    margin-right: auto;
  }

  .streaming {
    animation: pulse 1s infinite alternate;
  }

  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.5;
    }
  }

  .content :global(pre) {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    position: relative;
  }

  .content :global(pre code) {
    display: block;
    overflow-x: auto;
  }

  .content :global(.code-block-buttons) {
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    gap: 5px;
  }

  .content :global(.shadcn-button) {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .content :global(.shadcn-button:hover) {
    background-color: #f7fafc;
  }

  .content :global(.shadcn-button.copied) {
    background-color: #48bb78;
    color: white;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
    gap: 5px;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css">
</svelte:head>
