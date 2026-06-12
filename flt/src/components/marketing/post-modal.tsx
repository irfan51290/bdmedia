"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPost,
  updatePost,
  deletePost,
  type PostFormData,
} from "@/app/(dashboard)/marketing/actions";
import type { Database } from "@/lib/supabase/database.types";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

const PLATFORMS = ["LinkedIn", "Instagram", "X", "TikTok", "Newsletter", "Blog", "Other"];

const inputClass =
  "border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-10";

const labelClass = "text-xs font-bold uppercase tracking-widest";

// ── Create ────────────────────────────────────────────────────
interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  async function handleSubmit(data: PostFormData) {
    await createPost(data);
    onClose();
  }
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">New post</DialogTitle>
        </DialogHeader>
        <PostForm onSubmit={handleSubmit} onCancel={onClose} submitLabel="Create post" />
      </DialogContent>
    </Dialog>
  );
}

// ── Edit ──────────────────────────────────────────────────────
interface EditPostModalProps {
  post: Post | null;
  onClose: () => void;
}

export function EditPostModal({ post, onClose }: EditPostModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(data: PostFormData) {
    if (!post) return;
    await updatePost(post.id, data);
    onClose();
  }

  function handleDelete() {
    if (!post) return;
    startTransition(async () => {
      await deletePost(post.id);
      onClose();
    });
  }

  if (!post) return null;

  return (
    <Dialog open={!!post} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[3px] border-black rounded-sm shadow-[6px_6px_0_#000] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Edit post</DialogTitle>
        </DialogHeader>
        <PostForm
          defaultValues={{
            title: post.title,
            platform: post.platform,
            status: post.status as PostFormData["status"],
            body: post.body ?? "",
            scheduled_at: post.scheduled_at?.slice(0, 16) ?? "",
            tags: post.tags?.join(", ") ?? "",
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
        <div className="border-t-[2px] border-black pt-4 mt-2">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-bold text-brand-coral underline underline-offset-2 cursor-pointer hover:opacity-70"
            >
              Delete this post
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold text-brand-coral flex-1">Sure?</p>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="neu-btn bg-brand-coral text-white text-xs font-bold px-3 py-1.5 rounded-sm border-black cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs font-semibold cursor-pointer hover:opacity-70"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Shared form ───────────────────────────────────────────────
interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function PostForm({ defaultValues, onSubmit, onCancel, submitLabel = "Save post" }: PostFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: PostFormData = {
      title: fd.get("title") as string,
      platform: fd.get("platform") as string,
      status: fd.get("status") as PostFormData["status"],
      body: fd.get("body") as string,
      scheduled_at: fd.get("scheduled_at") as string,
      tags: fd.get("tags") as string,
    };
    startTransition(() => onSubmit(data));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className={labelClass}>Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Post headline or working title"
          defaultValue={defaultValues?.title}
          required
          className={inputClass}
        />
      </div>

      {/* Platform + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className={labelClass}>Platform</Label>
          <Select name="platform" defaultValue={defaultValues?.platform ?? "LinkedIn"}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>Status</Label>
          <Select name="status" defaultValue={defaultValues?.status ?? "idea"}>
            <SelectTrigger className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[2px] border-black rounded-sm shadow-[3px_3px_0_#000]">
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Schedule date */}
      <div className="space-y-1.5">
        <Label htmlFor="scheduled_at" className={labelClass}>Schedule date &amp; time</Label>
        <Input
          id="scheduled_at"
          name="scheduled_at"
          type="datetime-local"
          defaultValue={defaultValues?.scheduled_at}
          className={inputClass}
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <Label htmlFor="body" className={labelClass}>Content</Label>
        <Textarea
          id="body"
          name="body"
          placeholder="Write your post content here…"
          defaultValue={defaultValues?.body}
          rows={4}
          className="border-[2px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 resize-none"
        />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label htmlFor="tags" className={labelClass}>Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="freelance, design, singapore"
          defaultValue={defaultValues?.tags}
          className={inputClass}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 h-10 neu-btn bg-brand-coral text-white font-bold rounded-sm border-black cursor-pointer"
        >
          {isPending ? "Saving…" : submitLabel}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="h-10 neu-btn bg-card text-foreground font-bold rounded-sm border-black cursor-pointer px-4"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
