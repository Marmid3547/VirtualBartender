# 🍸 Виртуальный бармен

Мобильное приложение-бармен: рецепты коктейлей, обучение приготовлению,
общение с ИИ-барменами (текст + голос) и игры для компании. 18+

## Возможности
- 🍹 Каталог коктейлей: ингредиенты, пропорции, пошаговое приготовление
- 🤖 Три ИИ-бармена с разными характерами, подбор коктейля по ингредиентам
- 🎙 Голосовой ввод (Whisper) и озвучка ответов (expo-speech)
- 🎲 Игры для компании: «Я никогда не…», «Правда или выпей» и др.
- 🔐 Аккаунты: история чатов, избранное (Supabase Auth + Postgres/RLS)

## Стек
React Native 0.79 · Expo SDK 53 · Expo Router 5 · TypeScript · Supabase (Auth, DB, Edge Functions) · pnpm

## Запуск
```bash
pnpm install
cp .env.example .env   # заполнить значениями из Supabase → Settings → API
pnpm start             # Expo Go / эмулятор
```

## Бэкенд (Supabase)
1. SQL: таблицы `bartender_profiles`, `favorite_cocktails`, `chat_messages` + RLS (политики «только свои строки»).
2. Edge Functions: `bartender-chat` (чат с ИИ), `bartender-stt` (распознавание речи).
3. Секреты функций: `OPENAI_API_KEY`; опционально `OPENAI_BASE_URL`, `OPENAI_MODEL`,
   `OPENAI_STT_MODEL`, `STT_API_KEY`, `STT_BASE_URL`, `REQUIRE_AUTH`.

## Структура
app/            экраны (Expo Router): табы, чат, коктейль, вход
components/     bartender / cocktail / games / ui
constants/      база коктейлей, бармены, игры, тема
contexts/       Auth, Bartender, Game
services/       aiService, speechToTextService, voiceService, databaseService…
supabase/functions/  серверные функции (ключ ИИ только здесь)

## Безопасность
- Anon-ключ Supabase публичный по дизайну — данные защищает RLS.
- Ключ ИИ хранится только в секретах Edge Functions, в клиент не попадает.
- `.env` не коммитится (см. `.env.example`).

⚠️ Алкоголь вредит здоровью. Приложение предназначено для лиц 18+.