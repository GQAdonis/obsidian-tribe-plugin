# Obsidian Tribe IPFS Sync

Obsidian Tribe IPFS Sync is a powerful Obsidian plugin that enables users to seamlessly push their notes to IPFS (InterPlanetary File System) and leverage AI for note summarization, linking, and interactive chat. Built with TypeScript and Svelte, this plugin ensures a smooth and efficient workflow for managing and synchronizing your knowledge base.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **IPFS Integration:** Push individual notes or all notes to IPFS, ensuring decentralized and secure storage.
- **AI-Powered Summarization:** Utilize AI to generate summaries and intelligent links between your notes.
- **Interactive AI Chat:** Engage with an AI assistant to help with note-taking, research, and knowledge management.
- **Real-Time Synchronization:** Keep your notes in sync with IPFS in real-time.
- **Custom Commands:** Easily push or pull notes using intuitive Obsidian commands.
- **Svelte Components:** Interactive and responsive UI components built with Svelte.
- **Type Safety:** Robust type-checking with TypeScript ensures reliability and maintainability.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) v20
- **Framework:** [Svelte](https://svelte.dev/) v4
- **Bundler:** [Vite](https://vitejs.dev/) v5
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) for managing application state
- **HTTP Client:** [Axios](https://axios-http.com/) for API interactions
- **Database & Auth:** [Supabase](https://supabase.com/) for data management
- **UI Components:** [Shadcn UI](https://shadcn.com/) for beautiful and accessible UI
- **Form Validation:** [Zod](https://zod.dev/) for reliable form handling
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for modern and responsive design
- **AI Integration:** OpenAI API for AI-powered features
- **Code Quality:** ESLint, Prettier, and Biome for code formatting and linting
- **Testing:** Cypress for end-to-end testing

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/obsidian-tribe-sync.git
   cd obsidian-tribe-sync
   ```

2. **Install Dependencies**

   Ensure you have [Node.js](https://nodejs.org/) v20 installed.

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the root directory and add your environment variables:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   # Add other necessary environment variables
   ```

4. **Build the Plugin**

   ```bash
   npm run build
   ```

5. **Install the Plugin in Obsidian**

   - Locate your Obsidian plugins directory.
   - Copy the `main.js`, `manifest.json`, and `styles.css` files from the `dist` folder into a new folder named `obsidian-tribe-plugin` in your Obsidian plugins directory.
   - Enable the plugin from Obsidian's settings.

## Usage

Once installed, you can use the following features within Obsidian:

- **Push Note to IPFS:** Push the currently active note to IPFS.
- **Pull Notes from IPFS:** Retrieve notes from IPFS using a specific CID.
- **Push All Notes to IPFS:** Bulk push all your notes to IPFS.
- **AI Chat:** Open the AI chat panel to interact with the AI assistant for note-related tasks.

### Pushing a Note to IPFS

1. Open the note you wish to push.
2. Open the command palette (`Ctrl+P` or `Cmd+P`).
3. Select **Push Note to IPFS**.
4. The note will be uploaded to IPFS, and the CID will be logged in the console.

### Using the AI Chat

1. Open the command palette (`Ctrl+P` or `Cmd+P`).
2. Select **Open AI Chat**.
3. Type your questions or requests in the chat input.
4. The AI assistant will respond, helping you with note-taking, summarization, or other knowledge management tasks.

## Scripts

- **Start Development Server**

  ```bash
  npm run dev
  ```

- **Build for Production**

  ```bash
  npm run build
  ```

- **Version Bump**

  ```bash
  npm run version
  ```

- **Generate Supabase Types**

  ```bash
  npm run generate:types
  ```

- **Lint Code**

  ```bash
  npm run lint
  ```

- **Copy Plugin Files**

  ```bash
  npm run copy-plugin-files
  ```

## Project Structure

```
obsidian-tribe-plugin/
├── docs/                 # Documentation files
├── prisma/               # Prisma schema and migrations
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Svelte components
│   │   ├── chat/         # Chat-related components
│   │   └── ui/           # UI components (buttons, inputs, etc.)
│   ├── features/         # Feature-specific code
│   │   ├── chat/         # Chat feature implementation
│   │   ├── ipfs/         # IPFS integration
│   │   ├── settings/     # Plugin settings
│   │   └── sync/         # Synchronization logic
│   ├── lib/              # Utility libraries
│   │   ├── ai/           # AI-related utilities
│   │   ├── obsidian/     # Obsidian-specific utilities
│   │   └── stores/       # Zustand stores
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── constants.ts      # Constant values
│   ├── main.ts           # Plugin entry point
│   └── svelte-shims.d.ts # Svelte type definitions
├── test-vault/           # Test Obsidian vault for development
├── .eslintrc             # ESLint configuration
├── biome.json            # Biome configuration
├── esbuild.config.js     # esbuild configuration
├── manifest.json         # Obsidian plugin manifest
├── package.json          # Node.js dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── uno.config.ts         # UnoCSS configuration
└── vite.config.js        # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
