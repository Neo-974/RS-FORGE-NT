import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt } from "@/lib/claude/prompts";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { projectId, stepNumber, messages } = await request.json();

    if (!projectId || !stepNumber || !messages) {
      return NextResponse.json(
        { error: "Paramètres manquants : projectId, stepNumber, messages requis." },
        { status: 400 }
      );
    }

    /* Vérification de session via le cookie Supabase */
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Session invalide." }, { status: 401 });
    }

    /* Vérification que le projet appartient bien à l'utilisateur */
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    const systemPrompt = getSystemPrompt(stepNumber);

    /* Activation du web search uniquement pour l'étape 2 (analyse d'unicité) */
    const useWebSearch = stepNumber === 2;
    const tools: Anthropic.Tool[] = useWebSearch
      ? [{ type: "web_search_20250305" as const, name: "web_search", max_uses: 5 }]
      : [];

    /* Appel Claude API avec streaming */
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      ...(tools.length > 0 ? { tools } : {}),
    });

    /* Sauvegarde du dernier message utilisateur en base */
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === "user");
    if (lastUserMessage) {
      await supabase.from("conversations").insert({
        project_id: projectId,
        step_number: stepNumber,
        role: "user",
        content: typeof lastUserMessage.content === "string"
          ? lastUserMessage.content
          : JSON.stringify(lastUserMessage.content),
      });
    }

    /* Stream de la réponse vers le client */
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullText = "";

        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              fullText += chunk.delta.text;
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }

          /* Sauvegarde de la réponse complète de l'assistant */
          if (fullText) {
            await supabase.from("conversations").insert({
              project_id: projectId,
              step_number: stepNumber,
              role: "assistant",
              content: fullText,
            });
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
