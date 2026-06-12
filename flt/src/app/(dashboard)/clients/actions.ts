"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ClientFormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  status: "active" | "inactive" | "prospect";
  notes: string;
};

export async function createClient_(data: ClientFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("clients").insert({
    user_id: user.id,
    name: data.name,
    company: data.company || null,
    email: data.email || null,
    phone: data.phone || null,
    country: data.country || null,
    status: data.status,
    notes: data.notes || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}

export async function updateClient(id: string, data: ClientFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("clients")
    .update({
      name: data.name,
      company: data.company || null,
      email: data.email || null,
      phone: data.phone || null,
      country: data.country || null,
      status: data.status,
      notes: data.notes || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}

export async function deleteClient(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}
