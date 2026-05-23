import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-3-5-sonnet-20241022";

const SYSTEM_PROMPT = `You are an emotionally intelligent productivity coach inside FocusForge, a gamified focus app.
Your philosophy is built on curiosity, not restriction. You never shame or judge.
You help users explore their relationship with technology and focus through open questions,
gentle observations, and actionable experiments. You are warm but concise. 
If a user is clearly distressed, gently suggest professional support.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { user_id, messages } = body as {
      user_id: string;
      messages: ChatMessage[];
    };

    if (!user_id || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or messages" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("plan_type")
      .eq("id", user_id)
      .single();

    if (profileErr || !profile) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (profile.plan_type !== "premium") {
      return new Response(
        JSON.stringify({ error: "Premium plan required", code: "PREMIUM_REQUIRED" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [sessionsResult, moodsResult] = await Promise.all([
      supabase
        .from("focus_sessions")
        .select("mode, duration_minutes, completed, started_at")
        .eq("user_id", user_id)
        .gte("started_at", sevenDaysAgo.toISOString())
        .order("started_at", { ascending: false })
        .limit(10),
      supabase
        .from("mood_logs")
        .select("mood_id, log_type, timestamp")
        .eq("user_id", user_id)
        .gte("timestamp", sevenDaysAgo.toISOString())
        .order("timestamp", { ascending: false })
        .limit(10),
    ]);

    const recentSessions = sessionsResult.data ?? [];
    const recentMoods = moodsResult.data ?? [];

    const contextBlock = `\n\n[Recent context: ${recentSessions.length} sessions, ` +
      `${recentSessions.filter((s) => s.completed).length} completed. ` +
      `Recent moods: ${recentMoods.map((m) => m.mood_id).join(", ") || "none"}]`;

    const enrichedSystemPrompt = SYSTEM_PROMPT + contextBlock;

    const anthropicResponse = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        stream: true,
        system: enrichedSystemPrompt,
        messages: messages.map((m: ChatMessage) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!anthropicResponse.ok) {
      const errBody = await anthropicResponse.text();
      console.error("Anthropic API error:", errBody);
      return new Response(
        JSON.stringify({ error: "AI provider error" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const reader = anthropicResponse.body!.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        function sendSSE(event: string, data: string) {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        }

        try {
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;

                try {
                  const event = JSON.parse(jsonStr);

                  if (event.type === "content_block_delta") {
                    const text = event.delta?.text ?? "";
                    if (text) {
                      sendSSE("token", JSON.stringify({ text }));
                    }
                  } else if (event.type === "message_stop") {
                    sendSSE("done", JSON.stringify({ finished: true }));
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }
          }

          sendSSE("done", JSON.stringify({ finished: true }));
        } catch (err) {
          console.error("Stream error:", err);
          sendSSE("error", JSON.stringify({ error: "Stream interrupted" }));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
