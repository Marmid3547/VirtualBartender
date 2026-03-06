// Powered by OnSpace.AI

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBartender } from '@/hooks/useBartender';
import { bartenders } from '@/constants/bartenders';
import { theme } from '@/constants/theme';

export function BartenderSelector() {
  const { selectedBartender, selectBartender } = useBartender();

  const handleSelectBartender = async (id: string) => {
    try {
      await selectBartender(id);
      // Небольшая задержка для корректной загрузки состояния
      setTimeout(() => {
        router.push('/bartender-chat');
      }, 100);
    } catch (error) {
      console.error('Error selecting bartender:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите бармена</Text>
      <Text style={styles.subtitle}>
        Каждый бармен имеет свой стиль и специализацию
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bartenders.map((bartender) => (
          <Pressable
            key={bartender.id}
            onPress={() => handleSelectBartender(bartender.id)}
            style={({ pressed }) => [
              styles.card,
              selectedBartender.id === bartender.id && styles.cardSelected,
              pressed && styles.cardPressed,
            ]}
          >
            {selectedBartender.id === bartender.id && (
              <View style={styles.badge}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
              </View>
            )}
            <Image source={bartender.image} style={styles.image} contentFit="cover" />
            <View style={styles.info}>
              <Text style={styles.name}>{bartender.nameRu}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {bartender.descriptionRu}
              </Text>
              <View style={styles.specialtiesContainer}>
                <Text style={styles.specialtiesLabel}>Специализации:</Text>
                {bartender.specialties.slice(0, 2).map((specialty, index) => (
                  <Text key={index} style={styles.specialty} numberOfLines={1}>
                    • {specialty}
                  </Text>
                ))}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  card: {
    width: 220,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceLight,
  },
  cardPressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    zIndex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surfaceLight,
  },
  info: {
    padding: theme.spacing.md,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  specialtiesContainer: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  specialtiesLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  specialty: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontSize: 11,
    marginTop: 2,
  },
});
