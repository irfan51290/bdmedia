"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";
import {
  createProject,
  updateProject,
  deleteProject,
  type ProjectFormData,
} from "@/app/(dashboard)/projects/actions";
import type { Database } from "@/lib/supabase/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Client = { id: string; name: string };
type Lead = { id: string; title: string };

// ── Create modal ──────────────────────────────────────────────
interface CreateProjectModalProps {
  open: boolean;
  clients: Client[];
  leads: Lead[];
  onClose: () => void;
}

export function CreateProjectModal({
  open,
  clients,
  leads,
  onClose,
}: CreateProjectModalProps) {
  async function handleSubmit(data: ProjectFormData) {
    await createProject(data);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">New project</DialogTitle>
        </DialogHeader>
        <ProjectForm
          clients={clients}
          leads={leads}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Add project"
        />
      </DialogContent>
    </Dialog>
  );
}

// ── Edit modal ────────────────────────────────────────────────
interface EditProjectModalProps {
  project: Project | null;
  clients: Client[];
  leads: Lead[];
  onClose: () => void;
}

export function EditProjectModal({
  project,
  clients,
  leads,
  onClose,
}: EditProjectModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(data: ProjectFormData) {
    if (!project) return;
    await updateProject(project.id, data);
    onClose();
  }

  async function handleDelete() {
    if (!project) return;
    await deleteProject(project.id);
    onClose();
  }

  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Edit project</DialogTitle>
        </DialogHeader>

        <ProjectForm
          defaultValues={{
            title: project.title,
            client_id: project.client_id ?? "none",
            lead_id: project.lead_id ?? "none",
            type: project.type as ProjectFormData["type"],
            status: project.status as ProjectFormData["status"],
            budget: project.budget?.toString() ?? "",
            rate: project.rate?.toString() ?? "",
            start_date: project.start_date ?? "",
            due_date: project.due_date ?? "",
            description: project.description ?? "",
          }}
          clients={clients}
          leads={leads}
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
              Delete this project
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
