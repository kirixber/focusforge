import { storage } from './storage';
import { STORAGE_KEYS } from './constants';

export type SessionMode = 'pomodoro' | 'short_break' | 'long_break' | 'custom';

export interface TimerSession {
  id: string;
  startTime: number;      // timestamp (Date.now())
  duration: number;       // total duration in ms
  mode: SessionMode;
  notes?: string;
}

/**
 * High-precision timer engine anchored to a wall-clock timestamp.
 * Survives app backgrounding and phone locks.
 */
export const timerEngine = {
  /**
   * Calculates the remaining time in milliseconds for a given session.
   */
  getRemaining(session: TimerSession): number {
    const elapsed = Date.now() - session.startTime;
    return Math.max(0, session.duration - elapsed);
  },

  /**
   * Returns the progress of the session as a percentage (0 to 1).
   */
  getProgress(session: TimerSession): number {
    const elapsed = Date.now() - session.startTime;
    return Math.min(1, elapsed / session.duration);
  },

  /**
   * Checks if the given session has expired.
   */
  isExpired(session: TimerSession): boolean {
    return this.getRemaining(session) <= 0;
  },

  /**
   * Saves the active session to storage for crash recovery.
   */
  async saveActiveSession(session: TimerSession): Promise<void> {
    await storage.set(STORAGE_KEYS.ACTIVE_SESSION, session);
  },

  /**
   * Retrieves the active session from storage.
   */
  async getActiveSession(): Promise<TimerSession | null> {
    return await storage.get<TimerSession>(STORAGE_KEYS.ACTIVE_SESSION);
  },

  /**
   * Clears the active session from storage.
   */
  async clearActiveSession(): Promise<void> {
    await storage.remove(STORAGE_KEYS.ACTIVE_SESSION);
  }
};
