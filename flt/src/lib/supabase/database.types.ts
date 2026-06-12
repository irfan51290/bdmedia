// Auto-generate this file with: npx supabase gen types typescript --project-id xacfqaklnazfpgmaugm > src/lib/supabase/database.types.ts
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
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          telegram_chat_id: string | null;
          hourly_rate: number | null;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          country: string | null;
          notes: string | null;
          status: "active" | "inactive" | "prospect";
          total_billed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["clients"]["Row"],
          "id" | "total_billed" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          title: string;
          source: string | null;
          stage: "new" | "contacted" | "proposal" | "negotiation" | "won" | "lost";
          value: number | null;
          probability: number | null;
          notes: string | null;
          follow_up_at: string | null;
          closed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["leads"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          lead_id: string | null;
          title: string;
          description: string | null;
          status: "planning" | "active" | "paused" | "completed" | "cancelled";
          type: "fixed" | "hourly" | "retainer";
          budget: number | null;
          rate: number | null;
          start_date: string | null;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          status: "todo" | "in_progress" | "review" | "done";
          priority: "low" | "medium" | "high" | "urgent";
          due_date: string | null;
          completed_at: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["tasks"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          project_id: string | null;
          invoice_number: string;
          status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
          issue_date: string;
          due_date: string;
          paid_date: string | null;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          discount: number;
          total: number;
          currency: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["invoices"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      line_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          amount: number;
          position: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["line_items"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["line_items"]["Insert"]>;
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          category: string;
          description: string;
          amount: number;
          currency: string;
          receipt_url: string | null;
          is_billable: boolean;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["expenses"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
      };
      ledger_entries: {
        Row: {
          id: string;
          user_id: string;
          invoice_id: string | null;
          expense_id: string | null;
          type: "income" | "expense" | "refund" | "adjustment";
          amount: number;
          currency: string;
          description: string;
          date: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["ledger_entries"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["ledger_entries"]["Insert"]
        >;
      };
      content_posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          platform: string;
          status: "idea" | "draft" | "scheduled" | "published" | "archived";
          scheduled_at: string | null;
          published_at: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["content_posts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["content_posts"]["Insert"]
        >;
      };
      portfolio_items: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          url: string | null;
          image_url: string | null;
          tags: string[];
          is_featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["portfolio_items"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["portfolio_items"]["Insert"]
        >;
      };
      referrals: {
        Row: {
          id: string;
          user_id: string;
          referrer_client_id: string | null;
          referred_client_id: string | null;
          project_id: string | null;
          notes: string | null;
          reward_amount: number | null;
          reward_paid: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["referrals"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["referrals"]["Insert"]>;
      };
      time_logs: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          task_id: string | null;
          description: string | null;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number | null;
          is_billable: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["time_logs"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["time_logs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
