# 🔄 App Flow Document
## FocusForge — User Journeys & Screen Flows
**Version:** 1.0  
**Date:** May 2026

---

## 1. Master Flow Overview

```
                        ┌─────────────┐
                        │  App Launch  │
                        └──────┬──────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        Not logged in    Logged in,         Logged in,
                         no onboarding      onboarding done
              │                │                │
              ▼                ▼                ▼
         Landing           Onboarding        Home Tab
         Screen             Flow             Dashboard
              │
              ▼
         Login Screen
         (OTP/OAuth)
              │
              ▼
         Onboarding
```

---

## 2. Onboarding Flow

```
Screen 1: Welcome
  "Let's take back your time 🔥"
  [Get Started] → Screen 2

Screen 2: Daily Goal Setup
  "How much screen time is OK for you?"
  Slider: 30min — 8hrs (default: 2hrs)
  [Continue] → Screen 3

Screen 3: App Tracking Setup
  "Which apps eat most of your time?"
  Grid of common apps (Instagram, TikTok, YouTube, Twitter, Games...)
  Multi-select; [Select All] shortcut
  [Continue] → Screen 4

Screen 4: Focus Style
  "How do you like to work?"
  Cards: 
    🍅 Classic Pomodoro (25/5/15)
    ⚡ Deep Work (50/10)
    🎯 Custom (I'll set my own)
  [Continue] → Screen 5

Screen 5: Notifications
  "We'll cheer you on (never spam you)"
  Toggle: Daily goal reminders — ON by default
  Toggle: Focus session reminders — ON
  Toggle: Weekly report — ON
  [Allow Notifications] → requests system permission
  [Continue] → Screen 6

Screen 6: Profile Setup
  "What should we call you?"
  Name input
  Avatar picker (8 emoji avatars)
  [Let's Go! 🚀] → Home (marks onboarding complete)
```

---

## 3. Home Dashboard Flow

```
Home Screen
├── Header: "Good morning, [Name]! 🌟" + streak flame
├── Today's Progress Ring
│   ├── Center: "X hr Y min" used
│   ├── Subtitle: "of X hr goal"
│   └── Tap → Stats screen (day view)
│
├── Focus Score Card
│   ├── Score: 73 / 100
│   ├── Label: "Great day so far!"
│   └── Tap → Score breakdown sheet
│
├── Top Apps Today
│   ├── App row × 3-5 (with usage bar)
│   └── "See all" → Stats > App breakdown
│
├── Quick Challenges
│   ├── Challenge card × 1-3
│   └── Tap → Rewards tab
│
└── [🎯 Start Focus Session] FAB
    └── Tap → Focus tab / session setup
```

---

## 4. Focus Session Flow (Core Journey)

```
Focus Tab — Session Setup
├── Mode selector: [🍅 Work] [☕ Break] [🌊 Long Break] [⚙️ Custom]
├── Duration display: "25:00"
├── App blocking toggle: "Block distractions during session"
├── Intention input: "What are you focusing on?" (optional)
└── [Start Session] button

    ↓ tap Start

Full-Screen Timer Screen
├── Ambient background (pulsing glow, changes with time remaining)
├── Large countdown: "23:47"
├── Progress ring (outermost, fills as time completes)
├── Session intention (if set): "Finishing the report"
├── XP preview: "Earn 50 XP on completion"
├── [Pause] button (bottom center)
│   └── Paused state: [Resume] [Abandon]
└── App enters "focus mode" visual (dimmed status bar)

    ↓ timer completes

Session Complete Screen (Modal, slides up)
├── 🎉 Confetti burst animation
├── "Focus session complete!"
├── Duration: "25 minutes"
├── XP earned: "+50 XP" (animated counter)
├── Streak update: "5 day streak! 🔥" (if applicable)
├── Achievement unlocked (if any): Badge animation
├── [Start Break] shortcut
└── [Done] → returns to Focus tab

    ↓ [Start Break]

Break Timer (compact, no blocking)
├── Smaller visual treatment
├── "Take a breather 😌"
├── Countdown: "5:00"
└── Completes → [Start Next Session] prompt
```

---

## 5. Stats / Insights Flow

