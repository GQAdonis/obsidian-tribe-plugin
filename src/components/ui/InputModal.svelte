<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
  import { Button } from './button';
  import { Input } from './input';

  export let open = false;
  export let title = 'Enter Information';
  export let description = 'Please provide the required information.';
  export let placeholder = 'Enter text here';

  let inputValue = '';
  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('submit', inputValue);
    inputValue = '';
    open = false;
  }

  function handleClose() {
    inputValue = '';
    open = false;
    dispatch('close');
  }
</script>

<Dialog bind:open on:close={handleClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <form on:submit|preventDefault={handleSubmit}>
      <Input bind:value={inputValue} {placeholder} />
      <DialogFooter>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
