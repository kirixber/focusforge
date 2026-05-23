import { TimeEquivalent } from '../types/engine';

/**
 * Static dictionary of time translations.
 * These map "boring minutes" into meaningful human achievements.
 */
export const TIME_EQUIVALENTS: TimeEquivalent[] = [
  // Health
  { id: 'workout_1', category: 'health', label: 'a high-intensity power workout', minutesRequired: 45 },
  { id: 'yoga_1', category: 'health', label: 'a deep restorative yoga session', minutesRequired: 60 },
  { id: 'walk_1', category: 'health', label: 'a peaceful walk in nature', minutesRequired: 30 },
  { id: 'run_1', category: 'health', label: 'training for a 5K run', minutesRequired: 40 },

  // Learning
  { id: 'novel_1', category: 'learning', label: 'reading 2 chapters of a novel', minutesRequired: 45 },
  { id: 'language_1', category: 'learning', label: 'mastering 20 new Spanish words', minutesRequired: 20 },
  { id: 'coding_1', category: 'learning', label: 'solving a complex coding challenge', minutesRequired: 50 },
  { id: 'piano_1', category: 'learning', label: 'practicing piano scales', minutesRequired: 25 },

  // Social
  { id: 'call_1', category: 'social', label: 'a meaningful call with a friend', minutesRequired: 30 },
  { id: 'dinner_1', category: 'social', label: 'hosting a focus-free dinner party', minutesRequired: 120 },
  { id: 'coffee_1', category: 'social', label: 'grabbing coffee with a mentor', minutesRequired: 45 },

  // Leisure
  { id: 'movie_1', category: 'leisure', label: 'watching a classic movie', minutesRequired: 110 },
  { id: 'nap_1', category: 'leisure', label: 'a perfect afternoon power nap', minutesRequired: 20 },
  { id: 'meditation_1', category: 'leisure', label: 'attaining deep mental clarity', minutesRequired: 15 },
];

/**
 * Helper to get translations for a given duration.
 */
export const translator = {
  /**
   * Returns a list of equivalents that could have been achieved in the given time.
   */
  getEquivalents(totalMinutes: number): TimeEquivalent[] {
    // Return all items where minutesRequired is less than totalMinutes
    return TIME_EQUIVALENTS.filter(item => item.minutesRequired <= totalMinutes)
      .sort((a, b) => b.minutesRequired - a.minutesRequired); // Largest first
  },

  /**
   * Picks a random translation for a specific duration.
   */
  getRandomTranslation(totalMinutes: number): string {
    const options = this.getEquivalents(totalMinutes);
    if (options.length === 0) return `${totalMinutes} minutes of pure focus`;
    
    const random = options[Math.floor(Math.random() * options.length)];
    return random.label;
  }
};
