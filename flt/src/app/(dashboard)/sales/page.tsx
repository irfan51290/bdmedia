import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { SalesPipeline } from "@/components/sales/sales-pipeline";

export default async function SalesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: leads, error: leadsError }, { data: clients }] =
    await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("clients").select("id, name").order("name"),
    ]);

  if (leadsError) throw new Error(leadsError.message);

  return (
    <>
      <PageHeader
        title="Sales Pipeline"
        description={`${leads?.length ?? 0} lead${leads?.length !== 1 ? "s" : ""}`}
      />
      <main className="flex-1 p-6 overflow-x-auto">
        <SalesPipeline leads={leads ?? []} clients={clients ?? []} />
      </main>
    </>
  );
}
