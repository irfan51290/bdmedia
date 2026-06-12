"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, DollarSign } from "lucide-react";
import { CreateLeadModal, EditLeadModal } from "./lead-modal";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Client = { id: string; name: string };

const stages = [
  "new",
  "contacted",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;
type Stage = (typeof stages)[number];

const stageConfig: Record<
  Stage,
  { label: string; color: string; textColor: string }
> = {
  new:         { label: "New",         color: "bg-brand-yellow", textColor: "text-black" },
  contacted:   { label: "Contacted",   color: "bg-brand-mint",   textColor: "text-black" },
  proposal:    { label: "Proposal",    color: "bg-brand-teal",   textColor: "text-white" },
  negotiation: { label: "Negotiation", color: "bg-brand-orange", textColor: "text-white" },
  won:         { label: "Won",         color: "bg-green-500",    textColor: "text-white" },
  lost:        { label: "Lost",        color: "bg-brand-coral",  textColor: "text-white" },
};

interface SalesPipelineProps {
  leads: Lead[];
  clients: Client[];
}

export function SalesPipeline({ leads, clients }: SalesPipelineProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [createStage, setCreateStage] = useState<Stage>("new");
  const [editing, setEditing] = useState<Lead | null>(null);

  function openCreate(stage: Stage) {
    setCreateStage(stage);
    setShowCreate(true);
  }

  const byStage = stages.reduce<Record<Stage, Lead[]>>((acc, s) => {
    acc[s] = leads.filter((l) => l.stage === s);
    return acc;
  }, {} as Record<Stage, Lead[]>);

  const activeLeads = leads.filter((l) => !["won", "lost"].includes(l.stage));
  const totalPipeline = activeLeads.reduce((s, l) => s + (l.value ?? 0), 0);
  const weighted = activeLeads.reduce(
    (s, l) => s + (l.value ?? 0) * ((l.probability ?? 0) / 100),
    0
  );
  const wonTotal = leads
    .filter((l) => l.stage === "won")
    .reduce((s, l) => s + (l.value ?? 0), 0);

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  return (
    <>
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="neu-card rounded-sm px-4 py-2.5 bg-card flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            Pipeline
          </span>
          <span className="text-sm font-extrabold">
            SGD{" "}
            {totalPipeline.toLocaleString("en-SG", {
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="neu-card rounded-sm px-4 py-2.5 bg-card flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Weighted
          </span>
          <span className="text-sm font-extrabold text-brand-teal">
            SGD{" "}
            {weighted.toLocaleString("en-SG", { minimumFractionDigits: 0 })}
          </span>
        </div>
        <div className="neu-card rounded-sm px-4 py-2.5 bg-card flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Won</span>
          <span className="text-sm font-extrabold text-green-600">
            SGD{" "}
            {wonTotal.toLocaleString("en-SG", { minimumFractionDigits: 0 })}
          </span>
        </div>
        <Button
          onClick={() => openCreate("new")}
          className="ml-auto neu-btn bg-brand-yellow text-black font-bold rounded-sm h-9 px-3 text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          New lead
        </Button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 min-w-max pb-4">
        {stages.map((stage) => {
          const cfg = stageConfig[stage];
          const stageLeads = byStage[stage];
          const stageValue = stageLeads.reduce(
            (s, l) => s + (l.value ?? 0),
            0
          );

          return (
            <div key={stage} className="w-[272px] flex flex-col gap-2">
              {/* Column header */}
              <div
                className={cn(
                  "rounded-sm px-3 py-2 flex items-center justify-between border-[2px] border-black shadow-[2px_2px_0_#000]",
                  cfg.color,
                  cfg.textColor
                )}
              >
                <span className="text-xs font-extrabold uppercase tracking-widest">
                  {cfg.label}
                </span>
                <div className="flex items-center gap-2">
                  {stageValue > 0 && (
                    <span className="text-xs font-bold opacity-80">
                      SGD{" "}
                      {stageValue.toLocaleString("en-SG", {
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  )}
                  <span className="text-xs font-bold opacity-70">
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              {/* Lead cards */}
              <div className="flex flex-col gap-2 min-h-[80px]">
                {stageLeads.length === 0 && (
                  <div className="neu-card rounded-sm p-4 bg-card flex items-center justify-center min-h-[80px]">
                    <p className="text-xs text-muted-foreground">No leads</p>
                  </div>
                )}
                {stageLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    clientName={
                      lead.client_id ? clientMap[lead.client_id] : null
                    }
                    onClick={() => setEditing(lead)}
                  />
                ))}
              </div>

              {/* Add to this stage */}
              <button
                onClick={() => openCreate(stage)}
                className="flex items-center gap-1 text-xs text-muted-foreground font-semibold py-1.5 px-2 rounded-sm hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add lead
              </button>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreateLeadModal
        open={showCreate}
        initialStage={createStage}
        clients={clients}
        onClose={() => setShowCreate(false)}
      />
      <EditLeadModal
        lead={editing}
        clients={clients}
        onClose={() => setEditing(null)}
      />
    </>
  );
}

// ── Lead card ──────────────────────────────────────────────────
interface LeadCardProps {
  lead: Lead;
  clientName: string | null | undefined;
  onClick: () => void;
}

function LeadCard({ lead, clientName, onClick }: LeadCardProps) {
  const isOverdue =
    lead.follow_up_at &&
    new Date(lead.follow_up_at) < new Date() &&
    !["won", "lost"].includes(lead.stage);

  return (
    <button
      onClick={onClick}
      className="neu-card rounded-sm p-3.5 bg-card text-left w-full cursor-pointer hover:-translate-y-0.5 transition-transform duration-100"
    >
      <p className="font-bold text-sm leading-snug mb-1.5 text-foreground">
        {lead.title}
      </p>

      {clientName && (
        <p className="text-xs text-muted-foreground mb-2 truncate">
          {clientName}
        </p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        {lead.value != null && (
          <span className="inline-flex items-center text-xs font-bold bg-brand-teal/10 text-brand-teal border border-brand-teal/30 rounded-sm px-1.5 py-0.5">
            SGD{" "}
            {Number(lead.value).toLocaleString("en-SG", {
              minimumFractionDigits: 0,
            })}
          </span>
        )}
        {lead.probability != null && (
          <span className="text-xs font-semibold text-muted-foreground">
            {lead.probability}%
          </span>
        )}
        {lead.source && (
          <span className="text-xs text-muted-foreground/60 italic truncate max-w-[90px]">
            {lead.source}
          </span>
        )}
      </div>

      {lead.follow_up_at && (
        <p
          className={cn(
            "flex items-center gap-1 text-xs mt-2 font-medium",
            isOverdue ? "text-brand-coral font-bold" : "text-muted-foreground"
          )}
        >
          <Calendar className="w-3 h-3" />
          {new Date(lead.follow_up_at).toLocaleDateString("en-SG", {
            day: "numeric",
            month: "short",
          })}
          {isOverdue && " · overdue"}
        </p>
      )}
    </button>
  );
}
