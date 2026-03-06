// Powered by OnSpace.AI

import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/useAuth';
import { BartenderSelector } from '@/components/bartender/BartenderSelector';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Image
        source={require('@/assets/images/bar-background.png')}
        style={styles.background}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <View style={[styles.content, { paddingTop: insets.top }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Virtual Bartender</Text>
          <Text style={styles.subtitle}>Ваш личный бармен и советник по коктейлям</Text>
        </View>
        <BartenderSelector />
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
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
