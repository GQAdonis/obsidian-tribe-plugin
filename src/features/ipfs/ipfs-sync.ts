// features/ipfs/ipfs-sync.ts

import { TFile, Vault } from 'obsidian';
import axios from 'axios';

export class IPFSSync {
  private vault: Vault;
  private settings: {
    ipfsServerUrl: string;
    ipfsDirectoryName: string;
  };

  constructor(vault: Vault, settings: { ipfsServerUrl: string; ipfsDirectoryName: string }) {
    this.vault = vault;
    this.settings = settings;
  }

  async initialize(): Promise<void> {
    // Initialize the IPFS sync
  }

  async cleanup(): Promise<void> {
    // Cleanup the IPFS sync
  }

  async uploadVaultToIPFS(): Promise<void> {
    const files = this.vault.getFiles();
    const directoryName = this.settings.ipfsDirectoryName || this.vault.getName();

    for (const file of files) {
      await this.uploadFileToIPFS(file, directoryName);
    }
  }

  private async uploadFileToIPFS(file: TFile, directoryName: string): Promise<void> {
    const content = await this.vault.read(file);
    const filePath = `${directoryName}/${file.path}`;

    try {
      await axios.post(`${this.settings.ipfsServerUrl}/api/v0/add`, {
        path: filePath,
        content: content,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Failed to upload file ${file.path} to IPFS:`, error);
    }
  }

  async importNewFilesFromIPFS(): Promise<void> {
    try {
      const response = await axios.get(`${this.settings.ipfsServerUrl}/api/v0/ls?arg=${this.settings.ipfsDirectoryName}`);
      const files = response.data.Objects[0].Links;

      for (const file of files) {
        await this.importFileFromIPFS(file.Name);
      }
    } catch (error) {
      console.error('Failed to list files from IPFS:', error);
    }
  }

  private async importFileFromIPFS(fileName: string): Promise<void> {
    try {
      const response = await axios.get(`${this.settings.ipfsServerUrl}/api/v0/cat?arg=${this.settings.ipfsDirectoryName}/${fileName}`);
      const content = response.data;

      const existingFile = this.vault.getAbstractFileByPath(fileName);
      if (existingFile instanceof TFile) {
        await this.vault.modify(existingFile, content);
      } else {
        await this.vault.create(fileName, content);
      }
    } catch (error) {
      console.error(`Failed to import file ${fileName} from IPFS:`, error);
    }
  }
}