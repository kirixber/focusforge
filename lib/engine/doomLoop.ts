import { CircularBuffer } from '../utils/buffer';
import { storage } from '../storage';
import { OpenPattern } from '../types/engine';
import { STORAGE_KEYS } from '../constants';

const STORAGE_KEY = STORAGE_KEYS.OPEN_PATTERNS;
const MAX_BUFFER_SIZE = 10;
const DOOM_LOOP_THRESHOLD = 5; // opens
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Memory-resident buffer for immediate access/high performance
const localBuffer = new CircularBuffer<number>(MAX_BUFFER_SIZE);

/**
 * Logic for the Doom Loop Detector.
 * Tracks app opens and detects compulsive behavior patterns.
 */
export const doomLoop = {
  /**
   * Initializes the local buffer from storage.
   */
  async init(): Promise<void> {
    const saved = await storage.get<OpenPattern>(STORAGE_KEY);
    if (saved) {
      saved.timestamps.forEach(ts => localBuffer.push(ts));
    }
  },

  /**
   * Records a new app open event.
   * Returns true if a doom loop pattern is detected.
   */
  async recordOpen(): Promise<boolean> {
    const now = Date.now();
    localBuffer.push(now);

    // Save to persistence (offline-first)
    await storage.set(STORAGE_KEY, {
      timestamps: localBuffer.getItems(),
      appId: 'internal',
    });

    return this.isDoomLooping();
  },

  /**
   * Analysis logic: Checks if threshold opens occurred within the time window.
   */
  isDoomLooping(): boolean {
    if (localBuffer.size < DOOM_LOOP_THRESHOLD) return false;

    const items = localBuffer.getItems();
    // Get the last N items where N = DOOM_LOOP_THRESHOLD
    const recentOpens = items.slice(-DOOM_LOOP_THRESHOLD);
    
    const firstOpen = recentOpens[0];
    const lastOpen = recentOpens[recentOpens.length - 1];

    const timespan = lastOpen - firstOpen;
    
    // Pattern: Threshold opens within WINDOW_MS
    return timespan < WINDOW_MS;
  },

  /**
   * Clears the pattern log (e.g., after a mindful pause is acknowledged).
   */
  async reset(): Promise<void> {
    localBuffer.clear();
    await storage.remove(STORAGE_KEY);
  },
};
