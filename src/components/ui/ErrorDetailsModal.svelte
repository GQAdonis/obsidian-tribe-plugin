<script lang="ts">
  import { Button } from "$components/ui/button";
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$components/ui/dialog";
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "$components/ui/accordion";
  import { Copy } from 'lucide-svelte';

  export let open = false;
  export let errorMessage: string;
  export let errorDetails: string;

  function copyErrorDetails() {
    const fullErrorText = `Error Message: ${errorMessage}\n\nError Details: ${errorDetails}`;
    navigator.clipboard.writeText(fullErrorText);
  }
</script>

<Dialog {open} on:close={() => (open = false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Error Details</DialogTitle>
      <DialogDescription>
        An error occurred while processing your request. Details are provided below.
      </DialogDescription>
    </DialogHeader>
    <div class="error-content">
      <p><strong>Error Message:</strong> {errorMessage}</p>
      <Accordion>
        <AccordionItem value="details">
          <AccordionTrigger>View Full Error Details</AccordionTrigger>
          <AccordionContent>
            <pre>{errorDetails}</pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
    <div class="actions">
      <Button on:click={copyErrorDetails}>
        <Copy class="mr-2 h-4 w-4" />
        Copy Error Details
      </Button>
    </div>
  </DialogContent>
</Dialog>

<style>
  .error-content {
    margin-top: 1rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #f0f0f0;
    padding: 0.5rem;
    border-radius: 4px;
  }
</style>
