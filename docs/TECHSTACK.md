# ⚙️ Tech Stack Document
## FocusForge — Technology Decisions & Rationale
**Version:** 1.0  
**Date:** May 2026

---

## 1. Stack at a Glance

| Layer | Technology | Version | Why |
|---|---|---|---|
| Framework | Expo (React Native) | ~55.0 | Template base; OTA updates; cross-platform |
| Language | TypeScript | ~5.9 | Full type safety; catches bugs before runtime |
| Routing | Expo Router | ~55.0 | File-based; deep linking; auth guards built-in |
| Styling | NativeWind + TailwindCSS | ^4.2 / ^3.4 | Rapid UI; consistent design tokens |
| Database (remote) | Supabase | ^2.100 | Auth + Postgres + RLS; real-time capable |
| Database (local) | AsyncStorage | - | Offline-first; session persistence |
| Data fetching | TanStack Query | ^5.99 | Caching; background refetch; optimistic updates |
| Animations | React Native Reanimated | 4.2.1 | 60fps; worklet-based; Skia-compatible |
| Charts | Victory Native XL | ^41 | Reanimated-native charts; 60fps; beautiful |
| Subscriptions | RevenueCat | ^9.15 | Cross-platform IAP; A/B testing; webhooks |
| Notifications | Expo Notifications | ^55 | Push + local; scheduled notifications |
| Analytics | PostHog | ^4.39 | Feature flags; event tracking; session replay |
| Error tracking | Sentry | ~7.11 | Crash reports; performance monitoring |
| Icons | Lucide React Native | latest | Consistent icon system; tree-shakeable |
| Storage abstraction | Custom `lib/storage.ts` | - | Type-safe AsyncStorage wrapper |
| i18n | i18next + react-i18next | ^26 / ^17 | Future-proofing; EN ready |
| Testing | Jest + jest-expo | ^29 / ^55 | Unit tests; snapshot tests |

---

## 2. Key Package Decisions

### 2.1 Charts: Victory Native XL (over react-native-chart-kit, Recharts)
```
Victory Native XL uses React Native Skia under the hood.
Renders on the UI thread via Reanimated worklets → 60fps always.
Supports:
  - Animated line charts (trend lines)
  - Bar charts with smooth entrance
  - Area charts for usage history
  - Custom gradients and theming

Alternative considered: react-native-gifted-charts
Rejected: heavier bundle; less animation control
```

### 2.2 Timer: Custom timestamp-based (no interval library)
```
Why not react-native-background-timer or expo-task-manager?
- Background timer needs managed workflow — complex EAS build config
- Task manager has 15-minute minimum interval on iOS

Our approach: timestamp anchoring
- setInterval(tick, 1000) for UI updates only
- elapsed = Date.now() - session.startTime (always accurate)
- On app foreground: instant re-sync, no drift
- Works in background because math is computed on foreground
- Much simpler; no background permissions needed
```

### 2.3 Animations: Reanimated 4 + Lottie
```
react-native-lottie for:
  - Confetti burst (session complete)
  - Achievement unlock sparkle
  - Level-up celebration
  - Streak fire animation

Reanimated 4 for:
  - Timer ring (animated stroke-dashoffset equivalent)
  - XP bar fill transitions
  - Screen entry transitions
  - Tab bar indicator
```

### 2.4 Local-First with Supabase Sync
```
Priority: AsyncStorage (instant, offline) → Supabase (sync when online)

This means:
  - Focus sessions always save locally first
  - XP and level changes are immediate (no loading state)
  - Supabase sync happens in background via TanStack Query mutations
  - If sync fails: queued in a retry store, flushed on next online event
```

---

## 3. Folder Structure (Extended from Template)

