"use client";

import { useState } from "react";
import { InvoicesTab } from "./invoices-tab";
import { ExpensesTab } from "./expenses-tab";
import { LedgerTab } from "./ledger-tab";
import type { InvoiceWithItems } from "./invoice-builder";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];
type Client = { id: string; name: string };
type Project = { id: string; title: string };

type Tab = "Invoices" | "Expenses" | "Ledger";

const tabs: Tab[] = ["Invoices", "Expenses", "Ledger"];

interface FinanceDashboardProps {
  invoices: InvoiceWithItems[];
  expenses: ExpenseRow[];
  clients: Client[];
  projects: Project[];
}

export function FinanceDashboard({
  invoices,
  expenses,
  clients,
  projects,
}: FinanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Invoices");

  // Summary stats
  const totalBilled = invoices
    .filter((i) => i.status !== "cancelled")
    .reduce((s, i) => s + i.total, 0);
  const paid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);
  const outstanding = invoices
    .filter((i) => ["sent", "viewed", "overdue"].includes(i.status))
    .reduce((s, i) => s + i.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const fmt = (n: number) =>
    n.toLocaleString("en-SG", { minimumFractionDigits: 0 });

  const stats = [
    { label: "Total Billed",   value: `SGD ${fmt(totalBilled)}`,   bg: "bg-brand-teal text-white" },
    { label: "Paid",           value: `SGD ${fmt(paid)}`,           bg: "bg-brand-mint text-black" },
    { label: "Outstanding",    value: `SGD ${fmt(outstanding)}`,    bg: "bg-brand-yellow text-black" },
    { label: "Total Expenses", value: `SGD ${fmt(totalExpenses)}`,  bg: "bg-brand-coral text-white" },
  ];

  return (
    <>
      {/* Summary bento */}
      <div className="bento-grid mb-6">
        {stats.map((s) => (
          <div key={s.label} className={cn("neu-card rounded-sm p-5", s.bg)}>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
              {s.label}
            </p>
            <p className="text-2xl font-extrabold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "neu-btn rounded-sm px-4 py-2 text-sm font-bold cursor-pointer border-[2px] transition-all duration-100",
              activeTab === tab
                ? "bg-foreground text-background border-black shadow-[2px_2px_0_#000]"
                : "bg-card text-foreground border-transparent hover:border-black"
            )}
          >
            {tab}
            {tab === "Invoices" && invoices.length > 0 && (
              <span className="ml-1.5 text-xs opacity-60">({invoices.length})</span>
            )}
            {tab === "Expenses" && expenses.length > 0 && (
              <span className="ml-1.5 text-xs opacity-60">({expenses.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Invoices" && (
        <InvoicesTab invoices={invoices} clients={clients} projects={projects} />
      )}
      {activeTab === "Expenses" && (
        <ExpensesTab expenses={expenses} projects={projects} />
      )}
      {activeTab === "Ledger" && (
        <LedgerTab invoices={invoices} expenses={expenses} />
      )}
    </>
  );
}
