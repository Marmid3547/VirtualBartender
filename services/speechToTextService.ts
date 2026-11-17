import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';

export const speechToTextService = {
  async transcribe(audioUri: string): Promise<string> {
    try {
      const base64Audio = await this.convertAudioToBase64(audioUri);
      const filename = audioUri.split('/').pop()?.split('?')[0] || 'audio.m4a';

      const { data, error } = await supabase.functions.invoke('bartender-stt', {
        body: { audio: base64Audio, language: 'ru', filename },
      });
      if (error) throw error;
      return data?.text || '';
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw new Error('Не удалось распознать речь');
    }
  },

  async convertAudioToBase64(uri: string): Promise<string> {
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(((reader.result as string) ?? '').split(',')[1] ?? '');
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    // Исправлено: корректный импорт вместо require(...).default
    return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  },
};