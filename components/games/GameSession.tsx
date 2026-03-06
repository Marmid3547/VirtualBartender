// Powered by OnSpace.AI

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useGame } from '@/hooks/useGame';
import { gameService } from '@/services/gameService';
import { theme } from '@/constants/theme';

export function GameSession() {
  const { currentSession, endGame, nextTurn, updateScore, getLeaderboard } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [coinFlip, setCoinFlip] = useState<'heads' | 'tails' | null>(null);

  const game = currentSession ? gameService.getGameById(currentSession.gameId) : null;
  const currentPlayer = currentSession?.players.find(
    (p) => p.id === currentSession.currentPlayer
  );

  useEffect(() => {
    if (game?.category === 'timer' && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const handleNewQuestion = () => {
    if (!game) return;
    const question = gameService.getRandomQuestion(game.id);
    if (question) {
      setCurrentQuestion(question);
    }
  };

  const handleNewChallenge = () => {
    if (!game) return;
    const challenge = gameService.getRandomChallenge(game.id);
    if (challenge) {
      setCurrentQuestion(challenge);
    }
  };

  const handleFlipCoin = () => {
    const result = gameService.flipCoin();
    setCoinFlip(result);
  };

  const handleStartTimer = () => {
    setTimeRemaining(30);
  };

  const handleNextTurn = () => {
    nextTurn();
    setCurrentQuestion(null);
    setCoinFlip(null);
    setTimeRemaining(null);
  };

  const handleEndGame = () => {
    Alert.alert(
      'Завершить игру',
      'Вы уверены, что хотите завершить игру?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Завершить',
          style: 'destructive',
          onPress: () => endGame(),
        },
      ]
    );
  };

  if (!currentSession || !game || !currentPlayer) {
    return null;
  }

  const leaderboard = getLeaderboard();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.gameTitle}>{game.nameRu}</Text>
          <Text style={styles.round}>Раунд {currentSession.currentRound}</Text>
        </View>
        <Pressable onPress={handleEndGame} style={styles.endButton}>
          <MaterialIcons name="close" size={24} color={theme.colors.error} />
        </Pressable>
      </View>

      <View style={styles.currentPlayerCard}>
        <Text style={styles.currentPlayerLabel}>Текущий игрок</Text>
        <Text style={styles.currentPlayerName}>{currentPlayer.name}</Text>
      </View>

      {game.category === 'questions' && (
        <View style={styles.section}>
          {currentQuestion ? (
            <View style={styles.questionCard}>
              <MaterialIcons name="chat-bubble" size={32} color={theme.colors.primary} />
              <Text style={styles.questionText}>{currentQuestion}</Text>
            </View>
          ) : (
            <Pressable onPress={handleNewQuestion} style={styles.actionButton}>
              <MaterialIcons name="refresh" size={24} color={theme.colors.background} />
              <Text style={styles.actionButtonText}>Новый вопрос</Text>
            </Pressable>
          )}
        </View>
      )}

      {game.category === 'challenges' && (
        <View style={styles.section}>
          {currentQuestion ? (
            <View style={styles.questionCard}>
              <MaterialIcons name="emoji-events" size={32} color={theme.colors.accent} />
              <Text style={styles.questionText}>{currentQuestion}</Text>
            </View>
          ) : (
            <Pressable onPress={handleNewChallenge} style={styles.actionButton}>
              <MaterialIcons name="shuffle" size={24} color={theme.colors.background} />
              <Text style={styles.actionButtonText}>Новое задание</Text>
            </Pressable>
          )}
        </View>
      )}

      {game.category === 'dice' && (
        <View style={styles.section}>
          {coinFlip ? (
            <View style={styles.coinResult}>
              <MaterialIcons
                name={coinFlip === 'heads' ? 'stars' : 'monetization-on'}
                size={64}
                color={theme.colors.primary}
              />
              <Text style={styles.coinText}>
                {coinFlip === 'heads' ? 'Орел' : 'Решка'}
              </Text>
            </View>
          ) : (
            <Pressable onPress={handleFlipCoin} style={styles.actionButton}>
              <MaterialIcons name="autorenew" size={24} color={theme.colors.background} />
              <Text style={styles.actionButtonText}>Бросить монету</Text>
            </Pressable>
          )}
        </View>
      )}

      {game.category === 'timer' && (
        <View style={styles.section}>
          {timeRemaining !== null ? (
            <View style={styles.timerCard}>
              <Text style={styles.timerText}>{timeRemaining}с</Text>
              {timeRemaining === 0 && (
                <Text style={styles.timerLabel}>Время вышло!</Text>
              )}
            </View>
          ) : (
            <Pressable onPress={handleStartTimer} style={styles.actionButton}>
              <MaterialIcons name="timer" size={24} color={theme.colors.background} />
              <Text style={styles.actionButtonText}>Запустить таймер (30с)</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.controls}>
        <Pressable onPress={handleNextTurn} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Следующий игрок</Text>
          <MaterialIcons name="arrow-forward" size={20} color={theme.colors.background} />
        </Pressable>
      </View>

      <View style={styles.leaderboard}>
        <Text style={styles.leaderboardTitle}>Табло</Text>
        {leaderboard.map((entry, index) => (
          <View key={entry.player.id} style={styles.leaderboardItem}>
            <View style={styles.leaderboardRank}>
              <Text style={styles.leaderboardRankText}>#{index + 1}</Text>
            </View>
            <Text style={styles.leaderboardName}>{entry.player.name}</Text>
            <Text style={styles.leaderboardScore}>{entry.score} очков</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gameTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  round: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  endButton: {
    padding: theme.spacing.sm,
  },
  currentPlayerCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  currentPlayerLabel: {
    ...theme.typography.caption,
    color: theme.colors.background,
    opacity: 0.8,
  },
  currentPlayerName: {
    ...theme.typography.h1,
    color: theme.colors.background,
    marginTop: theme.spacing.xs,
  },
  section: {
    gap: theme.spacing.md,
  },
  questionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  questionText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
  },
  coinResult: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  coinText: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  timerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  timerLabel: {
    ...theme.typography.h3,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
  },
  controls: {
    gap: theme.spacing.sm,
  },
  nextButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  nextButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
  },
  leaderboard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  leaderboardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardRankText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  leaderboardName: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  leaderboardScore: {
    ...theme.typography.bodyLarge,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
