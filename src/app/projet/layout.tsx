import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* Protection de toutes les routes /projet/* */
export default async function ProjetLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <>{children}</>;
}
