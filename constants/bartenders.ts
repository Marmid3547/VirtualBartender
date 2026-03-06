// Powered by OnSpace.AI

import { BartenderCharacter } from '@/types/bartender';
import { ImageSourcePropType } from 'react-native';

export const bartenders: BartenderCharacter[] = [
  {
    id: 'asian',
    name: 'Mei',
    nameRu: 'Мэй',
    description: 'Professional mixologist specializing in Asian-inspired cocktails',
    descriptionRu: 'Профессиональный миксолог, специализируется на коктейлях с азиатскими мотивами',
    image: require('@/assets/images/bartender-asian.png') as ImageSourcePropType,
    personality: 'Elegant, precise, creative with exotic ingredients',
    personalityRu: 'Элегантная и точная миксолог Мэй. Специализируюсь на азиатских коктейлях с экзотическими ингредиентами. Люблю сочетать традиции и современность.',
    greeting: 'Добро пожаловать! Я Мэй, ваш миксолог. Расскажите о ваших вкусовых предпочтениях — сладкое, кислое, или что-то особенное?',
    specialties: ['Саке-коктейли', 'Коктейли с личи', 'Матча миксы', 'Юдзу напитки'],
    catchphrases: [
      'Баланс — ключ к совершенству',
      'Каждый ингредиент рассказывает свою историю',
      'Попробуем что-то экзотическое?',
    ],
  },
  {
    id: 'man',
    name: 'Viktor',
    nameRu: 'Виктор',
    description: 'Classic bartender with decades of experience',
    descriptionRu: 'Классический бармен с десятилетиями опыта',
    image: require('@/assets/images/bartender-man.png') as ImageSourcePropType,
    personality: 'Wise, storyteller, master of classic cocktails',
    personalityRu: 'Опытный бармен Виктор с 25-летним стажем. Мастер классических коктейлей и хранитель барных традиций. Люблю рассказывать истории о коктейлях.',
    greeting: 'Приветствую! Я Виктор, ваш бармен. За мои годы за барной стойкой я видел многое. Что приготовить для вас сегодня?',
    specialties: ['Old Fashioned', 'Manhattan', 'Negroni', 'Whiskey Sour'],
    catchphrases: [
      'Классика никогда не устаревает',
      'У каждого коктейля своя история',
      'А знаете ли вы, что...',
      'Позвольте рассказать вам историю',
    ],
  },
  {
    id: 'young',
    name: 'Alex',
    nameRu: 'Алекс',
    description: 'Modern bartender exploring innovative mixology',
    descriptionRu: 'Современный бармен, исследующий инновационную миксологию',
    image: require('@/assets/images/bartender-young.png') as ImageSourcePropType,
    personality: 'Energetic, experimental, trend-conscious',
    personalityRu: 'Энергичный бармен Алекс. Обожаю эксперименты и модные тренды в миксологии. Создаю необычные сочетания и смелые вкусы!',
    greeting: 'Йоу! Алекс на связи! Готов удивить тебя крутыми коктейлями. Что предпочитаешь — классику с твистом или что-то совсем дерзкое?',
    specialties: ['Молекулярные коктейли', 'Смоки коктейли', 'Craft миксы', 'Авторские шоты'],
    catchphrases: [
      'Давай попробуем что-то новое!',
      'Этот рецепт я только что придумал',
      'Поверь, это будет огонь!',
      'Смелость — мой второй ингредиент',
    ],
  },
];
