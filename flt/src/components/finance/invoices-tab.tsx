"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Send } from "lucide-react";
import { CreateInvoiceBuilder, EditInvoiceBuilder, type InvoiceWithItems } from "./invoice-builder";
import { updateInvoiceStatus, type InvoiceStatus } from "@/app/(dashboard)/finance/actions";
import { cn } from "@/lib/utils";

type Client = { id: string; name: string };
type Project = { id: string; title: string };

const statusConfig: Record<
  string,
  { label: string; color: string; textColor: string }
> = {
  draft:     { label: "Draft",     color: "bg-muted",          textColor: "text-muted-foreground" },
  sent:      { label: "Sent",      color: "bg-brand-mint",     textColor: "text-black" },
  viewed:    { label: "Viewed",    color: "bg-brand-yellow",   textColor: "text-black" },
  paid:      { label: "Paid",      color: "bg-green-500",      textColor: "text-white" },
  overdue:   { label: "Overdue",   color: "bg-brand-coral",    textColor: "text-white" },
  cancelled: { label: "Cancelled", color: "bg-muted",          textColor: "text-muted-foreground" },
};

interface InvoicesTabProps {
  invoices: InvoiceWithItems[];
  clients: Client[];
  projects: Project[];
}

export function InvoicesTab({ invoices, clients, projects }: InvoicesTabProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<InvoiceWithItems | null>(null);
  const [isPending, startTransition] = useTransition();

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  function markStatus(invoice: InvoiceWithItems, status: InvoiceStatus) {
    startTransition(() =>
      updateInvoiceStatus(
        invoice.id,
        status,
        invoice.invoice_number,
        invoice.total,
        invoice.currency
      )
    );
  }

  if (invoices.length === 0) {
    return (
      <>
        <div className="neu-card rounded-sm p-12 bg-card text-center">
          <p className="font-extrabold text-lg mb-1">No invoices yet</p>
          <p className="text-muted-foreground text-sm mb-5">
            Create your first invoice to start billing clients.
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="neu-btn bg-brand-teal text-white font-bold rounded-sm h-9 px-4 text-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New invoice
          </Button>
        </div>
        <CreateInvoiceBuilder
          open={showCreate}
          clients={clients}
          projects={projects}
          onClose={() => setShowCreate(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setShowCreate(true)}
          className="neu-btn bg-brand-teal text-white font-bold rounded-sm h-9 px-3 text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          New invoice
        </Button>
      </div>

      {/* Invoice table */}
      <div className="neu-card rounded-sm border-[2px] border-black overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1.5fr_1fr_80px_100px_1fr_auto] gap-4 px-4 py-2.5 bg-muted border-b-[2px] border-black">
          {["Invoice", "Client", "Total", "Due", "Status", ""].map((h) => (
            <span key={h} className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {invoices.map((inv, idx) => {
          const cfg = statusConfig[inv.status];
          const isOverdue =
            inv.status !== "paid" &&
            inv.status !== "cancelled" &&
            new Date(inv.due_date) < new Date();

          return (
            <div
              key={inv.id}
              className={cn(
                "grid grid-cols-[1.5fr_1fr_80px_100px_1fr_auto] gap-4 px-4 py-3 items-center cursor-pointer hover:bg-muted/30 transition-colors",
                idx < invoices.length - 1 && "border-b border-black/10"
              )}
              onClick={() => setEditing(inv)}
            >
              <span className="font-bold text-sm truncate">{inv.invoice_number}</span>
              <span className="text-sm text-muted-foreground truncate">
                {inv.client_id ? clientMap[inv.client_id] : "—"}
              </span>
              <span className="text-sm font-bold">
                {inv.currency} {Number(inv.total).toLocaleString("en-SG", { minimumFractionDigits: 2 })}
              </span>
              <span className={cn("text-xs font-medium", isOverdue && "text-brand-coral font-bold")}>
                {new Date(inv.due_date).toLocaleDateString("en-SG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <Badge
                className={cn(
                  "rounded-sm border-[2px] border-black text-xs font-bold capitalize px-2 w-fit",
                  cfg.color,
                  cfg.textColor
                )}
              >
                {cfg.label}
              </Badge>

              {/* Quick actions */}
              <div
                className="flex gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {inv.status === "draft" && (
                  <button
                    onClick={() => markStatus(inv, "sent")}
                    disabled={isPending}
                    title="Mark sent"
                    className="p-1.5 rounded-sm hover:bg-brand-mint/20 cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
                {["sent", "viewed", "overdue"].includes(inv.status) && (
                  <button
                    onClick={() => markStatus(inv, "paid")}
                    disabled={isPending}
                    title="Mark paid"
                    className="p-1.5 rounded-sm hover:bg-green-100 cursor-pointer transition-colors text-muted-foreground hover:text-green-600"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreateInvoiceBuilder
        open={showCreate}
        clients={clients}
        projects={projects}
        onClose={() => setShowCreate(false)}
      />
      <EditInvoiceBuilder
        invoice={editing}
        clients={clients}
        projects={projects}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
