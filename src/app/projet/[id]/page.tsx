import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* Redirige automatiquement vers l'étape courante du projet */
export default async function ProjetPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, current_step")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!project) notFound();

  redirect(`/projet/${project.id}/etape/${project.current_step}`);
}
