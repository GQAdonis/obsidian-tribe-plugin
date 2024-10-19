import { Plugin, App, PluginSettingTab, Setting } from 'obsidian';
import type { TribePluginSettings } from './features/settings/settings';
import { DEFAULT_SETTINGS } from './features/settings/settings';
import { IPFSSync } from './features/ipfs/ipfs-sync';
import { VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL } from './constants';
import { GenerativeAISidePanelView } from './features/chat/views/generative-ai-side-panel';

export default class TribePlugin extends Plugin {
  settings!: TribePluginSettings;
  private ipfsSync!: IPFSSync;

  async onload() {
    await this.loadSettings();
    this.ipfsSync = new IPFSSync(this.app.vault, this.settings);
    await this.ipfsSync.initialize();

    this.registerView(
      VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL,
      (leaf) => new GenerativeAISidePanelView(leaf)
    );

    this.addRibbonIcon('ai', 'Tribe AI Plugin', (evt: MouseEvent) => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-tribe-ai-plugin',
      name: 'Open Tribe AI Plugin',
      callback: () => this.activateView(),
    });

    this.addSettingTab(new TribePluginSettingTab(this.app, this));
  }

  async onunload() {
    await this.ipfsSync.cleanup();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL);

    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      leaf.setViewState({
        type: VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL,
        active: true,
      });

      this.app.workspace.revealLeaf(leaf);
    }
  }
}

class TribePluginSettingTab extends PluginSettingTab {
  plugin: TribePlugin;

  constructor(app: App, plugin: TribePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for Tribe AI Plugin' });

    new Setting(containerEl)
      .setName('IPFS Server URL')
      .setDesc('Enter the IPFS server URL')
      .addText(text => text
        .setPlaceholder('Enter your IPFS server URL')
        .setValue(this.plugin.settings.ipfsServerUrl)
        .onChange(async (value) => {
          this.plugin.settings.ipfsServerUrl = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('IPFS Directory Name')
      .setDesc('Enter the IPFS directory name')
      .addText(text => text
        .setPlaceholder('Enter your IPFS directory name')
        .setValue(this.plugin.settings.ipfsDirectoryName)
        .onChange(async (value) => {
          this.plugin.settings.ipfsDirectoryName = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('OpenAI Base URL')
      .setDesc('Enter the OpenAI base URL')
      .addText(text => text
        .setPlaceholder('Enter the OpenAI base URL')
        .setValue(this.plugin.settings.openAIBaseURL)
        .onChange(async (value) => {
          this.plugin.settings.openAIBaseURL = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('OpenAI API Key')
      .setDesc('Enter your OpenAI API key')
      .addText(text => text
        .setPlaceholder('Enter your OpenAI API key')
        .setValue(this.plugin.settings.openAIKey)
        .onChange(async (value) => {
          this.plugin.settings.openAIKey = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('OpenAI Model Name')
      .setDesc('Enter the OpenAI model name')
      .addText(text => text
        .setPlaceholder('Enter the OpenAI model name')
        .setValue(this.plugin.settings.openAIModelName)
        .onChange(async (value) => {
          this.plugin.settings.openAIModelName = value;
          await this.plugin.saveSettings();
        }));
  }
}
