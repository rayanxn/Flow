export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          notify_email: boolean;
          notify_in_app: boolean;
          notify_mentions: boolean;
          notify_assignments: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          avatar_url?: string | null;
          notify_email?: boolean;
          notify_in_app?: boolean;
          notify_mentions?: boolean;
          notify_assignments?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          avatar_url?: string | null;
          notify_email?: boolean;
          notify_in_app?: boolean;
          notify_mentions?: boolean;
          notify_assignments?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          issue_prefix: string;
          issue_counter: number;
          default_sprint_length: number;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          issue_prefix?: string;
          issue_counter?: number;
          default_sprint_length?: number;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          issue_prefix?: string;
          issue_counter?: number;
          default_sprint_length?: number;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          primary_project_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          primary_project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: "owner" | "admin" | "member";
          primary_project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace_invites: {
        Row: {
          id: string;
          workspace_id: string;
          code: string;
          role: "admin" | "member";
          created_by: string;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          code?: string;
          role?: "admin" | "member";
          created_by: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          code?: string;
          role?: "admin" | "member";
          created_by?: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_invites_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teams_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          color: string;
          lead_id: string | null;
          team_id: string | null;
          is_private: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          color?: string;
          lead_id?: string | null;
          team_id?: string | null;
          is_private?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          lead_id?: string | null;
          team_id?: string | null;
          is_private?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      labels: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          color: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          color: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          color?: string;
        };
        Relationships: [
          {
            foreignKeyName: "labels_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      sprints: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          name: string;
          goal: string | null;
          status: "planning" | "active" | "completed";
          start_date: string | null;
          end_date: string | null;
          capacity: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          name: string;
          goal?: string | null;
          status?: "planning" | "active" | "completed";
          start_date?: string | null;
          end_date?: string | null;
          capacity?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          project_id?: string;
          name?: string;
          goal?: string | null;
          status?: "planning" | "active" | "completed";
          start_date?: string | null;
          end_date?: string | null;
          capacity?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sprints_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sprints_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      issues: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          issue_number: number;
          issue_key: string;
          title: string;
          description: string | null;
          status: "todo" | "in_progress" | "in_review" | "done";
          priority: number;
          assignee_id: string | null;
          sprint_id: string | null;
          due_date: string | null;
          story_points: number | null;
          sort_order: number;
          created_by: string;
          completed_at: string | null;
          checklist: { id: string; text: string; completed: boolean }[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          issue_number: number;
          issue_key: string;
          title: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "in_review" | "done";
          priority?: number;
          assignee_id?: string | null;
          sprint_id?: string | null;
          due_date?: string | null;
          story_points?: number | null;
          sort_order?: number;
          created_by: string;
          completed_at?: string | null;
          checklist?: { id: string; text: string; completed: boolean }[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          project_id?: string;
          issue_number?: number;
          issue_key?: string;
          title?: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "in_review" | "done";
          priority?: number;
          assignee_id?: string | null;
          sprint_id?: string | null;
          due_date?: string | null;
          story_points?: number | null;
          sort_order?: number;
          created_by?: string;
          completed_at?: string | null;
          checklist?: { id: string; text: string; completed: boolean }[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "issues_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "issues_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      issue_labels: {
        Row: {
          issue_id: string;
          label_id: string;
        };
        Insert: {
          issue_id: string;
          label_id: string;
        };
        Update: {
          issue_id?: string;
          label_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "issue_labels_issue_id_fkey";
            columns: ["issue_id"];
            isOneToOne: false;
            referencedRelation: "issues";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "issue_labels_label_id_fkey";
            columns: ["label_id"];
            isOneToOne: false;
            referencedRelation: "labels";
            referencedColumns: ["id"];
          },
        ];
      };
      views: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          filters: Json;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          filters?: Json;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          description?: string | null;
          filters?: Json;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "views_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      activities: {
        Row: {
          id: string;
          workspace_id: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          actor_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          activity_id: string;
          type: "mention" | "assigned" | "comment" | "status_change" | "general";
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          activity_id: string;
          type?: "mention" | "assigned" | "comment" | "status_change" | "general";
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          activity_id?: string;
          type?: "mention" | "assigned" | "comment" | "status_change" | "general";
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: false;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_workspace_member: {
        Args: { ws_id: string };
        Returns: boolean;
      };
      get_user_workspace_role: {
        Args: { ws_id: string };
        Returns: string;
      };
      create_issue: {
        Args: {
          p_workspace_id: string;
          p_project_id: string;
          p_title: string;
          p_description?: string | null;
          p_status?: string;
          p_priority?: number;
          p_assignee_id?: string | null;
          p_sprint_id?: string | null;
          p_due_date?: string | null;
          p_story_points?: number | null;
          p_sort_order?: number;
          p_label_ids?: string[];
        };
        Returns: Database["public"]["Tables"]["issues"]["Row"];
      };
      create_workspace: {
        Args: {
          p_name: string;
          p_slug: string;
          p_team_size?: string | null;
        };
        Returns: Database["public"]["Tables"]["workspaces"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Convenience types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
