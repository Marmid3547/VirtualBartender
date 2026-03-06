// Powered by OnSpace.AI

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrinkingGame } from '@/types/games';
import { theme } from '@/constants/theme';

interface GameCardProps {
  game: DrinkingGame;
  onPress: () => void;
}

const categoryIcons: { [key: string]: keyof typeof MaterialIcons.glyphMap } = {
  questions: 'question-answer',
  challenges: 'emoji-events',
  cards: 'style',
  dice: 'casino',
  timer: 'timer',
};

const difficultyColors = {
  easy: theme.colors.success,
  medium: theme.colors.warning,
  hard: theme.colors.error,
};

export function GameCard({ game, onPress }: GameCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={categoryIcons[game.category]}
            size={32}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{game.nameRu}</Text>
          <Text style={styles.subtitle}>{game.nameEn}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {game.descriptionRu}
      </Text>

      <View style={styles.footer}>
        <View style={styles.info}>
          <MaterialIcons name="people" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>
            {game.minPlayers}-{game.maxPlayers} игроков
          </Text>
        </View>

        <View style={styles.info}>
          <MaterialIcons name="schedule" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{game.duration} мин</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: difficultyColors[game.difficulty] + '20' }]}>
          <Text style={[styles.badgeText, { color: difficultyColors[game.difficulty] }]}>
            {game.difficulty === 'easy' && 'Легко'}
            {game.difficulty === 'medium' && 'Средне'}
            {game.difficulty === 'hard' && 'Сложно'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginLeft: 'auto',
  },
  badgeText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
});
