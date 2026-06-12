"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "./lead-form";
import {
  createLead,
  updateLead,
  deleteLead,
  type LeadFormData,
} from "@/app/(dashboard)/sales/actions";
import type { Database } from "@/lib/supabase/database.types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Client = { id: string; name: string };

// ── Create modal ──────────────────────────────────────────────
interface CreateLeadModalProps {
  open: boolean;
  initialStage: LeadFormData["stage"];
  clients: Client[];
  onClose: () => void;
}

export function CreateLeadModal({
  open,
  initialStage,
  clients,
  onClose,
}: CreateLeadModalProps) {
  async function handleSubmit(data: LeadFormData) {
    await createLead(data);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">New lead</DialogTitle>
        </DialogHeader>
        <LeadForm
          defaultValues={{ stage: initialStage }}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Add lead"
        />
      </DialogContent>
    </Dialog>
  );
}

// ── Edit modal ────────────────────────────────────────────────
interface EditLeadModalProps {
  lead: Lead | null;
  clients: Client[];
  onClose: () => void;
}

export function EditLeadModal({ lead, clients, onClose }: EditLeadModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(data: LeadFormData) {
    if (!lead) return;
    await updateLead(lead.id, data);
    onClose();
  }

  async function handleDelete() {
    if (!lead) return;
    await deleteLead(lead.id);
    onClose();
  }

  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Edit lead</DialogTitle>
        </DialogHeader>

        <LeadForm
          defaultValues={{
            title: lead.title,
            client_id: lead.client_id ?? "none",
            source: lead.source ?? "",
            stage: lead.stage as LeadFormData["stage"],
            value: lead.value?.toString() ?? "",
            probability: lead.probability?.toString() ?? "",
            follow_up_at: lead.follow_up_at ?? "",
            notes: lead.notes ?? "",
          }}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />

        {/* Delete zone */}
        <div className="border-t-[2px] border-black pt-4 mt-2">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-bold text-brand-coral underline underline-offset-2 cursor-pointer hover:opacity-70"
            >
              Delete this lead
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold text-brand-coral flex-1">
                This cannot be undone. Are you sure?
              </p>
              <button
                onClick={handleDelete}
                className="neu-btn bg-brand-coral text-white text-xs font-bold px-3 py-1.5 rounded-sm border-black cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs font-semibold cursor-pointer hover:opacity-70"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
