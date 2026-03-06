// Powered by OnSpace.AI

import React from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBartender } from '@/hooks/useBartender';
import { IngredientSelector } from '@/components/bartender/IngredientSelector';
import { ChatInterface } from '@/components/bartender/ChatInterface';
import { theme } from '@/constants/theme';

export default function BartenderChatScreen() {
  const insets = useSafeAreaInsets();
  const { selectedBartender } = useBartender();

  if (!selectedBartender) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    // Возврат к главному экрану (список барменов)
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Image
        source={require('@/assets/images/bar-background.png')}
        style={styles.background}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* Заголовок с барменом и кнопкой назад */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>

          <View style={styles.bartenderInfo}>
            <Image source={selectedBartender.image} style={styles.bartenderAvatar} contentFit="cover" />
            <View style={styles.bartenderDetails}>
              <Text style={styles.bartenderName}>{selectedBartender.nameRu}</Text>
              <Text style={styles.bartenderRole}>{selectedBartender.descriptionRu}</Text>
            </View>
          </View>
        </View>

        {/* Селектор ингредиентов */}
        <IngredientSelector />

        {/* Чат */}
        <View style={styles.chatContainer}>
          <ChatInterface />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: theme.colors.overlay,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  bartenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  bartenderAvatar: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  bartenderDetails: {
    flex: 1,
  },
  bartenderName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  bartenderRole: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    marginTop: theme.spacing.md,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
