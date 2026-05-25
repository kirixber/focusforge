import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { doomLoop } from '@/lib/engine/doomLoop';
import { MindfulPauseModal } from './MindfulPauseModal';
import { useFocus } from '@/contexts/FocusContext';
import { router } from 'expo-router';

import { supabase } from '@/lib/supabase';

/**
 * Global manager for the Doom Loop Detector.
 * Listens to AppState changes and triggers the MindfulPauseModal.
 */
export const DoomLoopManager: React.FC = () => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { activeSession, startSession } = useFocus();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Initialize buffer from storage
    doomLoop.init();

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        const { data: { session } } = await supabase.auth.getSession();
        
        // Only trigger doom loop for LOGGED IN users
        if (session) {
          handleAppOpen();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [activeSession]); // Add activeSession to dependency to ensure it has latest state

  const handleAppOpen = async () => {
    // If a focus session is already active, don't trigger doom loop
    if (activeSession) return;

    const isDoomLooping = await doomLoop.recordOpen();
    if (isDoomLooping) {
      setIsModalVisible(true);
      modalRef.current?.present();
    }
  };

  const handleStartMicroFocus = async () => {
    setIsModalVisible(false);
    modalRef.current?.dismiss();
    await doomLoop.reset();
    
    // Start a 5-minute micro-focus session
    // Redirect to focus tab first
    router.push('/focus');
    await startSession('pomodoro', 5, 'Micro-focus to break loop');
  };

  return (
    <MindfulPauseModal 
      ref={modalRef}
      isVisible={isModalVisible}
      onDismiss={() => {
        setIsModalVisible(false);
        modalRef.current?.dismiss();
      }}
      onStartMicroFocus={handleStartMicroFocus}
    />
  );
};
