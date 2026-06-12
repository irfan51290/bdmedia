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
import type { ProjectFormData } from "@/app/(dashboard)/projects/actions";

type Client = { id: string; name: string };
type Lead = { id: string; title: string };

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData>;
  clients: Client[];
  leads: Lead[];
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const inputClass =
  "border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-10";

const labelClass = "text-xs font-bold uppercase tracking-widest";

export function ProjectForm({
  defaultValues,
  clients,
  leads,
  onSubmit,
  onCancel,
  submitLabel = "Save project",
}: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ProjectFormData = {
      title: fd.get("title") as string,
      client_id: fd.get("client_id") as string,
      lead_id: fd.get("lead_id") as string,
      type: fd.get("type") as ProjectFormData["type"],
      status: fd.get("status") as ProjectFormData["status"],
      budget: fd.get("budget") as string,
      rate: fd.get("rate") as string,
      start_date: fd.get("start_date") as string,
      due_date: fd.get("due_date") as string,
      description: fd.get("description") as string,
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
          placeholder="Brand identity redesign"
          defaultValue={defaultValues?.title}
          required
          className={inputClass}
        />
      </div>

      {/* Client + Lead */}
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
          <Label className={labelClass}>From lead</Label>
          <Select name="lead_id" defaultValue={defaultValues?.lead_id || "none"}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
              <SelectValue placeholder="No lead" />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="none">No lead</SelectItem>
              {leads.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Type + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className={labelClass}>Type</Label>
          <Select name="type" defaultValue={defaultValues?.type ?? "fixed"}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="fixed">Fixed price</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="retainer">Retainer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>Status</Label>
          <Select name="status" defaultValue={defaultValues?.status ?? "planning"}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Budget + Rate */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="budget" className={labelClass}>
            Budget (SGD)
          </Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            min="0"
            step="0.01"
            placeholder="8000"
            defaultValue={defaultValues?.budget}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rate" className={labelClass}>
            Rate (SGD/hr or /mo)
          </Label>
          <Input
            id="rate"
            name="rate"
            type="number"
            min="0"
            step="0.01"
            placeholder="150"
            defaultValue={defaultValues?.rate}
            className={inputClass}
          />
        </div>
      </div>

      {/* Start date + Due date */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start_date" className={labelClass}>
            Start date
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={defaultValues?.start_date?.slice(0, 10) ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_date" className={labelClass}>
            Due date
          </Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={defaultValues?.due_date?.slice(0, 10) ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className={labelClass}>
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What's the scope of this project?"
          defaultValue={defaultValues?.description}
          rows={3}
          className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 h-10 neu-btn bg-brand-orange text-white font-bold rounded-sm border-black cursor-pointer"
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
