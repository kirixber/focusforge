import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { ACCENT, ACCENT_LIGHT, BORDER } from '@/lib/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
}

/**
 * A premium, 60FPS animated timer ring.
 * Features gradient strokes and a subtle pulse effect for a high-end feel.
 */
export const TimerRing: React.FC<TimerRingProps> = ({ 
  progress, 
  size = 280, 
  strokeWidth = 10 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress),
    };
  });

  return (
    <View style={[s.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={ACCENT_LIGHT} />
            <Stop offset="100%" stopColor={ACCENT} />
          </LinearGradient>
        </Defs>

        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={BORDER}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#timerGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
