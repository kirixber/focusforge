---
description: "Task list for implementing the minimal video loading screen"
---

# Tasks: 002-Minimal Loading Screen

**Input**: Design documents from `/specs/002-minimal-loading-screen/`

**Organization**: Organized by setup, foundation, and user story implementation for incremental delivery.

## Path Conventions
- **Mobile (FocusForge)**: `app/` (screens), `components/` (UI), `lib/` (logic), `tests/` (testing)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [ ] T001 [P] Install `expo-av` dependency via `npx expo install expo-av`
- [ ] T002 [P] Verify `assets/logo_code.mp4` exists and is correctly placed in `assets/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components needed for the splash screen

- [ ] T003 [P] Create base component structure in `components/focus/VideoSplash.tsx`
- [ ] T004 [P] Update `lib/types/engine.ts` with splash state types

---

## Phase 3: User Story 1 - The Video Splash (Priority: P1) 🎯 MVP

**Goal**: Implement the full-screen video splash on app launch.

**Independent Test**: Relaunch app → observe video playback → observe transition to Home.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Implement full-screen `Video` playback in `components/focus/VideoSplash.tsx`
- [ ] T006 [P] [US1] Add `onPlaybackStatusUpdate` and `didJustFinish` logic to handle completion
- [ ] T007 [US1] Modify `app/_layout.tsx` to include `showSplash` state variable
- [ ] T008 [US1] Integrate `expo-splash-screen` logic to keep native splash until video is ready
- [ ] T009 [US1] Trigger main navigation render when `showSplash` becomes false

---

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T010 [P] Add Reanimated fade transition between splash and root view
- [ ] T011 Ensure splash video is muted and uses `resizeMode="cover"`
- [ ] T012 Final visual validation of continuity between native and video splash

---

## Dependencies
1. **User Story 1** depends on **Phase 1 & 2** completion.

## Implementation Strategy
- **MVP First**: Focus on getting the video to play and transition manually.
- **Incremental**: Add the native splash holding logic and fade transitions after core playback works.
