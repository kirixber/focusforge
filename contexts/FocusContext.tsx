import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { timerEngine, TimerSession, SessionMode } from '../lib/timer';
import { timeBank } from '../lib/engine/timeBank';
import { supabase } from '../lib/supabase';

interface FocusContextType {
  activeSession: TimerSession | null;
  lastCompletedSession: TimerSession | null;
  remainingTime: number; // ms
  progress: number; // 0 to 1
  startSession: (mode: SessionMode, durationMinutes: number, notes?: string) => Promise<void>;
  stopSession: () => Promise<void>;
  completeSession: () => Promise<void>;
  clearCompletedSession: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) throw new Error('useFocus must be used within a FocusProvider');
  return context;
};

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<TimerSession | null>(null);
  const [lastCompletedSession, setLastCompletedSession] = useState<TimerSession | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const timerRef = useRef<any>(null);

  /**
   * Sync UI with the active session state.
   */
  const updateUI = useCallback((session: TimerSession) => {
    const remaining = timerEngine.getRemaining(session);
    const prog = timerEngine.getProgress(session);
    
    setRemainingTime(remaining);
    setProgress(prog);

    if (remaining <= 0) {
      completeSession();
    }
  }, []);

  /**
   * Start a new focus session.
   */
  const startSession = async (mode: SessionMode, durationMinutes: number, notes?: string) => {
    const session: TimerSession = {
      id: Math.random().toString(36).substring(7),
      startTime: Date.now(),
      duration: durationMinutes * 60 * 1000,
      mode,
      notes,
    };

    await timerEngine.saveActiveSession(session);
    setActiveSession(session);
    updateUI(session);
  };

  /**
   * Cancel or stop the active session without completion.
   */
  const stopSession = async () => {
    await timerEngine.clearActiveSession();
    setActiveSession(null);
    setRemainingTime(0);
    setProgress(0);
  };

  /**
   * Mark the active session as successfully completed and award leisure time.
   */
  const completeSession = async () => {
    if (activeSession) {
      const durationMinutes = activeSession.duration / (60 * 1000);
      
      // Earned Time Bank Integration
      await timeBank.depositFocusTime(durationMinutes);
      
      setLastCompletedSession(activeSession);
      
      // Trigger AI Insight generation in background
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.functions.invoke('generate-insight', {
            body: { user_id: user.id, insight_type: 'post_session' }
          });
        }
      });

      await stopSession();
    }
  };

  const clearCompletedSession = () => {
    setLastCompletedSession(null);
  };

  /**
   * Bootstrap: Load existing session and start UI polling.
   */
  useEffect(() => {
    const bootstrap = async () => {
      const saved = await timerEngine.getActiveSession();
      if (saved && !timerEngine.isExpired(saved)) {
        setActiveSession(saved);
      }
    };
    bootstrap();
  }, []);

  /**
   * UI Tick: Poll the timer engine every 500ms for smoothness.
   */
  useEffect(() => {
    if (activeSession) {
      timerRef.current = setInterval(() => updateUI(activeSession), 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession, updateUI]);

  return (
    <FocusContext.Provider value={{ 
      activeSession, 
      lastCompletedSession,
      remainingTime, 
      progress, 
      startSession, 
      stopSession, 
      completeSession,
      clearCompletedSession
    }}>
      {children}
    </FocusContext.Provider>
  );
};
