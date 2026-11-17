import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Не заданы EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. Скопируйте .env.example в .env и заполните значения.'
  );
}

const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) =>
        Promise.resolve(typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null),
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }
  return AsyncStorage;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter() as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});