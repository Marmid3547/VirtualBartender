// Powered by OnSpace.AI

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBartender } from '@/hooks/useBartender';
import { theme } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { clearMessages, clearIngredients, voiceEnabled, toggleVoice } = useBartender();

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm?.();
      }
    } else {
      Alert.alert(title, message, [
        { text: 'Отмена', style: 'cancel' },
        { text: 'OK', onPress: onConfirm },
      ]);
    }
  };

  const handleClearChat = () => {
    showAlert(
      'Очистить историю',
      'Вы уверены, что хотите очистить всю историю разговоров?',
      () => clearMessages()
    );
  };

  const handleClearIngredients = () => {
    showAlert(
      'Очистить ингредиенты',
      'Вы уверены, что хотите очистить все выбранные ингредиенты?',
      () => clearIngredients()
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Настройки</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Аккаунт</Text>
          {user ? (
            <>
              <View style={styles.infoUser}>
                <MaterialIcons name="email" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.infoUserText}>{user.email}</Text>
              </View>
              <Pressable
                onPress={async () => {
                  await signOut();
                  router.replace('/(tabs)');
                }}
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.itemPressed,
                ]}
              >
                <MaterialIcons name="logout" size={24} color={theme.colors.error} />
                <Text style={[styles.itemText, { color: theme.colors.error }]}>Выйти</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => router.push('/auth/login')}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
            >
              <MaterialIcons name="login" size={24} color={theme.colors.primary} />
              <Text style={[styles.itemText, { color: theme.colors.primary }]}>Войти</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Общее</Text>

          <Pressable
            onPress={toggleVoice}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <MaterialIcons 
              name={voiceEnabled ? "volume-up" : "volume-off"} 
              size={24} 
              color={voiceEnabled ? theme.colors.primary : theme.colors.text} 
            />
            <Text style={styles.itemText}>Озвучивание ответов</Text>
            <View style={[styles.toggle, voiceEnabled && styles.toggleActive]}>            <Text style={styles.toggleText}>{voiceEnabled ? 'ВКЛ' : 'ВЫКЛ'}</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleClearChat}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          >
            <MaterialIcons name="delete-outline" size={24} color={theme.colors.text} />
            <Text style={styles.itemText}>Очистить историю чата</Text>
          </Pressable>

          <Pressable
            onPress={handleClearIngredients}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          >
            <MaterialIcons name="clear-all" size={24} color={theme.colors.text} />
            <Text style={styles.itemText}>Очистить ингредиенты</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Виртуальный бармен</Text>
            <Text style={styles.infoText}>
              Ваш персональный помощник в мире миксологии. Создавайте коктейли, получайте
              рекомендации и общайтесь с профессиональными барменами.
            </Text>
          </View>

          <View style={styles.warningCard}>
            <MaterialIcons name="warning" size={20} color={theme.colors.warning} />
            <Text style={styles.warningText}>
              Пожалуйста, употребляйте алкоголь ответственно. Приложение предназначено для лиц
              старше 18 лет.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Голосовой режим</Text>

          <View style={styles.infoCard}>
            <MaterialIcons name="mic" size={24} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
              <Text style={styles.infoTitle}>Голосовое общение</Text>
              <Text style={styles.infoText}>
                Нажмите на значок микрофона в чате, чтобы отправить голосовое сообщение. Включите озвучивание ответов для полноценного голосового диалога.
              </Text>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  infoTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  warningCard: {
    flexDirection: 'row',
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
    lineHeight: 20,
  },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    opacity: 0.6,
  },
  comingSoonText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  toggle: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '600',
  },
  infoUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  infoUserText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
});
