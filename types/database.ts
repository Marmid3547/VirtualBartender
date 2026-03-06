// Powered by OnSpace.AI

export interface Database {
  public: {
    Tables: {
      bartender_profiles: {
        Row: {
          id: string;
          user_id: string;
          favorite_bartender: string;
          age_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          favorite_bartender?: string;
          age_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          favorite_bartender?: string;
          age_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorite_cocktails: {
        Row: {
          id: string;
          user_id: string;
          cocktail_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cocktail_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cocktail_id?: string;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          sender: 'user' | 'bartender';
          content: string;
          bartender_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sender: 'user' | 'bartender';
          content: string;
          bartender_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sender?: 'user' | 'bartender';
          content?: string;
          bartender_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
