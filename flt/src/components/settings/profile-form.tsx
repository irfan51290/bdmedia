"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfile, type ProfileFormData } from "@/app/(dashboard)/settings/actions";
import { Check } from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const CURRENCIES = ["SGD", "USD", "EUR", "GBP", "AUD", "MYR", "IDR", "PHP", "THB"];

const inputClass =
  "border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-10";

const labelClass = "text-xs font-bold uppercase tracking-widest";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ProfileFormData = {
      full_name: fd.get("full_name") as string,
      bio: fd.get("bio") as string,
      location: fd.get("location") as string,
      website: fd.get("website") as string,
      avatar_url: fd.get("avatar_url") as string,
      hourly_rate: fd.get("hourly_rate") as string,
      currency: fd.get("currency") as string,
      telegram_chat_id: fd.get("telegram_chat_id") as string,
    };
    startTransition(async () => {
      await updateProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar + Name */}
      <div className="flex items-start gap-4">
        {/* Avatar preview */}
        <div className="shrink-0">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-16 h-16 rounded-sm border-[3px] border-black object-cover shadow-[3px_3px_0_#000]"
            />
          ) : (
            <div className="w-16 h-16 rounded-sm border-[3px] border-black bg-brand-yellow shadow-[3px_3px_0_#000] flex items-center justify-center">
              <span className="text-2xl font-extrabold text-black">
                {(profile.full_name ?? profile.email)[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="full_name" className={labelClass}>Full name</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="Your name"
            defaultValue={profile.full_name ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {/* Avatar URL */}
      <div className="space-y-1.5">
        <Label htmlFor="avatar_url" className={labelClass}>Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          placeholder="https://…"
          defaultValue={profile.avatar_url ?? ""}
          className={inputClass}
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio" className={labelClass}>Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="A short description of what you do…"
          defaultValue={profile.bio ?? ""}
          rows={3}
          className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 resize-none"
        />
      </div>

      {/* Location + Website */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="location" className={labelClass}>Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Singapore"
            defaultValue={profile.location ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website" className={labelClass}>Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://yoursite.com"
            defaultValue={profile.website ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="border-t-[2px] border-black pt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Billing defaults
        </p>

        {/* Hourly rate + Currency */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="hourly_rate" className={labelClass}>Default hourly rate</Label>
            <Input
              id="hourly_rate"
              name="hourly_rate"
              type="number"
              min="0"
              step="0.01"
              placeholder="150"
              defaultValue={profile.hourly_rate ?? ""}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Currency</Label>
            <Select name="currency" defaultValue={profile.currency ?? "SGD"}>
              <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t-[2px] border-black pt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Integrations
        </p>

        {/* Telegram chat ID */}
        <div className="space-y-1.5">
          <Label htmlFor="telegram_chat_id" className={labelClass}>Telegram Chat ID</Label>
          <Input
            id="telegram_chat_id"
            name="telegram_chat_id"
            placeholder="e.g. 123456789 — message @userinfobot to get yours"
            defaultValue={profile.telegram_chat_id ?? ""}
            className={`${inputClass} font-mono`}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className="neu-btn bg-brand-teal text-white font-bold rounded-sm h-10 px-6 border-black cursor-pointer"
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
            <Check className="w-4 h-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
