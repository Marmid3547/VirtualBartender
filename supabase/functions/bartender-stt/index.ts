// Голос -> текст (Whisper). Ключ только на сервере.
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const OPENAI_BASE_URL = (Deno.env.get('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/$/, '');
// Можно отдельно переопределить провайдера для речи (например, OpenRouter не умеет whisper)
const STT_API_KEY = Deno.env.get('STT_API_KEY') ?? OPENAI_API_KEY;
const STT_BASE_URL = (Deno.env.get('STT_BASE_URL') ?? OPENAI_BASE_URL).replace(/\/$/, '');
const STT_MODEL = Deno.env.get('OPENAI_STT_MODEL') ?? 'whisper-1';
const MAX_BASE64_LEN = 12_000_000; // ~9 МБ аудио

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
    if (!STT_API_KEY) return json({ error: 'API key secret is not set' }, 500);

    const body = await req.json().catch(() => null);
    if (!body || typeof body.audio !== 'string') return json({ error: 'Expected { audio: base64 }' }, 400);
    if (body.audio.length > MAX_BASE64_LEN) return json({ error: 'Audio too large' }, 413);

    const bytes = Uint8Array.from(atob(body.audio), (c) => c.charCodeAt(0));
    const filename = typeof body.filename === 'string' ? body.filename : 'audio.m4a';

    const form = new FormData();
    form.append('file', new Blob([bytes], { type: 'application/octet-stream' }), filename);
    form.append('model', STT_MODEL);
    form.append('language', typeof body.language === 'string' ? body.language : 'ru');

    const upstream = await fetch(`${STT_BASE_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${STT_API_KEY}` },
      body: form,
    });

    if (!upstream.ok) {
      console.error('STT provider error:', upstream.status, await upstream.text());
      return json({ error: 'STT provider error' }, 502);
    }

    const data = await upstream.json();
    return json({ text: data.text ?? '' });
  } catch (e) {
    console.error('bartender-stt error:', e);
    return json({ error: 'Internal error' }, 500);
  }
});