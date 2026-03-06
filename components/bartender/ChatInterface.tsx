// Powered by OnSpace.AI

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useBartender } from '@/hooks/useBartender';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { voiceService } from '@/services/voiceService';
import { speechToTextService } from '@/services/speechToTextService';

export function ChatInterface() {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    selectedBartender, 
    isLoadingResponse,
    voiceEnabled,
    toggleVoice,
  } = useBartender();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const userMessage = inputText.trim();
    setInputText('');
    await sendMessage(userMessage);
  };

  const handleVoicePress = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isRecording) {
      // Остановить запись
      setIsRecording(false);
      setIsProcessingVoice(true);

      try {
        const audioUri = await voiceService.stopRecording();
        
        if (audioUri) {
          // Распознать речь
          const transcribedText = await speechToTextService.transcribe(audioUri);
          
          if (transcribedText) {
            await sendMessage(transcribedText);
          } else {
            Alert.alert('Ошибка', 'Не удалось распознать речь');
          }
        }
      } catch (error) {
        console.error('Voice processing error:', error);
        Alert.alert('Ошибка', 'Произошла ошибка при обработке голоса');
      } finally {
        setIsProcessingVoice(false);
      }
    } else {
      // Начать запись
      try {
        await voiceService.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error('Recording start error:', error);
        Alert.alert(
          'Ошибка',
          'Не удалось начать запись. Проверьте разрешения микрофона.'
        );
      }
    }
  };

  const handleToggleVoice = () => {
    toggleVoice();
    if (!voiceEnabled) {
      Alert.alert(
        'Голосовой режим',
         'Теперь ответы бармена будут озвучиваться автоматически'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="local-bar" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>
              Начните разговор с {selectedBartender.nameRu}
            </Text>
            <Text style={styles.emptySubtext}>
              Спросите о коктейлях, рецептах или просто поболтайте!
            </Text>
          </View>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userBubble : styles.bartenderBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.sender === 'user' ? styles.userText : styles.bartenderText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Pressable
          onPress={handleToggleVoice}
          style={({ pressed }) => [
            styles.voiceToggleButton,
            voiceEnabled && styles.voiceToggleActive,
            pressed && styles.buttonPressed,
          ]}
        >
          <MaterialIcons 
            name={voiceEnabled ? "volume-up" : "volume-off"} 
            size={20} 
            color={voiceEnabled ? theme.colors.background : theme.colors.textMuted} 
          />
        </Pressable>

        <Input
          value={inputText}
          onChangeText={setInputText}
          placeholder={user ? "Напишите сообщение..." : "Войдите для чата"}
          style={styles.input}
          multiline
          onSubmitEditing={handleSend}
          editable={!isLoadingResponse && !!user && !isRecording}
        />

        {isProcessingVoice ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <Pressable
            onPress={handleVoicePress}
            style={({ pressed }) => [
              styles.voiceButton,
              isRecording && styles.voiceButtonRecording,
              !user && styles.voiceButtonDisabled,
              pressed && styles.buttonPressed,
            ]}
            disabled={!user || isLoadingResponse}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialIcons 
                name={isRecording ? "stop" : "mic"} 
                size={24} 
                color={theme.colors.background} 
              />
            </Animated.View>
          </Pressable>
        )}

        {isLoadingResponse ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <Pressable
            onPress={handleSend}
            style={({ pressed }) => [
              styles.sendButton,
              (!inputText.trim() || !user) && styles.sendButtonDisabled,
              pressed && styles.buttonPressed,
            ]}
            disabled={!inputText.trim() || !user || isRecording}
          >
            <MaterialIcons name="send" size={24} color={theme.colors.background} />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  bartenderBubble: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
  },
  messageText: {
    ...theme.typography.body,
  },
  userText: {
    color: theme.colors.background,
  },
  bartenderText: {
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  voiceToggleButton: {
    backgroundColor: theme.colors.surface,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceToggleActive: {
    backgroundColor: theme.colors.primary,
  },
  voiceButton: {
    backgroundColor: theme.colors.accent,
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonRecording: {
    backgroundColor: theme.colors.error,
  },
  voiceButtonDisabled: {
    opacity: 0.5,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
