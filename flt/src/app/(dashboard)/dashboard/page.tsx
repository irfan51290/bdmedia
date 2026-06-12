import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  FolderKanban,
  DollarSign,
  CheckSquare,
  AlertCircle,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── helpers ────────────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("en-SG", { minimumFractionDigits: 0 });
}

function fmtFull(n: number) {
  return n.toLocaleString("en-SG", { minimumFractionDigits: 2 });
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-SG", { month: "long", year: "numeric" });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const priorityColor: Record<string, string> = {
  urgent: "bg-brand-coral text-white",
  high:   "bg-brand-orange text-white",
  medium: "bg-brand-yellow text-black",
  low:    "bg-muted text-muted-foreground",
};

const stageLabel: Record<string, string> = {
  new: "New", contacted: "Contacted", proposal: "Proposal",
  negotiation: "Negotiation", won: "Won", lost: "Lost",
};

// ── page ───────────────────────────────────────────────────────
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);

  const [
    { data: monthlyInvoices },
    { count: activeProjects },
    { data: outstandingInvoices },
    { count: openLeads },
    { count: totalClients },
    { data: recentClients },
    { data: recentLeads },
    { data: recentProjects },
    { data: recentInvoices },
    { data: dueTasks },
  ] = await Promise.all([
    // Monthly revenue (paid invoices this month)
    supabase
      .from("invoices")
      .select("total")
      .eq("status", "paid")
      .gte("paid_date", monthStart)
      .lte("paid_date", monthEnd),

    // Active projects count
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),

    // Outstanding invoices (sent/viewed/overdue)
    supabase
      .from("invoices")
      .select("total")
      .in("status", ["sent", "viewed", "overdue"]),

    // Open leads (not won/lost)
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .not("stage", "in", '("won","lost")'),

    // Total clients
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true }),

    // Recent: clients
    supabase
      .from("clients")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(3),

    // Recent: leads
    supabase
      .from("leads")
      .select("id, title, stage, created_at")
      .order("created_at", { ascending: false })
      .limit(3),

    // Recent: projects
    supabase
      .from("projects")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(3),

    // Recent: invoices
    supabase
      .from("invoices")
      .select("id, invoice_number, status, total, currency, created_at")
      .order("created_at", { ascending: false })
      .limit(3),

    // Tasks due today or overdue (not done)
    supabase
      .from("tasks")
      .select("id, title, priority, status, due_date")
      .lte("due_date", todayStr)
      .neq("status", "done")
      .order("due_date", { ascending: true })
      .limit(6),
  ]);

  // Compute stats
  const monthlyRevenue = (monthlyInvoices ?? []).reduce(
    (s, i) => s + i.total,
    0
  );
  const outstanding = (outstandingInvoices ?? []).reduce(
    (s, i) => s + i.total,
    0
  );

  // Build activity feed
  type ActivityItem = {
    type: "client" | "lead" | "project" | "invoice";
    label: string;
    sub: string;
    created_at: string;
  };

  const activity: ActivityItem[] = [
    ...(recentClients ?? []).map((c) => ({
      type: "client" as const,
      label: c.name,
      sub: "New client",
      created_at: c.created_at,
    })),
    ...(recentLeads ?? []).map((l) => ({
      type: "lead" as const,
      label: l.title,
      sub: stageLabel[l.stage] ?? l.stage,
      created_at: l.created_at,
    })),
    ...(recentProjects ?? []).map((p) => ({
      type: "project" as const,
      label: p.title,
      sub: p.status.charAt(0).toUpperCase() + p.status.slice(1),
      created_at: p.created_at,
    })),
    ...(recentInvoices ?? []).map((i) => ({
      type: "invoice" as const,
      label: i.invoice_number,
      sub: `${i.currency} ${fmtFull(i.total)} · ${i.status}`,
      created_at: i.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 8);

  const activityIcons = {
    client:  <Users className="w-3.5 h-3.5" />,
    lead:    <TrendingUp className="w-3.5 h-3.5" />,
    project: <FolderKanban className="w-3.5 h-3.5" />,
    invoice: <FileText className="w-3.5 h-3.5" />,
  };

  const activityColors = {
    client:  "bg-brand-teal/10 text-brand-teal",
    lead:    "bg-brand-mint/20 text-brand-teal",
    project: "bg-brand-orange/10 text-brand-orange",
    invoice: "bg-brand-yellow/30 text-black",
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back. Here's ${monthLabel(now)}.`}
      />
      <main className="flex-1 p-6">
        <div className="bento-grid">

          {/* ── Hero: Monthly Revenue (span 2) ── */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-brand-yellow">
            <p className="text-xs font-semibold uppercase tracking-widest text-black/60">
              Monthly Revenue
            </p>
            <p className="text-5xl font-extrabold text-black mt-2">
              SGD {fmt(monthlyRevenue)}
            </p>
            <Badge className="mt-4 bg-black text-white border-0 rounded-sm font-bold text-xs">
              {monthLabel(now)}
            </Badge>
          </div>

          {/* ── Active Projects ── */}
          <div className="neu-card rounded-sm p-5 bg-brand-teal text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                Active Projects
              </p>
              <FolderKanban className="w-4 h-4 opacity-60" />
            </div>
            <p className="text-4xl font-extrabold">{activeProjects ?? 0}</p>
            <Link
              href="/projects"
              className="text-xs font-bold opacity-70 hover:opacity-100 mt-2 block underline underline-offset-2"
            >
              View all →
            </Link>
          </div>

          {/* ── Open Leads ── */}
          <div className="neu-card rounded-sm p-5 bg-brand-mint text-black">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                Open Leads
              </p>
              <TrendingUp className="w-4 h-4 opacity-60" />
            </div>
            <p className="text-4xl font-extrabold">{openLeads ?? 0}</p>
            <Link
              href="/sales"
              className="text-xs font-bold opacity-70 hover:opacity-100 mt-2 block underline underline-offset-2"
            >
              View pipeline →
            </Link>
          </div>

          {/* ── Outstanding ── */}
          <div className="neu-card rounded-sm p-5 bg-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Outstanding
              </p>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-extrabold">SGD {fmt(outstanding)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(outstandingInvoices ?? []).length} unpaid invoice
              {(outstandingInvoices ?? []).length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* ── Total Clients ── */}
          <div className="neu-card rounded-sm p-5 bg-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Clients
              </p>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-4xl font-extrabold">{totalClients ?? 0}</p>
            <Link
              href="/clients"
              className="text-xs font-bold text-muted-foreground hover:text-foreground mt-2 block underline underline-offset-2"
            >
              View all →
            </Link>
          </div>

          {/* ── Quick Actions (span 2) ── */}
          <div className="bento-span-2 neu-card rounded-sm p-5 bg-foreground text-background">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-3">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Invoice",  href: "/finance",  icon: <FileText className="w-3.5 h-3.5" /> },
                { label: "New Client",   href: "/clients",  icon: <Users className="w-3.5 h-3.5" /> },
                { label: "New Lead",     href: "/sales",    icon: <TrendingUp className="w-3.5 h-3.5" /> },
                { label: "New Project",  href: "/projects", icon: <FolderKanban className="w-3.5 h-3.5" /> },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2 neu-btn bg-background text-foreground text-xs font-bold px-3 py-2.5 rounded-sm cursor-pointer hover:bg-muted transition-colors"
                >
                  {action.icon}
                  {action.label}
                  <Plus className="w-3 h-3 ml-auto opacity-50" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Recent Activity (span 3) ── */}
          <div className="bento-span-3 neu-card rounded-sm p-5 bg-card">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Recent Activity
            </p>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activity yet. Create a client or project to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-sm shrink-0",
                        activityColors[item.type]
                      )}
                    >
                      {activityIcons[item.type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate leading-none">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.sub}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {relativeTime(item.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Tasks Due / Overdue (span 1) ── */}
          <div className="neu-card rounded-sm p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Due &amp; Overdue
              </p>
              <CheckSquare className="w-4 h-4 text-muted-foreground" />
            </div>
            {(dueTasks ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 gap-2">
                <AlertCircle className="w-6 h-6 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground text-center">
                  No overdue tasks
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {(dueTasks ?? []).map((task) => {
                  const isOverdue =
                    task.due_date && task.due_date < todayStr;
                  return (
                    <div key={task.id} className="flex items-start gap-2">
                      <Badge
                        className={cn(
                          "shrink-0 rounded-sm border-0 text-xs font-bold capitalize px-1.5 mt-0.5",
                          priorityColor[task.priority]
                        )}
                      >
                        {task.priority[0].toUpperCase()}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate leading-snug">
                          {task.title}
                        </p>
                        {task.due_date && (
                          <p
                            className={cn(
                              "text-xs mt-0.5",
                              isOverdue
                                ? "text-brand-coral font-bold"
                                : "text-muted-foreground"
                            )}
                          >
                            {isOverdue ? "Overdue · " : ""}
                            {new Date(task.due_date).toLocaleDateString(
                              "en-SG",
                              { day: "numeric", month: "short" }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
