import { getPluginSettings } from '../../features/settings/settings';

export async function streamOpenAiResponse(userMessage: string, onMessage: (partialResponse: string) => void) {
  const settings = getPluginSettings();
  const response = await fetch(`${settings.openAIBaseURL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.openAIKey}`,
    },
    body: JSON.stringify({
      model: settings.openAIModelName,
      messages: [{ role: 'user', content: userMessage }],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader?.read() ?? { done: true, value: undefined };
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonData = line.slice(6);
        if (jsonData === '[DONE]') break;
        try {
          const parsedData = JSON.parse(jsonData);
          const messagePart = parsedData.choices[0]?.delta?.content || '';
          onMessage(messagePart);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
  }
}
