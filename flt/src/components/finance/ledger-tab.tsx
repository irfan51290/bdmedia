import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];

interface LedgerEntry {
  date: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  currency: string;
  ref: string;
}

interface LedgerTabProps {
  invoices: InvoiceRow[];
  expenses: ExpenseRow[];
}

export function LedgerTab({ invoices, expenses }: LedgerTabProps) {
  // Build unified ledger from paid invoices + all expenses
  const entries: LedgerEntry[] = [
    ...invoices
      .filter((inv) => inv.status === "paid")
      .map((inv) => ({
        date: inv.paid_date ?? inv.due_date,
        type: "income" as const,
        description: `Invoice ${inv.invoice_number}`,
        amount: inv.total,
        currency: inv.currency,
        ref: inv.invoice_number,
      })),
    ...expenses.map((exp) => ({
      date: exp.date,
      type: "expense" as const,
      description: exp.description,
      amount: exp.amount,
      currency: exp.currency,
      ref: exp.category,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.amount, 0);
  const totalExpenses = entries
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  if (entries.length === 0) {
    return (
      <div className="neu-card rounded-sm p-12 bg-card text-center">
        <p className="text-muted-foreground text-sm">
          Your ledger will populate as you mark invoices paid and log expenses.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* P&L summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="neu-card rounded-sm p-4 bg-brand-mint text-black">
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">Income</p>
          <p className="text-xl font-extrabold mt-1">
            SGD {totalIncome.toLocaleString("en-SG", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="neu-card rounded-sm p-4 bg-brand-coral text-white">
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">Expenses</p>
          <p className="text-xl font-extrabold mt-1">
            SGD {totalExpenses.toLocaleString("en-SG", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div
          className={cn(
            "neu-card rounded-sm p-4",
            netProfit >= 0
              ? "bg-brand-teal text-white"
              : "bg-brand-orange text-white"
          )}
        >
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">Net profit</p>
          <p className="text-xl font-extrabold mt-1">
            {netProfit < 0 ? "−" : ""}SGD{" "}
            {Math.abs(netProfit).toLocaleString("en-SG", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Transaction feed */}
      <div className="neu-card rounded-sm border-[2px] border-black overflow-hidden">
        <div className="grid grid-cols-[120px_1fr_100px_100px] gap-4 px-4 py-2.5 bg-muted border-b-[2px] border-black">
          {["Date", "Description", "Type", "Amount"].map((h) => (
            <span key={h} className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {h}
            </span>
          ))}
        </div>
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className={cn(
              "grid grid-cols-[120px_1fr_100px_100px] gap-4 px-4 py-3 items-center",
              idx < entries.length - 1 && "border-b border-black/10"
            )}
          >
            <span className="text-xs text-muted-foreground">
              {new Date(entry.date).toLocaleDateString("en-SG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div>
              <p className="text-sm font-semibold truncate">{entry.description}</p>
              <p className="text-xs text-muted-foreground">{entry.ref}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {entry.type === "income" ? (
                <ArrowDownLeft className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-coral" />
              )}
              <span
                className={cn(
                  "text-xs font-bold capitalize",
                  entry.type === "income" ? "text-green-600" : "text-brand-coral"
                )}
              >
                {entry.type}
              </span>
            </div>
            <span
              className={cn(
                "text-sm font-extrabold",
                entry.type === "income" ? "text-green-600" : "text-brand-coral"
              )}
            >
              {entry.type === "expense" ? "−" : "+"}
              {entry.currency}{" "}
              {Number(entry.amount).toLocaleString("en-SG", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
