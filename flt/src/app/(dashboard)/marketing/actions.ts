"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

type PostUpdate = Database["public"]["Tables"]["content_posts"]["Update"];

export type PostFormData = {
  title: string;
  platform: string;
  status: "idea" | "draft" | "scheduled" | "published" | "archived";
  body: string;
  scheduled_at: string;
  tags: string; // comma-separated
};

export async function createPost(data: PostFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("content_posts").insert({
    user_id: user.id,
    title: data.title,
    platform: data.platform,
    status: data.status,
    body: data.body || null,
    scheduled_at: data.scheduled_at || null,
    published_at:
      data.status === "published" ? new Date().toISOString() : null,
    tags: data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  });

  if (error) throw new Error(error.message);
  revalidatePath("/marketing");
}

export async function updatePost(id: string, data: PostFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: PostUpdate = {
    title: data.title,
    platform: data.platform,
    status: data.status,
    body: data.body || null,
    scheduled_at: data.scheduled_at || null,
    published_at:
      data.status === "published" ? new Date().toISOString() : null,
    tags: data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  };

  const { error } = await supabase.from("content_posts").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/marketing");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("content_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/marketing");
}
