"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from "lucide-react";
import { CreatePostModal, EditPostModal } from "./post-modal";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

const ALL = "All";
const PLATFORMS = ["All", "LinkedIn", "Instagram", "X", "TikTok", "Newsletter", "Blog", "Other"];

const statusConfig: Record<string, { color: string; textColor: string }> = {
  idea:      { color: "bg-muted",          textColor: "text-muted-foreground" },
  draft:     { color: "bg-brand-yellow",   textColor: "text-black" },
  scheduled: { color: "bg-brand-teal",     textColor: "text-white" },
  published: { color: "bg-green-500",      textColor: "text-white" },
  archived:  { color: "bg-muted",          textColor: "text-muted-foreground" },
};

const platformColor: Record<string, string> = {
  LinkedIn:   "bg-blue-100 text-blue-800 border-blue-300",
  Instagram:  "bg-pink-100 text-pink-800 border-pink-300",
  X:          "bg-zinc-100 text-zinc-800 border-zinc-300",
  TikTok:     "bg-brand-mint/20 text-brand-teal border-brand-mint/40",
  Newsletter: "bg-brand-yellow/40 text-black border-brand-yellow",
  Blog:       "bg-brand-orange/10 text-brand-orange border-brand-orange/30",
  Other:      "bg-muted text-muted-foreground border-black/10",
};

interface ContentBoardProps {
  posts: Post[];
}

export function ContentBoard({ posts }: ContentBoardProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [platformFilter, setPlatformFilter] = useState(ALL);

  const filtered =
    platformFilter === ALL
      ? posts
      : posts.filter((p) => p.platform === platformFilter);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Platform tabs */}
        <div className="flex flex-wrap gap-1.5">
          {PLATFORMS.map((p) => {
            const count = p === ALL ? posts.length : posts.filter((post) => post.platform === p).length;
            if (p !== ALL && count === 0) return null;
            return (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={cn(
                  "rounded-sm px-2.5 py-1 text-xs font-bold cursor-pointer border-[2px] transition-all duration-100",
                  platformFilter === p
                    ? "border-black shadow-[2px_2px_0_#000] bg-foreground text-background"
                    : "border-transparent bg-muted hover:border-black"
                )}
              >
                {p} {count > 0 && <span className="opacity-60">({count})</span>}
              </button>
            );
          })}
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="shrink-0 neu-btn bg-brand-coral text-white font-bold rounded-sm h-8 px-3 text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          New post
        </Button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="neu-card rounded-sm p-10 bg-card text-center">
          {platformFilter !== ALL ? (
            <p className="text-muted-foreground text-sm">
              No posts for <strong>{platformFilter}</strong>.
            </p>
          ) : (
            <>
              <p className="font-extrabold text-base mb-1">No content yet</p>
              <p className="text-muted-foreground text-sm mb-4">
                Draft your first post to start building your content pipeline.
              </p>
              <Button
                onClick={() => setShowCreate(true)}
                className="neu-btn bg-brand-coral text-white font-bold rounded-sm h-9 px-4 text-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create first post
              </Button>
            </>
          )}
        </div>
      )}

      {/* Post grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((post) => {
            const sc = statusConfig[post.status];
            const pc = platformColor[post.platform] ?? platformColor["Other"];
            return (
              <button
                key={post.id}
                onClick={() => setEditing(post)}
                className="neu-card rounded-sm p-4 bg-card text-left cursor-pointer w-full hover:-translate-y-0.5 transition-transform duration-100"
              >
                {/* Header badges */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span
                    className={cn(
                      "text-xs font-bold rounded-sm px-2 py-0.5 border",
                      pc
                    )}
                  >
                    {post.platform}
                  </span>
                  <Badge
                    className={cn(
                      "rounded-sm border-[2px] border-black text-xs font-bold capitalize px-2",
                      sc.color,
                      sc.textColor
                    )}
                  >
                    {post.status}
                  </Badge>
                </div>

                {/* Title */}
                <p className="font-bold text-sm leading-snug truncate mb-1.5">
                  {post.title}
                </p>

                {/* Body preview */}
                {post.body && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {post.body}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t-[1px] border-black/10">
                  {post.scheduled_at ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.scheduled_at).toLocaleDateString("en-SG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">No date set</span>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-muted rounded-sm px-1.5 py-0.5 text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreatePostModal open={showCreate} onClose={() => setShowCreate(false)} />
      <EditPostModal post={editing} onClose={() => setEditing(null)} />
    </>
  );
}
