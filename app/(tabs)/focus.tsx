import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MirrorMoodSelector } from '@/components/focus/MirrorMoodSelector';
import { TimerRing } from '@/components/focus/TimerRing';
import { SessionCompleteModal } from '@/components/focus/SessionCompleteModal';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useFocus } from '@/contexts/FocusContext';
import { useUsage } from '@/contexts/UsageContext';
import { MoodId, SessionMode } from '@/lib/types/engine';
import { ACCENT, BG, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, SURFACE2, ON_ACCENT, SURFACE, BORDER } from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';

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
  const [customMinutes, setCustomMinutes] = useState('25');

  const completeModalRef = React.useRef<BottomSheetModal>(null);
  const customModalRef = React.useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (lastCompletedSession) {
      completeModalRef.current?.present();
    }
  }, [lastCompletedSession]);

  const handleModePress = (modeId: SessionMode) => {
    setSelectedMode(modeId);
    if (modeId === 'custom') {
      customModalRef.current?.present();
    }
  };

  const handleStart = async () => {
    if (!selectedMood) return;
    const mode = MODES.find(m => m.id === selectedMode);
    const duration = selectedMode === 'custom' ? parseInt(customMinutes, 10) : (mode?.duration || 25);
    await startSession(selectedMode, duration);
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
        <View style={[s.activeContent, { paddingBottom: TAB_BAR_CLEARANCE + 100 }]}>
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
              label="Stop Session" 
              onPress={stopSession} 
              variant="secondary"
              fullWidth
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
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: TAB_BAR_CLEARANCE + 120 }}
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
              onPress={() => handleModePress(mode.id)}
              style={[
                s.modeCard,
                selectedMode === mode.id && s.selectedModeCard
              ]}
            >
              <Ionicons 
                name={mode.icon} 
                size={24} 
                color={selectedMode === mode.id ? ON_ACCENT : TEXT_SECONDARY} 
              />
              <Text style={[
                s.modeCardLabel,
                selectedMode === mode.id && s.selectedModeLabel
              ]}>
                {mode.label}
              </Text>
              {mode.duration > 0 && (
                <Text style={[
                  s.modeDuration,
                  selectedMode === mode.id && s.selectedModeDuration
                ]}>
                  {mode.duration}m
                </Text>
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
            label="Start Session" 
            onPress={handleStart} 
            disabled={!selectedMood}
            variant={!selectedMood ? 'secondary' : 'primary'}
            fullWidth
            style={s.startButton}
          />
          {!selectedMood && (
            <Text style={s.hint}>Check-in with yourself to begin</Text>
          )}
        </View>
      </ScrollView>

      {/* Custom Duration Modal */}
      <BottomSheetModal
        ref={customModalRef}
        index={0}
        snapPoints={['40%']}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
        backgroundStyle={{ backgroundColor: SURFACE }}
        handleIndicatorStyle={{ backgroundColor: BORDER }}
      >
        <BottomSheetView style={s.customContent}>
          <Text style={s.customTitle}>Custom Duration</Text>
          <Text style={s.customSub}>How many minutes do you want to focus?</Text>
          
          <View style={s.inputContainer}>
            <TextInput
              value={customMinutes}
              onChangeText={setCustomMinutes}
              keyboardType="number-pad"
              style={s.customInput}
              placeholderTextColor={TEXT_TERTIARY}
            />
            <Text style={s.minutesSuffix}>minutes</Text>
          </View>

          <Button 
            label="Set Duration" 
            onPress={() => customModalRef.current?.dismiss()}
            fullWidth
          />
        </BottomSheetView>
      </BottomSheetModal>

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
    color: ON_ACCENT,
    fontWeight: '800',
  },
  modeDuration: {
    fontSize: 12,
    color: TEXT_TERTIARY,
    marginTop: 2,
  },
  selectedModeDuration: {
    color: 'rgba(2, 58, 34, 0.6)',
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
  },
  customContent: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  customTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_PRIMARY,
  },
  customSub: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE2,
    borderRadius: 16,
    paddingHorizontal: 20,
    width: '100%',
    height: 64,
    gap: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  customInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: ACCENT,
    textAlign: 'right',
  },
  minutesSuffix: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    width: 80,
  }
});
