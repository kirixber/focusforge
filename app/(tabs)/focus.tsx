import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MirrorMoodSelector } from '@/components/focus/MirrorMoodSelector';
import { TimerRing } from '@/components/focus/TimerRing';
import { SessionCompleteModal } from '@/components/focus/SessionCompleteModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFocus } from '@/contexts/FocusContext';
import { useUsage } from '@/contexts/UsageContext';
import { MoodId, SessionMode } from '@/lib/types/engine';
import { ACCENT, BG, TEXT_PRIMARY, TEXT_SECONDARY, SURFACE2 } from '@/lib/theme';

const MODES: { id: SessionMode, label: string, icon: keyof typeof Ionicons.glyphMap, duration: number }[] = [
  { id: 'pomodoro', label: 'Work', icon: 'timer-outline', duration: 25 },
  { id: 'short_break', label: 'Short Break', icon: 'cafe-outline', duration: 5 },
  { id: 'long_break', label: 'Long Break', icon: 'water-outline', duration: 15 },
  { id: 'custom', label: 'Custom', icon: 'settings-outline', duration: 0 },
];

export default function FocusScreen() {
  const insets = useSafeAreaInsets();
  const { 
    activeSession, 
    lastCompletedSession, 
    startSession, 
    stopSession, 
    remainingTime, 
    progress,
    clearCompletedSession 
  } = useFocus();
  
  const [selectedMode, setSelectedMode] = useState<SessionMode>('pomodoro');
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);

  const completeModalRef = React.useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (lastCompletedSession) {
      completeModalRef.current?.present();
    }
  }, [lastCompletedSession]);

  const handleStart = async () => {
    if (!selectedMood) return;
    const mode = MODES.find(m => m.id === selectedMode);
    await startSession(selectedMode, mode?.duration || 25);
  };

  const handleCompleteDone = (postMood: MoodId) => {
    // TODO: Save mood check-in to database
    completeModalRef.current?.dismiss();
    clearCompletedSession();
    setSelectedMood(null); // Reset for next time
  };

  if (activeSession) {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
      <View style={[s.container, { paddingTop: insets.top }]}>
        <View style={s.activeContent}>
          <Text style={s.modeLabel}>{activeSession.mode.toUpperCase()}</Text>
          
          <View style={s.timerContainer}>
             <TimerRing progress={progress} />
             <View style={StyleSheet.absoluteFill}>
               <View style={s.timerLabelWrap}>
                 <Text style={s.timerBig}>{timeStr}</Text>
                 <Text style={s.timerSmall}>remaining</Text>
               </View>
             </View>
          </View>

          <View style={s.activeFooter}>
            <Button 
              title="Stop Session" 
              onPress={stopSession} 
              variant="secondary"
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={[s.container, { backgroundColor: BG }]}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Text style={s.title}>Focus Session</Text>
          <Text style={s.subtitle}>Deep work creates freedom.</Text>
        </View>

        <Text style={s.sectionTitle}>1. Choose Your Mode</Text>
        <View style={s.modeGrid}>
          {MODES.map((mode) => (
            <TouchableOpacity 
              key={mode.id}
              onPress={() => setSelectedMode(mode.id)}
              style={[
                s.modeCard,
                selectedMode === mode.id && s.selectedModeCard
              ]}
            >
              <Ionicons 
                name={mode.icon} 
                size={24} 
                color={selectedMode === mode.id ? '#fff' : TEXT_SECONDARY} 
              />
              <Text style={[
                s.modeCardLabel,
                selectedMode === mode.id && s.selectedModeLabel
              ]}>
                {mode.label}
              </Text>
              {mode.duration > 0 && (
                <Text style={s.modeDuration}>{mode.duration}m</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.mirrorSection}>
          <Text style={s.sectionTitle}>2. The Mirror</Text>
          <Card style={s.moodCard}>
            <MirrorMoodSelector 
              selectedMood={selectedMood}
              onSelect={setSelectedMood}
            />
          </Card>
        </View>

        <View style={s.footer}>
          <Button 
            title="Start Session" 
            onPress={handleStart} 
            disabled={!selectedMood}
            variant={!selectedMood ? 'secondary' : 'primary'}
            style={s.startButton}
          />
          {!selectedMood && (
            <Text style={s.hint}>Check-in with yourself to begin</Text>
          )}
        </View>
      </ScrollView>

      <SessionCompleteModal 
        ref={completeModalRef}
        durationMinutes={lastCompletedSession ? lastCompletedSession.duration / 60000 : 0}
        xpEarned={100} 
        onDone={handleCompleteDone}
      />
    </>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 24, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: TEXT_SECONDARY, marginTop: 4 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  modeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: SURFACE2,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedModeCard: {
    backgroundColor: ACCENT,
  },
  modeCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginTop: 8,
  },
  selectedModeLabel: {
    color: '#fff',
  },
  modeDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  mirrorSection: {
    marginBottom: 32,
  },
  moodCard: {
    marginHorizontal: 16,
    paddingVertical: 10,
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    height: 56,
  },
  hint: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 12,
  },
  activeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: ACCENT,
    letterSpacing: 2,
    marginBottom: 40,
  },
  timerContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  timerBig: {
    fontSize: 64,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    fontVariant: ['tabular-nums'],
  },
  timerLabelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSmall: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -4,
  },
  activeFooter: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 40,
  }
});
