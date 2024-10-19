import { writable } from 'svelte/store';

export interface TribePluginSettings {
    ipfsServerUrl: string;
    ipfsDirectoryName: string;
    openAIBaseURL: string;
    openAIKey: string;
    openAIModelName: string;
}

export const DEFAULT_SETTINGS: TribePluginSettings = {
    ipfsServerUrl: '',
    ipfsDirectoryName: '',
    openAIBaseURL: '',
    openAIKey: '',
    openAIModelName: '',
};

export const settingsStore = writable<TribePluginSettings>(DEFAULT_SETTINGS);

export function getPluginSettings(): TribePluginSettings {
    let settings: TribePluginSettings = DEFAULT_SETTINGS;
    settingsStore.subscribe(value => {
        settings = value;
    })();
    return settings;
}
