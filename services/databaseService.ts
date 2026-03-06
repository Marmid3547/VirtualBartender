// Powered by OnSpace.AI

import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type BartenderProfile = Database['public']['Tables']['bartender_profiles']['Row'];
type FavoriteCocktail = Database['public']['Tables']['favorite_cocktails']['Row'];
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export const databaseService = {
  // Профили барменов
  async getBartenderProfile(userId: string) {
    const { data, error } = await supabase
      .from('bartender_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  },

  async updateBartenderProfile(
    userId: string,
    updates: Partial<Omit<BartenderProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) {
    const { data, error } = await supabase
      .from('bartender_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    return { data, error };
  },

  // Избранные коктейли
  async getFavoriteCocktails(userId: string) {
    const { data, error } = await supabase
      .from('favorite_cocktails')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async addFavoriteCocktail(userId: string, cocktailId: string) {
    const { data, error } = await supabase
      .from('favorite_cocktails')
      .insert({ user_id: userId, cocktail_id: cocktailId })
      .select()
      .single();

    return { data, error };
  },

  async removeFavoriteCocktail(userId: string, cocktailId: string) {
    const { error } = await supabase
      .from('favorite_cocktails')
      .delete()
      .eq('user_id', userId)
      .eq('cocktail_id', cocktailId);

    return { error };
  },

  async isFavorite(userId: string, cocktailId: string): Promise<boolean> {
    const { data } = await supabase
      .from('favorite_cocktails')
      .select('id')
      .eq('user_id', userId)
      .eq('cocktail_id', cocktailId)
      .single();

    return !!data;
  },

  // История чатов
  async getChatMessages(userId: string, bartenderId: string, limit = 50) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('bartender_id', bartenderId)
      .order('created_at', { ascending: true })
      .limit(limit);

    return { data, error };
  },

  async saveChatMessage(
    userId: string,
    bartenderId: string,
    sender: 'user' | 'bartender',
    content: string
  ) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        bartender_id: bartenderId,
        sender,
        content,
      })
      .select()
      .single();

    return { data, error };
  },

  async clearChatHistory(userId: string, bartenderId: string) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId)
      .eq('bartender_id', bartenderId);

    return { error };
  },
};
