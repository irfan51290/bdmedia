"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Receipt } from "lucide-react";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  type ExpenseFormData,
} from "@/app/(dashboard)/finance/actions";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];
type Project = { id: string; title: string };

const CATEGORIES = [
  "Software",
  "Hardware",
  "Travel",
  "Marketing",
  "Hosting",
  "Office",
  "Contractor",
  "Other",
];

const inputClass =
  "border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-9 text-sm";

const labelClass = "text-xs font-bold uppercase tracking-widest";

interface ExpensesTabProps {
  expenses: Expense[];
  projects: Project[];
}

export function ExpensesTab({ expenses, projects }: ExpensesTabProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const billable = expenses.filter((e) => e.is_billable).reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Total:{" "}
            <strong>
              SGD{" "}
              {totalExpenses.toLocaleString("en-SG", { minimumFractionDigits: 2 })}
            </strong>
          </span>
          <span className="text-muted-foreground">
            Billable:{" "}
            <strong className="text-brand-teal">
              SGD{" "}
              {billable.toLocaleString("en-SG", { minimumFractionDigits: 2 })}
            </strong>
          </span>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="neu-btn bg-brand-coral text-white font-bold rounded-sm h-9 px-3 text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add expense
        </Button>
      </div>

      {expenses.length === 0 ? (
        <div className="neu-card rounded-sm p-12 bg-card text-center">
          <Receipt className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-extrabold text-lg mb-1">No expenses logged</p>
          <p className="text-muted-foreground text-sm mb-5">
            Track what you spend to calculate your real profit.
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="neu-btn bg-brand-coral text-white font-bold rounded-sm h-9 px-4 text-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add first expense
          </Button>
        </div>
      ) : (
        <div className="neu-card rounded-sm border-[2px] border-black overflow-hidden">
          <div className="grid grid-cols-[1fr_1.5fr_80px_100px_80px] gap-4 px-4 py-2.5 bg-muted border-b-[2px] border-black">
            {["Category", "Description", "Amount", "Date", "Billable"].map((h) => (
              <span key={h} className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {h}
              </span>
            ))}
          </div>
          {expenses.map((exp, idx) => (
            <div
              key={exp.id}
              className={cn(
                "grid grid-cols-[1fr_1.5fr_80px_100px_80px] gap-4 px-4 py-3 items-center cursor-pointer hover:bg-muted/30 transition-colors",
                idx < expenses.length - 1 && "border-b border-black/10"
              )}
              onClick={() => setEditing(exp)}
            >
              <span className="text-xs font-bold bg-muted rounded-sm px-2 py-0.5 w-fit border border-black/10">
                {exp.category}
              </span>
              <span className="text-sm truncate">{exp.description}</span>
              <span className="text-sm font-bold">
                {exp.currency} {Number(exp.amount).toLocaleString("en-SG", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(exp.date).toLocaleDateString("en-SG", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span
                className={cn(
                  "text-xs font-bold",
                  exp.is_billable ? "text-brand-teal" : "text-muted-foreground"
                )}
              >
                {exp.is_billable ? "Yes" : "No"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ExpenseModal
        open={showCreate}
        projects={projects}
        onClose={() => setShowCreate(false)}
      />
      <ExpenseModal
        open={!!editing}
        expense={editing ?? undefined}
        projects={projects}
        onClose={() => setEditing(null)}
      />
    </>
  );
}

// ── Expense modal ──────────────────────────────────────────────
interface ExpenseModalProps {
  open: boolean;
  expense?: Expense;
  projects: Project[];
  onClose: () => void;
}

function ExpenseModal({ open, expense, projects, onClose }: ExpenseModalProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isBillable, setIsBillable] = useState(expense?.is_billable ?? false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ExpenseFormData = {
      category: fd.get("category") as string,
      description: fd.get("description") as string,
      amount: fd.get("amount") as string,
      currency: fd.get("currency") as string,
      project_id: fd.get("project_id") as string,
      is_billable: isBillable,
      date: fd.get("date") as string,
    };
    startTransition(async () => {
      if (expense) {
        await updateExpense(expense.id, data);
      } else {
        await createExpense(data);
      }
      onClose();
    });
  }

  function handleDelete() {
    if (!expense) return;
    startTransition(async () => {
      await deleteExpense(expense.id);
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">
            {expense ? "Edit expense" : "Add expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={labelClass}>Category</Label>
              <Select name="category" defaultValue={expense?.category ?? "Software"}>
                <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount" className={labelClass}>Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                defaultValue={expense?.amount}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className={labelClass}>Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="What was this for?"
              defaultValue={expense?.description}
              required
              className={inputClass}
            />
          </div>

          {/* Date + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date" className={labelClass}>Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={expense?.date ?? new Date().toISOString().slice(0, 10)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Currency</Label>
              <Select name="currency" defaultValue={expense?.currency ?? "SGD"}>
                <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
                  <SelectItem value="SGD">SGD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project + Billable */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={labelClass}>Project</Label>
              <Select name="project_id" defaultValue={expense?.project_id ?? "none"}>
                <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-9">
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Billable to client</Label>
              <button
                type="button"
                onClick={() => setIsBillable((v) => !v)}
                className={cn(
                  "w-full h-9 rounded-sm border-[2px] border-black font-bold text-sm cursor-pointer transition-all duration-100",
                  isBillable
                    ? "bg-brand-teal text-white shadow-[2px_2px_0_#000]"
                    : "bg-card text-muted-foreground"
                )}
              >
                {isBillable ? "Yes — billable" : "No — internal"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-10 neu-btn bg-brand-coral text-white font-bold rounded-sm border-black cursor-pointer"
            >
              {isPending ? "Saving…" : expense ? "Update" : "Add expense"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-10 neu-btn bg-card text-foreground font-bold rounded-sm border-black cursor-pointer px-4"
            >
              Cancel
            </Button>
          </div>

          {/* Delete */}
          {expense && (
            <div className="border-t-[2px] border-black pt-4">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs font-bold text-brand-coral underline underline-offset-2 cursor-pointer hover:opacity-70"
                >
                  Delete this expense
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold text-brand-coral flex-1">Sure?</p>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="neu-btn bg-brand-coral text-white text-xs font-bold px-3 py-1.5 rounded-sm border-black cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs font-semibold cursor-pointer hover:opacity-70"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
