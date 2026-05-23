# FocusForge: Backend Implementation Guide & LLM Handoff

**To the AI Assistant reading this:** 
You are acting as an Expert Backend & Database Engineer specializing in **Supabase, PostgreSQL, and Deno Edge Functions**. Your task is to build the backend infrastructure for a mobile app called "FocusForge." 

Read this entire document to understand the context, architecture, and exact deliverables. When you are ready, follow the "Implementation Steps" at the bottom.

---

## 1. Project Context
**App Name:** FocusForge
**Purpose:** A gamified screen-time and focus control app. It outcompetes apps like BePresent by focusing on *psychology* rather than *restriction*.
**Key Differentiators:**
1. **Earned Time Bank:** Users "earn" guilt-free screen time by completing focus sessions. 
2. **Doom Loop Detector:** Detects mindless app-switching patterns. (Handled mostly client-side).
3. **The Mirror:** Emoji-based mood tracking before/after sessions to build an emotional trigger map.
4. **Three-Layer AI Architecture:** Uses Claude (Haiku & Sonnet) for non-judgmental, curiosity-driven coaching.

**Frontend-Backend Relationship:**
The frontend (React Native/Expo) is strictly **Offline-First**. It writes to local `AsyncStorage` immediately and syncs to Supabase in the background via TanStack Query. Your backend must support this sync model (e.g., using `updated_at` timestamps, handling upserts/conflicts gracefully).

---

## 2. Tech Stack
*   **Database:** PostgreSQL (Hosted on Supabase)
*   **Authentication:** Supabase Auth
*   **Security:** Row Level Security (RLS) - Mandatory for all tables.
*   **Serverless:** Supabase Edge Functions (Deno / TypeScript)
*   **AI Provider:** Anthropic API (Claude 3 Haiku for async insights, Claude 3.5 Sonnet for premium chat)
*   **Payments:** RevenueCat (Webhooks syncing to Supabase)

---

## 3. Database Schema Requirements

You must write a Supabase migration SQL file (e.g., `20260523000000_focusforge_schema.sql`) that includes the following tables. Ensure you use `UUID` for IDs, link to `auth.users`, and include `created_at` and `updated_at` timestamps.

### Tables to Create:

1.  **`profiles`**
    *   Extends `auth.users` (use a trigger to auto-create on signup).
    *   Fields: `id`, `display_name`, `avatar_url`, `level` (int, default 1), `total_xp` (int, default 0), `current_streak` (int), `best_streak` (int), `plan_type` (text: 'free' or 'premium').

2.  **`focus_sessions`**
    *   Records completed or abandoned focus timers.
    *   Fields: `id`, `user_id`, `mode` (text: pomodoro, short_break, etc.), `duration_minutes` (int), `completed` (boolean), `xp_earned` (int), `started_at` (timestamptz), `ended_at` (timestamptz).

3.  **`mood_logs`** (The Mirror feature)
    *   Fields: `id`, `user_id`, `session_id` (fk to focus_sessions, nullable), `mood_id` (text: anxious, bored, neutral, productive, focused), `log_type` (text: pre_session, post_session, doom_loop_pause), `timestamp` (timestamptz).

4.  **`usage_logs`**
    *   Daily aggregates of app usage (synced from local storage).
    *   Fields: `id`, `user_id`, `log_date` (date), `app_id` (text), `category` (text), `minutes_used` (int), `opens_count` (int). 
    *   Constraint: Unique on `(user_id, log_date, app_id)`.

5.  **`leisure_bank_state`**
    *   Cloud backup of the user's earned time bank.
    *   Fields: `user_id` (PK), `total_earned_minutes` (float), `total_spent_minutes` (float), `last_reset_date` (timestamptz).

6.  **`ai_insights`**
    *   Stores the generated coaching cards from Claude.
    *   Fields: `id`, `user_id`, `insight_text` (text), `type` (text: post_session, weekly_report), `read` (boolean), `created_at`.

### Row Level Security (RLS)
*   Enable RLS on **every** table.
*   Create policies ensuring users can only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rows where `user_id = auth.uid()`.

---

## 4. Supabase Edge Functions

You must scaffold three Deno-based Edge Functions. 

### Function 1: `generate-insight` (AI Layer 2)
*   **Trigger:** Called asynchronously by the frontend after a focus session, or via a Database Webhook when a new week begins.
*   **Logic:** 
    *   Fetch the user's recent `focus_sessions` and `mood_logs`.
    *   Call the **Anthropic API (Claude 3 Haiku)**.
    *   **System Prompt Rule:** "You are a non-judgmental productivity coach. Never use the words 'limit', 'restrict', or 'bad'. Always frame observations with curiosity (e.g., 'I noticed you feel anxious before working...'). Keep it under 2 sentences."
    *   Save the response to the `ai_insights` table.

### Function 2: `premium-coach-chat` (AI Layer 3)
*   **Trigger:** HTTP POST from the frontend chat UI.
*   **Logic:**
    *   Verify the user's `profiles.plan_type == 'premium'`. If not, return 403.
    *   Call the **Anthropic API (Claude 3.5 Sonnet)** for high-EQ conversational coaching.
    *   Stream the response back to the client using Server-Sent Events (SSE).

### Function 3: `revenuecat-webhook`
*   **Trigger:** HTTP POST from RevenueCat servers when a subscription changes.
*   **Logic:**
    *   Verify the webhook signature.
    *   Extract the `app_user_id` (maps to Supabase `auth.users.id`).
    *   Update `profiles.plan_type` to 'premium' (on purchase/renewal) or 'free' (on expiration/cancellation).

---

## 5. Implementation Steps for the AI Assistant

To execute this backend build, please provide the following outputs in order:

1.  **Step 1: Database Migrations**
    *   Provide the complete SQL code for the `20260523000000_focusforge_schema.sql` migration file. Include all tables, primary/foreign keys, unique constraints, and RLS policies.
    *   Include a trigger for `handle_new_user()` that inserts a row into `profiles` on `auth.users` insert.

2.  **Step 2: TypeScript Types (Database)**
    *   Provide the `types/supabase.ts` definitions reflecting the schema so the frontend team can use them.

3.  **Step 3: Edge Function - AI Insight Generator**
    *   Provide the Deno/TypeScript code for the `generate-insight` edge function. Show how you format the Claude Haiku prompt and interact with the database.

4.  **Step 4: Edge Function - Premium Coach Chat**
    *   Provide the Deno/TypeScript code for the `premium-coach-chat` edge function. Show the premium gate check and the streaming implementation.

5.  **Step 5: Edge Function - RevenueCat**
    *   Provide the code for the `revenuecat-webhook` to sync subscription statuses.

**Final Note:** Write clean, production-ready code. Assume a standard Supabase CLI environment (`supabase functions new ...`). Provide the file contents clearly so the human developer can copy-paste them into their project repository.