```
Stats Tab
├── Segment control: [Today] [Week] [Month]
│
├── TODAY view:
│   ├── Usage ring (total + goal)
│   ├── Hourly bar chart (x=hour, y=minutes)
│   ├── App breakdown list (sortable: time / opens)
│   └── Category pie: Social 45% / Games 20% / Productivity 35%
│
├── WEEK view:
│   ├── Daily bar chart (Mon-Sun, stacked by category)
│   ├── Best day / worst day highlights
│   ├── Week vs last week comparison
│   └── Focus sessions count + total time
│
└── MONTH view (Premium):
    ├── 4-week trend line
    ├── Habit score history
    └── [Upgrade for full history] gate for free users

Manual Log Entry (FAB on Stats tab):
├── "Log today's usage"
├── App selector → time entry per app
└── Saves to usage_logs

Weekly Report (auto-generated, share-able):
├── Triggered Sunday evening push notification
├── Full-screen report card view
├── Sections: Summary / Best moment / Areas to improve / Next week goal
└── [Share as Image] → generates PNG card for social
```

---

## 6. Rewards & Gamification Flow

```
Rewards Tab
├── Header: Level badge + XP bar
│   ├── Level: "Silver II ⚔️"
│   ├── XP: "340 / 500 XP to next level"
│   └── Tap → Level breakdown sheet
│
├── Daily Challenges
│   ├── Challenge × 3 (or 1 for free tier)
│   ├── Each: icon + title + XP value + progress bar
│   ├── Completed: checkmark + "Claim XP" button → animation
│   └── Resets: "Refreshes in 14:23:07"
│
├── Achievements
│   ├── Filter: [All] [Unlocked] [Locked]
│   ├── Badge grid (4 columns)
│   ├── Tapping locked badge: "Complete X to unlock"
│   └── Tapping unlocked badge: unlock date + description
│
└── Leaderboard (Weekly)
    ├── "Top Focusers This Week"
    ├── Rows 1-10 (simulated users + real user)
    ├── User's rank highlighted
    └── "Resets every Monday"
```

### Achievement Trigger Flow
```
Any action (session complete, goal met, etc.)
    │
    ▼
gamification.checkAchievements(action, state)
    │
    ├── No new achievement → silent
    │
    └── Achievement unlocked
            │
            ▼
        AchievementUnlockModal slides up
        ├── Badge animation (scale + glow)
        ├── "Achievement Unlocked!"
        ├── Badge name + description
        ├── XP bonus: "+25 XP"
        └── [Awesome!] → dismiss
```

---

## 7. Profile & Settings Flow

```
Profile Tab
├── Avatar + Name + Level badge
├── Stats row: Sessions | Streak | Total Focus Time
│
├── My Goals section
│   ├── Daily screen time limit (editable)
│   ├── Weekly focus sessions target
│   └── App limits → App Limit Setup screen
│
├── Preferences
│   ├── Focus style (Pomodoro / Deep Work / Custom)
│   ├── Default session duration
│   ├── Break reminders
│   └── Notification settings
│
├── Account
│   ├── [Upgrade to Premium] (free users)
│   ├── Subscription status (premium users)
│   └── Sign out
│
└── App links
    ├── Privacy Policy
    ├── Terms of Service
    └── Support / Feedback

App Limit Setup Screen:
├── App list (categorized)
├── Toggle + time picker per app
└── [Save Limits] → GoalsContext update
```

---

## 8. Edge Cases & Error Flows

```
Session interrupted (phone call / crash)
    │
    ▼
App re-opens → reads active_session from storage
    │
    ├── Session time < 2min: discard silently
    ├── Session time ≥ 2min: 
    │       "You had a session in progress (18:34 elapsed)"
    │       [Count it!] → award partial XP, mark complete
    │       [Discard] → clear session
    └── Session expired (>2hrs ago): discard silently

Goal exceeded:
    │
    ▼
In-app banner: "You've hit your X hr goal for today"
    ├── [See Stats] → Stats tab
    └── [Set New Limit] → goal edit sheet

First launch with no data:
    │
    ▼
All charts show onboarding prompts instead of empty states
Usage ring shows "No data yet — log your first session"
```

---

## 9. Notification Schedule

| Notification | Trigger | Time |
|---|---|---|
| "Morning check-in" | Daily if streak active | 9:00 AM |
| "Approaching goal" | 80% of daily limit used | Dynamic |
| "Start a session" | No session by noon | 12:30 PM |
| "Goal met today! 🎉" | Daily limit under | Dynamic |
| "Don't break your streak" | No session by 8PM | 8:00 PM |
| "Weekly report ready" | Sunday | 8:00 PM |
| "New daily challenges" | Daily | 7:00 AM |

---

*End of App Flow Document*
