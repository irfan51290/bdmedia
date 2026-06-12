import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/settings/profile-form";
import { AccountSection } from "@/components/settings/account-section";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) throw new Error("Could not load profile");

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile and account."
      />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

          {/* Profile form */}
          <div className="neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-5">
              Profile
            </p>
            <ProfileForm profile={profile} />
          </div>

          {/* Account panel */}
          <div className="space-y-4">
            <div className="neu-card rounded-sm p-5 bg-card">
              <p className="font-bold text-sm uppercase tracking-widest mb-4">
                Account
              </p>
              <AccountSection email={user.email ?? ""} />
            </div>

            {/* App info */}
            <div className="neu-card rounded-sm p-5 bg-brand-yellow text-black">
              <p className="font-extrabold text-sm">FreelanceOS</p>
              <p className="text-xs opacity-70 mt-0.5">
                Built for solo freelancers in Southeast Asia.
              </p>
              <div className="mt-3 pt-3 border-t-[2px] border-black/20 space-y-0.5">
                <p className="text-xs font-bold">Version 0.1.0</p>
                <p className="text-xs opacity-60">Next.js · Supabase · Tailwind</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
