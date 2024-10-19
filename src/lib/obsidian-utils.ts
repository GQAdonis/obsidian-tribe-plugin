import type { App, TFile } from 'obsidian';

export async function createNote(app: App, content: string, fileName: string = 'New Note'): Promise<TFile> {
  const file = await app.vault.create(`${fileName}.md`, content);
  return file;
}

export function copyToClipboard(text: string): void {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
