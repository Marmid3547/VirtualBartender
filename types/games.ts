// Powered by OnSpace.AI

export type GameCategory = 'questions' | 'challenges' | 'cards' | 'dice' | 'timer';

export interface DrinkingGame {
  id: string;
  nameRu: string;
  nameEn: string;
  category: GameCategory;
  minPlayers: number;
  maxPlayers: number;
  descriptionRu: string;
  rulesRu: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // минуты
  questions?: string[];
  challenges?: string[];
}

export interface GameSession {
  id: string;
  gameId: string;
  players: Player[];
  currentRound: number;
  scores: { [playerId: string]: number };
  startTime: Date;
  isActive: boolean;
  currentPlayer?: string;
  timeRemaining?: number;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
}

export interface GameAction {
  type: 'drink' | 'truth' | 'dare' | 'skip' | 'point';
  playerId: string;
  value?: number;
}
