"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileFormData = {
  full_name: string;
  bio: string;
  location: string;
  website: string;
  avatar_url: string;
  hourly_rate: string;
  currency: string;
  telegram_chat_id: string;
};

export async function updateProfile(data: ProfileFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name || null,
      bio: data.bio || null,
      location: data.location || null,
      website: data.website || null,
      avatar_url: data.avatar_url || null,
      hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : null,
      currency: data.currency || "SGD",
      telegram_chat_id: data.telegram_chat_id || null,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function sendPasswordReset(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/settings`,
  });
  if (error) throw new Error(error.message);
}
