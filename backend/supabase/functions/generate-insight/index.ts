import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-3-haiku-20240307";

const SYSTEM_PROMPT = `You are a non-judgmental productivity coach inside an app called FocusForge. 
Never use the words 'limit', 'restrict', or 'bad'. 
Always frame observations with curiosity (e.g., "I noticed you feel anxious before working — what might be driving that?"). 
Keep your response under 2 sentences. Be warm, concise, and insightful.`;

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
    const { user_id, insight_type } = body as {
      user_id: string;
      insight_type: "post_session" | "weekly_report";
    };

    if (!user_id || !insight_type) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or insight_type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data: sessions, error: sessionsErr } = await supabase
      .from("focus_sessions")
      .select("mode, duration_minutes, completed, xp_earned, started_at, ended_at")
      .eq("user_id", user_id)
      .gte("started_at", fourteenDaysAgo.toISOString())
      .order("started_at", { ascending: false })
      .limit(30);

    if (sessionsErr) {
      console.error("Error fetching sessions:", sessionsErr);
      return new Response(
        JSON.stringify({ error: "Failed to fetch sessions" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: moods, error: moodsErr } = await supabase
      .from("mood_logs")
      .select("mood_id, log_type, timestamp")
      .eq("user_id", user_id)
      .gte("timestamp", fourteenDaysAgo.toISOString())
      .order("timestamp", { ascending: false })
      .limit(30);

    if (moodsErr) {
      console.error("Error fetching moods:", moodsErr);
      return new Response(
        JSON.stringify({ error: "Failed to fetch mood logs" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const completedCount = sessions?.filter((s) => s.completed).length ?? 0;
    const abandonedCount = sessions?.filter((s) => !s.completed).length ?? 0;
    const totalMinutes = sessions?.reduce((acc, s) => acc + s.duration_minutes, 0) ?? 0;
    const totalXp = sessions?.reduce((acc, s) => acc + s.xp_earned, 0) ?? 0;

    const moodCounts: Record<string, number> = {};
    for (const m of moods ?? []) {
      moodCounts[m.mood_id] = (moodCounts[m.mood_id] ?? 0) + 1;
    }

    const moodBreakdown = Object.entries(moodCounts)
      .map(([mood, count]) => `${mood}: ${count}`)
      .join(", ");

    const contextPrompt =
      insight_type === "weekly_report"
        ? `Weekly summary: ${completedCount} sessions completed, ${abandonedCount} abandoned. ` +
          `Total focus time: ${totalMinutes} min, total XP earned: ${totalXp}. ` +
          `Mood distribution: ${moodBreakdown || "no data"}. ` +
          `Give the user an encouraging weekly observation with a curious question.`
        : `User just finished a focus session. Recent stats: ${completedCount} completed, ` +
          `${abandonedCount} abandoned over last 14 days. ` +
          `Mood distribution: ${moodBreakdown || "no data"}. ` +
          `Provide a brief, curiosity-driven insight about their recent pattern.`;

    const anthropicResponse = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 150,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: contextPrompt,
          },
        ],
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

    const aiResult = await anthropicResponse.json();
    const insightText =
      aiResult?.content?.[0]?.text ?? "Keep exploring your focus patterns — something interesting is emerging.";

    const { error: insertErr } = await supabase
      .from("ai_insights")
      .insert({
        user_id,
        insight_text: insightText,
        type: insight_type,
        read: false,
      });

    if (insertErr) {
      console.error("Error inserting insight:", insertErr);
      return new Response(
        JSON.stringify({ error: "Failed to save insight" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, insight: insightText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
