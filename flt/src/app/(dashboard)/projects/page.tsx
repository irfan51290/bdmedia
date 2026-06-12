import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectsList } from "@/components/projects/projects-list";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: projects, error: projectsError },
    { data: clients },
    { data: leads },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
    supabase.from("leads").select("id, title").order("title"),
  ]);

  if (projectsError) throw new Error(projectsError.message);

  return (
    <>
      <PageHeader
        title="Projects"
        description={`${projects?.length ?? 0} project${projects?.length !== 1 ? "s" : ""}`}
      />
      <main className="flex-1 p-6">
        <ProjectsList
          projects={projects ?? []}
          clients={clients ?? []}
          leads={leads ?? []}
        />
      </main>
    </>
  );
}
