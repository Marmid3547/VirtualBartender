// Powered by OnSpace.AI

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { BartenderProvider } from '@/contexts/BartenderContext';
import { GameProvider } from '@/contexts/GameContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BartenderProvider>
          <GameProvider>
            <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0a0a0a' },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="bartender-chat" 
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="cocktail/[id]" 
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="auth/login" 
              options={{
                presentation: 'modal',
              }}
            />
          </Stack>
          </GameProvider>
        </BartenderProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
