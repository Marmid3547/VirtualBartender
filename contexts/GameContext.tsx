// Powered by OnSpace.AI

import React, { createContext, useState, ReactNode } from 'react';
import { GameSession, Player } from '@/types/games';
import { gameService } from '@/services/gameService';

interface GameContextType {
  currentSession: GameSession | null;
  startGame: (gameId: string, players: Player[]) => void;
  endGame: () => void;
  nextTurn: () => void;
  updateScore: (playerId: string, points: number) => void;
  getLeaderboard: () => Array<{ player: Player; score: number }>;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  const startGame = (gameId: string, players: Player[]) => {
    const session = gameService.createSession(gameId, players);
    setCurrentSession(session);
  };

  const endGame = () => {
    if (currentSession) {
      const endedSession = gameService.endSession(currentSession);
      setCurrentSession(endedSession);
    }
  };

  const nextTurn = () => {
    if (currentSession) {
      const updatedSession = gameService.nextTurn(currentSession);
      setCurrentSession(updatedSession);
    }
  };

  const updateScore = (playerId: string, points: number) => {
    if (currentSession) {
      const updatedSession = gameService.updateScore(currentSession, playerId, points);
      setCurrentSession(updatedSession);
    }
  };

  const getLeaderboard = () => {
    if (!currentSession) return [];
    return gameService.getLeaderboard(currentSession);
  };

  return (
    <GameContext.Provider
      value={{
        currentSession,
        startGame,
        endGame,
        nextTurn,
        updateScore,
        getLeaderboard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
