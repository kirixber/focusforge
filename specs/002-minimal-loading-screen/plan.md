# Implementation Plan: 002-Minimal Loading Screen

**Branch**: `002-minimal-loading-screen` | **Date**: 2026-05-23 | **Spec**: specs/002-minimal-loading-screen/spec.md

## Summary

The goal is to implement a high-fidelity video splash screen using `expo-av`. This will sit between the native splash screen and the root navigation. We will use `expo-splash-screen` to keep the app hidden while the video asset is pre-loading, then show the video and automatically transition to the Home/Login once playback completes.

## Technical Context

**Language/Version**: TypeScript ~5.9

**Primary Dependencies**: `expo-av` (required), `expo-splash-screen` (existing)

**Storage**: N/A

**Testing**: Manual visual validation.

**Target Platform**: iOS / Android (Mobile App)

**Performance Goals**: < 100ms switch from native splash to video.

**Constraints**: Asset loading on low-spec phones.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Offline-First**: Does the design prioritize local persistence? (N/A - Asset is local).
- [x] **Timestamp Timing**: N/A
- [x] **Gamification**: N/A
- [x] **60FPS Performance**: Yes, video playback and transitions must be smooth.
- [x] **Type-Safety**: Yes, full typing for video refs.

## Project Structure

### Documentation (this feature)

```text
specs/002-minimal-loading-screen/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code

```text
app/
├── _layout.tsx         # Main entry - will house the splash state
components/
├── focus/
│   └── VideoSplash.tsx # New component for full-screen playback
```

## Phase Strategy (Overview)
- **Phase 1 (Setup)**: Install `expo-av` and verify asset exists.
- **Phase 2 (Component)**: Create `VideoSplash.tsx`.
- **Phase 3 (Integration)**: Wire the splash state into the root `_layout.tsx`.
