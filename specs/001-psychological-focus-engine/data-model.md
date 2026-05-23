# Data Model: Psychological Focus Engine

## Entities

### LeisureBank
```typescript
interface LeisureBank {
  totalEarnedMinutes: number;
  totalSpentMinutes: number;
  currentBalanceMinutes: number; // computed
  lastResetDate: string; // ISO String (Weekly reset)
}
```

### MoodLog
```typescript
interface MoodLog {
  id: string; // UUID
  sessionId?: string; // Link to focus_session
  timestamp: string; // ISO String
  moodId: 'anxious' | 'bored' | 'neutral' | 'productive' | 'focused';
  type: 'pre_session' | 'post_session' | 'doom_loop_pause';
}
```

### OpenPattern
```typescript
interface OpenPattern {
  timestamps: number[]; // Circular buffer of Date.now()
  appId: string; // 'internal' for MVP
}
```

### TimeEquivalent
```typescript
interface TimeEquivalent {
  id: string;
  category: 'social' | 'health' | 'learning' | 'leisure';
  label: string; // e.g. "Read 2 chapters"
  minutesRequired: number;
}
```

## Storage Keys (AsyncStorage)
- `@focusforge/leisure_bank`
- `@focusforge/open_patterns`
- `@focusforge/mood_logs`
