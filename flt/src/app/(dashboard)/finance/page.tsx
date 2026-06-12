import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { FinanceDashboard } from "@/components/finance/finance-dashboard";
import type { Database } from "@/lib/supabase/database.types";

type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type LineItemRow = Database["public"]["Tables"]["line_items"]["Row"];
type InvoiceWithItems = InvoiceRow & { line_items: LineItemRow[] };

export default async function FinancePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: rawInvoices, error: invError },
    { data: expenses },
    { data: clients },
    { data: projects },
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, line_items(*)")
      .order("created_at", { ascending: false }),
    supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  if (invError) throw new Error(invError.message);

  const invoices = (rawInvoices ?? []) as unknown as InvoiceWithItems[];

  return (
    <>
      <PageHeader
        title="Finance"
        description="Invoices, expenses, and your P&amp;L ledger."
      />
      <main className="flex-1 p-6">
        <FinanceDashboard
          invoices={invoices}
          expenses={expenses ?? []}
          clients={clients ?? []}
          projects={projects ?? []}
        />
      </main>
    </>
  );
}
