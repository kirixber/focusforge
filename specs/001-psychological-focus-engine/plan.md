# Implementation Plan: 001-Psychological Focus Engine

**Branch**: `001-psychological-focus-engine` | **Date**: 2026-05-23 | **Spec**: specs/001-psychological-focus-engine/spec.md

## Summary

The Psychological Focus Engine implements the core differentiators of FocusForge: Earned Time Bank, Doom Loop Detector, The Mirror, and the Time Translator. To ensure this runs smoothly on low-spec phones, we rely heavily on lightweight state management, minimal re-renders, and off-thread UI animations using React Native Reanimated. Background timing uses a timestamp-anchoring technique to avoid battery drain.

## Technical Context

**Language/Version**: TypeScript ~5.9

**Primary Dependencies**: Expo ~55.0, NativeWind, TanStack Query, React Native Reanimated 4, React Native View Shot (for sharing)

**Storage**: Local-first (AsyncStorage) + Remote Supabase (Postgres)

**Testing**: Jest + jest-expo (Unit + Component tests)

**Target Platform**: iOS / Android (Mobile App)

**Performance Goals**: 60 FPS for all animations; < 16ms render time for overlay triggers.

**Constraints**: Offline-capable, timestamp-anchored timing, minimal RAM footprint for the pattern detector.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Offline-First**: Does the design prioritize local persistence? (Yes, all logic writes to AsyncStorage first).
- [x] **Timestamp Timing**: Is the timer logic anchored to a wall-clock timestamp? (Yes, `lib/timer.ts` utilizes `Date.now()`).
- [x] **Gamification**: Does this feature provide positive reinforcement? (Yes, Time Bank and Time Translator are purely positive).
- [x] **60FPS Performance**: Are animations and charts optimized for 60FPS? (Yes, overlays use Reanimated worklets; open loop checks run off the UI thread).
- [x] **Type-Safety**: Are all new data structures fully typed? (Yes, exact interfaces defined for logs and banks).

## Project Structure

### Documentation (this feature)

```text
specs/001-psychological-focus-engine/
├── plan.md              # This file
├── research.md          # Implementation details for pattern detection and view-shot
├── data-model.md        # Entities: LeisureBank, MoodLog, OpenPattern
└── tasks.md             # Derived tasks
```

### Source Code

```text
app/
├── (tabs)/
│   ├── focus.tsx        # Timer UI & Mirror integration
│   └── stats.tsx        # Time Translator view
components/
├── focus/
│   ├── MirrorMoodSelector.tsx  # Emoji selector
│   └── MindfulPauseModal.tsx   # Doom Loop interrupt overlay
├── gamification/
│   ├── LeisureBankRing.tsx     # Reanimated display of banked time
│   └── TimeTranslatorCard.tsx  # Shareable component
lib/
├── engine/
│   ├── timeBank.ts      # Math for 1:0.6 ratio conversion
│   ├── doomLoop.ts      # Lightweight circular buffer logic
│   └── translator.ts    # Static dictionary mappings
```

## Low-Spec Optimization Strategy
1. **Circular Buffer for Doom Loop**: We track app opens in a fixed-size array (e.g., length 10). This prevents memory leaks and ensures $O(1)$ computation time when checking if the threshold is met.
2. **Reanimated Worklets**: The `MindfulPauseModal` must instantly intercept UI taps. We will mount it hidden and use shared values to slide it into view to avoid React render cycle delays.
3. **No Polling**: The time bank updates strictly upon session completion, eliminating continuous background intervals.
