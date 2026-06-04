import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StepProgressBar from "@/components/steps/StepProgressBar";
import ChatInterface from "@/components/chat/ChatInterface";
import StepHeader from "@/components/steps/StepHeader";
import StepActions from "@/components/steps/StepActions";

interface Props {
  params: { id: string; num: string };
}

export default async function EtapePage({ params }: Props) {
  const stepNum = parseInt(params.num, 10);

  if (isNaN(stepNum) || stepNum < 1 || stepNum > 7) notFound();

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  /* Charge le projet */
  const { data: project } = await supabase
    .from("projects")
    .select("id, title, status, current_step")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!project) notFound();

  /* Charge toutes les étapes */
  const { data: steps } = await supabase
    .from("project_steps")
    .select("step_number, step_name, status")
    .eq("project_id", project.id)
    .order("step_number");

  /* Charge l'historique de conversation de cette étape */
  const { data: history } = await supabase
    .from("conversations")
    .select("role, content")
    .eq("project_id", project.id)
    .eq("step_number", stepNum)
    .order("created_at");

  const currentStepData = steps?.find((s) => s.step_number === stepNum);
  const isComplete = currentStepData?.status === "complete";
  const isLastStep = stepNum === 7;

  const initialMessages = (history ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--color-bg-primary)" }}>

      {/* Barre de progression */}
      <StepProgressBar
        projectId={project.id}
        steps={steps ?? []}
        currentStep={stepNum}
      />

      {/* En-tête de l'étape */}
      <StepHeader
        projectTitle={project.title}
        stepNumber={stepNum}
        stepName={currentStepData?.step_name ?? ""}
        isComplete={isComplete}
      />

      {/* Zone de chat — occupe tout l'espace disponible */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          projectId={project.id}
          stepNumber={stepNum}
          initialMessages={initialMessages}
        />
      </div>

      {/* Actions bas de page : valider l'étape, passer à la suivante */}
      <StepActions
        projectId={project.id}
        stepNumber={stepNum}
        isComplete={isComplete}
        isLastStep={isLastStep}
      />
    </div>
  );
}
