<script lang="ts">
    import { sendMessage } from './chat-controller';

    let userMessage = '';
  
    function handleSend() {
      if (userMessage.trim()) {
        sendMessage(userMessage);
        userMessage = '';
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    }
</script>
  
<div class="input-container">
    <input 
      type="text" 
      bind:value={userMessage} 
      placeholder="Type your message..." 
      on:keydown={handleKeydown}
    />
    <button on:click={handleSend}>Send</button>
</div>
  
<style>
    .input-container {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
  
    input {
      flex-grow: 1;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
  
    button {
      padding: 10px 15px;
      margin-left: 10px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
</style>
