// Powered by OnSpace.AI

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Cocktail } from '@/constants/cocktails';
import { theme } from '@/constants/theme';

interface CocktailCardProps {
  cocktail: Cocktail;
  onPress: () => void;
}

export function CocktailCard({ cocktail, onPress }: CocktailCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{cocktail.nameRu}</Text>
        <View style={styles.badge}>
          <MaterialIcons
            name={cocktail.alcoholic ? 'local-bar' : 'local-cafe'}
            size={16}
            color={cocktail.alcoholic ? theme.colors.primary : theme.colors.success}
          />
        </View>
      </View>

      <Text style={styles.category}>
        {cocktail.category === 'classic'
          ? 'Классический'
          : cocktail.category === 'modern'
          ? 'Современный'
          : 'Безалкогольный'}
      </Text>

      <View style={styles.ingredients}>
        {cocktail.ingredients.slice(0, 3).map((ing, index) => (
          <View key={index} style={styles.ingredientChip}>
            <Text style={styles.ingredientText}>{ing.nameRu}</Text>
          </View>
        ))}
        {cocktail.ingredients.length > 3 && (
          <Text style={styles.moreText}>+{cocktail.ingredients.length - 3}</Text>
        )}
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
    ...theme.shadows.sm,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  ingredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  ingredientChip: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  ingredientText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  moreText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});
