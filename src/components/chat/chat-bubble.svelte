<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { marked } from 'marked';
  import hljs from 'highlight.js';
  import mermaid from 'mermaid';
  import { createNote, copyToClipboard } from '../../lib/obsidian-utils';
  import { getContext } from 'svelte';
  import { Button } from "$components/ui/button";
  import { Copy, FileText, User, Bot, Download } from 'lucide-svelte';
  import { toast } from '../../components/ui/toast/toast';
  import InputModal from '../ui/InputModal.svelte';
  import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

  /** @type {string} */
  export let content: string;

  /** @type {'user' | 'assistant'} */
  export let role: 'user' | 'assistant';

  /** @type {boolean} */
  export let isStreaming: boolean = false;

  let renderedContent: string = '';
  const app: any = getContext('app');

  let showInputModal = false;
  let currentContent = '';
  let isCodeBlock = false;
  let isMermaidDiagram = false;

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
      const mermaidDiagrams = document.querySelectorAll('.mermaid');
      mermaid.init(undefined, mermaidDiagrams as NodeListOf<HTMLElement>);
      isMermaidDiagram = mermaidDiagrams.length > 0;
    }, 0);

    // Add buttons to code blocks and mermaid diagrams
    setTimeout(() => {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach((block, index) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'code-block-buttons';

        const copyButton = createButton('Copy', 'copy', () => copyCodeBlock(block.textContent || '', index));
        buttonContainer.appendChild(copyButton);

        if (isMermaidDiagram) {
          const saveAsPngButton = createButton('Save as PNG', 'download', () => saveMermaidAsPng(block));
          buttonContainer.appendChild(saveAsPngButton);
        } else {
          const createNoteButton = createButton('Create Note', 'file-text', () => openCreateNoteModal(block.textContent || '', true));
          buttonContainer.appendChild(createNoteButton);
        }

        block.parentNode?.insertBefore(buttonContainer, block);
      });
    }, 0);
  }

  function createButton(tooltip: string, icon: string, onClick: () => void) {
    const button = document.createElement('button');
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${icon}"><path d="${getIconPath(icon)}"/></svg>`;
    button.className = 'shadcn-button';
    button.title = tooltip;
    button.onclick = onClick;
    return button;
  }

  function getIconPath(icon: string) {
    switch (icon) {
      case 'copy':
        return 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z';
      case 'file-text':
        return 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8';
      case 'download':
        return 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3';
      default:
        return '';
    }
  }

  function copyCodeBlock(text: string, index: number) {
    copyToClipboard(text);
    toast({
      title: "Content copied!",
      description: "The code block has been copied to your clipboard.",
    });
    const button = document.querySelectorAll('.code-block-buttons .shadcn-button')[index * 2];
    button.classList.add('copied');
    setTimeout(() => {
      button.classList.remove('copied');
    }, 2000);
  }

  function openCreateNoteModal(contentToSave: string, isCodeBlockContent: boolean = false) {
    currentContent = contentToSave;
    isCodeBlock = isCodeBlockContent;
    showInputModal = true;
  }

  async function handleCreateNote(event: CustomEvent<string>) {
    const noteName = event.detail;
    try {
      const currentFile = app.workspace.getActiveFile();
      const currentDir = currentFile ? currentFile.parent.path : '/';
      const fileName = `${currentDir}/${noteName}.md`;
      const file = await createNote(app, currentContent, fileName);
      console.log('Note created:', file.path);
      toast({
        title: "Note created",
        description: `A new note has been created at ${file.path}`,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create the note. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleCopyFullContent() {
    copyToClipboard(content);
    toast({
      title: "Content copied!",
      description: "The full message content has been copied to your clipboard.",
    });
  }

  async function saveMermaidAsPng(mermaidElement: Element) {
    try {
      const svg = mermaidElement.querySelector('svg');
      if (!svg) throw new Error('SVG not found');

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Open system file dialog
        const link = document.createElement('a');
        link.download = 'mermaid-diagram.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Error saving Mermaid diagram as PNG:', error);
      toast({
        title: "Error",
        description: "Failed to save the Mermaid diagram as PNG. Please try again.",
        variant: "destructive",
      });
    }
  }
</script>

<div class="bubble-container {role === 'user' ? 'user-container' : 'assistant-container'}">
  <div class="avatar">
    {#if role === 'user'}
      <User class="h-6 w-6" />
    {:else}
      <Bot class="h-6 w-6" />
    {/if}
  </div>
  <div class="bubble {role === 'user' ? 'user-bubble' : 'assistant-bubble'} {isStreaming ? 'streaming' : ''}">
    <div class="content">
      {@html renderedContent}
    </div>
    {#if !isStreaming}
      <div class="actions">
        <Tooltip>
          <TooltipTrigger>
            <Button on:click={handleCopyFullContent} size="sm" variant="outline">
              <Copy class="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy full content</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button on:click={() => openCreateNoteModal(content)} size="sm" variant="outline">
              <FileText class="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new note</p>
          </TooltipContent>
        </Tooltip>
      </div>
    {/if}
  </div>
</div>

<InputModal
  bind:open={showInputModal}
  title="Create New Note"
  description="Enter a name for the new note"
  placeholder="Note name"
  on:submit={handleCreateNote}
/>

<style>
  .bubble-container {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .user-container {
    flex-direction: row-reverse;
  }

  .assistant-container {
    flex-direction: row;
  }

  .avatar {
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #f1f1f1;
  }

  .bubble {
    padding: 10px;
    border-radius: 12px;
    max-width: calc(70% - 52px);
    transition: all 0.3s ease;
  }

  .user-bubble {
    background-color: #e9f5ff;
    color: #333;
  }

  .assistant-bubble {
    background-color: #f1f1f1;
    color: #333;
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
    position: relative;
    padding: 10px;
    border-radius: 5px;
    overflow: hidden;
  }

  .content :global(pre code) {
    display: block;
    overflow-x: auto;
    padding: 1em;
    font-family: 'Courier New', Courier, monospace;
  }

  /* Light mode styles */
  :global(.theme-light) .content :global(pre) {
    background-color: #000000;
    color: #ffffff;
  }

  /* Dark mode styles */
  :global(.theme-dark) .content :global(pre) {
    background-color: #ffffff;
    color: #000000;
  }

  .content :global(.code-block-buttons) {
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    gap: 5px;
  }

  .content :global(.shadcn-button) {
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    padding: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .content :global(.shadcn-button:hover) {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .content :global(.shadcn-button.copied) {
    background-color: #48bb78;
    color: white;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
    gap: 2px;
  }

  .actions :global(button) {
    padding: 2px;
    font-size: 0.75rem;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css">
</svelte:head>
