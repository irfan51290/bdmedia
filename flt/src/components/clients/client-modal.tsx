"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "./client-form";
import {
  createClient_,
  updateClient,
  deleteClient,
  type ClientFormData,
} from "@/app/(dashboard)/clients/actions";
import type { Database } from "@/lib/supabase/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

// ── Create modal ──────────────────────────────────────────────
interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateClientModal({ open, onClose }: CreateClientModalProps) {
  async function handleSubmit(data: ClientFormData) {
    await createClient_(data);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">New client</DialogTitle>
        </DialogHeader>
        <ClientForm onSubmit={handleSubmit} onCancel={onClose} submitLabel="Add client" />
      </DialogContent>
    </Dialog>
  );
}

// ── Edit modal ────────────────────────────────────────────────
interface EditClientModalProps {
  client: Client | null;
  onClose: () => void;
}

export function EditClientModal({ client, onClose }: EditClientModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(data: ClientFormData) {
    if (!client) return;
    await updateClient(client.id, data);
    onClose();
  }

  async function handleDelete() {
    if (!client) return;
    await deleteClient(client.id);
    onClose();
  }

  if (!client) return null;

  return (
    <Dialog open={!!client} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Edit client</DialogTitle>
        </DialogHeader>

        <ClientForm
          defaultValues={{
            name: client.name,
            company: client.company ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            country: client.country ?? "",
            status: client.status as ClientFormData["status"],
            notes: client.notes ?? "",
          }}
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
              Delete this client
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
