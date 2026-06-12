import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Active Projects",
    value: "0",
    accent: "bg-brand-teal text-white",
    span: "bento-span-2",
  },
  {
    label: "Outstanding Invoices",
    value: "SGD 0",
    accent: "bg-brand-yellow text-black",
    span: "",
  },
  {
    label: "Open Leads",
    value: "0",
    accent: "bg-brand-mint text-black",
    span: "",
  },
  {
    label: "Hours This Month",
    value: "0h",
    accent: "bg-brand-orange text-white",
    span: "",
  },
  {
    label: "Monthly Revenue",
    value: "SGD 0",
    accent: "bg-brand-coral text-white",
    span: "",
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's what's happening."
      />
      <main className="flex-1 p-6">
        {/* Bento grid */}
        <div className="bento-grid">
          {/* Hero stat — spans 2 cols */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-brand-yellow">
            <p className="text-xs font-semibold uppercase tracking-widest text-black/60">
              Monthly Revenue
            </p>
            <p className="text-5xl font-extrabold text-black mt-2">SGD 0</p>
            <Badge className="mt-4 bg-black text-white border-0 rounded-sm font-bold text-xs">
              June 2026
            </Badge>
          </div>

          {/* Quick stats */}
          {stats.slice(0, 3).map((s) => (
            <div key={s.label} className="neu-card rounded-sm p-5 bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
              <p className="text-3xl font-extrabold mt-2">{s.value}</p>
            </div>
          ))}

          {/* Recent activity placeholder — spans full width */}
          <div className="bento-span-4 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-4">
              Recent Activity
            </p>
            <p className="text-muted-foreground text-sm">
              No activity yet. Create a client or project to get started.
            </p>
          </div>

          {/* Quick actions */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-brand-teal text-white">
            <p className="font-bold text-sm uppercase tracking-widest mb-3">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "New Invoice",
                "Log Time",
                "Add Client",
                "New Task",
              ].map((action) => (
                <button
                  key={action}
                  className="neu-btn bg-white text-black text-xs font-bold px-3 py-1.5 rounded-sm cursor-pointer"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks due today */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-3">
              Tasks Due Today
            </p>
            <p className="text-muted-foreground text-sm">No tasks due today.</p>
          </div>
        </div>
      </main>
    </>
  );
}
