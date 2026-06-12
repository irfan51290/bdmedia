"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

type InvoiceUpdate = Database["public"]["Tables"]["invoices"]["Update"];
type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"];

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "paid"
  | "overdue"
  | "cancelled";

export type LineItemFormData = {
  description: string;
  quantity: number;
  unit_price: number;
};

export type InvoiceFormData = {
  client_id: string;
  project_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  tax_rate: number;
  discount: number;
  currency: string;
  notes: string;
  line_items: LineItemFormData[];
};

export type ExpenseFormData = {
  category: string;
  description: string;
  amount: string;
  currency: string;
  project_id: string;
  is_billable: boolean;
  date: string;
};

function computeTotals(
  lineItems: LineItemFormData[],
  taxRate: number,
  discount: number
) {
  const subtotal = lineItems.reduce(
    (s, li) => s + li.quantity * li.unit_price,
    0
  );
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;
  return { subtotal, taxAmount, total };
}

// ── Invoices ──────────────────────────────────────────────────

export async function createInvoice(data: InvoiceFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { subtotal, taxAmount, total } = computeTotals(
    data.line_items,
    data.tax_rate,
    data.discount
  );

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: data.client_id,
      project_id:
        data.project_id && data.project_id !== "none"
          ? data.project_id
          : null,
      invoice_number: data.invoice_number,
      status: data.status,
      issue_date: data.issue_date || new Date().toISOString().slice(0, 10),
      due_date: data.due_date,
      paid_date:
        data.status === "paid"
          ? new Date().toISOString().slice(0, 10)
          : null,
      subtotal,
      tax_rate: data.tax_rate,
      tax_amount: taxAmount,
      discount: data.discount,
      total,
      currency: data.currency || "SGD",
      notes: data.notes || null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (data.line_items.length > 0) {
    const { error: liErr } = await supabase.from("line_items").insert(
      data.line_items.map((li, i) => ({
        invoice_id: invoice.id,
        description: li.description,
        quantity: li.quantity,
        unit_price: li.unit_price,
        amount: li.quantity * li.unit_price,
        position: i,
      }))
    );
    if (liErr) throw new Error(liErr.message);
  }

  if (data.status === "paid") {
    await supabase.from("ledger_entries").insert({
      user_id: user.id,
      invoice_id: invoice.id,
      type: "income",
      amount: total,
      currency: data.currency || "SGD",
      description: `Invoice ${data.invoice_number}`,
      date: new Date().toISOString().slice(0, 10),
    });
  }

  revalidatePath("/finance");
}

export async function updateInvoice(id: string, data: InvoiceFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { subtotal, taxAmount, total } = computeTotals(
    data.line_items,
    data.tax_rate,
    data.discount
  );

  const update: InvoiceUpdate = {
    client_id: data.client_id,
    project_id:
      data.project_id && data.project_id !== "none" ? data.project_id : null,
    invoice_number: data.invoice_number,
    status: data.status,
    issue_date: data.issue_date,
    due_date: data.due_date,
    paid_date:
      data.status === "paid" ? new Date().toISOString().slice(0, 10) : null,
    subtotal,
    tax_rate: data.tax_rate,
    tax_amount: taxAmount,
    discount: data.discount,
    total,
    currency: data.currency,
    notes: data.notes || null,
  };

  const { error } = await supabase.from("invoices").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  // Replace line items
  await supabase.from("line_items").delete().eq("invoice_id", id);
  if (data.line_items.length > 0) {
    await supabase.from("line_items").insert(
      data.line_items.map((li, i) => ({
        invoice_id: id,
        description: li.description,
        quantity: li.quantity,
        unit_price: li.unit_price,
        amount: li.quantity * li.unit_price,
        position: i,
      }))
    );
  }

  revalidatePath("/finance");
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
  invoiceNumber: string,
  total: number,
  currency: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: InvoiceUpdate = {
    status,
    paid_date:
      status === "paid" ? new Date().toISOString().slice(0, 10) : null,
  };

  const { error } = await supabase.from("invoices").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  if (status === "paid") {
    await supabase.from("ledger_entries").insert({
      user_id: user.id,
      invoice_id: id,
      type: "income",
      amount: total,
      currency,
      description: `Invoice ${invoiceNumber}`,
      date: new Date().toISOString().slice(0, 10),
    });
  }

  revalidatePath("/finance");
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("ledger_entries").delete().eq("invoice_id", id);
  await supabase.from("line_items").delete().eq("invoice_id", id);
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/finance");
}

// ── Expenses ──────────────────────────────────────────────────

export async function createExpense(data: ExpenseFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: expense, error } = await supabase
    .from("expenses")
    .insert({
      user_id: user.id,
      project_id:
        data.project_id && data.project_id !== "none"
          ? data.project_id
          : null,
      category: data.category,
      description: data.description,
      amount: Number(data.amount),
      currency: data.currency || "SGD",
      is_billable: data.is_billable,
      date: data.date || new Date().toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("ledger_entries").insert({
    user_id: user.id,
    expense_id: expense.id,
    type: "expense",
    amount: Number(data.amount),
    currency: data.currency || "SGD",
    description: data.description,
    date: data.date || new Date().toISOString().slice(0, 10),
  });

  revalidatePath("/finance");
}

export async function updateExpense(id: string, data: ExpenseFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: ExpenseUpdate = {
    project_id:
      data.project_id && data.project_id !== "none" ? data.project_id : null,
    category: data.category,
    description: data.description,
    amount: Number(data.amount),
    currency: data.currency,
    is_billable: data.is_billable,
    date: data.date,
  };

  const { error } = await supabase.from("expenses").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/finance");
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("ledger_entries").delete().eq("expense_id", id);
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/finance");
}
