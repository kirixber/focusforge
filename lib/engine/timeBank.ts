import { storage } from '../storage';
import { LeisureBank } from '../types/engine';
import { STORAGE_KEYS, EARN_RATIO } from '../constants';

const STORAGE_KEY = STORAGE_KEYS.LEISURE_BANK;

const INITIAL_BANK: LeisureBank = {
  totalEarnedMinutes: 0,
  totalSpentMinutes: 0,
  currentBalanceMinutes: 0,
  lastResetDate: new Date().toISOString(),
};

/**
 * Logic for the Earned Time Bank.
 * Handles depositing focus time and withdrawing leisure time.
 */
export const timeBank = {
  /**
   * Fetches the current leisure bank state from storage.
   */
  async getBank(): Promise<LeisureBank> {
    const bank = await storage.get<LeisureBank>(STORAGE_KEY);
    return bank ?? INITIAL_BANK;
  },

  /**
   * Calculates and adds leisure time based on a focused duration.
   * @param focusMinutes Duration of the focused session in minutes.
   */
  async depositFocusTime(focusMinutes: number): Promise<LeisureBank> {
    const bank = await this.getBank();
    const earned = focusMinutes * EARN_RATIO;
    
    const updatedBank: LeisureBank = {
      ...bank,
      totalEarnedMinutes: bank.totalEarnedMinutes + earned,
      currentBalanceMinutes: bank.currentBalanceMinutes + earned,
    };

    await storage.set(STORAGE_KEY, updatedBank);
    return updatedBank;
  },

  /**
   * Deducts spent leisure time from the bank.
   * @param spentMinutes Minutes spent scrolling or on leisure apps.
   */
  async spendLeisureTime(spentMinutes: number): Promise<LeisureBank> {
    const bank = await this.getBank();
    const balance = Math.max(0, bank.currentBalanceMinutes - spentMinutes);

    const updatedBank: LeisureBank = {
      ...bank,
      totalSpentMinutes: bank.totalSpentMinutes + spentMinutes,
      currentBalanceMinutes: balance,
    };

    await storage.set(STORAGE_KEY, updatedBank);
    return updatedBank;
  },

  /**
   * Resets the bank balance (typically weekly).
   */
  async resetWeekly(): Promise<LeisureBank> {
    const updatedBank: LeisureBank = {
      ...INITIAL_BANK,
      lastResetDate: new Date().toISOString(),
    };
    await storage.set(STORAGE_KEY, updatedBank);
    return updatedBank;
  },
};
