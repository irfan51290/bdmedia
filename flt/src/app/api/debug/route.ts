import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    const results: Record<string, unknown> = {
      auth: authError ? { error: authError.message } : { user: user?.id ?? "none" },
    };

    const tables = ["profiles", "clients", "leads", "projects", "invoices", "expenses", "content_posts"];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table as "clients")
        .select("*")
        .limit(1);
      results[table] = error ? { error: error.message, code: error.code } : { ok: true, rows: data?.length };
    }

    return NextResponse.json(results, { status: 200 });
  } catch (e) {
    return NextResponse.json({ fatal: String(e) }, { status: 500 });
  }
}
