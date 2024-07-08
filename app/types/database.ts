export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string | null;
          name: string | null;
          username: string | null;
          email: string | null;
          role: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          name?: string | null;
          username?: string | null;
          email?: string | null;
          role?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          name?: string | null;
          username?: string | null;
          email?: string | null;
          role?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
