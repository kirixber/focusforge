import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { TrendingUp } from 'lucide-react-native';
import { ACCENT, SURFACE2 } from '@/lib/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface WeeklyVitalityProps {
  totalHours: string;
  trend: string;
  data: number[]; // 0 to 100
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function WeeklyVitalityChart({ totalHours, trend, data }: WeeklyVitalityProps) {
  return (
    <View className="bg-surface rounded-[1.5rem] p-8 border border-white/5 relative overflow-hidden">
      <View className="flex-row justify-between items-start mb-8 relative z-10">
        <View>
          <Text className="font-outfit-bold text-[24px] text-accent mb-1">Weekly Vitality</Text>
          <Text className="font-mono text-[14px] text-accent/60">Hours focused per day</Text>
        </View>
        <View className="items-end">
          <Text className="font-mono-semibold text-[24px] text-accent">{totalHours}</Text>
          <View className="flex-row items-center gap-1 mt-1">
            <TrendingUp size={14} color="#aef1c9" />
            <Text className="font-mono text-[14px] text-accent/70">{trend}</Text>
          </View>
        </View>
      </View>

      <View className="h-[200px] flex-row items-end justify-between gap-2 relative z-10 mt-4 pb-6 border-b border-white/10">
        {data.map((height, i) => (
          <View key={i} className="flex-1 flex-col items-center gap-3">
             <Animated.View 
               entering={FadeInUp.delay(i * 100)}
               style={{ height: `${height}%` }}
               className={`w-full max-w-[40px] rounded-t-lg relative overflow-hidden ${
                 i === 2 ? 'bg-accent' : 'bg-surface2'
               }`}
             >
                <View 
                  style={{ height: '100%' }} 
                  className={`absolute bottom-0 w-full ${i === 2 ? 'bg-accent' : 'bg-accent/40'} rounded-t-sm`} 
                />
             </Animated.View>
             <Text className={`font-mono text-[12px] ${i === 2 ? 'text-accent' : 'text-accent/60'}`}>
                {DAYS[i]}
             </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
