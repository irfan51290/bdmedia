import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ContentBoard } from "@/components/marketing/content-board";

const statusOrder = ["idea", "draft", "scheduled", "published", "archived"];

export default async function MarketingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: posts, error: postsError },
    { count: portfolioCount },
    { count: referralsCount },
  ] = await Promise.all([
    supabase
      .from("content_posts")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("portfolio_items")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true }),
  ]);

  if (postsError) throw new Error(postsError.message);

  const allPosts = posts ?? [];

  // Count by status
  const statusCounts = Object.fromEntries(
    statusOrder.map((s) => [s, allPosts.filter((p) => p.status === s).length])
  );

  return (
    <>
      <PageHeader
        title="Marketing"
        description="Content calendar, portfolio, and self-promo tools."
      />
      <main className="flex-1 p-6">
        <div className="bento-grid">
          {/* Content calendar — span 3 */}
          <div className="bento-span-3 neu-card rounded-sm p-5 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-4">
              Content Calendar
            </p>
            <ContentBoard posts={allPosts} />
          </div>

          {/* Portfolio count */}
          <div className="neu-card rounded-sm p-6 bg-brand-coral text-white">
            <p className="font-bold text-xs uppercase tracking-widest opacity-70 mb-2">
              Portfolio
            </p>
            <p className="text-5xl font-extrabold">{portfolioCount ?? 0}</p>
            <p className="text-xs mt-1 opacity-70">items</p>
          </div>

          {/* Referrals — span 2 */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-brand-yellow text-black">
            <p className="font-bold text-xs uppercase tracking-widest opacity-70 mb-2">
              Referrals Received
            </p>
            <p className="text-5xl font-extrabold">{referralsCount ?? 0}</p>
          </div>

          {/* Post status breakdown — span 2 */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-3">
              Post Status
            </p>
            <div className="space-y-0">
              {statusOrder.map((s) => (
                <div
                  key={s}
                  className="flex justify-between text-sm py-2 border-b border-black/10 last:border-0"
                >
                  <span className="capitalize text-muted-foreground">{s}</span>
                  <span className="font-extrabold">{statusCounts[s]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
