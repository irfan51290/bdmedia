import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const statusColors: Record<string, string> = {
  planning:   "bg-brand-yellow text-black",
  active:     "bg-brand-teal text-white",
  paused:     "bg-muted text-muted-foreground",
  completed:  "bg-brand-mint text-black",
  cancelled:  "bg-brand-coral text-white",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="Manage your active and upcoming projects."
        actions={
          <Button className="neu-btn bg-brand-orange text-white font-bold rounded-sm h-8 px-3 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Project
          </Button>
        }
      />
      <main className="flex-1 p-6">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(statusColors).map(([status, cls]) => (
            <button
              key={status}
              className={`neu-btn rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer ${cls}`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bento-grid">
          <div className="bento-span-4 neu-card rounded-sm p-6 bg-card">
            <p className="text-muted-foreground text-sm">
              No projects yet. Convert a lead or create one directly.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
