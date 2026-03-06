// Powered by OnSpace.AI

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { bartenderService } from '@/services/bartenderService';
import { theme } from '@/constants/theme';

export default function CocktailDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cocktail = bartenderService.getCocktailById(id || '');

  if (!cocktail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.error}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>Коктейль не найден</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{cocktail.nameRu}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.badge}>
          <MaterialIcons
            name={cocktail.alcoholic ? 'local-bar' : 'local-cafe'}
            size={48}
            color={cocktail.alcoholic ? theme.colors.primary : theme.colors.success}
          />
        </View>

        <Text style={styles.title}>{cocktail.nameRu}</Text>
        <Text style={styles.subtitle}>{cocktail.name}</Text>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {cocktail.category === 'classic'
              ? 'Классический'
              : cocktail.category === 'modern'
              ? 'Современный'
              : 'Безалкогольный'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ингредиенты</Text>
          {cocktail.ingredients.map((ing, index) => (
            <View key={index} style={styles.ingredient}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText}>
                {ing.nameRu} — {ing.amount}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Приготовление</Text>
          <Text style={styles.instructions}>{cocktail.instructionsRu}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Подача</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="local-drink" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>Бокал: {cocktail.glass}</Text>
          </View>
          {cocktail.garnishRu && (
            <View style={styles.infoRow}>
              <MaterialIcons name="eco" size={20} color={theme.colors.success} />
              <Text style={styles.infoText}>Украшение: {cocktail.garnishRu}</Text>
            </View>
          )}
        </View>

        {cocktail.alcoholic && (
          <View style={styles.warningCard}>
            <MaterialIcons name="warning" size={20} color={theme.colors.warning} />
            <Text style={styles.warningText}>
              Содержит алкоголь. Употребляйте ответственно.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryBadge: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.xl,
  },
  categoryText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  ingredientText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  instructions: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...theme.typography.h3,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
  },
});
