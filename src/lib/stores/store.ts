import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Define the shape of your store's state
interface CountStore {
  subscribe: Writable<number>['subscribe'];
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

// Create a custom Svelte store
function createCountStore(): CountStore {
  const { subscribe, set, update } = writable<number>(0);

  return {
    subscribe,
    increase: () => update((n) => n + 1),
    decrease: () => update((n) => n - 1),
    reset: () => set(0),
  };
}

// Initialize and export the store
export const count = createCountStore();
