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

      {/* Фото бармена на треть экрана */}
      <View style={styles.bartenderSection}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.background} />
        </Pressable>
        
        <Text style={styles.bartenderName}>{selectedBartender.nameRu}</Text>
        <Image 
          source={selectedBartender.image} 
          style={styles.bartenderImage} 
          contentFit="cover" 
        />
      </View>

      <View style={styles.content}>

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
    height: '33.33%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '33.33%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bartenderSection: {
    height: '33.33%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  bartenderName: {
    ...theme.typography.h1,
    color: theme.colors.background,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: theme.spacing.md,
    zIndex: 1,
  },
  bartenderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
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
