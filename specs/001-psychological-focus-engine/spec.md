# Feature Specification: 001-Psychological Focus Engine

**Feature Branch**: `001-psychological-focus-engine`

**Created**: 2026-05-23

**Status**: Draft

**Input**: Create a core engine that outdoes BePresent by focusing on psychology and unique incentives (Time Bank, Doom Loop, Mirror).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The Guilt-Free Cycle (Priority: P1) 🎯 MVP

As Arjun (the Distracted Dev), I want to earn "guilt-free leisure time" by completing focus sessions, so that I can enjoy my phone without the usual shame spiral.

**Why this priority**: This is our primary psychological hook ("Earned Time Bank"). It flips the script from "don't use your phone" to "earn your phone time," creating a positive incentive loop that competitors lack.

**Independent Test**: Start a 25-min session → Perform mood check-in (Mirror) → Complete session → See 15 mins added to "Leisure Bank" → View dashboard update.

**Acceptance Scenarios**:
1. **Given** I have 0 banked minutes, **When** I complete a 25-minute "Work" session, **Then** my Leisure Bank increases by 15 minutes.
2. **Given** I am starting a session, **When** the app asks "How are you feeling?", **Then** I must be able to select an emoji (Mirror) before the timer starts.
3. **Given** I have banked time, **When** I view the dashboard, **Then** I see a "Guilt-Free Time" ring alongside my usage.

---

### User Story 2 - Breaking the Doom Loop (Priority: P2)

As Priya (the Mindful Mom), I want the app to detect when I'm mindlessly switching between apps, so that I can regain consciousness before I waste an hour.

**Why this priority**: High competitive differentiator. Most apps only track total time; we track *compulsion patterns*.

**Independent Test**: Simulate 6 app opens within 10 minutes, each lasting <30 seconds → Verify the "Mindful Pause" card triggers with the "Restless?" prompt.

**Acceptance Scenarios**:
1. **Given** I open Instagram 5 times in 10 minutes, **When** the 6th open occurs, **Then** a "Mindful Pause" overlay appears asking "What are you actually looking for?".
2. **Given** a Mindful Pause is active, **When** I select "Procrastinating," **Then** the app suggests starting a 5-minute "Micro-Focus" session.

---

### User Story 3 - The Time Translator (Priority: P3)

As Zara (the Student Grinder), I want my focused time to be translated into "real-life achievements," so that I can share my progress in a way that feels meaningful on social media.

**Why this priority**: This is our primary virality mechanic. "3 hours focused" is boring; "Read 2 chapters of a novel" is a story.

**Independent Test**: Complete 2 hours of focus over a day → Navigate to "Stats" → View the "Time Translator" card showing equivalents (e.g., "1 full workout").

**Acceptance Scenarios**:
1. **Given** I have focused for 120 minutes today, **When** I view the summary, **Then** I see at least 3 "translations" (e.g., "2 long calls with friends," "150 pages read").
2. **Given** a translation card, **When** I tap "Share," **Then** a beautiful, brand-aligned image is generated for the share sheet.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Earned Time Bank)**: System MUST calculate banked leisure time based on a 1:0.6 ratio (60% of focus time earned as leisure).
- **FR-002 (The Mirror)**: System MUST require an emoji-based mood check-in before AND after every focus session.
- **FR-003 (Doom Loop Detector)**: System MUST monitor "App Open Frequency" (simulated in MVP via `UsageContext`) and trigger a "Mindful Pause" if frequency > 5 per 15-minute window with low duration.
- **FR-004 (Timer Engine)**: System MUST use the Constitution-mandated timestamp-anchored timer to ensure background persistence.
- **FR-005 (Time Translator)**: System MUST include a library of at least 10 "Time Equivalents" (Books, Workouts, Social, Skills) and map minutes to these values.

### Key Entities

- **LeisureBank**: Tracks total earned vs. spent leisure minutes (Reset weekly).
- **MoodLog**: Stores `[timestamp, emoji_id, session_id]` for pre/post session tracking.
- **OpenPattern**: Transient log of `[app_id, timestamp, duration]` to detect doom loops.
- **TimeEquivalent**: Mapping of `activity_name` to `minutes_per_unit`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Retention)**: 20% increase in D7 retention compared to standard timer-only apps (measured via PostHog).
- **SC-002 (Engagement)**: Users complete a mood check-in for >90% of sessions.
- **SC-003 (Virality)**: At least 1 in 5 users shares a "Time Translator" card in their first week.
- **SC-004 (Performance)**: Mindful Pause overlay triggers within <100ms of detecting a doom loop pattern.

## Assumptions

- **Manual Logging (MVP)**: In the MVP, "App Opens" and "Leisure Time Spent" may be manually logged or simulated to demonstrate the concept before full OS-level integration.
- **Honour System**: The Leisure Bank relies on the user's intent to stick to their earned time, reinforced by notifications.
- **Static Translations**: Time equivalents are initially static (e.g., 60 mins = 1 workout) rather than dynamically pulled from a health API in v1.
