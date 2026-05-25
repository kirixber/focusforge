# Feature Specification: 002-Minimal Loading Screen

**Feature Branch**: `002-minimal-loading-screen`

**Created**: 2026-05-23

**Status**: Draft

**Input**: Create a minimal loading screen at the very beginning which shows up as soon as the app is launched using `@assets/logo_code.mp4`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The Video Splash (Priority: P1) 🎯 MVP

As a user, I want to see a beautiful logo animation when the app opens, so that the experience feels high-end and polished from the first second.

**Why this priority**: First impressions are critical for wellness apps. This sets the tone for "Mental Peace & Plants."

**Independent Test**: Kill the app → Open the app → Observe `logo_code.mp4` playing → Observe automatic transition to Home/Login after video ends or after a short delay.

**Acceptance Scenarios**:
1. **Given** I launch the app, **When** the native splash screen disappears, **Then** I must see the `logo_code.mp4` video playing full-screen.
2. **Given** the video is playing, **When** it reaches the end, **Then** the app must navigate to the root index screen.
3. **Given** I am on a slow device, **When** the video is loading, **Then** I should see a static placeholder to avoid a black screen.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Video Playback)**: System MUST play `assets/logo_code.mp4` on launch.
- **FR-002 (Auto-transition)**: System MUST transition to the main app flow automatically after video completion.
- **FR-003 (Mute)**: Splash video SHOULD be muted by default.
- **FR-004 (Performance)**: Video should be pre-loaded or optimized to avoid delay.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Time to Interactive)**: Main app logic should be initialized while the video is playing.
- **SC-002 (Visual Continuity)**: Zero "flicker" between the native splash and the video splash.

## Assumptions

- **Native Splash**: The native splash screen (`expo-splash-screen`) will be held until the video is ready to play.
- **Asset Presence**: `assets/logo_code.mp4` exists and is formatted correctly for mobile playback.
