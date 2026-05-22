# ⚔️ FocusForge: Project Context & Guidelines

FocusForge is a gamified digital wellness application designed to help users reclaim their time through tracking screen usage, structured focus sessions, distraction blocking, and a robust rewards system.

## 🏗️ Project Overview
- **Purpose:** A "non-preachy" gamified screen-time and focus control app.
- **Key Features:**
    - **Focus Timer:** Pomodoro-style sessions (Work, Short Break, Long Break, Custom).
    - **Dashboard:** "Today's Usage Ring," "Top Apps Widget," "Focus Score," and "Streak Counter."
    - **Stats & Insights:** Daily/Weekly usage charts (Victory Native XL), category breakdowns, and heatmaps.
    - **Gamification:** XP system, Leveling (Bronze to Diamond), Achievement Badges, Daily Challenges, and Leaderboards.
    - **Limits:** Daily screen time goals and per-app limits.
- **Target Audience:** "Distracted Devs," "Mindful Moms," and "Student Grinders."

## ⚙️ Tech Stack
- **Framework:** Expo (React Native) ~55.0
- **Language:** TypeScript ~5.9
- **Routing:** Expo Router (File-based)
- **Styling:** NativeWind + TailwindCSS
- **State Management:** React Context (Focus, Gamification, Usage, Goals) + TanStack Query (Server Sync)
- **Database:** Supabase (Remote) + AsyncStorage (Local-First/Offline)
- **Animations:** React Native Reanimated 4 + Lottie (Confetti, level-ups)
- **Charts:** Victory Native XL (Skia-based)
- **Payments:** RevenueCat (IAP)

## 📁 Key Directories & Architecture
- `app/`: Expo Router screens (Tabs, Auth, Onboarding).
- `components/`: UI library, feature-specific components (`focus/`, `charts/`, `gamification/`).
- `contexts/`: Global state management for sessions, XP, and usage.
- `lib/`: Core logic and services:
    - `storage.ts`: Type-safe AsyncStorage wrapper.
    - `timer.ts`: Timestamp-anchored timer engine (survives backgrounding).
    - `gamification.ts`: XP math and achievement logic.
    - `mockUsage.ts`: Realistic seeded usage data for MVP/Development.
- `supabase/`: Migrations and Edge Functions.

## 🚀 Building & Running
- **Install Dependencies:** `npm install`
- **Start Development:** `npx expo start`
- **Typecheck:** `npm run typecheck`
- **Test:** `npm test` (Jest)
- **Supabase Local:** `supabase start`

## 🛠️ Development Conventions
- **Timer Logic:** ALWAYS use the timestamp-anchored approach in `lib/timer.ts`. Do not rely on `setInterval` for the source of truth, as it drifts or stops in the background.
- **Offline-First:** All user actions (session completion, XP gain) must write to `AsyncStorage` via `lib/storage.ts` first, then sync to Supabase.
- **Styling:** Use NativeWind (Tailwind) for all components. Refer to `lib/theme.ts` for brand color tokens (Primary: `#6C63FF`).
- **Performance:** Use `FlashList` for long lists. Memoize heavy components like charts and the timer ring.
- **Testing:** New features should include unit tests in `lib/` and component tests using `jest-expo`.

## 📌 TODO / Roadmap
- [ ] Implement real-time app blocking (Future v2 - MDM/Screen Time API).
- [ ] Integration with native system screen time APIs.
- [ ] Social network features (Real friends leaderboard).

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
