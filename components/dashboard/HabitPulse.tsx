import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface HabitPulseProps {
  deepWorkTime: string;
  distractionsTime: string;
  deepWorkPercent: number;
  distractionsPercent: number;
}

export function HabitPulse({ 
  deepWorkTime, 
  distractionsTime, 
  deepWorkPercent, 
  distractionsPercent 
}: HabitPulseProps) {
  return (
    <View className="bg-surface rounded-[1.5rem] p-8 border border-white/5 flex-col gap-6">
      <Text className="font-mono text-[14px] text-accent/60 uppercase tracking-[0.2em]">
        Habit Pulse
      </Text>
      
      <View className="flex-col gap-8">
        {/* Deep Work */}
        <View>
          <View className="flex-row justify-between items-end mb-2">
            <Text className="font-outfit text-[16px] text-accent/90">Deep Work</Text>
            <Text className="font-mono-semibold text-[20px] text-accent">{deepWorkTime}</Text>
          </View>
          <View className="w-full h-1 bg-background rounded-full overflow-hidden">
            <View 
              style={{ width: `${deepWorkPercent}%` }} 
              className="h-full bg-accent rounded-full" 
            />
          </View>
        </View>

        {/* Distractions */}
        <View>
          <View className="flex-row justify-between items-end mb-2">
            <Text className="font-outfit text-[16px] text-accent/90">Distractions</Text>
            <Text className="font-mono-semibold text-[20px] text-muted">{distractionsTime}</Text>
          </View>
          <View className="w-full h-1 bg-background rounded-full overflow-hidden">
            <View 
              style={{ width: `${distractionsPercent}%` }} 
              className="h-full bg-muted rounded-full" 
            />
          </View>
        </View>

        {/* Weekly Trend Mock */}
        <View className="mt-4 pt-6 border-t border-white/5">
          <Text className="font-mono text-[12px] text-accent/40 uppercase tracking-widest mb-4">
            Weekly Trend
          </Text>
          <View className="h-24 w-full flex-row items-end justify-between">
            {[40, 60, 85, 50, 70, 30, 100].map((height, i) => (
              <View 
                key={i}
                style={{ height: `${height}%` }}
                className={`w-[12%] rounded-t-sm ${i === 6 ? 'bg-accent' : 'bg-surface2'}`}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
