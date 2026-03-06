// Powered by OnSpace.AI

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useBartender } from '@/hooks/useBartender';
import { commonIngredients } from '@/constants/cocktails';
import { theme } from '@/constants/theme';

export function IngredientSelector() {
  const { selectedIngredients, toggleIngredient, clearIngredients } = useBartender();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Доступные ингредиенты</Text>
        {selectedIngredients.length > 0 && (
          <Pressable onPress={clearIngredients} style={styles.clearButton}>
            <Text style={styles.clearText}>Очистить</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {commonIngredients.map((ingredient) => {
          const isSelected = selectedIngredients.includes(ingredient);
          return (
            <Pressable
              key={ingredient}
              onPress={() => toggleIngredient(ingredient)}
              style={({ pressed }) => [
                styles.chip,
                isSelected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {ingredient}
              </Text>
              {isSelected && (
                <MaterialIcons name="check" size={16} color={theme.colors.background} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  clearButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  clearText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  chipTextSelected: {
    color: theme.colors.background,
    fontWeight: '600',
  },
});
