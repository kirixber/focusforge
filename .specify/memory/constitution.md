<!--
Sync Impact Report:
- Version change: [INITIAL] -> 1.0.0
- List of modified principles:
  - Added: I. Offline-First & Local Persistence
  - Added: II. Timestamp-Anchored Timing
  - Added: III. Gamified Engagement
  - Added: IV. 60FPS Performance
  - Added: V. Type-Safe Architecture
- Added sections: Technical Standards & Constraints, Development Workflow & Quality Gates
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Refined for FocusForge structure)
  - ✅ .specify/templates/spec-template.md (Refined for FocusForge requirements)
  - ✅ .specify/templates/tasks-template.md (Refined for mobile paths)
- Follow-up TODOs:
  - [ ] Initialize Supabase migrations for the profiles table.
-->

# FocusForge Constitution

## Core Principles

### I. Offline-First & Local Persistence
All user actions (session completion, XP gain, usage logging) MUST write to `AsyncStorage` via the type-safe `lib/storage.ts` wrapper first. Remote synchronization with Supabase should happen in the background via TanStack Query mutations. The app MUST remain fully functional for core features without an active network connection.

### II. Timestamp-Anchored Timing
The focus timer MUST use the timestamp-anchored approach defined in `lib/timer.ts`. Do not rely on `setInterval` or `setTimeout` as the source of truth for elapsed time, as these mechanisms drift or stop when the app is backgrounded or the device is locked. The UI MUST poll the wall-clock anchor to ensure ±1s accuracy at all times.

### III. Gamified Engagement
FocusForge is a "non-preachy" wellness app. Every user interaction SHOULD provide positive reinforcement through the XP system, achievement unlocks, or visual feedback (e.g., Lottie confetti). Discipline SHOULD feel like a game the user is winning, not a restriction.

### IV. 60FPS Performance
Fluidity is critical for user retention. All data visualizations (Victory Native XL), animations (Reanimated 4), and long lists (FlashList) MUST target 60FPS. Heavy computations or blocking UI thread operations MUST be offloaded to worklets or handled asynchronously.

### V. Type-Safe Architecture
Strict TypeScript (v5.9+) is mandatory across all layers. Avoid `any` or loose typing. Data structures for storage, API responses, and global context state MUST be explicitly defined to ensure structural integrity and catch regressions during development.

## Technical Standards & Constraints

### Framework & Styling
- **Framework**: Expo (React Native) ~55.0. Use Expo Router for file-based navigation and deep linking.
- **Styling**: NativeWind (TailwindCSS) is the primary styling solution. Brand tokens (Primary: `#6C63FF`) MUST be referenced from `lib/theme.ts`.

### State & Database
- **Global State**: React Context for domain-specific state (Focus, Gamification, Usage, Goals).
- **Data Fetching**: TanStack Query for server sync and optimistic updates.
- **Persistence**: Local-first via `AsyncStorage`, mirrored to remote `Supabase` Postgres.

### Visuals & Charts
- **Charts**: Use Victory Native XL (Skia-based) for usage and focus trends.
- **Animations**: Reanimated 4 for interaction states; Lottie for celebration effects.

## Development Workflow & Quality Gates

### Implementation Cycle
Every feature follows the **Specify → Plan → Implement** cycle.
1. **Spec**: Define user stories and acceptance criteria in `specs/`.
2. **Plan**: Research technical approach and map tasks.
3. **Implement**: Execute tasks with continuous validation.

### Testing & Validation
- **Unit Tests**: Mandatory for core logic in `lib/` (math, storage, timer).
- **Component Tests**: Required for reusable UI elements in `components/`.
- **Pre-Commit**: `npm run typecheck` and `npm test` MUST pass before merging or finalizing implementation.

## Governance
The FocusForge Constitution is the foundational document for project standards. It supersedes general development practices found in external templates.

### Amendment Procedure
1. Propose changes to principles or constraints.
2. Update the Constitution and increment the version.
3. Propagate changes to all dependent templates in `.specify/templates/`.
4. Document the rationale in the Sync Impact Report.

### Versioning Policy
- **MAJOR**: Backward incompatible governance/principle changes.
- **MINOR**: New principles or major section additions.
- **PATCH**: Clarifications, wording, or formatting fixes.

**Version**: 1.0.0 | **Ratified**: 2026-05-23 | **Last Amended**: 2026-05-23
