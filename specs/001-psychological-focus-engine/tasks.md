# Tasks: 001-Psychological Focus Engine

**Input**: Design documents from `/specs/001-psychological-focus-engine/`

**Organization**: Organized by core differentiator features for incremental delivery.

## Path Conventions
- **Mobile (FocusForge)**: `app/` (screens), `components/` (UI), `lib/` (logic), `tests/` (testing)

---

## Phase 1: Foundational Logic (Blocking Prerequisites)

- [ ] T001 [P] Define TypeScript interfaces for `LeisureBank`, `MoodLog`, and `OpenPattern` in `lib/types/engine.ts`
- [ ] T002 Implement `CircularBuffer` utility for open tracking in `lib/utils/buffer.ts`
- [ ] T003 Implement `timeBank.ts` math and storage logic (1:0.6 ratio) in `lib/engine/timeBank.ts`
- [ ] T004 Implement `doomLoop.ts` detection logic using circular buffer in `lib/engine/doomLoop.ts`
- [ ] T005 [P] Create static dictionary of `TimeEquivalents` in `lib/engine/translator.ts`

---

## Phase 2: User Story 1 - The Guilt-Free Cycle (Earned Time Bank) 🎯 MVP

**Goal**: Earn leisure time from focus sessions.

### Implementation for US1
- [ ] T006 Add `leisure_bank` keys to `lib/storage.ts`
- [ ] T007 [P] Create `LeisureBankRing.tsx` Reanimated component in `components/gamification/LeisureBankRing.tsx`
- [ ] T008 Update `FocusContext.tsx` to call `depositLeisureTime()` upon session completion
- [ ] T009 Integrate `LeisureBankRing` into `app/(tabs)/index.tsx` (Dashboard)

---

## Phase 3: User Story 2 - Breaking the Doom Loop (Mirror + Detector)

**Goal**: Detect anxiety scrolling and track mood.

### Implementation for US2
- [ ] T010 Create `MirrorMoodSelector.tsx` in `components/focus/MirrorMoodSelector.tsx` (Reanimated emojis)
- [ ] T011 Create `MindfulPauseModal.tsx` in `components/focus/MindfulPauseModal.tsx`
- [ ] T012 Update `app/(tabs)/focus.tsx` to require `MirrorMoodSelector` before start/after end
- [ ] T013 Integrate `doomLoop.ts` trigger with `AppState` listener in `app/_layout.tsx` to show `MindfulPauseModal`

---

## Phase 4: User Story 3 - The Time Translator

**Goal**: Translate focused time into achievements.

### Implementation for US3
- [ ] T014 [P] Create `TimeTranslatorCard.tsx` in `components/gamification/TimeTranslatorCard.tsx`
- [ ] T015 Implement `view-shot` logic for sharing achievements in `lib/engine/sharing.ts`
- [ ] T016 Integrate `TimeTranslatorCard` and sharing button into `app/(tabs)/stats.tsx`

---

## Phase 5: Optimization & Polish

- [ ] T017 [P] Add unit tests for `doomLoop.ts` pattern detection in `tests/unit/doomLoop.test.ts`
- [ ] T018 Add unit tests for `timeBank.ts` in `tests/unit/timeBank.test.ts`
- [ ] T019 [P] Optimize `MirrorMoodSelector` with `React.memo` and worklets for low-spec performance
- [ ] T020 Final accessibility pass for all new UI components
