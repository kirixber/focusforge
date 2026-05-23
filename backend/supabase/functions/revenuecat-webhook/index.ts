import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PREMIUM_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "TRANSFER",
  "PRODUCT_CHANGE",
]);

const FREE_EVENTS = new Set([
  "CANCELLATION",
  "EXPIRATION",
  "BILLING_RETRY_ENTERED",
]);

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const webhookAuthKey = Deno.env.get("REVENUECAT_WEBHOOK_AUTH_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${webhookAuthKey}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const event = body.event as {
      type: string;
      app_user_id: string;
      product_id: string;
      expiration_at_ms?: number;
      purchased_at_ms?: number;
      environment?: string;
      store?: string;
      aliases?: string[];
    };

    if (!event || !event.type || !event.app_user_id) {
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(
      `[RevenueCat] event=${event.type} user=${event.app_user_id} env=${event.environment}`
    );

    let planType: "free" | "premium";

    if (PREMIUM_EVENTS.has(event.type)) {
      planType = "premium";
    } else if (FREE_EVENTS.has(event.type)) {
      planType = "free";
    } else {
      console.warn(`[RevenueCat] Unhandled event type: ${event.type}`);
      return new Response(
        JSON.stringify({ received: true, action: "ignored" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const userIds = [event.app_user_id, ...(event.aliases ?? [])].filter(Boolean);

    for (const uid of userIds) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uid)) {
        console.warn(`[RevenueCat] Skipping non-UUID user id: ${uid}`);
        continue;
      }

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ plan_type: planType, updated_at: new Date().toISOString() })
        .eq("id", uid);

      if (updateErr) {
        console.error(`[RevenueCat] Error updating profile for ${uid}:`, updateErr);
      } else {
        console.log(`[RevenueCat] Updated ${uid} → ${planType}`);
      }
    }

    return new Response(
      JSON.stringify({ received: true, action: "updated", plan_type: planType }),
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
