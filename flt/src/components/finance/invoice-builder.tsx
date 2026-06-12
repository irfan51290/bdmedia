"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Plus, Trash2 } from "lucide-react";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  type InvoiceFormData,
  type InvoiceStatus,
} from "@/app/(dashboard)/finance/actions";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type LineItemRow = Database["public"]["Tables"]["line_items"]["Row"];
export type InvoiceWithItems = InvoiceRow & { line_items: LineItemRow[] };

type Client = { id: string; name: string };
type Project = { id: string; title: string };

type LineItemState = {
  key: string;
  description: string;
  quantity: number;
  unit_price: number;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function in30days() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function generateInvoiceNumber() {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `INV-${ym}-${seq}`;
}

function newItem(): LineItemState {
  return { key: crypto.randomUUID(), description: "", quantity: 1, unit_price: 0 };
}

const inputClass =
  "border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-9 text-sm";

const labelClass = "text-xs font-bold uppercase tracking-widest";

// ── Create modal ──────────────────────────────────────────────
interface CreateInvoiceBuilderProps {
  open: boolean;
  clients: Client[];
  projects: Project[];
  onClose: () => void;
}

export function CreateInvoiceBuilder({
  open,
  clients,
  projects,
  onClose,
}: CreateInvoiceBuilderProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">New invoice</DialogTitle>
        </DialogHeader>
        <InvoiceForm
          clients={clients}
          projects={projects}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

// ── Edit modal ────────────────────────────────────────────────
interface EditInvoiceBuilderProps {
  invoice: InvoiceWithItems | null;
  clients: Client[];
  projects: Project[];
  onClose: () => void;
}

export function EditInvoiceBuilder({
  invoice,
  clients,
  projects,
  onClose,
}: EditInvoiceBuilderProps) {
  return (
    <Dialog open={!!invoice} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Edit invoice</DialogTitle>
        </DialogHeader>
        {invoice && (
          <InvoiceForm
            invoice={invoice}
            clients={clients}
            projects={projects}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Shared form ───────────────────────────────────────────────
interface InvoiceFormProps {
  invoice?: InvoiceWithItems;
  clients: Client[];
  projects: Project[];
  onClose: () => void;
}

function InvoiceForm({ invoice, clients, projects, onClose }: InvoiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form fields
  const [clientId, setClientId] = useState(invoice?.client_id ?? "");
  const [projectId, setProjectId] = useState(invoice?.project_id ?? "none");
  const [invoiceNumber, setInvoiceNumber] = useState(
    invoice?.invoice_number ?? generateInvoiceNumber()
  );
  const [status, setStatus] = useState<InvoiceStatus>(invoice?.status ?? "draft");
  const [issueDate, setIssueDate] = useState(invoice?.issue_date ?? today());
  const [dueDate, setDueDate] = useState(invoice?.due_date ?? in30days());
  const [taxRate, setTaxRate] = useState(invoice?.tax_rate ?? 9);
  const [discount, setDiscount] = useState(invoice?.discount ?? 0);
  const [currency, setCurrency] = useState(invoice?.currency ?? "SGD");
  const [notes, setNotes] = useState(invoice?.notes ?? "");

  // Line items
  const [lineItems, setLineItems] = useState<LineItemState[]>(
    invoice && invoice.line_items.length > 0
      ? invoice.line_items
          .sort((a, b) => a.position - b.position)
          .map((li) => ({
            key: li.id,
            description: li.description,
            quantity: li.quantity,
            unit_price: li.unit_price,
          }))
      : [newItem()]
  );

  // Computed totals
  const subtotal = lineItems.reduce((s, li) => s + li.quantity * li.unit_price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;

  function updateItem(key: string, field: keyof Omit<LineItemState, "key">, value: string | number) {
    setLineItems((prev) =>
      prev.map((li) => (li.key === key ? { ...li, [field]: value } : li))
    );
  }

  function removeItem(key: string) {
    setLineItems((prev) => prev.filter((li) => li.key !== key));
  }

  function handleSave() {
    if (!clientId) return alert("Please select a client.");
    if (!dueDate) return alert("Please set a due date.");

    const data: InvoiceFormData = {
      client_id: clientId,
      project_id: projectId,
      invoice_number: invoiceNumber,
      status,
      issue_date: issueDate,
      due_date: dueDate,
      tax_rate: taxRate,
      discount,
      currency,
      notes,
      line_items: lineItems
        .filter((li) => li.description.trim())
        .map((li) => ({
          description: li.description,
          quantity: li.quantity,
          unit_price: li.unit_price,
        })),
    };

    startTransition(async () => {
      if (invoice) {
        await updateInvoice(invoice.id, data);
      } else {
        await createInvoice(data);
      }
      onClose();
    });
  }

  function handleDelete() {
    if (!invoice) return;
    startTransition(async () => {
      await deleteInvoice(invoice.id);
      onClose();
    });
  }

  const fmt = (n: number) =>
    n.toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      {/* Client + Project */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className={labelClass}>Client *</Label>
          <Select value={clientId} onValueChange={(v) => setClientId(v ?? "")}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-9">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>Project</Label>
          <Select value={projectId} onValueChange={(v) => setProjectId(v ?? "none")}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-9">
              <SelectValue placeholder="No project" />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="none">No project</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invoice number + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className={labelClass}>Invoice #</Label>
          <Input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as InvoiceStatus)}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dates + Currency */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className={labelClass}>Issue date</Label>
          <Input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>Due date</Label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>Currency</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v ?? "SGD")}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="SGD">SGD</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="AUD">AUD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Line items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className={labelClass}>Line items</Label>
        </div>
        <div className="border-[2px] border-black rounded-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_56px_88px_80px_32px] gap-0 bg-muted border-b-[2px] border-black px-2 py-1.5">
            {["Description", "Qty", "Unit price", "Amount", ""].map((h) => (
              <span key={h} className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {h}
              </span>
            ))}
          </div>
          {/* Rows */}
          {lineItems.map((li, idx) => (
            <div
              key={li.key}
              className={cn(
                "grid grid-cols-[1fr_56px_88px_80px_32px] gap-0 px-2 py-1.5 items-center",
                idx < lineItems.length - 1 && "border-b border-black/10"
              )}
            >
              <input
                type="text"
                placeholder="Item description"
                value={li.description}
                onChange={(e) => updateItem(li.key, "description", e.target.value)}
                className="text-sm bg-transparent border-0 outline-none w-full pr-2"
              />
              <input
                type="number"
                min="0"
                step="0.5"
                value={li.quantity}
                onChange={(e) => updateItem(li.key, "quantity", Number(e.target.value))}
                className="text-sm bg-transparent border-0 outline-none w-full text-center"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={li.unit_price}
                onChange={(e) => updateItem(li.key, "unit_price", Number(e.target.value))}
                className="text-sm bg-transparent border-0 outline-none w-full text-right pr-2"
              />
              <span className="text-sm font-semibold text-right pr-2">
                {fmt(li.quantity * li.unit_price)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(li.key)}
                disabled={lineItems.length === 1}
                className="flex items-center justify-center text-muted-foreground hover:text-brand-coral cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLineItems((prev) => [...prev, newItem()])}
          className="flex items-center gap-1 text-xs text-muted-foreground font-semibold py-1.5 px-1 mt-1 hover:text-foreground cursor-pointer transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add line item
        </button>
      </div>

      {/* Totals */}
      <div className="border-[2px] border-black rounded-sm p-4 bg-muted/30 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-medium">Subtotal</span>
          <span className="font-semibold">{currency} {fmt(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Tax</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-14 text-sm border-[2px] border-black rounded-sm px-1.5 h-7 text-center"
            />
            <span className="text-muted-foreground text-xs">%</span>
          </div>
          <span className="font-semibold">{currency} {fmt(taxAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Discount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-20 text-sm border-[2px] border-black rounded-sm px-1.5 h-7 text-right"
            />
          </div>
          <span className="font-semibold text-brand-coral">− {currency} {fmt(discount)}</span>
        </div>
        <div className="flex justify-between text-base border-t-[2px] border-black pt-2 mt-1">
          <span className="font-extrabold">Total</span>
          <span className="font-extrabold text-brand-teal">{currency} {fmt(total)}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className={labelClass}>Notes</Label>
        <Textarea
          placeholder="Payment terms, bank details, thank you note…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 resize-none text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 h-10 neu-btn bg-brand-teal text-white font-bold rounded-sm border-black cursor-pointer"
        >
          {isPending ? "Saving…" : invoice ? "Update invoice" : "Create invoice"}
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

      {/* Delete zone (edit only) */}
      {invoice && (
        <div className="border-t-[2px] border-black pt-4">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-bold text-brand-coral underline underline-offset-2 cursor-pointer hover:opacity-70"
            >
              Delete this invoice
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold text-brand-coral flex-1">
                This cannot be undone. Are you sure?
              </p>
              <button
                onClick={handleDelete}
                disabled={isPending}
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
      )}
    </div>
  );
}
