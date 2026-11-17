// Чат с барменом: ключ ИИ хранится только на сервере (секрет OPENAI_API_KEY)
import { createClient } from 'jsr:@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const OPENAI_BASE_URL = (Deno.env.get('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/$/, '');
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini';
const REQUIRE_AUTH = Deno.env.get('REQUIRE_AUTH') === 'true'; // 'true' = чат только для вошедших

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface BartenderContext {
  bartenderName?: string;
  specialties?: string[];
  catchphrases?: string[];
  messageCount?: number;
  hasIngredients?: boolean;
  ingredients?: string[];
}

function buildSystemPrompt(personality: string, ctx?: BartenderContext): string {
  const list = (arr?: string[]) => (arr ?? []).map((s) => `- ${String(s).slice(0, 200)}`).join('\n');
  return `Ты ${personality}

${ctx ? `
ТВОИ СПЕЦИАЛИЗАЦИИ:
${list(ctx.specialties)}

ТВОИ ФИРМЕННЫЕ ФРАЗЫ (используй периодически):
${list(ctx.catchphrases)}

${ctx.hasIngredients ? `ДОСТУПНЫЕ ИНГРЕДИЕНТЫ У ПОЛЬЗОВАТЕЛЯ:
${(ctx.ingredients ?? []).slice(0, 50).map(String).join(', ')}` : ''}

СЧЕТЧИК СООБЩЕНИЙ: ${Number(ctx.messageCount) || 0} (каждые 5-7 сообщений предлагай что-то новое)
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

Помни: ты создаешь атмосферу уютного бара, где каждый гость — желанный друг!`;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    if (!OPENAI_API_KEY) return json({ error: 'OPENAI_API_KEY secret is not set' }, 500);

    if (REQUIRE_AUTH) {
      const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return json({ error: 'Unauthorized' }, 401);
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.personality !== 'string' || !Array.isArray(body.messages)) {
      return json({ error: 'Expected { messages, personality, context? }' }, 400);
    }

    // Защита от злоупотреблений: только user/assistant, последние 20, обрезка длины
    const messages = body.messages
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20)
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    if (messages.length === 0) return json({ error: 'messages is empty' }, 400);

    const upstream = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(body.personality.slice(0, 2000), body.context) },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!upstream.ok) {
      console.error('AI provider error:', upstream.status, await upstream.text());
      return json({ error: 'AI provider error' }, 502);
    }

    const data = await upstream.json();
    return json({ content: data.choices?.[0]?.message?.content ?? '' });
  } catch (e) {
    console.error('bartender-chat error:', e);
    return json({ error: 'Internal error' }, 500);
  }
});