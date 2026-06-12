"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveTelegramChatId } from "@/app/(dashboard)/telegram-bot/actions";
import { Check } from "lucide-react";

interface ChatIdFormProps {
  currentChatId: string | null;
}

export function ChatIdForm({ currentChatId }: ChatIdFormProps) {
  const [chatId, setChatId] = useState(currentChatId ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveTelegramChatId(chatId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-3 mt-4">
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">
        Your Chat ID
      </p>
      <div className="flex gap-2">
        <Input
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="e.g. 123456789"
          className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-10 font-mono text-sm"
        />
        <Button
          onClick={handleSave}
          disabled={isPending || chatId === (currentChatId ?? "")}
          className="shrink-0 h-10 neu-btn bg-black text-white font-bold rounded-sm cursor-pointer px-4"
        >
          {saved ? <Check className="w-4 h-4" /> : isPending ? "…" : "Save"}
        </Button>
      </div>
      <p className="text-xs opacity-60">
        Get your Chat ID by messaging{" "}
        <strong>@userinfobot</strong> on Telegram.
      </p>
    </div>
  );
}
