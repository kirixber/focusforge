# 🚀 Implementation Plan
## FocusForge — Step-by-Step Build Guide
**Version:** 1.0  
**Date:** May 2026  
**Target:** Winning submission — complete, polished, functional

---

## Overview: Build in 6 Phases

```
Phase 1: Foundation Setup         (Template clone + config + DB)
Phase 2: Core Data Layer          (Storage, services, mock data)
Phase 3: Screens — Shell          (Navigation + placeholder screens)
Phase 4: Focus Timer              (The crown jewel feature)
Phase 5: Dashboard + Stats        (Data visualization)
Phase 6: Gamification + Polish    (What wins the competition)
```

**Principle: Build vertically (full working feature) not horizontally (all screens empty).**

---

## Phase 1: Foundation Setup

### 1.1 Clone & Configure Template
```bash
git clone https://github.com/8xsocial/template-mobile focusforge
cd focusforge
rm -rf .git && git init
npm install
```

### 1.2 Rename & Brand
```json
// app.json
{
  "name": "FocusForge",
  "slug": "focusforge",
  "scheme": "focusforge"
}
```

```typescript
// lib/constants.ts
export const APP_NAME = 'FocusForge'
export const APP_TAGLINE = 'Forge your focus. Own your time.'
```

```typescript
// lib/theme.ts
export const ACCENT = '#6C63FF'   // purple-indigo
// + all derived values
```

### 1.3 Supabase Schema
```bash
supabase start
# Create migration: supabase/migrations/20260501_focusforge.sql
supabase db reset
```

Migration includes:
- `profiles` table (template + extended with level, xp, streak fields)
- `focus_sessions` table
- `usage_logs` table
- `user_achievements` table
- `app_limits` table
- All RLS policies

### 1.4 Install Additional Packages
```bash
npx expo install \
  victory-native \
  @shopify/react-native-skia \
  @shopify/flash-list \
  lottie-react-native \
  expo-notifications \
  expo-image \
  react-native-svg \
  @react-native-async-storage/async-storage
```

### 1.5 Deliverable Check ✓
- [ ] App launches on simulator
- [ ] Supabase local running
- [ ] Login/OTP works
- [ ] Theme colors applied (purple-indigo)

---

## Phase 2: Core Data Layer

### 2.1 `lib/storage.ts` — Type-safe AsyncStorage
```typescript
// All keys as constants
// get<T>, set<T>, remove, getAll
// Handles JSON parse/stringify
// Returns defaults if key missing
```

### 2.2 `lib/appRegistry.ts` — App Catalog
```typescript
// 30+ common apps with:
// { id, name, category, colorHex }
// Categories: social, games, productivity, entertainment, health
```

### 2.3 `lib/mockUsage.ts` — Realistic Seed Data
```typescript
// Generates 14 days of usage data
// Uses seeded random (deterministic per user)
// Realistic patterns: spikes on evenings/weekends
// Apps: Instagram 45min, TikTok 38min, YouTube 52min, etc.
// Saved to storage on first launch
```

### 2.4 `lib/timer.ts` — Timer Engine
```typescript
export interface TimerSession {
  id: string
  startTime: number      // Date.now() at start
  duration: number       // target ms
  mode: SessionMode
  notes?: string
}

export function getRemaining(session: TimerSession): number
export function getElapsed(session: TimerSession): number
export function getProgress(session: TimerSession): number // 0-1
export function isExpired(session: TimerSession): boolean
```

### 2.5 `lib/gamification.ts` — XP & Achievement System
```typescript
// XP_TABLE: action → points
const XP_TABLE = {
  FOCUS_SESSION_COMPLETE: 50,
  FOCUS_SESSION_BONUS_PERFECT: 25,  // no interruptions
  DAILY_GOAL_MET: 30,
  STREAK_3_DAY: 20,
  STREAK_7_DAY: 50,
  STREAK_14_DAY: 100,
  CHALLENGE_COMPLETE: 40,
}

// Level thresholds (cumulative XP)
const LEVELS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000, 13000]

export function calculateLevel(totalXp: number): LevelInfo
export function checkAchievements(action: Action, state: AppState): Achievement[]
export function getDailyChallenges(date: string): Challenge[]
```

