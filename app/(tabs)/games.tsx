// Powered by OnSpace.AI

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { GameCard } from '@/components/games/GameCard';
import { GameSession } from '@/components/games/GameSession';
import { useGame } from '@/hooks/useGame';
import { gameService } from '@/services/gameService';
import { DrinkingGame } from '@/types/games';
import { Player } from '@/types/games';
import { theme } from '@/constants/theme';

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const { currentSession, startGame } = useGame();
  const [selectedGame, setSelectedGame] = useState<DrinkingGame | null>(null);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(['']);

  const games = gameService.getGames();

  const handleGamePress = (game: DrinkingGame) => {
    setSelectedGame(game);
    setShowPlayerSetup(true);
  };

  const handleAddPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayerNames(playerNames.filter((_, i) => i !== index));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const handleStartGame = () => {
    if (!selectedGame) return;

    const validNames = playerNames.filter((name) => name.trim() !== '');

    if (validNames.length < selectedGame.minPlayers) {
      Alert.alert(
        'Недостаточно игроков',
        `Для этой игры нужно минимум ${selectedGame.minPlayers} игроков`
      );
      return;
    }

    if (validNames.length > selectedGame.maxPlayers) {
      Alert.alert(
        'Слишком много игроков',
        `Для этой игры максимум ${selectedGame.maxPlayers} игроков`
      );
      return;
    }

    const players: Player[] = validNames.map((name, index) => ({
      id: `player-${index}`,
      name,
    }));

    startGame(selectedGame.id, players);
    setShowPlayerSetup(false);
    setPlayerNames(['']);
    setSelectedGame(null);
  };

  const handleCloseSetup = () => {
    setShowPlayerSetup(false);
    setPlayerNames(['']);
    setSelectedGame(null);
  };

  if (currentSession?.isActive) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <GameSession />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Питейные игры</Text>
        <Text style={styles.subtitle}>Развлечения для вечеринки</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <MaterialIcons name="warning" size={24} color={theme.colors.warning} />
          <Text style={styles.warningText}>
            Употребляйте алкоголь ответственно. Игры предназначены для развлечения лиц старше 18
            лет.
          </Text>
        </View>

        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} onPress={() => handleGamePress(game)} />
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showPlayerSetup}
        animationType="slide"
        transparent
        onRequestClose={handleCloseSetup}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Добавьте игроков</Text>
              <Pressable onPress={handleCloseSetup}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            {selectedGame && (
              <View style={styles.gameInfo}>
                <Text style={styles.gameInfoText}>
                  {selectedGame.nameRu} • {selectedGame.minPlayers}-{selectedGame.maxPlayers}{' '}
                  игроков
                </Text>
              </View>
            )}

            <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
              {playerNames.map((name, index) => (
                <View key={index} style={styles.playerInput}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => handlePlayerNameChange(index, text)}
                    placeholder={`Игрок ${index + 1}`}
                    placeholderTextColor={theme.colors.textMuted}
                  />
                  {playerNames.length > 1 && (
                    <Pressable onPress={() => handleRemovePlayer(index)} style={styles.removeButton}>
                      <MaterialIcons name="remove-circle" size={24} color={theme.colors.error} />
                    </Pressable>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable onPress={handleAddPlayer} style={styles.addButton}>
                <MaterialIcons name="add" size={20} color={theme.colors.primary} />
                <Text style={styles.addButtonText}>Добавить игрока</Text>
              </Pressable>

              <Pressable onPress={handleStartGame} style={styles.startButton}>
                <Text style={styles.startButtonText}>Начать игру</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  warningCard: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
    marginBottom: theme.spacing.lg,
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  gamesGrid: {
    paddingBottom: theme.spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  gameInfo: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  gameInfoText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  playersList: {
    maxHeight: 300,
    marginBottom: theme.spacing.md,
  },
  playerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  input: {
    ...theme.typography.body,
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
  },
  removeButton: {
    padding: theme.spacing.xs,
  },
  modalActions: {
    gap: theme.spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  startButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
  },
});
