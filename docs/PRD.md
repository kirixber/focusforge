# 📋 Product Requirements Document
## FocusForge — Screen Time & Focus Control App
**Version:** 1.0  
**Date:** May 2026  
**Status:** Approved for Development

---

## 1. Executive Summary

FocusForge is a gamified digital wellness app that helps users reclaim their time by tracking screen usage, running structured focus sessions, blocking distractions, and earning rewards for healthy digital habits. Built on the 8x React Native template, it targets the 151M+ viewers who engage with BePresent-style content — people who know they're addicted to their phones and want a fun, non-preachy system to change.

**The core insight:** Discipline apps fail because they shame users. FocusForge wins by making control feel like a game you're winning, not a restriction you're suffering through.

---

## 2. Problem Statement

| Pain Point | User Quote |
|---|---|
| Invisible usage | "I had no idea I was on TikTok 3 hours a day" |
| No accountability | "I set limits but just override them anyway" |
| Boring tools | "Screen Time feels like homework" |
| No positive reinforcement | "Why does the app only tell me when I fail?" |
| Fragmented workflow | "I need a timer AND stats AND blocking — in one app" |

---

## 3. Goals & Success Metrics

### Primary Goals
- G1: Users complete at least 3 focus sessions in their first week
- G2: 60%+ of users who set a daily goal meet it within 7 days
- G3: App earns 4.5+ stars on app stores within 3 months

### KPIs
| Metric | Target (30 days) |
|---|---|
| D1 Retention | > 40% |
| D7 Retention | > 20% |
| Sessions per DAU | > 1.5 |
| Weekly streak rate | > 35% |
| Premium conversion | > 8% |

---

## 4. Target Users

### Primary Persona: "Distracted Dev" — Arjun, 24
- Software engineer, works from home
- Knows Instagram is eating his productivity but can't stop
- Competitive, responds to streaks and leaderboards
- Wants a Pomodoro timer that also shows him his "shame stats"

### Secondary Persona: "Mindful Mom" — Priya, 34
- Work-from-home parent, wants to model healthy phone habits
- Needs gentle nudges, not hard blocks
- Loves the idea of earning rewards she can give herself
- Weekly summary reports help her feel in control

### Tertiary Persona: "Student Grinder" — Zara, 19
- Finals season warrior, needs deep work sessions
- Motivated by streaks and point milestones
- Shares achievements on Instagram Stories

---

## 5. Feature Requirements

### 5.1 Dashboard (Home Screen)
**Priority: P0**

| Feature | Description | Acceptance Criteria |
|---|---|---|
| Today's Usage Ring | Circular progress showing today's screen time vs. daily goal | Updates every time user opens app; shows % and hours |
| Top Apps Widget | 3–5 most-used apps today with time bars | Shows real simulated data; tappable for detail |
| Focus Score | Daily 0–100 score based on goal adherence + sessions | Visible above the fold; animated on change |
| Streak Counter | Consecutive days of meeting goal | Flame icon; resets on miss; shows best streak |
| Quick Focus Button | CTA to start focus session from home | One tap launch; prominent placement |

### 5.2 Focus Session (Pomodoro Timer)
**Priority: P0**

| Feature | Description | Acceptance Criteria |
|---|---|---|
| Session Modes | Work (25min), Short break (5min), Long break (15min), Custom | Mode selector before start |
| Focus Timer | Full-screen countdown with animated ring | Smooth animation; background persistence |
| App Blocking UI | Shows "blocked" overlay concept during session | Visual feedback; honor system in MVP |
| Session Notes | Optional intent-setting before start | Text input, 140 chars max |
| Completion Reward | Points awarded + animation on finish | Confetti/burst animation; points shown |
| Session History | Log of all completed sessions | Date, duration, points, notes stored |

### 5.3 App Usage Tracking
**Priority: P0**

