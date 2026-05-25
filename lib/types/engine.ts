/**
 * Core types for the Psychological Focus Engine.
 * These types define the data structures for the Earned Time Bank,
 * Mood Mirror, and Doom Loop Detector.
 */

export type MoodId = 'anxious' | 'bored' | 'neutral' | 'productive' | 'focused';
export type MoodLogType = 'pre_session' | 'post_session' | 'doom_loop_pause';

export interface LeisureBank {
  totalEarnedMinutes: number;
  totalSpentMinutes: number;
  currentBalanceMinutes: number;
  lastResetDate: string; // ISO String (Weekly reset)
}

export interface MoodLog {
  id: string; // UUID
  sessionId?: string; // Link to focus_session if applicable
  timestamp: string; // ISO String
  moodId: MoodId;
  type: MoodLogType;
}

export interface OpenPattern {
  timestamps: number[]; // Circular buffer of Date.now() values
  appId: string; // 'internal' for MVP
}

export type SessionMode = 'pomodoro' | 'short_break' | 'long_break' | 'custom';

export interface SplashState {
  isReady: boolean;
  videoFinished: boolean;
}

export interface TimeEquivalent {
  id: string;
  category: 'health' | 'learning' | 'social' | 'leisure';
  label: string;
  minutesRequired: number;
}
