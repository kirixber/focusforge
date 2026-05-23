# Research: Psychological Focus Engine

## Doom Loop Detector (Pattern Recognition)

### Requirement
Detect "compulsion loops" (frequency > 5 opens per 15-minute window with low duration).

### Approach
- **Tracking**: Use a fixed-size `CircularBuffer` of timestamps.
- **Trigger**: Every time the app is opened (detected via `AppState` or internal navigation in MVP), we push `Date.now()` to the buffer.
- **Analysis**:
  ```typescript
  if (buffer.size >= 5) {
    const timespan = buffer.last - buffer.first;
    if (timespan < 15 * 60 * 1000) triggerMindfulPause();
  }
  ```
- **Optimization**: Run this check inside a Reanimated worklet or a requestAnimationFrame callback to keep the UI thread free for screen transitions.

## Earned Time Bank (Currency Math)

### Ratio Logic
- **Earn Rate**: 0.6 leisure minutes per 1 focus minute.
- **Persistence**: Store `bankedLeisureMinutes` as a float in `AsyncStorage`.
- **Atomic Updates**: Use a "Credit/Debit" approach to avoid drift.

## Time Translator (Social Virality)

### Mapping Strategy
- Use a tiered dictionary:
  - `0-30m`: "A quick espresso break", "10 pages of a thriller".
  - `30-60m`: "A power workout", "2 chapters of a novel".
  - `60-120m`: "A movie with a friend", "A deep yoga session".
- **Sharing**: Use `react-native-view-shot` to capture the `TimeTranslatorCard` as a PNG. Ensure the view is rendered with brand fonts (Inter) before capture.

## Mirror (Mood Tracking)

### UI Design
- 5 emojis (Anxious, Bored, Neutral, Productive, Focused).
- Reanimated spring animations for selection (scaling from 1 to 1.3).
- Low impact: Stored as a simple `integer` ID in the session log.
