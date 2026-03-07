// Powered by OnSpace.AI

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { BartenderCharacter } from '@/types/bartender';
import { bartenders } from '@/constants/bartenders';
import { Message } from '@/types/bartender';
import { useAuth } from '@/hooks/useAuth';
import { databaseService } from '@/services/databaseService';
import { aiService } from '@/services/aiService';
import { voiceService } from '@/services/voiceService';

interface BartenderContextType {
  selectedBartender: BartenderCharacter;
  selectBartender: (id: string) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  selectedIngredients: string[];
  toggleIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  isLoadingResponse: boolean;
  favoriteCocktails: string[];
  toggleFavorite: (cocktailId: string) => Promise<void>;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  speakMessage: (text: string) => Promise<void>;
}

export const BartenderContext = createContext<BartenderContextType | undefined>(undefined);

export function BartenderProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [selectedBartender, setSelectedBartender] = useState<BartenderCharacter>(bartenders[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [favoriteCocktails, setFavoriteCocktails] = useState<string[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Загрузка истории чата при выборе бармена
  useEffect(() => {
    // Ждем пока AuthContext инициализируется
    if (authLoading) return;

    if (user) {
      loadChatHistory().catch(console.error);
      loadFavorites().catch(console.error);
    } else {
      // Отправить приветствие при первой загрузке
      if (messages.length === 0) {
        sendGreeting();
      }
    }
  }, [user, selectedBartender.id, authLoading]);

  const sendGreeting = () => {
    const greetingMessage: Message = {
      id: 'greeting-' + Date.now(),
      sender: 'bartender',
      text: selectedBartender.greeting,
      timestamp: new Date(),
    };
    setMessages([greetingMessage]);
  };

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data } = await databaseService.getChatMessages(user.id, selectedBartender.id);
      if (data) {
        const loadedMessages: Message[] = data.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.content,
        timestamp: new Date(msg.created_at),
      }));
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data } = await databaseService.getFavoriteCocktails(user.id);
      if (data) {
        setFavoriteCocktails(data.map((f) => f.cocktail_id));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const selectBartender = async (id: string) => {
    const bartender = bartenders.find((b) => b.id === id);
    if (bartender) {
      setSelectedBartender(bartender);
      setMessages([]);
      
      // Отправить приветствие от нового бармена
      setTimeout(() => {
        const greetingMessage: Message = {
          id: 'greeting-' + Date.now(),
          sender: 'bartender',
          text: bartender.greeting,
          timestamp: new Date(),
        };
        setMessages([greetingMessage]);
      }, 500);
      
      // Сохранить выбор в профиле
      if (user) {
        await databaseService.updateBartenderProfile(user.id, {
          favorite_bartender: id,
        });
      }
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Сохранить в базу данных
    if (user) {
      await databaseService.saveChatMessage(
        user.id,
        selectedBartender.id,
        message.sender,
        message.text
      );
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Добавить сообщение пользователя
    await addMessage({
      sender: 'user',
      text: text.trim(),
    });

    // Получить ответ от AI
    setIsLoadingResponse(true);
    try {
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
      }));

      conversationHistory.push({
        role: 'user',
        content: text.trim(),
      });

      // Добавить контекст для более живого общения
      const contextInfo = {
        bartenderName: selectedBartender.nameRu,
        specialties: selectedBartender.specialties,
        catchphrases: selectedBartender.catchphrases,
        messageCount: messages.length,
        hasIngredients: selectedIngredients.length > 0,
        ingredients: selectedIngredients,
      };

      const response = await aiService.chat(
        conversationHistory,
        selectedBartender.personalityRu,
        contextInfo
      );

      await addMessage({
        sender: 'bartender',
        text: response,
      });

      // Озвучить ответ если включен голосовой режим
      if (voiceEnabled) {
        await voiceService.speak(response, selectedBartender.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      await addMessage({
        sender: 'bartender',
        text: 'Извините, произошла ошибка. Попробуйте еще раз.',
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const clearMessages = async () => {
    setMessages([]);
    
    if (user) {
      await databaseService.clearChatHistory(user.id, selectedBartender.id);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((i) => i !== ingredient);
      }
      return [...prev, ingredient];
    });
  };

  const clearIngredients = () => {
    setSelectedIngredients([]);
  };

  const toggleFavorite = async (cocktailId: string) => {
    if (!user) return;

    const isFav = favoriteCocktails.includes(cocktailId);
    
    if (isFav) {
      await databaseService.removeFavoriteCocktail(user.id, cocktailId);
      setFavoriteCocktails((prev) => prev.filter((id) => id !== cocktailId));
    } else {
      await databaseService.addFavoriteCocktail(user.id, cocktailId);
      setFavoriteCocktails((prev) => [...prev, cocktailId]);
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      voiceService.stopSpeaking();
    }
    setVoiceEnabled((prev) => !prev);
  };

  const speakMessage = async (text: string) => {
    await voiceService.speak(text, selectedBartender.id);
  };

  return (
    <BartenderContext.Provider
      value={{
        selectedBartender,
        selectBartender,
        messages,
        addMessage,
        sendMessage,
        clearMessages,
        selectedIngredients,
        toggleIngredient,
        clearIngredients,
        isLoadingResponse,
        favoriteCocktails,
        toggleFavorite,
        voiceEnabled,
        toggleVoice,
        speakMessage,
      }}
    >
      {children}
    </BartenderContext.Provider>
  );
}
