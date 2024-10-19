import { sveltePreprocess } from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto';

const config = {
    preprocess: sveltePreprocess({
        typescript: {
          tsconfigFile: './tsconfig.json',
        },
        // You can add other preprocessors like SCSS, PostCSS, etc., if needed
      }),
    kit: {
        adapter: adapter(),
        alias: {
            "$/*": "./src/*",
            "$components/*": "./src/components/*",
            "$features/*": "./src/features/*",
            "$stores/*": "./src/stores/*",
            "$lib/*": "./src/lib/*",
            "$config/*": "./src/config/*",
            "$public/*": "./public/*",
            "$utils/*": "./src/utils/*",
            "$styles/*": "./src/styles/*",
        },
    },
   };

export default config;