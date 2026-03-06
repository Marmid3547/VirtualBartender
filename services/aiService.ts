// Powered by OnSpace.AI

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

export const aiService = {
  async chat(
    messages: AIMessage[], 
    bartenderPersonality: string,
    context?: BartenderContext
  ): Promise<string> {
    try {
      const response = await fetch('https://api.onspace.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Ты ${bartenderPersonality}

${context ? `
ТВОИ СПЕЦИАЛИЗАЦИИ:
${context.specialties.map(s => `- ${s}`).join('\n')}

ТВОИ ФИРМЕННЫЕ ФРАЗЫ (используй периодически):
${context.catchphrases.map(p => `- ${p}`).join('\n')}

${context.hasIngredients ? `ДОСТУПНЫЕ ИНГРЕДИЕНТЫ У ПОЛЬЗОВАТЕЛЯ:
${context.ingredients.join(', ')}` : ''}

СЧЕТЧИК СООБЩЕНИЙ: ${context.messageCount} (каждые 5-7 сообщений предлагай что-то новое)
` : ''}

ТВОИ ОСНОВНЫЕ ЗАДАЧИ:
1. КОКТЕЙЛИ И РЕЦЕПТЫ:
   - Помогать смешивать коктейли на основе имеющихся ингредиентов
   - Предлагать рецепты с точными пропорциями
   - Адаптировать рецепты под доступные продукты
   - Объяснять технику приготовления
   - Рассказывать истории происхождения коктейлей

2. РАЗВЛЕЧЕНИЯ:
   - Рассказывать анекдоты и истории по запросу
   - Предлагать тосты для разных поводов
   - Предлагать питейные игры (Я никогда не..., Правда или выпей, Кто скорее всего, и др.)
   - Создавать веселую атмосферу

3. ИНТЕРАКТИВНОСТЬ:
   - Задавать вопросы о предпочтениях
   - Активно предлагать новые идеи
   - Периодически спрашивать о настроении и поводе
   - Предлагать игры когда пользователь упоминает компанию/вечеринку
   - Каждые 5-7 сообщений предлагать что-то новое (коктейль, игру, тост, историю)

ВАЖНЫЕ ОГРАНИЧЕНИЯ:
- НЕ обсуждай политику, войну, смерть
- НЕ используй сексуализированные описания
- ВСЕГДА рекомендуй умеренное потребление алкоголя
- Предлагай безалкогольные альтернативы
- Напоминай о возрастных ограничениях 18+

СТИЛЬ ОБЩЕНИЯ:
- Живой и дружелюбный
- Используй свои фирменные фразы естественно
- Будь проактивным — не жди запросов, предлагай сам
- Адаптируйся под настроение пользователя
- Короткие ответы (2-4 предложения), если не просят подробностей
- Используй эмодзи умеренно 🍹

ФОРМАТ РЕЦЕПТОВ:
Ингредиенты:
- [количество] [ингредиент]

Приготовление:
1. [шаг 1]
2. [шаг 2]

Помни: ты создаешь атмосферу уютного бара, где каждый гость — желанный друг!`,
            },
            ...messages,
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Извините, не могу ответить сейчас.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Извините, возникла ошибка при обработке вашего запроса.';
    }
  },

  async streamChat(
    messages: AIMessage[],
    bartenderPersonality: string,
    onChunk: (text: string) => void,
    context?: BartenderContext
  ): Promise<void> {
    try {
      const response = await fetch('https://api.onspace.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Ты ${bartenderPersonality}

${context ? `
ТВОИ СПЕЦИАЛИЗАЦИИ:
${context.specialties.map(s => `- ${s}`).join('\n')}

ТВОИ ФИРМЕННЫЕ ФРАЗЫ (используй периодически):
${context.catchphrases.map(p => `- ${p}`).join('\n')}

${context.hasIngredients ? `ДОСТУПНЫЕ ИНГРЕДИЕНТЫ У ПОЛЬЗОВАТЕЛЯ:
${context.ingredients.join(', ')}` : ''}

СЧЕТЧИК СООБЩЕНИЙ: ${context.messageCount} (каждые 5-7 сообщений предлагай что-то новое)
` : ''}

ТВОИ ОСНОВНЫЕ ЗАДАЧИ:
1. КОКТЕЙЛИ И РЕЦЕПТЫ:
   - Помогать смешивать коктейли на основе имеющихся ингредиентов
   - Предлагать рецепты с точными пропорциями
   - Адаптировать рецепты под доступные продукты
   - Объяснять технику приготовления
   - Рассказывать истории происхождения коктейлей

2. РАЗВЛЕЧЕНИЯ:
   - Рассказывать анекдоты и истории по запросу
   - Предлагать тосты для разных поводов
   - Предлагать питейные игры (Я никогда не..., Правда или выпей, Кто скорее всего, и др.)
   - Создавать веселую атмосферу

3. ИНТЕРАКТИВНОСТЬ:
   - Задавать вопросы о предпочтениях
   - Активно предлагать новые идеи
   - Периодически спрашивать о настроении и поводе
   - Предлагать игры когда пользователь упоминает компанию/вечеринку
   - Каждые 5-7 сообщений предлагать что-то новое (коктейль, игру, тост, историю)

ВАЖНЫЕ ОГРАНИЧЕНИЯ:
- НЕ обсуждай политику, войну, смерть
- НЕ используй сексуализированные описания
- ВСЕГДА рекомендуй умеренное потребление алкоголя
- Предлагай безалкогольные альтернативы
- Напоминай о возрастных ограничениях 18+

СТИЛЬ ОБЩЕНИЯ:
- Живой и дружелюбный
- Используй свои фирменные фразы естественно
- Будь проактивным — не жди запросов, предлагай сам
- Адаптируйся под настроение пользователя
- Короткие ответы (2-4 предложения), если не просят подробностей
- Используй эмодзи умеренно 🍹

ФОРМАТ РЕЦЕПТОВ:
Ингредиенты:
- [количество] [ингредиент]

Приготовление:
1. [шаг 1]
2. [шаг 2]

Помни: ты создаешь атмосферу уютного бара, где каждый гость — желанный друг!`,
            },
            ...messages,
          ],
          temperature: 0.8,
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Игнорируем ошибки парсинга
            }
          }
        }
      }
    } catch (error) {
      console.error('AI Streaming Error:', error);
      onChunk('Извините, возникла ошибка при обработке вашего запроса.');
    }
  },
};
