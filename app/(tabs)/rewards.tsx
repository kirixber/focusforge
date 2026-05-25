import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LucideIcon, PersonStanding, Settings, Sprout } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { NurseryPlantCard } from '@/components/gamification/NurseryPlantCard';
import { ACCENT, BG, SURFACE, SURFACE2, MUTED } from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PLANTS = [
  { 
    id: '1', 
    name: 'Jade Shrub', 
    description: 'A resilient succulent representing enduring focus.', 
    cost: 0, 
    status: 'active' as const,
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '2', 
    name: 'Monstera', 
    description: 'Expansive growth. Requires dedicated deep work sessions.', 
    cost: 500, 
    status: 'claimable' as const,
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '3', 
    name: 'Bonsai Pine', 
    description: 'Mastery and patience. Unlock at Conservatory Level 5.', 
    cost: 1200, 
    status: 'locked' as const,
    imageUrl: 'https://images.unsplash.com/photo-1512428813833-df52165a59b8?auto=format&fit=crop&q=80&w=400'
  },
];

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'Locked', 'Active'];

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

      {/* Nursery Header */}
      <Animated.View entering={FadeInDown.duration(800)} className="mb-12">
        <Text className="font-outfit-bold text-[56px] leading-[1.1] text-accent mb-2">
          Nursery
        </Text>
        <Text className="font-outfit text-[18px] text-accent/60 mb-8">
          Cultivate your mind, grow your garden.
        </Text>

        <View className="bg-surface rounded-xl p-4 border border-white/5 flex-row items-center gap-3 self-start">
            <Sprout size={20} color="#92d5ae" />
            <View>
                <Text className="font-mono text-[10px] text-accent/60 uppercase">Available Tokens</Text>
                <Text className="font-mono-semibold text-[18px] text-accent">1,240</Text>
            </View>
        </View>
      </Animated.View>

      {/* Garden Progress */}
      <View className="bg-surface rounded-[1.5rem] p-6 border border-white/5 mb-12 relative overflow-hidden">
        <Text className="font-mono text-[12px] text-accent/60 mb-6 uppercase tracking-widest">Garden Progress</Text>
        <View className="flex-col gap-6">
            <View>
                <View className="flex-row justify-between mb-2">
                    <Text className="font-outfit text-[14px] text-accent">Species Unlocked</Text>
                    <Text className="font-mono-semibold text-[16px] text-accent">8/24</Text>
                </View>
                <View className="h-1 bg-background rounded-full overflow-hidden">
                    <View className="h-full bg-accent w-1/3 rounded-full" />
                </View>
            </View>
            <View>
                <View className="flex-row justify-between mb-2">
                    <Text className="font-outfit text-[14px] text-accent">Conservatory Level</Text>
                    <Text className="font-mono-semibold text-[16px] text-accent">3</Text>
                </View>
                <View className="h-1 bg-background rounded-full overflow-hidden">
                    <View style={{ opacity: 0.6 }} className="h-full bg-accent w-3/4 rounded-full" />
                </View>
            </View>
        </View>
      </View>

      {/* Available Species */}
      <View className="mb-8 flex-row justify-between items-end border-b border-white/5 pb-4">
        <Text className="font-outfit-bold text-[28px] text-accent">Species</Text>
        <View className="flex-row gap-2">
            {FILTERS.map(f => (
                <TouchableOpacity 
                    key={f} 
                    onPress={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg ${filter === f ? 'bg-accent/10 border border-accent/20' : ''}`}
                >
                    <Text className={`font-mono text-[12px] ${filter === f ? 'text-accent' : 'text-accent/40'}`}>{f}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </View>

      <View className="flex-col gap-6">
        {PLANTS.map(plant => (
          <NurseryPlantCard 
            key={plant.id}
            name={plant.name}
            description={plant.description}
            cost={plant.cost}
            imageUrl={plant.imageUrl}
            status={plant.status}
          />
        ))}
      </View>
    </ScrollView>
  );
}
