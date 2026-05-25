import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface FocusScoreProps {
  score: number;
}

export function FocusScore({ score }: FocusScoreProps) {
  return (
    <View className="flex flex-col">
      <Text className="font-mono text-[14px] text-accent/60 uppercase tracking-[0.2em] mb-1">
        Focus Score
      </Text>
      <Text className="font-mono-semibold text-[80px] leading-none text-accent">
        {score}
      </Text>
    </View>
  );
}