### 2.6 `lib/insights.ts` — Stats Computation
```typescript
export function computeFocusScore(day: DayData): number    // 0-100
export function getWeeklyTrend(weeks: WeekData[]): Trend
export function getBestWorstDay(week: DayData[]): { best, worst }
export function getCategoryBreakdown(day: DayData): CategoryBreakdown[]
export function computeHabitScore(history: DayData[]): number
```

### 2.7 Contexts
```
FocusContext.tsx       → useReducer session state machine
GamificationContext.tsx → XP/level state + achievement queue
UsageContext.tsx        → Daily/weekly usage (from storage)
GoalsContext.tsx        → User goals, limits, streak tracking
```

### 2.8 Deliverable Check ✓
- [ ] Mock data generates correctly for 14 days
- [ ] Timer engine tested (timestamp math accurate)
- [ ] XP calculation correct for all actions
- [ ] Achievements trigger correctly in unit tests

---

## Phase 3: Navigation Shell

### 3.1 Onboarding Screens (4 screens)
Order: Welcome → Goal Setup → App Select → Notification → Profile
- Simple, beautiful UI
- Each screen saves to context / storage
- Animated slide transitions (Reanimated)
- Progress dots at top

### 3.2 Tab Bar Setup
```typescript
// app/(tabs)/_layout.tsx
// 5 tabs: Home, Focus, Stats, Rewards, Profile
// Custom TabBar component with:
//   - Animated indicator
//   - Custom icons (Lucide)
//   - Active state color (ACCENT)
//   - Floating style card
```

### 3.3 Screen Shells
Create all tab screens with:
- Correct header
- Empty state placeholder
- Scroll container
- Pull-to-refresh hooked up

### 3.4 Deliverable Check ✓
- [ ] Onboarding flows completely end-to-end
- [ ] All 5 tabs navigate correctly
- [ ] No navigation errors in console
- [ ] Onboarding skipped on re-open

---

## Phase 4: Focus Timer (Priority #1 Feature)

### 4.1 `components/focus/TimerRing.tsx`
```typescript
// Uses React Native Reanimated + SVG
// Animated circular progress ring
// Color changes: work=purple, break=green, long=cyan
// Pulse animation when < 10% remaining
// Props: progress (0-1), color, size, strokeWidth
```

### 4.2 `components/focus/SessionModeSelector.tsx`
```typescript
// Horizontal pill selector
// Modes: Pomodoro (🍅) / Short Break (☕) / Long Break (🌊) / Custom (⚙️)
// Animated underline indicator
// Duration preview updates as mode changes
```

### 4.3 `app/(tabs)/focus.tsx` — Main Focus Screen

**Setup state (default):**
```
┌─────────────────────────┐
│  Choose Your Mode       │
│  [🍅] [☕] [🌊] [⚙️]  │
│                         │
│     ○ 25:00 ○           │
│   (timer preview ring)  │
│                         │
│  What are you focusing  │
│  on? (text input)       │
│                         │
│  [🎯 Start Session]     │
└─────────────────────────┘
```

**Running state (full-screen takeover):**
```
┌─────────────────────────┐
│ ← FOCUS MODE            │
│                         │
│   ┌───────────────┐     │
│   │    23:47      │     │  ← Reanimated countdown
│   │   "Finishing  │     │
│   │    report"    │     │
│   └───────────────┘     │  ← Large circular ring
│                         │
│  🔥 Streak: 5 days      │
│  ⚡ +50 XP on complete  │
│                         │
│      [II Pause]         │
└─────────────────────────┘
```

### 4.4 Session Complete Modal
```
- Animated scale-in modal
- Confetti Lottie animation
- XP counter animates up
- Streak update if applicable
- Achievement card if unlocked
- [Start Break] / [Done] buttons
```

### 4.5 Session History List
```
- FlashList of past sessions
- Card per session: mode icon + duration + XP + date
- "Today" / "Yesterday" / date headers
- Empty state: "Complete your first session!"
```

### 4.6 Deliverable Check ✓
- [ ] Timer counts down accurately (test by running 1-minute session)
- [ ] Timer survives app background + foreground
- [ ] Session saves to storage on complete
- [ ] XP awarded and shown
- [ ] Session history shows all past sessions
- [ ] All 4 modes work correctly

---

## Phase 5: Dashboard & Stats

### 5.1 `app/(tabs)/index.tsx` — Home Dashboard

