# 🏗️ Architecture Document
## FocusForge — System & Application Architecture
**Version:** 1.0  
**Date:** May 2026

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React Native / Expo)             │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Screens │  │Contexts  │  │  Hooks   │  │  Components  │   │
│  │ (Router) │  │(Global   │  │(TanStack │  │  (UI Layer)  │   │
│  │          │  │ State)   │  │  Query)  │  │              │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────────┘   │
│       │              │              │                           │
│       └──────────────┴──────────────┘                          │
│                       │                                         │
│              ┌─────────▼──────────┐                            │
│              │   lib/ (Services)  │                            │
│              │  storage, timer,   │                            │
│              │  gamification,     │                            │
│              │  analytics         │                            │
│              └─────────┬──────────┘                            │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
   ┌──────▼──────┐ ┌─────▼─────┐ ┌────▼──────┐
   │  Supabase   │ │AsyncStorage│ │RevenueCat │
   │  (Remote DB │ │  (Local   │ │   (IAP)   │
   │   + Auth)   │ │  Cache)   │ │           │
   └─────────────┘ └───────────┘ └───────────┘
```

---

## 2. Data Architecture

### 2.1 Local Storage (AsyncStorage) — Offline-First

```
AsyncStorage Keys:
├── @focusforge/user_profile         → { name, avatar, level, xp, joinDate }
├── @focusforge/daily_goal           → { screenTimeLimit: number (minutes) }
├── @focusforge/app_limits           → { [appId]: { limit: number, enabled: boolean } }
├── @focusforge/usage_log            → [{ date, appId, minutes, opens }]
├── @focusforge/focus_sessions       → [{ id, startTime, endTime, mode, notes, xpEarned }]
├── @focusforge/achievements         → { [achievementId]: { unlocked, unlockedAt } }
├── @focusforge/daily_challenges     → { date, challenges: [{ id, completed }] }
├── @focusforge/streak               → { current, best, lastActiveDate }
├── @focusforge/onboarding_done      → boolean
└── @focusforge/active_session       → { startTime, mode, duration } | null
```

### 2.2 Supabase Schema (Remote Sync)

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  daily_goal_minutes INTEGER DEFAULT 120,
  plan_type TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Focus sessions
CREATE TABLE focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('pomodoro','short_break','long_break','custom')),
  planned_duration INTEGER NOT NULL, -- minutes
  actual_duration INTEGER,           -- minutes (null if abandoned)
  completed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage logs (manual/simulated entry)
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  app_id TEXT NOT NULL,          -- e.g. "instagram", "tiktok"
  app_name TEXT NOT NULL,
  category TEXT NOT NULL,        -- 'social', 'games', 'productivity', etc.
  minutes INTEGER NOT NULL,
  opens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date, app_id)
);

-- Daily goals / achievements
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- App limits configuration
CREATE TABLE app_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  app_name TEXT NOT NULL,
  limit_minutes INTEGER NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, app_id)
);

-- RLS Policies (all tables)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- [same pattern for all tables]
CREATE POLICY "Users own their data" ON profiles
  FOR ALL USING (auth.uid() = id);
```

---

## 3. Application State Architecture

### 3.1 Global Contexts

```typescript
// AppContext — orchestrates everything
AppContext
├── FocusContext        → active session state, timer, blocking
├── GamificationContext → XP, level, achievements, challenges  
├── UsageContext        → daily/weekly usage data
├── GoalsContext        → limits, targets, streak
└── (inherited) SubscriptionContext, ToastContext
```

### 3.2 State Flow

```
User opens app
    │
    ▼
_layout.tsx bootstraps:
  ├── Loads AsyncStorage → populates all contexts
  ├── Syncs Supabase profile
  ├── Checks active session (crash recovery)
  └── Evaluates streak (did user hit goal yesterday?)
    │
    ▼
Home Screen renders with:
  ├── Today's usage ring (from UsageContext)
  ├── Focus Score (computed from GoalsContext + GamificationContext)
  └── Active session indicator (from FocusContext)
```

### 3.3 Focus Session State Machine

```
IDLE ──[start]──► RUNNING ──[pause]──► PAUSED
  ▲                  │                    │
  │                [complete]          [resume]
  │                  │                    │
  └──[abandon]───────▼────────────────────┘
                 COMPLETED
                     │
              [award XP + save]
                     │
                     ▼
                 IDLE (next)
```

---

## 4. Navigation Architecture

