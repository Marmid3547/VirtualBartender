// Powered by OnSpace.AI

import { cocktailsDatabase, Cocktail } from '@/constants/cocktails';

export const bartenderService = {
  searchCocktails(ingredients: string[]): Cocktail[] {
    if (ingredients.length === 0) {
      return cocktailsDatabase;
    }

    const lowerIngredients = ingredients.map((ing) => ing.toLowerCase());

    return cocktailsDatabase.filter((cocktail) => {
      const cocktailIngredients = cocktail.ingredients.map((ing) =>
        ing.nameRu.toLowerCase()
      );

      const matchCount = lowerIngredients.filter((userIng) =>
        cocktailIngredients.some((cIng) => cIng.includes(userIng) || userIng.includes(cIng))
      ).length;

      return matchCount > 0;
    }).sort((a, b) => {
      const matchCountA = lowerIngredients.filter((userIng) =>
        a.ingredients.some((ing) =>
          ing.nameRu.toLowerCase().includes(userIng) || userIng.includes(ing.nameRu.toLowerCase())
        )
      ).length;

      const matchCountB = lowerIngredients.filter((userIng) =>
        b.ingredients.some((ing) =>
          ing.nameRu.toLowerCase().includes(userIng) || userIng.includes(ing.nameRu.toLowerCase())
        )
      ).length;

      return matchCountB - matchCountA;
    });
  },

  getCocktailById(id: string): Cocktail | undefined {
    return cocktailsDatabase.find((c) => c.id === id);
  },

  getRandomCocktail(): Cocktail {
    const randomIndex = Math.floor(Math.random() * cocktailsDatabase.length);
    return cocktailsDatabase[randomIndex];
  },

  getCocktailsByCategory(category: 'classic' | 'modern' | 'nonalcoholic'): Cocktail[] {
    return cocktailsDatabase.filter((c) => c.category === category);
  },

  generateBartenderResponse(
    userMessage: string,
    context: {
      selectedIngredients: string[];
      bartenderName: string;
    }
  ): string {
    const lowerMessage = userMessage.toLowerCase();

    // Анекдоты и истории
    if (lowerMessage.includes('анекдот') || lowerMessage.includes('шутк')) {
      const jokes = [
        'Заходит программист в бар, заказывает пиво. Бармен: "Одно или два?". Программист: "Да!"',
        'Бармен спрашивает: "Что будете заказывать?". Клиент: "Что посоветуете?". Бармен: "Советую уйти, пока не поздно!"',
        'Почему бармены хорошие психологи? Потому что они знают, что смешивать можно не только напитки!',
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Тосты
    if (lowerMessage.includes('тост')) {
      const toasts = [
        'За встречи, которые украшают нашу жизнь!',
        'За то, чтобы наши желания совпадали с возможностями!',
        'За хороших друзей и отличные коктейли!',
      ];
      return toasts[Math.floor(Math.random() * toasts.length)];
    }

    // Рекомендации
    if (lowerMessage.includes('что посоветуе') || lowerMessage.includes('что приготовить')) {
      if (context.selectedIngredients.length > 0) {
        const matches = this.searchCocktails(context.selectedIngredients);
        if (matches.length > 0) {
          const top = matches[0];
          return `На основе ваших ингредиентов я рекомендую ${top.nameRu}! Это ${top.alcoholic ? 'классический коктейль' : 'безалкогольный напиток'}. Хотите рецепт?`;
        }
      }
      const random = this.getRandomCocktail();
      return `Могу предложить ${random.nameRu} — ${random.alcoholic ? 'отличный алкогольный коктейль' : 'освежающий безалкогольный напиток'}!`;
    }

    // Приветствие
    if (
      lowerMessage.includes('привет') ||
      lowerMessage.includes('здравств') ||
      lowerMessage.includes('добр')
    ) {
      return `Здравствуйте! Я ${context.bartenderName}, ваш виртуальный бармен. Расскажите, какие ингредиенты у вас есть, или спросите совет по коктейлям!`;
    }

    // Безалкогольное
    if (lowerMessage.includes('безалкоголь')) {
      const nonalco = this.getCocktailsByCategory('nonalcoholic');
      if (nonalco.length > 0) {
        return `Конечно! У меня есть отличные безалкогольные варианты: ${nonalco.map((c) => c.nameRu).join(', ')}. Что попробуем?`;
      }
    }

    // Поиск по названию коктейля
    const foundCocktail = cocktailsDatabase.find(
      (c) =>
        c.nameRu.toLowerCase().includes(lowerMessage) ||
        c.name.toLowerCase().includes(lowerMessage)
    );
    if (foundCocktail) {
      return `${foundCocktail.nameRu} — отличный выбор! ${foundCocktail.instructionsRu}`;
    }

    // Общий ответ
    return 'Интересный вопрос! Могу помочь с рецептами коктейлей, рассказать анекдот или предложить тост. Что вас интересует?';
  },
};
