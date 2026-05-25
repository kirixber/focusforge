import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, SURFACE, BORDER, WARNING } from '@/lib/theme';

interface MindfulPauseModalProps {
  isVisible: boolean;
  onDismiss: () => void;
  onStartMicroFocus: () => void;
}

/**
 * The "5-Second Pause" Doom Loop interrupter.
 * This is the core psychological friction component that breaks the reflex tap.
 */
export const MindfulPauseModal = React.forwardRef<BottomSheetModal, MindfulPauseModalProps>(({ 
  isVisible, 
  onDismiss,
  onStartMicroFocus 
}, ref) => {
  const [countdown, setCountdown] = useState(5);
  const [reason, setReason] = useState<string | null>(null);
  
  const snapPoints = useMemo(() => ['65%'], []);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isVisible) {
      setCountdown(5);
      setReason(null);
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      pulseScale.value = 1;
    }
  }, [isVisible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.8}
      />
    ),
    []
  );

  const REASONS = [
    { label: 'Boredom', emoji: '🥱' },
    { label: 'Anxiety', emoji: '😰' },
    { label: 'Work-Related', emoji: '💼' },
    { label: 'Procrastinating', emoji: '🙈' },
  ];

  const handleReasonSelect = (r: string) => {
    Haptics.selectionAsync();
    setReason(r);
  };

  const timerCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    borderColor: countdown > 0 ? WARNING : ACCENT,
  }));

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={countdown === 0}
      backgroundStyle={{ backgroundColor: SURFACE }}
      handleIndicatorStyle={{ backgroundColor: BORDER }}
    >
      <BottomSheetView style={s.content}>
        <View style={s.header}>
          <Text style={s.eyebrow}>Doom Loop Detected</Text>
          <Text style={s.title}>Take a breath.</Text>
        </View>

        <View style={s.timerContainer}>
          <Animated.View style={[s.timerCircle, timerCircleStyle]}>
            <Text style={s.timerText}>{countdown > 0 ? countdown : '✓'}</Text>
          </Animated.View>
        </View>

        <View style={s.questionSection}>
          <Text style={s.question}>What are you actually looking for?</Text>
          <View style={s.reasonGrid}>
            {REASONS.map((r) => (
              <TouchableOpacity 
                key={r.label}
                onPress={() => handleReasonSelect(r.label)}
                style={[
                  s.reasonItem, 
                  reason === r.label && s.selectedReason
                ]}
              >
                <Text style={s.reasonEmoji}>{r.emoji}</Text>
                <Text style={[s.reasonLabel, reason === r.label && s.selectedReasonLabel]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={s.footer}>
          {reason === 'Procrastinating' || reason === 'Boredom' ? (
            <Button 
              label="Start 5m Micro-Focus" 
              onPress={onStartMicroFocus}
              variant="primary"
              style={s.mainButton}
            />
          ) : (
            <Button 
              label="Continue with Intention" 
              onPress={onDismiss}
              disabled={countdown > 0 || !reason}
              variant={countdown > 0 || !reason ? 'secondary' : 'primary'}
              style={s.mainButton}
            />
          )}
          
          <TouchableOpacity onPress={onDismiss} style={s.skipButton}>
            <Text style={s.skipText}>I changed my mind, put the phone down</Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: WARNING,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_PRIMARY,
  },
  timerContainer: {
    marginVertical: 20,
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: '800',
    color: TEXT_PRIMARY,
  },
  questionSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  question: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  selectedReason: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderColor: ACCENT,
  },
  reasonEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  selectedReasonLabel: {
    color: TEXT_PRIMARY,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
  },
  mainButton: {
    width: '100%',
    marginBottom: 16,
  },
  skipButton: {
    alignItems: 'center',
    padding: 8,
  },
  skipText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
  }
});
