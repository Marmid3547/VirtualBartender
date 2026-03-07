// Powered by OnSpace.AI

import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

class VoiceService {
  private recording: Audio.Recording | null = null;
  private isSpeaking = false;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording) {
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  }

  isRecording(): boolean {
    return this.recording !== null;
  }

  async speak(
    text: string, 
    bartenderId: string = 'asian',
    language: string = 'ru-RU'
  ): Promise<void> {
    try {
      // Остановить текущую речь если она идет
      if (this.isSpeaking) {
        await this.stopSpeaking();
      }

      this.isSpeaking = true;

      // Настройки голоса для каждого бармена
      const voiceSettings = this.getVoiceSettings(bartenderId);

      await Speech.speak(text, {
        language,
        pitch: voiceSettings.pitch,
        rate: voiceSettings.rate,
        voice: voiceSettings.voice,
        onDone: () => {
          this.isSpeaking = false;
        },
        onStopped: () => {
          this.isSpeaking = false;
        },
        onError: () => {
          this.isSpeaking = false;
        },
      });
    } catch (error) {
      console.error('Failed to speak:', error);
      this.isSpeaking = false;
    }
  }

  private getVoiceSettings(bartenderId: string) {
    // Настройки голоса для каждого бармена
    const settings: Record<string, { pitch: number; rate: number; voice?: string }> = {
      asian: {
        pitch: 1.2,      // Более высокий женский голос
        rate: 0.85,      // Медленнее, томнее
      },
      man: {
        pitch: 0.8,      // Низкий мужской голос
        rate: 0.9,       // Умеренная скорость
      },
      young: {
        pitch: 1.0,      // Средний мужской голос
        rate: 1.0,       // Быстрее, энергичнее
      },
    };

    return settings[bartenderId] || settings.asian;
  }

  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('Failed to stop speaking:', error);
    }
  }

  getSpeakingState(): boolean {
    return this.isSpeaking;
  }

  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.filter((voice) => voice.language.startsWith('ru'));
    } catch (error) {
      console.error('Failed to get voices:', error);
      return [];
    }
  }
}

export const voiceService = new VoiceService();
