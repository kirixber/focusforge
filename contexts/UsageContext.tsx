import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { timeBank } from '../lib/engine/timeBank';
import { LeisureBank } from '../lib/types/engine';

interface UsageContextType {
  bank: LeisureBank | null;
  refreshBank: () => Promise<void>;
  spendLeisure: (minutes: number) => Promise<void>;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (!context) throw new Error('useUsage must be used within a UsageProvider');
  return context;
};

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bank, setBank] = useState<LeisureBank | null>(null);

  const refreshBank = useCallback(async () => {
    const currentBank = await timeBank.getBank();
    setBank(currentBank);
  }, []);

  const spendLeisure = async (minutes: number) => {
    const updated = await timeBank.spendLeisureTime(minutes);
    setBank(updated);
  };

  useEffect(() => {
    refreshBank();
  }, [refreshBank]);

  return (
    <UsageContext.Provider value={{ bank, refreshBank, spendLeisure }}>
      {children}
    </UsageContext.Provider>
  );
};
