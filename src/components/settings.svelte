<script lang="ts">
    import { createForm } from 'felte';
    import { validator } from '@felte/validator-zod';
    import { z } from 'zod';
    import { Button } from '$components/ui/button';
    import { Input } from '$components/ui/input';
    import { Label } from '$components/ui/label';
    import { Textarea } from '$components/ui/textarea';
    import { Alert, AlertDescription } from '$components/ui/alert';
  
    const settingsSchema = z.object({
      ipfsServerUrl: z.string().url('Invalid URL').min(1, 'IPFS Server URL is required'),
      ipfsDirectoryName: z.string().min(1, 'IPFS Directory Name is required'),
      vaultName: z.string().min(1, 'Vault Name is required'),
      syncInterval: z.number().int().min(1, 'Sync interval must be at least 1 minute'),
      notes: z.string().optional(),
    });
  
    type SettingsSchema = z.infer<typeof settingsSchema>;
  
    const { form, errors, data } = createForm<SettingsSchema>({
      extend: [validator({ schema: settingsSchema })],
      onSubmit: (values) => {
        console.log('Settings saved:', values);
        // Here you would typically save the settings to your backend or local storage
      },
    });
  
    $: console.log($errors);
  </script>
  
  <form use:form>
    <div class="space-y-4">
      <div>
        <Label for="ipfsServerUrl">IPFS Server URL</Label>
        <Input id="ipfsServerUrl" name="ipfsServerUrl" type="url" required />
        {#if $errors.ipfsServerUrl}
          <Alert variant="destructive">
            <AlertDescription>{$errors.ipfsServerUrl[0]}</AlertDescription>
          </Alert>
        {/if}
      </div>
  
      <div>
        <Label for="ipfsDirectoryName">IPFS Directory Name</Label>
        <Input id="ipfsDirectoryName" name="ipfsDirectoryName" required />
        {#if $errors.ipfsDirectoryName}
          <Alert variant="destructive">
            <AlertDescription>{$errors.ipfsDirectoryName[0]}</AlertDescription>
          </Alert>
        {/if}
      </div>
  
      <div>
        <Label for="vaultName">Vault Name</Label>
        <Input id="vaultName" name="vaultName" required />
        {#if $errors.vaultName}
          <Alert variant="destructive">
            <AlertDescription>{$errors.vaultName[0]}</AlertDescription>
          </Alert>
        {/if}
      </div>
  
      <div>
        <Label for="syncInterval">Sync Interval (minutes)</Label>
        <Input id="syncInterval" name="syncInterval" type="number" min="1" required />
        {#if $errors.syncInterval}
          <Alert variant="destructive">
            <AlertDescription>{$errors.syncInterval[0]}</AlertDescription>
          </Alert>
        {/if}
      </div>
  
      <div>
        <Label for="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>
  
      <Button type="submit">Save Settings</Button>
    </div>
  </form>
  
  {#if $data}
    <Alert class="mt-4">
      <AlertDescription>Settings saved successfully!</AlertDescription>
    </Alert>
  {/if}