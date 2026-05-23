/**
 * 🏷️ APP IDENTITY — App-wide constants and storage keys.
 */

export const APP_NAME = 'FocusForge';
export const APP_TAGLINE = 'Forge your focus. Own your time.';
export const APP_DESCRIPTION = 'A gamified digital wellness application designed to help users reclaim their time through tracking and rewards.';
export const APP_SCHEME = 'focusforge';
export const APP_SUPPORT_EMAIL = 'support@focusforge.app';
export const APP_DOCS_URL = 'https://docs.focusforge.app';

// ─── Storage Keys ────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  USER_PROFILE: '@focusforge/user_profile',
  DAILY_GOAL: '@focusforge/daily_goal',
  APP_LIMITS: '@focusforge/app_limits',
  USAGE_LOG: '@focusforge/usage_log',
  FOCUS_SESSIONS: '@focusforge/focus_sessions',
  ACHIEVEMENTS: '@focusforge/achievements',
  DAILY_CHALLENGES: '@focusforge/daily_challenges',
  STREAK: '@focusforge/streak',
  ONBOARDING_DONE: '@focusforge/onboarding_done',
  ACTIVE_SESSION: '@focusforge/active_session',
  
  // Psychological Focus Engine Keys
  LEISURE_BANK: '@focusforge/leisure_bank',
  OPEN_PATTERNS: '@focusforge/open_patterns',
  MOOD_LOGS: '@focusforge/mood_logs',
};

// ─── Gamification Constants ──────────────────────────────────────────────────

export const EARN_RATIO = 0.6; // 1 focused minute = 0.6 leisure minutes