| Feature | Description | Acceptance Criteria |
|---|---|---|
| Usage Dashboard | Chart of daily usage by category | Bar/line chart; categorized (Social, Games, etc.) |
| Per-App Breakdown | Individual app usage with time and opens | Scrollable list; sortable |
| Category Heatmap | Hour-by-hour usage grid | 24-column grid showing intensity |
| Comparison View | This week vs last week | Side-by-side or overlay chart |
| Daily Goal Setting | Set a total screen time limit per day | Slider from 30min–8hrs; saves to profile |

### 5.4 Goals & Limits System
**Priority: P1**

| Feature | Description | Acceptance Criteria |
|---|---|---|
| Daily Screen Time Goal | Maximum total usage target | Set in onboarding + changeable in settings |
| App-Specific Limits | Per-app time limits | Toggle on/off; set time from 15min–4hrs |
| Bedtime Mode | No usage after set time | Time picker; optional |
| Focus Goals | Weekly session count target | 1–20 sessions; progress tracker |
| Goal Notification | Alert when approaching/exceeding limit | Push notification + in-app banner |

### 5.5 Gamification & Rewards
**Priority: P1**

| Feature | Description | Acceptance Criteria |
|---|---|---|
| XP Points System | Earn points for: session completion, goal met, streaks | Points visible on all relevant actions |
| Level System | Bronze→Silver→Gold→Platinum→Diamond (100XP each level) | Level badge on profile; animated level-up |
| Achievement Badges | 20+ unlockable achievements | Badge gallery; locked/unlocked states |
| Daily Challenges | 3 rotating tasks per day | New challenges at midnight; tap to claim |
| Streak Bonuses | Bonus XP for 3/7/14/30 day streaks | Visual indicator; multiplier shown |
| Weekly Leaderboard | Compare with "friends" (simulated in MVP) | Top 10 list; user's position highlighted |

### 5.6 Insights & Reports
**Priority: P1**

| Feature | Description | Acceptance Criteria |
|---|---|---|
| Weekly Report | Auto-generated Sunday summary | Push notification; shareable card |
| Trend Analysis | 4-week rolling average | Line chart; up/down indicators |
| Best Day / Worst Day | Highlight extremes in current week | Cards with context |
| Focus Time Ratio | % of day in focused state | Ring chart + number |
| Habit Score | Composite wellness score 0–100 | Historical line chart |

### 5.7 Onboarding
**Priority: P0**

| Feature | Description |
|---|---|
| Goal Setting | Screen time limit selection |
| App Category Selection | Which apps to watch closely |
| Focus Style | Pomodoro / Custom / Free-form preference |
| Notification Permission | Push notification opt-in |
| Name + Avatar | Profile personalization |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | App opens in < 2s; timer runs accurately to ±1 second |
| Offline | Focus timer and session logging work fully offline |
| Data | Usage data stored locally + synced to Supabase |
| Privacy | No actual app usage data harvested; simulated/manual tracking in MVP |
| Accessibility | All interactive elements meet WCAG AA contrast; tap targets ≥ 44pt |
| Battery | Background timer uses minimal battery (no active tracking APIs needed in MVP) |

---

## 7. Out of Scope (MVP)

- Real OS-level app blocking (requires MDM/Screen Time API — future v2)
- Actual system screen time API integration (platform limitations)
- Social following / real friends network
- Parental controls
- Cross-device sync
- Apple Watch / Wear OS companion

---

## 8. Premium vs Free Tier

| Feature | Free | Premium |
|---|---|---|
| Focus sessions | 3/day | Unlimited |
| Session modes | Pomodoro only | All + Custom |
| Usage history | 7 days | 90 days |
| Weekly reports | Basic | Full + shareable |
| Achievements | 10 | 20+ |
| App limits | 3 apps | Unlimited |
| Themes | 1 | 8 |
| Daily challenges | 1 | 3 |

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Real app blocking not possible in Expo | High | Medium | Use honor-system UI + clear messaging |
| Users abandon without real tracking | Medium | High | Make manual logging frictionless + rewarding |
| Timer accuracy in background | Medium | High | Use timestamps not interval counters |
| Gamification feels hollow | Medium | High | Tie every point to a real behavior |

---

*End of PRD*
