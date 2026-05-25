import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MirrorMoodSelector } from './MirrorMoodSelector';
import { MoodId } from '@/lib/types/engine';
import { ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, SURFACE, SUCCESS, XP_GOLD } from '@/lib/theme';
import { EARN_RATIO } from '@/lib/constants';

interface SessionCompleteModalProps {
  durationMinutes: number;
  xpEarned: number;
  onDone: (postMood: MoodId) => void;
}

/**
 * Celebration modal for session completion.
 * Awards XP and Leisure time with high-energy visual feedback.
 */
export const SessionCompleteModal = React.forwardRef<BottomSheetModal, SessionCompleteModalProps>(({ 
  durationMinutes, 
  xpEarned,
  onDone 
}, ref) => {
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const leisureEarned = Math.floor(durationMinutes * EARN_RATIO);

  const handleDone = () => {
    if (selectedMood) {
      onDone(selectedMood);
    }
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.8} />
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={['75%']}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: SURFACE }}
      enablePanDownToClose={false}
    >
      <BottomSheetView style={s.content}>
        <View style={s.confettiContainer} pointerEvents="none">
          {/* Using a placeholder or common Lottie confetti */}
          <LottieView
            autoPlay
            loop={false}
            style={{ width: '100%', height: '100%' }}
            source={require('@/assets/lottie/confetti.json')}
          />
        </View>

        <View style={s.header}>
          <Text style={s.title}>Session Complete!</Text>
          <Text style={s.subtitle}>You forged {durationMinutes} minutes of focus.</Text>
        </View>

        <View style={s.rewardsRow}>
          <Card style={s.rewardCard}>
            <Text style={s.rewardValue}>+{xpEarned}</Text>
            <Text style={s.rewardLabel}>XP</Text>
          </Card>
          <Card style={s.rewardCard}>
            <Text style={[s.rewardValue, { color: ACCENT }]}>+{leisureEarned}m</Text>
            <Text style={s.rewardLabel}>Leisure</Text>
          </Card>
        </View>

        <View style={s.mirrorWrap}>
          <MirrorMoodSelector 
            title="How do you feel after focusing?"
            selectedMood={selectedMood}
            onSelect={(m) => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setSelectedMood(m);
            }}
          />
        </View>

        <View style={s.footer}>
          <Button 
            label="Complete & Save" 
            onPress={handleDone}
            disabled={!selectedMood}
            variant={!selectedMood ? 'secondary' : 'primary'}
            fullWidth
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const s = StyleSheet.create({
  content: {
    padding: 24,
    alignItems: 'center',
    flex: 1,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginTop: 4,
    textAlign: 'center',
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  rewardCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  rewardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFD700', // Gold color
  },
  rewardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  mirrorWrap: {
    width: '100%',
    marginBottom: 40,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
  },
});
