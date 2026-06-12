"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, DollarSign, Clock, RefreshCw } from "lucide-react";
import { CreateProjectModal, EditProjectModal } from "./project-modal";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Client = { id: string; name: string };
type Lead = { id: string; title: string };

const ALL = "all" as const;
type StatusFilter =
  | typeof ALL
  | "planning"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

const statusConfig: Record<
  string,
  { color: string; textColor: string; label: string }
> = {
  planning:  { color: "bg-brand-yellow",  textColor: "text-black",             label: "Planning"  },
  active:    { color: "bg-brand-teal",    textColor: "text-white",             label: "Active"    },
  paused:    { color: "bg-muted",         textColor: "text-muted-foreground",  label: "Paused"    },
  completed: { color: "bg-brand-mint",    textColor: "text-black",             label: "Completed" },
  cancelled: { color: "bg-brand-coral",   textColor: "text-white",             label: "Cancelled" },
};

const typeLabel: Record<string, string> = {
  fixed:    "Fixed",
  hourly:   "Hourly",
  retainer: "Retainer",
};

interface ProjectsListProps {
  projects: Project[];
  clients: Client[];
  leads: Lead[];
}

export function ProjectsList({ projects, clients, leads }: ProjectsListProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [filter, setFilter] = useState<StatusFilter>(ALL);

  const filtered =
    filter === ALL ? projects : projects.filter((p) => p.status === filter);

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const counts = Object.fromEntries(
    (["planning", "active", "paused", "completed", "cancelled"] as const).map(
      (s) => [s, projects.filter((p) => p.status === s).length]
    )
  );

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setFilter(ALL)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer border-[2px] transition-all duration-100",
            filter === ALL
              ? "border-black shadow-[2px_2px_0_#000] bg-foreground text-background"
              : "border-transparent hover:border-black"
          )}
        >
          All ({projects.length})
        </button>
        {(
          ["planning", "active", "paused", "completed", "cancelled"] as const
        ).map((s) => {
          const cfg = statusConfig[s];
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer border-[2px] transition-all duration-100",
                active
                  ? `${cfg.color} ${cfg.textColor} border-black shadow-[2px_2px_0_#000]`
                  : "border-transparent hover:border-black"
              )}
            >
              {cfg.label} ({counts[s]})
            </button>
          );
        })}
        <Button
          onClick={() => setShowCreate(true)}
          className="ml-auto neu-btn bg-brand-orange text-white font-bold rounded-sm h-9 px-3 text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          New project
        </Button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="neu-card rounded-sm p-12 bg-card text-center">
          {filter !== ALL ? (
            <p className="text-muted-foreground text-sm">
              No <strong>{filter}</strong> projects.
            </p>
          ) : (
            <>
              <p className="font-extrabold text-lg mb-1">No projects yet</p>
              <p className="text-muted-foreground text-sm mb-5">
                Convert a won lead or create one directly.
              </p>
              <Button
                onClick={() => setShowCreate(true)}
                className="neu-btn bg-brand-orange text-white font-bold rounded-sm h-9 px-4 text-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add first project
              </Button>
            </>
          )}
        </div>
      )}

      {/* Project grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              clientName={project.client_id ? clientMap[project.client_id] : null}
              onClick={() => setEditing(project)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        open={showCreate}
        clients={clients}
        leads={leads}
        onClose={() => setShowCreate(false)}
      />
      <EditProjectModal
        project={editing}
        clients={clients}
        leads={leads}
        onClose={() => setEditing(null)}
      />
    </>
  );
}

// ── Project card ───────────────────────────────────────────────
interface ProjectCardProps {
  project: Project;
  clientName: string | null | undefined;
  onClick: () => void;
}

function ProjectCard({ project, clientName, onClick }: ProjectCardProps) {
  const cfg = statusConfig[project.status];

  const dueDate = project.due_date ? new Date(project.due_date) : null;
  const now = new Date();
  const isOverdue =
    dueDate &&
    dueDate < now &&
    !["completed", "cancelled"].includes(project.status);
  const daysUntilDue = dueDate
    ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const financialValue = project.budget ?? project.rate;
  const financialLabel =
    project.type === "fixed"
      ? "Budget"
      : project.type === "hourly"
      ? "Rate/hr"
      : "Retainer/mo";

  return (
    <button
      onClick={onClick}
      className="neu-card rounded-sm p-5 bg-card text-left cursor-pointer w-full hover:-translate-y-0.5 transition-transform duration-100"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-extrabold text-base leading-tight truncate">
            {project.title}
          </p>
          {clientName && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {clientName}
            </p>
          )}
        </div>
        <Badge
          className={cn(
            "shrink-0 rounded-sm border-[2px] border-black text-xs font-bold capitalize px-2",
            cfg.color,
            cfg.textColor
          )}
        >
          {cfg.label}
        </Badge>
      </div>

      {/* Type + financial */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-xs font-bold bg-muted rounded-sm px-2 py-0.5 border border-black/10">
          {project.type === "hourly" ? (
            <Clock className="w-3 h-3" />
          ) : project.type === "retainer" ? (
            <RefreshCw className="w-3 h-3" />
          ) : (
            <DollarSign className="w-3 h-3" />
          )}
          {typeLabel[project.type]}
        </span>
        {financialValue != null && (
          <span className="text-xs font-bold text-brand-teal">
            SGD {Number(financialValue).toLocaleString("en-SG", { minimumFractionDigits: 0 })}
            {project.type !== "fixed" && (
              <span className="font-normal text-muted-foreground">
                {project.type === "hourly" ? "/hr" : "/mo"}
              </span>
            )}
          </span>
        )}
        {project.budget == null && project.rate == null && (
          <span className="text-xs text-muted-foreground">{financialLabel} TBD</span>
        )}
      </div>

      {/* Dates */}
      <div className="border-t-[2px] border-black pt-3 flex items-center justify-between gap-2">
        {project.start_date && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(project.start_date).toLocaleDateString("en-SG", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
        {dueDate ? (
          <span
            className={cn(
              "text-xs font-semibold flex items-center gap-1 ml-auto",
              isOverdue
                ? "text-brand-coral font-bold"
                : daysUntilDue !== null && daysUntilDue <= 7
                ? "text-brand-orange font-bold"
                : "text-muted-foreground"
            )}
          >
            <Calendar className="w-3 h-3" />
            {isOverdue
              ? `${Math.abs(daysUntilDue!)}d overdue`
              : daysUntilDue === 0
              ? "Due today"
              : daysUntilDue !== null && daysUntilDue > 0
              ? `${daysUntilDue}d left`
              : dueDate.toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
          </span>
        ) : (
          !project.start_date && (
            <span className="text-xs text-muted-foreground ml-auto">No dates set</span>
          )
        )}
      </div>
    </button>
  );
}