```
focusforge/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx                    ← Landing
│   ├── upgrade.tsx
│   ├── (auth)/login.tsx
│   ├── (onboarding)/
│   │   ├── index.tsx                ← Welcome
│   │   ├── goal-setup.tsx
│   │   ├── app-select.tsx
│   │   └── notification-setup.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx                ← Home
│       ├── focus.tsx                ← Focus timer
│       ├── stats.tsx                ← Usage charts
│       ├── rewards.tsx              ← Gamification
│       └── profile.tsx
│
├── components/
│   ├── ui/ (template)
│   ├── focus/
│   │   ├── TimerRing.tsx
│   │   ├── SessionModeSelector.tsx
│   │   └── SessionCard.tsx
│   ├── charts/
│   │   ├── UsageBarChart.tsx
│   │   ├── WeeklyLineChart.tsx
│   │   └── RadialProgress.tsx
│   ├── gamification/
│   │   ├── XPBar.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── ChallengeCard.tsx
│   │   └── StreakCounter.tsx
│   └── dashboard/
│       ├── UsageRing.tsx
│       └── TopAppsWidget.tsx
│
├── contexts/
│   ├── FocusContext.tsx             ← Session state machine
│   ├── GamificationContext.tsx      ← XP, level, achievements
│   ├── UsageContext.tsx             ← Today's usage data
│   ├── GoalsContext.tsx             ← Limits, targets, streaks
│   ├── SubscriptionContext.tsx      ← (template)
│   └── ToastContext.tsx             ← (template)
│
├── hooks/
│   ├── useFocusSession.ts
│   ├── useUsageStats.ts
│   ├── useAchievements.ts
│   ├── useDailyChallenges.ts
│   ├── useStreak.ts
│   ├── useWeeklyReport.ts
│   └── useProfile.ts               ← (template, extended)
│
├── lib/
│   ├── storage.ts                  ← AsyncStorage typed wrapper
│   ├── timer.ts                    ← Timestamp-based timer engine
│   ├── gamification.ts             ← XP math, levels, achievement logic
│   ├── mockUsage.ts                ← Seeded fake usage data
│   ├── appRegistry.ts              ← App catalog + categories
│   ├── notifications.ts            ← Push + local notification helpers
│   ├── insights.ts                 ← Stats computation (score, trends)
│   ├── sharing.ts                  ← Weekly report card generation
│   ├── theme.ts                    ← (template, extended with focus colors)
│   ├── constants.ts                ← (template, FocusForge values)
│   └── ...                         ← other template files
│
└── supabase/
    ├── migrations/
    │   ├── *_init.sql
    │   ├── *_app_domain.sql         ← (template)
    │   └── *_focusforge.sql         ← focus_sessions, usage_logs, etc.
    └── functions/
        └── revenuecat-webhook/
```

---

## 4. Environment Variables

```bash
# .env.local

# Supabase (required)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# RevenueCat (optional, degrades gracefully)
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=

# PostHog (optional)
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry (optional in dev)
EXPO_PUBLIC_SENTRY_DSN=
```

---

## 5. Design System

### Color Tokens (extending template's 59 tokens)

```typescript
// lib/theme.ts additions

// Primary brand
export const ACCENT = '#6C63FF'          // purple-indigo (focus, energy)
export const ACCENT_DIM = 'rgba(108,99,255,0.12)'
export const ACCENT_BORDER = 'rgba(108,99,255,0.30)'

// Semantic colors
export const SUCCESS = '#10B981'          // emerald — goal met
export const WARNING = '#F59E0B'          // amber — approaching limit
export const DANGER = '#EF4444'           // red — exceeded limit
export const XP_GOLD = '#F7B731'          // gold — XP/rewards
export const STREAK_FIRE = '#FF6B35'      // orange-red — streaks

// Category colors (for app icons)
export const CATEGORY_SOCIAL = '#E91E8C'
export const CATEGORY_GAMES = '#9B59B6'
export const CATEGORY_PRODUCTIVITY = '#3498DB'
export const CATEGORY_ENTERTAINMENT = '#E74C3C'
export const CATEGORY_HEALTH = '#2ECC71'
export const CATEGORY_OTHER = '#95A5A6'

// Timer states
export const TIMER_WORK = '#6C63FF'       // accent
export const TIMER_BREAK = '#10B981'      // green
export const TIMER_LONG_BREAK = '#06B6D4' // cyan
```

### Typography Scale

```typescript
// Already using Inter from template
// Additional weights used:
// - Black (900): Score numbers, XP amounts
// - ExtraBold (800): Level labels
// - Bold (700): Section headers, CTA buttons
// - SemiBold (600): App names, challenge titles
// - Medium (500): Body, stats
// - Regular (400): Captions, descriptions
```

---

## 6. Performance Optimizations

### Memoization Strategy
```typescript
// Heavy components memoized:
const TimerRing = React.memo(...)
const UsageBarChart = React.memo(...)
const AchievementBadge = React.memo(...)

// Lists use FlashList (not FlatList):
import { FlashList } from "@shopify/flash-list"
// 10x faster for long usage history lists
```

### Bundle Optimization
```
- All chart imports tree-shaken (only import used chart types)
- Lottie animations loaded lazily on demand
- Images use expo-image (WebP format, caching)
- Heavy screens use React.lazy equivalent via Suspense
```

---

## 7. Testing Strategy

```
Unit tests (Jest):
  ├── lib/gamification.ts   → XP calculation edge cases
  ├── lib/timer.ts          → timestamp math accuracy
  ├── lib/insights.ts       → score computation
  └── lib/storage.ts        → storage operations

Component tests (jest-expo):
  ├── TimerRing renders correct state
  ├── XPBar shows correct percentage
  └── AchievementBadge locked/unlocked states

E2E tests (future):
  └── Detox for critical paths (session start → complete → XP award)
```

---

## 8. CI/CD (GitHub Actions — from template)

```yaml
# .github/workflows/ci.yml (already set up)
on: [push, pull_request]
jobs:
  quality:
    - npm run typecheck   # tsc --noEmit
    - npm test            # jest
    - npm run lint        # eslint
  
  build_preview:
    - eas build --platform android --profile preview
    # Runs on main branch merges
```

---

*End of Tech Stack Document*
