export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appareils: {
        Row: {
          created_at: string
          date_allocation_tac: string | null
          id: string
          imei: string
          marque: string
          modele: string
          score_anomalie: number
          statut: Database["public"]["Enums"]["statut_appareil"]
          tac: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_allocation_tac?: string | null
          id?: string
          imei: string
          marque?: string
          modele?: string
          score_anomalie?: number
          statut?: Database["public"]["Enums"]["statut_appareil"]
          tac?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_allocation_tac?: string | null
          id?: string
          imei?: string
          marque?: string
          modele?: string
          score_anomalie?: number
          statut?: Database["public"]["Enums"]["statut_appareil"]
          tac?: string
          updated_at?: string
        }
        Relationships: []
      }
      enregistrements_imei: {
        Row: {
          created_at: string
          date_verification: string
          features: Json
          id: string
          imei: string
          resultat: Database["public"]["Enums"]["statut_appareil"]
          score_anomalie: number
          utilisateur_id: string
        }
        Insert: {
          created_at?: string
          date_verification?: string
          features?: Json
          id?: string
          imei: string
          resultat: Database["public"]["Enums"]["statut_appareil"]
          score_anomalie?: number
          utilisateur_id: string
        }
        Update: {
          created_at?: string
          date_verification?: string
          features?: Json
          id?: string
          imei?: string
          resultat?: Database["public"]["Enums"]["statut_appareil"]
          score_anomalie?: number
          utilisateur_id?: string
        }
        Relationships: []
      }
      historique_reparations: {
        Row: {
          created_at: string
          date_reparation: string
          id: string
          imei: string
          notes: string | null
          technicien_id: string
          type_reparation: string
        }
        Insert: {
          created_at?: string
          date_reparation?: string
          id?: string
          imei: string
          notes?: string | null
          technicien_id: string
          type_reparation?: string
        }
        Update: {
          created_at?: string
          date_reparation?: string
          id?: string
          imei?: string
          notes?: string | null
          technicien_id?: string
          type_reparation?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          marche: Database["public"]["Enums"]["marche_type"]
          nom: string
          type_activite: Database["public"]["Enums"]["activite_type"]
          updated_at: string
          user_id: string
          verifications_count: number
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          marche?: Database["public"]["Enums"]["marche_type"]
          nom?: string
          type_activite?: Database["public"]["Enums"]["activite_type"]
          updated_at?: string
          user_id: string
          verifications_count?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          marche?: Database["public"]["Enums"]["marche_type"]
          nom?: string
          type_activite?: Database["public"]["Enums"]["activite_type"]
          updated_at?: string
          user_id?: string
          verifications_count?: number
        }
        Relationships: []
      }
      signalements_vol: {
        Row: {
          created_at: string
          date_vol: string
          description: string | null
          id: string
          imei: string
          marque: string
          modele: string
          photo_url: string | null
          quartier: string
          reference: string
          signale_par: string
          statut: Database["public"]["Enums"]["statut_signalement"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_vol: string
          description?: string | null
          id?: string
          imei: string
          marque?: string
          modele?: string
          photo_url?: string | null
          quartier?: string
          reference: string
          signale_par: string
          statut?: Database["public"]["Enums"]["statut_signalement"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_vol?: string
          description?: string | null
          id?: string
          imei?: string
          marque?: string
          modele?: string
          photo_url?: string | null
          quartier?: string
          reference?: string
          signale_par?: string
          statut?: Database["public"]["Enums"]["statut_signalement"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activite_type: "revente" | "reparation" | "les_deux"
      app_role: "dealer" | "technicien" | "enqueteur" | "admin"
      marche_type: "Missebo" | "Dantokpa" | "Cadjehoun" | "Autre"
      statut_appareil: "legitime" | "suspect" | "vole"
      statut_signalement: "ouvert" | "en_cours" | "resolu"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activite_type: ["revente", "reparation", "les_deux"],
      app_role: ["dealer", "technicien", "enqueteur", "admin"],
      marche_type: ["Missebo", "Dantokpa", "Cadjehoun", "Autre"],
      statut_appareil: ["legitime", "suspect", "vole"],
      statut_signalement: ["ouvert", "en_cours", "resolu"],
    },
  },
} as const
