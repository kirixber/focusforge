import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import Svg, { Circle } from 'react-native-svg';
import { BrainCircuit } from 'lucide-react-native';
import { ACCENT, SURFACE2 } from '@/lib/theme';

interface RadialTimerProps {
  remainingTime: number; // ms
  progress: number; // 0 to 1
  mode: string;
}

export function RadialTimer({ remainingTime, progress, mode }: RadialTimerProps) {
  // Format ms to MM:SS
  const totalSeconds = Math.max(0, Math.floor(remainingTime / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="relative w-[320px] h-[320px] items-center justify-center">
      {/* Outer Glow/Shadow */}
      <View className="absolute inset-0 rounded-full bg-accent/5 blur-3xl" />
      
      <Svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
        {/* Track */}
        <Circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={SURFACE2}
          strokeWidth="2"
        />
        {/* Progress */}
        <Circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={ACCENT}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Inner Timer Display */}
      <View className="absolute items-center justify-center text-center">
        <Text className="font-mono text-[14px] text-accent/60 uppercase tracking-[0.2em] mb-2">
          {mode}
        </Text>
        <Text className="font-mono-semibold text-[64px] text-accent leading-none">
          {timeString}
        </Text>
        <View className="flex-row items-center gap-2 mt-4">
          <BrainCircuit size={14} color={ACCENT} opacity={0.7} />
          <Text className="font-mono text-[14px] text-accent/70">
            Mental Peace
          </Text>
        </View>
      </View>
    </View>
  );
}
