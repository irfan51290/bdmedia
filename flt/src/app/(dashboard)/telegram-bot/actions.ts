"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveTelegramChatId(chatId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("profiles")
    .update({ telegram_chat_id: chatId.trim() || null })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/telegram-bot");
}
