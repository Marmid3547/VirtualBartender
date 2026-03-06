// Powered by OnSpace.AI

import { Platform } from 'react-native';

export const speechToTextService = {
  async transcribe(audioUri: string): Promise<string> {
    try {
      // Конвертируем аудио файл в base64
      const base64Audio = await this.convertAudioToBase64(audioUri);

      // Используем OnSpace AI для транскрипции
      const response = await fetch('https://api.onspace.ai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'whisper-1',
          audio: base64Audio,
          language: 'ru',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw new Error('Не удалось распознать речь');
    }
  },

  async convertAudioToBase64(uri: string): Promise<string> {
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // Для мобильных платформ используем FileSystem
        const FileSystem = require('expo-file-system').default;
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return base64;
      }
    } catch (error) {
      console.error('Error converting audio to base64:', error);
      throw error;
    }
  },
};
