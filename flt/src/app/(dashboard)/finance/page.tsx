import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const tabs = ["Invoices", "Expenses", "Ledger"];

export default function FinancePage() {
  return (
    <>
      <PageHeader
        title="Finance"
        description="Invoices, expenses, and your P&L ledger."
        actions={
          <Button className="neu-btn bg-brand-teal text-white font-bold rounded-sm h-8 px-3 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Invoice
          </Button>
        }
      />
      <main className="flex-1 p-6">
        {/* Tab bar */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`neu-btn rounded-sm px-4 py-2 text-sm font-bold cursor-pointer ${
                i === 0
                  ? "bg-brand-teal text-white"
                  : "bg-card text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Summary bento */}
        <div className="bento-grid mb-6">
          {[
            { label: "Total Billed",     value: "SGD 0", bg: "bg-brand-teal text-white" },
            { label: "Paid",             value: "SGD 0", bg: "bg-brand-mint text-black" },
            { label: "Outstanding",      value: "SGD 0", bg: "bg-brand-yellow text-black" },
            { label: "Total Expenses",   value: "SGD 0", bg: "bg-brand-coral text-white" },
          ].map((s) => (
            <div key={s.label} className={`neu-card rounded-sm p-5 ${s.bg}`}>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                {s.label}
              </p>
              <p className="text-3xl font-extrabold mt-2">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="neu-card rounded-sm p-6 bg-card">
          <p className="text-muted-foreground text-sm">
            No invoices yet. Create your first invoice to get started.
          </p>
        </div>
      </main>
    </>
  );
}