```
app/
├── _layout.tsx                   ← Root (providers + auth guard)
├── index.tsx                     ← Landing (unauthenticated)
├── upgrade.tsx                   ← Paywall
│
├── (auth)/
│   └── login.tsx                 ← OTP + OAuth
│
├── (onboarding)/
│   ├── index.tsx                 ← Welcome
│   ├── goal-setup.tsx            ← Daily limit setting
│   ├── app-select.tsx            ← Apps to track
│   └── notification-setup.tsx    ← Push permission
│
└── (tabs)/
    ├── _layout.tsx               ← Tab bar config
    ├── index.tsx                 ← HOME (dashboard)
    ├── focus.tsx                 ← FOCUS (timer + sessions)
    ├── stats.tsx                 ← STATS (usage charts)
    ├── rewards.tsx               ← REWARDS (XP, badges, leaderboard)
    └── profile.tsx               ← PROFILE (settings, goals)

Modals / Sheets (push over tabs):
├── session-complete.tsx          ← Post-session reward screen
├── achievement-unlock.tsx        ← Achievement celebration
├── weekly-report.tsx             ← Weekly summary
└── app-limit-setup.tsx           ← Configure per-app limits
```

---

## 5. Component Architecture

```
components/
├── ui/ (from template, extended)
│   ├── Text.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── AppModal.tsx
│   └── ...
│
├── focus/
│   ├── TimerRing.tsx             ← Animated circular countdown
│   ├── SessionModeSelector.tsx   ← Work/Break mode pills
│   ├── SessionCard.tsx           ← History item
│   └── BlockingOverlay.tsx       ← In-session UI overlay
│
├── charts/
│   ├── UsageBarChart.tsx         ← Daily app usage bars
│   ├── WeeklyLineChart.tsx       ← 7-day trend line
│   ├── HeatmapGrid.tsx           ← 24hr usage heatmap
│   └── RadialProgress.tsx        ← Goal progress ring
│
├── gamification/
│   ├── XPBar.tsx                 ← Level progress bar
│   ├── AchievementBadge.tsx      ← Badge with lock/unlock state
│   ├── ChallengeCard.tsx         ← Daily challenge item
│   ├── LeaderboardRow.tsx        ← Ranking item
│   └── StreakCounter.tsx         ← Flame + number
│
├── dashboard/
│   ├── UsageRing.tsx             ← Today's main progress ring
│   ├── TopAppsWidget.tsx         ← Top 5 app usage
│   ├── FocusScoreCard.tsx        ← Daily score card
│   └── QuickStats.tsx            ← Row of 3 stat pills
│
└── shared/
    ├── AppIcon.tsx               ← App icon with category color
    ├── PointsBurst.tsx           ← XP reward animation
    ├── ConfettiOverlay.tsx       ← Celebration effect
    └── EmptyState.tsx            ← Consistent empty states
```

---

## 6. Services / lib Architecture

```
lib/
├── (template defaults)
│   ├── supabase.ts
│   ├── theme.ts
│   ├── analytics.ts
│   └── ...
│
├── storage.ts          ← AsyncStorage CRUD with type safety
├── timer.ts            ← Timer engine (timestamp-based, not interval)
├── gamification.ts     ← XP calculation, level logic, achievement checks
├── mockUsage.ts        ← Realistic simulated app usage data generator
├── appRegistry.ts      ← App catalog (name, icon color, category)
├── notifications.ts    ← Push notification scheduling
├── insights.ts         ← Computed stats (focus ratio, trends, score)
└── sharing.ts          ← Weekly report card image generation
```

---

## 7. Timer Architecture (Critical Detail)

The timer must survive app backgrounding and phone relocks. We use a **timestamp-anchored** approach:

```typescript
// When session starts:
const session = {
  startTime: Date.now(),      // anchored wall clock
  duration: 25 * 60 * 1000,  // 25 minutes in ms
}
await storage.set('active_session', session)

// On each tick (UI polling every second):
const elapsed = Date.now() - session.startTime
const remaining = session.duration - elapsed
// remaining is always accurate regardless of backgrounding

// On app foreground:
// Re-read active_session → compute remaining → update UI instantly
// No drift, no desync
```

---

## 8. Offline-First Strategy

```
User Action → Try Supabase → Success: done
                           → Fail: write to local queue
                                    │
                          App online event → flush queue → sync
```

All usage logs, session completions, and XP updates write locally first. Supabase is a secondary mirror, not the source of truth for session state.

---

## 9. Performance Targets

| Screen | Target TTI | Strategy |
|---|---|---|
| Home | < 300ms | Placeholder data from AsyncStorage |
| Focus timer | < 100ms start | Pre-loaded state, no network |
| Stats charts | < 500ms | Local data, lazy render |
| Rewards | < 400ms | Cached achievements |

---

*End of Architecture Document*
