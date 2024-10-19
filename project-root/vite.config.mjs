import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'path';

// Tailwind CSS plugin for PostCSS
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
  plugins: [
    svelte({
      // Enable support for .svelte and .svx (Svelte with Markdown)
      extensions: ['.svelte', '.svx'],
      preprocess: mdsvex({
        // Configuration for mdsvex (Markdown + Svelte)
        extensions: ['.svx'],  // Process .svx files as MDX
        highlight: {
          // Prism.js for syntax highlighting
          alias: { js: 'javascript', ts: 'typescript' },
        }
      })
    })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(path.resolve(__dirname, 'tailwind.config.js')),  // Use the Tailwind CSS config
        autoprefixer
      ]
    }
  },
  build: {
    outDir: 'dist',  // Output directory for the build
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),  // Entry point for your plugin
      formats: ['es', 'cjs'],
    },
    sourcemap: true,  // Enable source maps
    rollupOptions: {
      output: {
        dir: 'dist',  // Directory for bundled files
        // Removed sourcemap from here
      },
      // Optionally externalize dependencies that should not be bundled
      external: ['obsidian'],
    }
  },
  resolve: {
    alias: {
      // Optionally define path aliases (e.g., '@components' -> './src/components')
      '$components': path.resolve(__dirname, 'src/components'),
      '$utils': path.resolve(__dirname, 'src/utils'),
      '$stores': path.resolve(__dirname, 'src/stores'),
      '$config': path.resolve(__dirname, 'src/config'),
      '$public': path.resolve(__dirname, 'public'),
      '$lib': path.resolve(__dirname, 'src/lib'),
      '$features': path.resolve(__dirname, 'src/features'),
      '$styles': path.resolve(__dirname, 'src/styles'),
    }
  }
});
