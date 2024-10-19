import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '$components': resolve(__dirname, './src/components'),
      '$lib': resolve(__dirname, './src/lib'),
      '$features': resolve(__dirname, './src/features'),
      '$utils': resolve(__dirname, './src/utils'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ObsidianTribePlugin',
      fileName: 'main',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['obsidian'],
      output: {
        format: 'cjs',
        exports: 'default',
        globals: {
          obsidian: 'obsidian',
        },
        inlineDynamicImports: true,
        dir: 'dist',
        entryFileNames: 'main.js',
        assetFileNames: 'styles.css',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