Sections (in order):
1. **Greeting header** with streak flame
2. **Usage Ring** — today's screen time vs goal (RadialProgress component)
3. **Focus Score Card** — computed daily score (large number + color)
4. **Quick Stats Row** — 3 pills: Sessions Today | Total Focus | Best Streak
5. **Top Apps Today** — 5 app rows with colored usage bars
6. **Daily Challenges** — 1-3 challenge cards with XP tags
7. **Quick Start FAB** — floating "Start Focus" button (bottom right)

### 5.2 `components/charts/UsageBarChart.tsx`
```typescript
// Victory Native XL Bar chart
// X: time of day (grouped by hour)
// Y: minutes of usage
// Color coded by category
// Animated entrance (bars grow from bottom)
// Tap a bar: shows tooltip with details
```

### 5.3 `components/charts/WeeklyLineChart.tsx`
```typescript
// Victory Native XL Area chart
// X: Mon-Sun
// Y: total screen time (minutes)
// Two lines: this week (accent) vs last week (dim)
// Smooth curve interpolation
// Dot at each data point
```

### 5.4 `app/(tabs)/stats.tsx` — Stats Screen

**Segment tabs:** Today | Week | Month

**Today tab:**
- Radial progress ring (full view)
- Hourly usage bar chart (scrollable)
- Category breakdown (horizontal bars)
- App-by-app list

**Week tab:**
- Daily bar chart (stacked by category)
- Best/Worst day cards
- Focus sessions count this week
- Week-over-week comparison

**Month tab (Premium gate):**
- 4-week trend line
- Habit score history
- [Upgrade] card for free users

### 5.5 Manual Usage Log
```
FAB on stats screen → bottom sheet
├── "Log today's app usage"
├── App selector (grid of icons)
├── Time spinner (hours + minutes)
├── [Add More Apps]
└── [Save] → updates UsageContext → refetches charts
```

### 5.6 Deliverable Check ✓
- [ ] Home dashboard renders correctly with mock data
- [ ] All charts animate on mount
- [ ] Usage ring shows correct progress %
- [ ] Stats Today / Week views both work
- [ ] Manual log saves and updates charts

---

## Phase 6: Gamification + Polish (Competition Winner)

### 6.1 `app/(tabs)/rewards.tsx` — Rewards Screen

**XP & Level section:**
```typescript
// Level badge with icon (Bronze→Silver→Gold→Platinum→Diamond)
// Animated XP bar with progress percentage
// "X XP to next level"
// Tap → level detail sheet (all levels, what unlocks)
```

**Daily Challenges (3 cards):**
```typescript
interface Challenge {
  id: string
  title: string        // "Complete 2 focus sessions"
  description: string  // "Every session counts!"
  xpReward: number    // 40
  progress: number    // 1/2
  target: number
  icon: string        // emoji
  claimed: boolean
}
// Tap incomplete: shows progress
// Tap complete, unclaimed: [Claim X XP] → animation
```

**Achievement Gallery:**
```typescript
// 20 achievements defined:
const ACHIEVEMENTS = [
  { id: 'first_session', title: 'First Step', desc: 'Complete your first session', icon: '🎯', xp: 25 },
  { id: 'streak_3', title: 'Habit Forming', desc: '3 day streak', icon: '🔥', xp: 30 },
  { id: 'streak_7', title: 'Week Warrior', desc: '7 day streak', icon: '⚔️', xp: 75 },
  { id: 'session_10', title: 'Dedicated', desc: '10 sessions total', icon: '💪', xp: 50 },
  // ... 16 more
]
// 4-column grid, locked badges dimmed with lock icon
```

**Leaderboard:**
```typescript
// Simulated weekly leaderboard
// 9 seeded "users" + current user
// Ranked by sessions_this_week * avg_focus_score
// User highlighted, smooth scroll to their row
// "Resets Monday" countdown
```

### 6.2 Achievement Unlock Animation
```typescript
// When checkAchievements() returns new achievements:
// 1. Add to GamificationContext achievementQueue
// 2. AchievementToast slides in from top (stays 3s)
// OR
// 3. Full modal for first achievement / milestone ones
// Lottie sparkle animation
// Haptic feedback (expo-haptics)
```

### 6.3 Level-Up Celebration
```typescript
// When XP crosses level threshold:
// Full screen overlay (z-index top)
// Lottie confetti burst
// Large animated badge
// "Level Up! You're now [level name]"
// Haptic: notificationSuccess
// Auto-dismiss after 3s or tap
```

