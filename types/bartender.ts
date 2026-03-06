// Powered by OnSpace.AI

import { ImageSourcePropType } from 'react-native';

export interface BartenderCharacter {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  image: ImageSourcePropType;
  personality: string;
  personalityRu: string;
  greeting: string;
  specialties: string[];
  catchphrases: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'bartender';
  text: string;
  timestamp: Date;
  cocktailSuggestion?: {
    id: string;
    name: string;
  };
  type?: 'text' | 'cocktail' | 'game';
}

export interface ChatContext {
  selectedIngredients: string[];
  preferredCategory?: 'alcoholic' | 'nonalcoholic';
  conversationTone: 'friendly' | 'professional' | 'casual';
  messageCount: number;
}
