"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];

export type LeadFormData = {
  title: string;
  client_id: string;
  source: string;
  stage: "new" | "contacted" | "proposal" | "negotiation" | "won" | "lost";
  value: string;
  probability: string;
  follow_up_at: string;
  notes: string;
};

export async function createLead(data: LeadFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("leads").insert({
    user_id: user.id,
    title: data.title,
    client_id: data.client_id && data.client_id !== "none" ? data.client_id : null,
    source: data.source || null,
    stage: data.stage,
    value: data.value ? Number(data.value) : null,
    probability: data.probability ? Number(data.probability) : null,
    follow_up_at: data.follow_up_at || null,
    notes: data.notes || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/sales");
}

export async function updateLead(id: string, data: Partial<LeadFormData>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: LeadUpdate = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.client_id !== undefined && {
      client_id: data.client_id && data.client_id !== "none" ? data.client_id : null,
    }),
    ...(data.source !== undefined && { source: data.source || null }),
    ...(data.stage !== undefined && {
      stage: data.stage,
      closed_at:
        data.stage === "won" || data.stage === "lost"
          ? new Date().toISOString()
          : null,
    }),
    ...(data.value !== undefined && {
      value: data.value ? Number(data.value) : null,
    }),
    ...(data.probability !== undefined && {
      probability: data.probability ? Number(data.probability) : null,
    }),
    ...(data.follow_up_at !== undefined && {
      follow_up_at: data.follow_up_at || null,
    }),
    ...(data.notes !== undefined && { notes: data.notes || null }),
  };

  const { error } = await supabase.from("leads").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
}