### 6.4 Profile Screen Polish
```typescript
// Avatar display (emoji-based, 8 options)
// Stats: Total sessions | Total focus hours | Best streak
// Edit daily goal inline (tap to edit, smooth animation)
// App limits list with toggles
// Subscription status + Upgrade CTA
```

### 6.5 Weekly Report Card
```typescript
// Triggered Sunday 8PM notification OR manual from Stats
// Full-screen beautiful card:
//   ┌────────────────────┐
//   │ FocusForge Weekly  │
//   │ May 12-18, 2026    │
//   │                    │
//   │  ⏱️ 8h 23m         │
//   │  Focused time      │
//   │                    │
//   │  🎯 5/7 days       │
//   │  Goal achieved     │
//   │                    │
//   │  🔥 Streak: 5 days │
//   │                    │
//   │  [Share Card]      │
//   └────────────────────┘
// Share: uses react-native-view-shot → share sheet
```

### 6.6 UI Polish Pass

**Micro-interactions to add:**
- Tab icons bounce on press (Reanimated spring)
- Cards have subtle shadow that intensifies on press
- Stats numbers count up animatedly on screen enter
- Timer ring has a trailing glow effect
- XP earned floats up and fades (+50 XP) on earn
- Streak flame "flickers" using Reanimated loop

**Loading states:**
- Skeleton screens for charts while loading
- Skeleton for top apps list
- Spinner inside timer ring while resuming session

**Empty states (all screens):**
- Beautiful illustrations (SVG-based, custom)
- Specific CTAs for each empty state
- Not just "No data" — actionable prompts

### 6.7 Notifications Setup
```typescript
// lib/notifications.ts
// Schedule all 7 notification types on:
//   - Onboarding complete
//   - Daily goal update
//   - App foreground (reschedule if needed)

// iOS: requestPermissionsAsync() in onboarding
// Android: permissions auto-granted (show rationale first)
```

### 6.8 Final Quality Pass

**TypeScript:** `npm run typecheck` → 0 errors  
**Tests:** `npm test` → all passing  
**Performance:** Profiler check — no dropped frames on timer  
**Accessibility:** All interactive elements have accessibilityLabel  
**Offline:** Kill network → all core features still work  
**Deep links:** `focusforge://focus` opens timer tab  

---

## Deliverable Checklist (Competition Submission)

### Core Features
- [ ] ✅ Onboarding (6 screens, goal setup, app select)
- [ ] ✅ Home dashboard with usage ring + focus score
- [ ] ✅ Focus timer (all 4 modes, full-screen, accurate)
- [ ] ✅ Session history
- [ ] ✅ Usage stats (Today + Week views, charts)
- [ ] ✅ Manual usage logging
- [ ] ✅ App limits configuration
- [ ] ✅ XP + level system
- [ ] ✅ Daily challenges (3 rotating)
- [ ] ✅ 20 achievements with unlock flow
- [ ] ✅ Weekly leaderboard
- [ ] ✅ Streak tracking
- [ ] ✅ Weekly report card (shareable)
- [ ] ✅ Profile + goal editing
- [ ] ✅ Push notifications (7 types)
- [ ] ✅ Premium paywall (RevenueCat)

### Polish (What wins)
- [ ] ✅ Confetti on session complete
- [ ] ✅ Level-up celebration screen
- [ ] ✅ Achievement unlock animation
- [ ] ✅ Animated charts
- [ ] ✅ Tab bar micro-animations
- [ ] ✅ XP float-up effect
- [ ] ✅ Streak fire animation
- [ ] ✅ Beautiful empty states
- [ ] ✅ Skeleton loading screens

### Technical Quality
- [ ] ✅ 0 TypeScript errors
- [ ] ✅ All tests passing
- [ ] ✅ Offline-first working
- [ ] ✅ Timer survives backgrounding
- [ ] ✅ No performance drops (60fps)
- [ ] ✅ Accessibility labels on all elements

---

## Estimated Effort

| Phase | Complexity | Priority |
|---|---|---|
| Phase 1: Foundation | Low | P0 |
| Phase 2: Data Layer | Medium | P0 |
| Phase 3: Nav Shell | Low | P0 |
| Phase 4: Focus Timer | **High** | **P0** |
| Phase 5: Dashboard + Stats | **High** | P1 |
| Phase 6: Gamification + Polish | **Very High** | **P0** |

**Phase 4 and 6 are the competitive differentiators. Spend the most time here.**

---

*End of Implementation Plan*
