import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LucideIcon, PersonStanding, Settings, Flame, CheckCircle2 } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { WeeklyVitalityChart } from '@/components/charts/WeeklyVitalityChart';
import { FocusDistributionRings } from '@/components/charts/FocusDistributionRings';
import { ACCENT, BG, SURFACE } from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState('Weekly');

  const RANGES = ['Weekly', 'Monthly', 'All Time'];

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ 
        paddingTop: insets.top + 16, 
        paddingBottom: TAB_BAR_CLEARANCE + 32,
        paddingHorizontal: 24 
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-white/10">
            <PersonStanding size={20} color={ACCENT} />
          </View>
          <Text className="font-outfit-bold text-[24px] text-accent">FocusForge</Text>
        </View>
        <Pressable 
          onPress={() => router.push('/settings')}
          className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-white/5"
        >
          <Settings size={20} color={ACCENT} />
        </Pressable>
      </View>

      {/* Analytics Header */}
      <Animated.View entering={FadeInDown.duration(800)} className="mb-12">
        <Text className="font-outfit-bold text-[56px] leading-[1.1] text-accent mb-2">
          Analytics
        </Text>
        <Text className="font-outfit text-[18px] text-accent/60">
          Tracking your growth in the quiet hours.
        </Text>

        <View className="flex-row bg-surface rounded-full p-1 mt-8 self-start w-full md:w-auto">
          {RANGES.map((r) => (
            <TouchableOpacity 
              key={r}
              onPress={() => setRange(r)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-full ${
                range === r ? 'bg-accent' : ''
              }`}
            >
              <Text className={`font-mono text-[14px] text-center ${
                range === r ? 'text-background font-bold' : 'text-accent/60'
              }`}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Charts Grid */}
      <View className="flex-col gap-8">
        <WeeklyVitalityChart 
          totalHours="32.4h"
          trend="+12%"
          data={[40, 65, 100, 45, 80, 25, 30]}
        />

        <View className="flex-row gap-4">
          <View className="flex-1 bg-surface rounded-[1.5rem] p-6 border border-white/5 flex-row items-center justify-between">
            <View>
              <Text className="font-mono text-[12px] text-accent/60 mb-2 uppercase tracking-widest">Streak</Text>
              <Text className="font-mono-semibold text-[24px] text-accent">5 Days</Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-surface2 items-center justify-center">
              <Flame size={20} color={ACCENT} />
            </View>
          </View>
          <View className="flex-1 bg-surface rounded-[1.5rem] p-6 border border-white/5 flex-row items-center justify-between">
            <View>
              <Text className="font-mono text-[12px] text-accent/60 mb-2 uppercase tracking-widest">Rate</Text>
              <Text className="font-mono-semibold text-[24px] text-accent">92%</Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-surface2 items-center justify-center">
              <CheckCircle2 size={20} color={ACCENT} />
            </View>
          </View>
        </View>

        <View className="h-[450px]">
            <FocusDistributionRings 
                percentage={65}
                dominantLabel="Work Dominant"
                legend={[
                    { label: 'Work', time: '18h 30m', color: ACCENT },
                    { label: 'Education', time: '9h 15m', color: '#92d5ae' },
                    { label: 'Social', time: '4h 45m', color: '#003a23' },
                ]}
            />
        </View>
      </View>
    </ScrollView>
  );
}
