import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const stages = ["new", "contacted", "proposal", "negotiation", "won", "lost"];

const stageColors: Record<string, string> = {
  new:         "bg-brand-yellow text-black",
  contacted:   "bg-brand-mint text-black",
  proposal:    "bg-brand-teal text-white",
  negotiation: "bg-brand-orange text-white",
  won:         "bg-green-500 text-white",
  lost:        "bg-brand-coral text-white",
};

export default function SalesPage() {
  return (
    <>
      <PageHeader
        title="Sales Pipeline"
        description="Track leads from first contact to closed deal."
        actions={
          <Button className="neu-btn bg-brand-yellow text-black font-bold rounded-sm h-8 px-3 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Lead
          </Button>
        }
      />
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => (
            <div key={stage} className="w-64 flex flex-col gap-3">
              <div
                className={`neu-card-sm rounded-sm px-3 py-2 flex items-center justify-between ${stageColors[stage]}`}
              >
                <span className="text-xs font-extrabold uppercase tracking-widest">
                  {stage}
                </span>
                <span className="text-xs font-bold opacity-70">0</span>
              </div>
              <div className="neu-card rounded-sm p-4 bg-card min-h-24 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">No leads</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
