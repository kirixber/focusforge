import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import Svg, { Circle } from 'react-native-svg';
import { ACCENT, SURFACE2, SURFACE } from '@/lib/theme';

interface FocusDistributionProps {
  percentage: number;
  dominantLabel: string;
  legend: { label: string; time: string; color: string }[];
}

export function FocusDistributionRings({ percentage, dominantLabel, legend }: FocusDistributionProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <View className="bg-surface rounded-[1.5rem] p-8 border border-white/5 relative overflow-hidden h-full">
      <Text className="font-outfit-bold text-[24px] text-accent mb-8">Focus Distribution</Text>
      
      <View className="relative w-full aspect-square max-w-[240px] mx-auto mb-8 items-center justify-center">
        {/* Base Track */}
        <View className="absolute inset-0 rounded-full border-[12px] border-surface2" />
        
        <Svg height="240" width="240" viewBox="0 0 200 200" className="-rotate-90">
           {/* Work (Primary) */}
           <Circle
             cx="100"
             cy="100"
             r={radius}
             fill="none"
             stroke={ACCENT}
             strokeWidth="12"
             strokeDasharray={circumference}
             strokeDashoffset={circumference * 0.35}
             strokeLinecap="round"
           />
           {/* Education (Secondary) */}
           <Circle
             cx="100"
             cy="100"
             r={radius}
             fill="none"
             stroke="#92d5ae"
             strokeWidth="12"
             strokeDasharray={circumference}
             strokeDashoffset={circumference * 0.85}
             strokeLinecap="round"
             transform="rotate(45 100 100)"
           />
        </Svg>

        {/* Inner Content */}
        <View className="absolute inset-[40px] bg-surface rounded-full items-center justify-center border border-white/5">
          <Text className="font-mono-semibold text-[32px] text-accent leading-none">{percentage}%</Text>
          <Text className="font-mono text-[12px] text-accent/70 mt-2 text-center">{dominantLabel}</Text>
        </View>
      </View>

      {/* Legend */}
      <View className="mt-auto space-y-4">
        {legend.map((item, i) => (
          <View key={i} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View style={{ backgroundColor: item.color }} className="w-3 h-3 rounded-full" />
              <Text className="font-mono text-[14px] text-accent">{item.label}</Text>
            </View>
            <Text className="font-mono text-[14px] text-accent/60">{item.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
