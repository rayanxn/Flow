export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      board_invitations: {
        Row: {
          board_id: string;
          created_at: string;
          id: string;
          invitee_email: string;
          inviter_id: string;
          role: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          board_id: string;
          created_at?: string;
          id?: string;
          invitee_email: string;
          inviter_id: string;
          role: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          board_id?: string;
          created_at?: string;
          id?: string;
          invitee_email?: string;
          inviter_id?: string;
          role?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "board_invitations_board_id_fkey";
            columns: ["board_id"];
            isOneToOne: false;
            referencedRelation: "boards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "board_invitations_inviter_id_fkey";
            columns: ["inviter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      board_memberships: {
        Row: {
          board_id: string;
          created_at: string;
          id: string;
          role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          board_id: string;
          created_at?: string;
          id?: string;
          role: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          board_id?: string;
          created_at?: string;
          id?: string;
          role?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "board_memberships_board_id_fkey";
            columns: ["board_id"];
            isOneToOne: false;
            referencedRelation: "boards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "board_memberships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      boards: {
        Row: {
          archived_at: string | null;
          background: string;
          created_at: string;
          id: string;
          is_archived: boolean;
          owner_id: string;
          title: string;
          updated_at: string;
          visibility: string;
        };
        Insert: {
          archived_at?: string | null;
          background?: string;
          created_at?: string;
          id?: string;
          is_archived?: boolean;
          owner_id: string;
          title: string;
          updated_at?: string;
          visibility?: string;
        };
        Update: {
          archived_at?: string | null;
          background?: string;
          created_at?: string;
          id?: string;
          is_archived?: boolean;
          owner_id?: string;
          title?: string;
          updated_at?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: "boards_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cards: {
        Row: {
          created_at: string;
          description: string | null;
          due_date: string | null;
          id: string;
          list_id: string;
          position: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          list_id: string;
          position: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          list_id?: string;
          position?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cards_list_id_fkey";
            columns: ["list_id"];
            isOneToOne: false;
            referencedRelation: "lists";
            referencedColumns: ["id"];
          },
        ];
      };
      lists: {
        Row: {
          board_id: string;
          created_at: string;
          id: string;
          position: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          board_id: string;
          created_at?: string;
          id?: string;
          position: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          board_id?: string;
          created_at?: string;
          id?: string;
          position?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lists_board_id_fkey";
            columns: ["board_id"];
            isOneToOne: false;
            referencedRelation: "boards";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      user_can_access_board: {
        Args: {
          target_board_id: string;
        };
        Returns: boolean;
      };
      user_can_admin_board: {
        Args: {
          target_board_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
