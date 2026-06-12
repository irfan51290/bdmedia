"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateClientModal, EditClientModal } from "./client-modal";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type Client = Database["public"]["Tables"]["clients"]["Row"];

const statusStyles: Record<string, string> = {
  active:   "bg-brand-teal text-white",
  inactive: "bg-muted text-muted-foreground",
  prospect: "bg-brand-yellow text-black",
};

interface ClientsListProps {
  clients: Client[];
}

export function ClientsList({ clients }: ClientsListProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.company ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[2px] border-black rounded-sm h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex gap-2 text-xs font-bold text-muted-foreground">
          <span>{clients.filter((c) => c.status === "active").length} active</span>
          <span>·</span>
          <span>{clients.filter((c) => c.status === "prospect").length} prospects</span>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="ml-auto neu-btn bg-brand-teal text-white font-bold rounded-sm h-9 px-3 text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          New client
        </Button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="neu-card rounded-sm p-12 bg-card text-center">
          {search ? (
            <p className="text-muted-foreground text-sm">
              No clients matching <strong>&ldquo;{search}&rdquo;</strong>
            </p>
          ) : (
            <>
              <p className="font-extrabold text-lg mb-1">No clients yet</p>
              <p className="text-muted-foreground text-sm mb-5">
                Add your first client to start tracking projects and invoices.
              </p>
              <Button
                onClick={() => setShowCreate(true)}
                className="neu-btn bg-brand-yellow text-black font-bold rounded-sm h-9 px-4 text-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add first client
              </Button>
            </>
          )}
        </div>
      )}

      {/* Client grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => setEditing(client)}
              className={cn(
                "neu-card rounded-sm p-5 bg-card text-left cursor-pointer w-full",
                "hover:-translate-y-0.5 transition-transform duration-100"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="font-extrabold text-base leading-tight truncate">
                    {client.name}
                  </p>
                  {client.company && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="w-3 h-3 shrink-0" />
                      {client.company}
                    </p>
                  )}
                </div>
                <Badge
                  className={cn(
                    "shrink-0 rounded-sm border-[2px] border-black text-xs font-bold capitalize px-2",
                    statusStyles[client.status]
                  )}
                >
                  {client.status}
                </Badge>
              </div>

              {/* Contact */}
              <div className="space-y-1 mb-4">
                {client.email && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 shrink-0" />
                    {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3 h-3 shrink-0" />
                    {client.phone}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t-[2px] border-black pt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  Total billed
                </span>
                <span className="text-sm font-extrabold">
                  SGD {Number(client.total_billed).toLocaleString("en-SG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateClientModal open={showCreate} onClose={() => setShowCreate(false)} />
      <EditClientModal client={editing} onClose={() => setEditing(null)} />
    </>
  );
}
