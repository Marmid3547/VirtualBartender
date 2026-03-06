// Powered by OnSpace.AI

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBartender } from '@/hooks/useBartender';
import { bartenderService } from '@/services/bartenderService';
import { CocktailCard } from '@/components/cocktail/CocktailCard';
import { theme } from '@/constants/theme';

export default function CocktailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedIngredients } = useBartender();
  const [filter, setFilter] = useState<'all' | 'alcoholic' | 'nonalcoholic'>('all');

  const cocktails = useMemo(() => {
    const results = bartenderService.searchCocktails(selectedIngredients);

    if (filter === 'alcoholic') {
      return results.filter((c) => c.alcoholic);
    }
    if (filter === 'nonalcoholic') {
      return results.filter((c) => !c.alcoholic);
    }
    return results;
  }, [selectedIngredients, filter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Коктейли</Text>
        {selectedIngredients.length > 0 && (
          <Text style={styles.subtitle}>
            Найдено {cocktails.length} по вашим ингредиентам
          </Text>
        )}
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'alcoholic', 'nonalcoholic'] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={({ pressed }) => [
              styles.filterButton,
              filter === f && styles.filterButtonActive,
              pressed && styles.filterButtonPressed,
            ]}
          >
            <Text
              style={[styles.filterText, filter === f && styles.filterTextActive]}
            >
              {f === 'all' ? 'Все' : f === 'alcoholic' ? 'Алкогольные' : 'Безалкогольные'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {cocktails.map((cocktail) => (
          <CocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            onPress={() => router.push(`/cocktail/${cocktail.id}`)}
          />
        ))}

        {cocktails.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {selectedIngredients.length > 0
                ? 'Не найдено коктейлей с такими ингредиентами'
                : 'Выберите ингредиенты для поиска коктейлей'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonPressed: {
    opacity: 0.7,
  },
  filterText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  filterTextActive: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
