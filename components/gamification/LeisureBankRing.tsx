import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { Text } from '../ui/Text';
import { ACCENT, ACCENT_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, BORDER } from '@/lib/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LeisureBankRingProps {
  balance: number;
  goal?: number;
  size?: number;
  strokeWidth?: number;
}

/**
 * A high-performance, animated progress ring for the Earned Time Bank.
 * Designed for 60FPS fluidity on low-spec phones using Reanimated worklets.
 */
export const LeisureBankRing: React.FC<LeisureBankRingProps> = React.memo(({ 
  balance, 
  goal = 60, // Default 1 hour goal for visual reference
  size = 180, 
  strokeWidth = 14 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = useSharedValue(0);
  
  useEffect(() => {
    const targetProgress = Math.min(balance / goal, 1);
    progress.value = withTiming(targetProgress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [balance, goal]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  // Format balance for display
  const hours = Math.floor(balance / 60);
  const minutes = Math.floor(balance % 60);
  const timeLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <View style={[s.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={ACCENT_LIGHT} />
            <Stop offset="100%" stopColor={ACCENT} />
          </LinearGradient>
        </Defs>
        
        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={BORDER}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Animated Progress Path */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#ringGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      
      {/* Central Label */}
      <View style={StyleSheet.absoluteFill}>
        <View style={s.labelContainer}>
          <Text style={s.value}>{timeLabel}</Text>
          <Text style={s.subLabel}>Guilt-Free Time</Text>
        </View>
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
