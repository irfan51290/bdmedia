import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const platforms = ["LinkedIn", "Instagram", "X", "TikTok", "Newsletter"];

export default function MarketingPage() {
  return (
    <>
      <PageHeader
        title="Marketing"
        description="Content calendar, portfolio, and self-promo tools."
        actions={
          <Button className="neu-btn bg-brand-coral text-white font-bold rounded-sm h-8 px-3 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Post
          </Button>
        }
      />
      <main className="flex-1 p-6">
        <div className="bento-grid">
          {/* Content calendar */}
          <div className="bento-span-3 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-4">
              Content Calendar
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="neu-card-sm rounded-sm px-2.5 py-1 text-xs font-bold bg-card"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              No posts scheduled. Draft your first piece of content.
            </p>
          </div>

          {/* Portfolio */}
          <div className="neu-card rounded-sm p-6 bg-brand-coral text-white">
            <p className="font-bold text-sm uppercase tracking-widest mb-2">
              Portfolio
            </p>
            <p className="text-4xl font-extrabold">0</p>
            <p className="text-xs mt-1 opacity-70">items</p>
          </div>

          {/* Stats */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-brand-yellow text-black">
            <p className="font-bold text-sm uppercase tracking-widest mb-2">
              Referrals Received
            </p>
            <p className="text-5xl font-extrabold">0</p>
          </div>

          <div className="bento-span-2 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-3">
              Post Status
            </p>
            {["idea", "draft", "scheduled", "published"].map((s) => (
              <div key={s} className="flex justify-between text-sm py-1 border-b border-black/10 last:border-0">
                <span className="capitalize text-muted-foreground">{s}</span>
                <span className="font-bold">0</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
