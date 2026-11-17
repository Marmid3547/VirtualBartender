 import { supabase } from '@/lib/supabase';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface BartenderContext {
  bartenderName: string;
  specialties: string[];
  catchphrases: string[];
  messageCount: number;
  hasIngredients: boolean;
  ingredients: string[];
}

// Системный промпт теперь строится на сервере (Edge Function bartender-chat)
async function requestReply(
  messages: AIMessage[],
  personality: string,
  context?: BartenderContext
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('bartender-chat', {
    body: {
      messages: messages.filter((m) => m.role !== 'system'),
      personality,
      context,
    },
  });
  if (error) throw error;
  return data?.content?.trim() || 'Извините, не могу ответить сейчас.';
}

export const aiService = {
  async chat(
    messages: AIMessage[],
    bartenderPersonality: string,
    context?: BartenderContext
  ): Promise<string> {
    try {
      return await requestReply(messages, bartenderPersonality, context);
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Извините, возникла ошибка при обработке вашего запроса.';
    }
  },

  // Эффект "печатающегося" ответа: получаем текст целиком и выдаём порциями.
  // Сигнатура прежняя — ChatInterface/контексты менять не нужно.
  async streamChat(
    messages: AIMessage[],
    bartenderPersonality: string,
    onChunk: (text: string) => void,
    context?: BartenderContext
  ): Promise<void> {
    try {
      const reply = await requestReply(messages, bartenderPersonality, context);
      const words = reply.match(/\S+\s*/g) ?? [reply];
      for (let i = 0; i < words.length; i += 2) {
        onChunk(words.slice(i, i + 2).join(''));
        await new Promise((r) => setTimeout(r, 30));
      }
    } catch (error) {
      console.error('AI Streaming Error:', error);
      onChunk('Извините, возникла ошибка при обработке вашего запроса.');
    }
  },
};