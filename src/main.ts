// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Plugin, App, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import type { TribePluginSettings } from './features/settings/settings';
import { DEFAULT_SETTINGS, saveSettings, checkMissingSettings } from './features/settings/settings';
import { IPFSSync } from './features/ipfs/ipfs-sync';
import { VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL } from './constants';
import { GenerativeAISidePanelView } from './features/chat/views/generative-ai-side-panel';
import { toast } from './components/ui/toast/toast';
import { isValidUrl } from './utils/validation';
import { Wand2 } from 'lucide-svelte';

export default class TribePlugin extends Plugin {
  settings!: TribePluginSettings;
  private ipfsSync!: IPFSSync;
  private ribbonIconEl: HTMLElement | null = null;

  async onload() {
    console.log('Tribe Plugin loaded');
    await this.loadSettings();
    this.ipfsSync = new IPFSSync(this.app.vault, this.settings);
    await this.ipfsSync.initialize();

    this.registerView(
      VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL,
      (leaf) => new GenerativeAISidePanelView(leaf)
    );
    console.log('Tribe Plugin registerView');

    this.addRibbonIcon('wand-2', 'Tribe AI Plugin', (evt: MouseEvent) => {
      this.activateView();
    });
    console.log('Tribe Plugin addRibbonIcon');

    this.addCommand({
      id: 'open-tribe-ai-plugin',
      name: 'Open Tribe AI Plugin',
      callback: () => this.activateView(),
    });
    console.log('Tribe Plugin addCommand');
    
    this.addSettingTab(new TribePluginSettingTab(this.app, this));
    console.log('Tribe Plugin onload finished');
  }

  async onunload() {
    await this.ipfsSync.cleanup();
  }

  async loadSettings() {
    console.log('Tribe Plugin loadSettings');
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    console.log('Tribe Plugin saveSettings');
    await this.saveData(this.settings);
    saveSettings(this.settings);
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully saved.",
      duration: 3000,
    });
  }

  activateView() {
    console.log('Tribe Plugin activateView');
    const missingSettings = checkMissingSettings();
    if (missingSettings.length > 0) {
      toast({
        title: "Missing Settings",
        description: `Please fill in all settings before activating the chat: ${missingSettings.join(', ')}`,
        duration: 5000,
        variant: "destructive",
      });
      return;
    }

    const existingLeaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL);
    if (existingLeaves.length > 0) {
      // If a view already exists, just reveal it
      this.app.workspace.revealLeaf(existingLeaves[0]);
    } else {
      // Create a new leaf in the main workspace area
      const leaf = this.app.workspace.getLeaf('tab');
      leaf.setViewState({
        type: VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL,
        active: true,
      });

      // Ensure the new leaf is revealed and focused
      this.app.workspace.setActiveLeaf(leaf, { focus: true });
    }

    // Ensure the view is visible
    this.ensureViewIsVisible();
  }

  ensureViewIsVisible() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_GENERATIVE_AI_SIDE_PANEL);
    if (leaves.length > 0) {
      const leaf = leaves[0];
      if (!leaf.view.containerEl.isConnected) {
        console.log('View is not visible, attempting to make it visible');
        this.app.workspace.revealLeaf(leaf);
      }

      // Double-check visibility after a short delay
      setTimeout(() => {
        if (!leaf.view.containerEl.isConnected) {
          console.log('View still not visible, notifying user');
          toast({
            title: "View Not Visible",
            description: "The AI chat view could not be made visible. Please try reopening it.",
            duration: 5000,
            variant: "destructive",
          });
        }
      }, 500);
    }
  }
}

class TribePluginSettingTab extends PluginSettingTab {
  plugin: TribePlugin;
  errorMessages: { [key: string]: string } = {};

  constructor(app: App, plugin: TribePlugin) {
    console.log('TribePluginSettingTab constructor');
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    console.log('TribePluginSettingTab display');
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for Tribe AI Plugin' });

    this.addSettingWithValidation(containerEl, 'IPFS Server URL', 'Enter the IPFS server URL', 'ipfsServerUrl');
    this.addSettingWithValidation(containerEl, 'OpenAI Base URL', 'Enter the OpenAI base URL', 'openAIBaseURL');

    new Setting(containerEl)
      .setName('IPFS Directory Name')
      .setDesc('Enter the IPFS directory name')
      .addText(text => text
        .setPlaceholder('Enter your IPFS directory name')
        .setValue(this.plugin.settings.ipfsDirectoryName)
        .onChange(async (value) => {
          this.plugin.settings.ipfsDirectoryName = value;
        }));

    new Setting(containerEl)
      .setName('OpenAI API Key')
      .setDesc('Enter your OpenAI API key')
      .addText(text => text
        .setPlaceholder('Enter your OpenAI API key')
        .setValue(this.plugin.settings.openAIKey)
        .onChange(async (value) => {
          this.plugin.settings.openAIKey = value;
        }));

    new Setting(containerEl)
      .setName('OpenAI Model Name')
      .setDesc('Enter the OpenAI model name')
      .addText(text => text
        .setPlaceholder('Enter the OpenAI model name')
        .setValue(this.plugin.settings.openAIModelName)
        .onChange(async (value) => {
          this.plugin.settings.openAIModelName = value;
        }));

    new Setting(containerEl)
      .setName('Save Settings')
      .setDesc('Save all settings')
      .addButton(button => button
        .setButtonText('Save')
        .setCta()
        .onClick(async () => {
          if (Object.values(this.errorMessages).every(msg => msg === '')) {
            await this.plugin.saveSettings();
          } else {
            toast({
              title: "Invalid Settings",
              description: "Please correct the invalid URLs before saving.",
              duration: 5000,
              variant: "destructive",
            });
          }
        }));
  }

  addSettingWithValidation(containerEl: HTMLElement, name: string, desc: string, settingKey: keyof TribePluginSettings) {
    const setting = new Setting(containerEl)
      .setName(name)
      .setDesc(desc)
      .addText(text => text
        .setPlaceholder(`Enter ${name.toLowerCase()}`)
        .setValue(this.plugin.settings[settingKey] as string)
        .onChange(async (value) => {
          this.plugin.settings[settingKey] = value;
          this.validateUrl(settingKey, value, setting.settingEl);
        }));

    const errorMessageEl = setting.settingEl.createDiv('setting-error-message');
    errorMessageEl.style.color = 'red';
    errorMessageEl.style.marginTop = '5px';
  }

  validateUrl(key: string, value: string, settingEl: HTMLElement) {
    const errorMessageEl = settingEl.querySelector('.setting-error-message');
    if (errorMessageEl) {
      if (value && !isValidUrl(value)) {
        this.errorMessages[key] = 'Invalid URL format';
        errorMessageEl.textContent = this.errorMessages[key];
      } else {
        this.errorMessages[key] = '';
        errorMessageEl.textContent = '';
      }
    }
  }
}
