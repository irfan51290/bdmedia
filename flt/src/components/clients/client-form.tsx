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
import type { ClientFormData } from "@/app/(dashboard)/clients/actions";

interface ClientFormProps {
  defaultValues?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const inputClass =
  "border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-10";

const labelClass = "text-xs font-bold uppercase tracking-widest";

export function ClientForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save client",
}: ClientFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ClientFormData = {
      name: fd.get("name") as string,
      company: fd.get("company") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      country: fd.get("country") as string,
      status: fd.get("status") as ClientFormData["status"],
      notes: fd.get("notes") as string,
    };
    startTransition(() => onSubmit(data));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Company */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className={labelClass}>Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Jane Smith"
            defaultValue={defaultValues?.name}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company" className={labelClass}>Company</Label>
          <Input
            id="company"
            name="company"
            placeholder="Acme Pte Ltd"
            defaultValue={defaultValues?.company}
            className={inputClass}
          />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className={labelClass}>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@acme.com"
            defaultValue={defaultValues?.email}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className={labelClass}>Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+65 9123 4567"
            defaultValue={defaultValues?.phone}
            className={inputClass}
          />
        </div>
      </div>

      {/* Country + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="country" className={labelClass}>Country</Label>
          <Input
            id="country"
            name="country"
            placeholder="Singapore"
            defaultValue={defaultValues?.country}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>Status</Label>
          <Select name="status" defaultValue={defaultValues?.status ?? "prospect"}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className={labelClass}>Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any context about this client…"
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
          className="flex-1 h-10 neu-btn bg-brand-teal text-white font-bold rounded-sm border-black cursor-pointer"
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
