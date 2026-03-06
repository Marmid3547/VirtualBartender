// Powered by OnSpace.AI

import { DrinkingGame, GameSession, Player, GameAction } from '@/types/games';
import { drinkingGames } from '@/constants/drinkingGames';

class GameService {
  getGames(): DrinkingGame[] {
    return drinkingGames;
  }

  getGameById(id: string): DrinkingGame | undefined {
    return drinkingGames.find((game) => game.id === id);
  }

  getGamesByCategory(category: string): DrinkingGame[] {
    return drinkingGames.filter((game) => game.category === category);
  }

  getRandomGame(): DrinkingGame {
    const randomIndex = Math.floor(Math.random() * drinkingGames.length);
    return drinkingGames[randomIndex];
  }

  getRandomQuestion(gameId: string): string | null {
    const game = this.getGameById(gameId);
    if (!game || !game.questions || game.questions.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * game.questions.length);
    return game.questions[randomIndex];
  }

  getRandomChallenge(gameId: string): string | null {
    const game = this.getGameById(gameId);
    if (!game || !game.challenges || game.challenges.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * game.challenges.length);
    return game.challenges[randomIndex];
  }

  createSession(gameId: string, players: Player[]): GameSession {
    const game = this.getGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (players.length < game.minPlayers) {
      throw new Error(`Minimum ${game.minPlayers} players required`);
    }

    if (players.length > game.maxPlayers) {
      throw new Error(`Maximum ${game.maxPlayers} players allowed`);
    }

    const scores: { [playerId: string]: number } = {};
    players.forEach((player) => {
      scores[player.id] = 0;
    });

    return {
      id: Date.now().toString(),
      gameId,
      players,
      currentRound: 1,
      scores,
      startTime: new Date(),
      isActive: true,
      currentPlayer: players[0].id,
    };
  }

  nextTurn(session: GameSession): GameSession {
    const currentIndex = session.players.findIndex((p) => p.id === session.currentPlayer);
    const nextIndex = (currentIndex + 1) % session.players.length;
    const isNewRound = nextIndex === 0;

    return {
      ...session,
      currentPlayer: session.players[nextIndex].id,
      currentRound: isNewRound ? session.currentRound + 1 : session.currentRound,
    };
  }

  updateScore(session: GameSession, playerId: string, points: number): GameSession {
    return {
      ...session,
      scores: {
        ...session.scores,
        [playerId]: (session.scores[playerId] || 0) + points,
      },
    };
  }

  getLeaderboard(session: GameSession): Array<{ player: Player; score: number }> {
    return session.players
      .map((player) => ({
        player,
        score: session.scores[player.id] || 0,
      }))
      .sort((a, b) => b.score - a.score);
  }

  flipCoin(): 'heads' | 'tails' {
    return Math.random() < 0.5 ? 'heads' : 'tails';
  }

  rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  endSession(session: GameSession): GameSession {
    return {
      ...session,
      isActive: false,
    };
  }
}

export const gameService = new GameService();
