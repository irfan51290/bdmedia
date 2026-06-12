"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type ProjectFormData = {
  title: string;
  client_id: string;
  lead_id: string;
  type: "fixed" | "hourly" | "retainer";
  status: "planning" | "active" | "paused" | "completed" | "cancelled";
  budget: string;
  rate: string;
  start_date: string;
  due_date: string;
  description: string;
};

export async function createProject(data: ProjectFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    title: data.title,
    client_id: data.client_id && data.client_id !== "none" ? data.client_id : null,
    lead_id: data.lead_id && data.lead_id !== "none" ? data.lead_id : null,
    type: data.type,
    status: data.status,
    budget: data.budget ? Number(data.budget) : null,
    rate: data.rate ? Number(data.rate) : null,
    start_date: data.start_date || null,
    due_date: data.due_date || null,
    description: data.description || null,
    completed_at:
      data.status === "completed" ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/projects");
}

export async function updateProject(id: string, data: Partial<ProjectFormData>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: ProjectUpdate = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.client_id !== undefined && {
      client_id: data.client_id && data.client_id !== "none" ? data.client_id : null,
    }),
    ...(data.lead_id !== undefined && {
      lead_id: data.lead_id && data.lead_id !== "none" ? data.lead_id : null,
    }),
    ...(data.type !== undefined && { type: data.type }),
    ...(data.status !== undefined && {
      status: data.status,
      completed_at:
        data.status === "completed" ? new Date().toISOString() : null,
    }),
    ...(data.budget !== undefined && {
      budget: data.budget ? Number(data.budget) : null,
    }),
    ...(data.rate !== undefined && {
      rate: data.rate ? Number(data.rate) : null,
    }),
    ...(data.start_date !== undefined && { start_date: data.start_date || null }),
    ...(data.due_date !== undefined && { due_date: data.due_date || null }),
    ...(data.description !== undefined && { description: data.description || null }),
  };

  const { error } = await supabase.from("projects").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/projects");
}
