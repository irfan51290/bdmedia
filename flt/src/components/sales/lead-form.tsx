"use client";

import { useTransition } from "react";
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
import type { LeadFormData } from "@/app/(dashboard)/sales/actions";

type Client = { id: string; name: string };

interface LeadFormProps {
  defaultValues?: Partial<LeadFormData>;
  clients: Client[];
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const inputClass =
  "border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-10";

const labelClass = "text-xs font-bold uppercase tracking-widest";

export function LeadForm({
  defaultValues,
  clients,
  onSubmit,
  onCancel,
  submitLabel = "Save lead",
}: LeadFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: LeadFormData = {
      title: fd.get("title") as string,
      client_id: fd.get("client_id") as string,
      source: fd.get("source") as string,
      stage: fd.get("stage") as LeadFormData["stage"],
      value: fd.get("value") as string,
      probability: fd.get("probability") as string,
      follow_up_at: fd.get("follow_up_at") as string,
      notes: fd.get("notes") as string,
    };
    startTransition(() => onSubmit(data));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className={labelClass}>
          Title *
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Website redesign for Acme"
          defaultValue={defaultValues?.title}
          required
          className={inputClass}
        />
      </div>

      {/* Client + Source */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className={labelClass}>Client</Label>
          <Select name="client_id" defaultValue={defaultValues?.client_id || "none"}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
              <SelectValue placeholder="No client" />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="none">No client</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="source" className={labelClass}>
            Source
          </Label>
          <Input
            id="source"
            name="source"
            placeholder="Referral, LinkedIn…"
            defaultValue={defaultValues?.source}
            className={inputClass}
          />
        </div>
      </div>

      {/* Stage */}
      <div className="space-y-1.5">
        <Label className={labelClass}>Stage</Label>
        <Select name="stage" defaultValue={defaultValues?.stage ?? "new"}>
          <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Value + Probability */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="value" className={labelClass}>
            Value (SGD)
          </Label>
          <Input
            id="value"
            name="value"
            type="number"
            min="0"
            step="0.01"
            placeholder="5000"
            defaultValue={defaultValues?.value}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="probability" className={labelClass}>
            Probability %
          </Label>
          <Input
            id="probability"
            name="probability"
            type="number"
            min="0"
            max="100"
            placeholder="50"
            defaultValue={defaultValues?.probability}
            className={inputClass}
          />
        </div>
      </div>

      {/* Follow-up date */}
      <div className="space-y-1.5">
        <Label htmlFor="follow_up_at" className={labelClass}>
          Follow-up date
        </Label>
        <Input
          id="follow_up_at"
          name="follow_up_at"
          type="date"
          defaultValue={
            defaultValues?.follow_up_at
              ? defaultValues.follow_up_at.slice(0, 10)
              : ""
          }
          className={inputClass}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className={labelClass}>
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Key context, next steps…"
          defaultValue={defaultValues?.notes}
          rows={3}
          className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 h-10 neu-btn bg-brand-yellow text-black font-bold rounded-sm border-black cursor-pointer"
        >
          {isPending ? "Saving…" : submitLabel}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="h-10 neu-btn bg-card text-foreground font-bold rounded-sm border-black cursor-pointer px-4"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
