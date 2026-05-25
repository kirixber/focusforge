import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloudRain, Trees, Waves, StopCircle, PersonStanding, Settings, BrainCircuit } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { RadialTimer } from '@/components/focus/RadialTimer';
import { SoundscapeCard } from '@/components/focus/SoundscapeCard';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { useFocus } from '@/contexts/FocusContext';
import { ACCENT, BG, SURFACE, ERROR } from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const SOUNDSCAPES = [
  { id: 'rain', label: 'Heavy Rain', volume: '70', icon: CloudRain },
  { id: 'forest', label: 'Deep Forest', volume: '0', icon: Trees },
  { id: 'white_noise', label: 'White Noise', volume: '0', icon: Waves },
];

export default function FocusScreen() {
  const insets = useSafeAreaInsets();
  const { 
    activeSession, 
    remainingTime, 
    progress, 
    stopSession,
    startSession 
  } = useFocus();

  const [activeSoundscape, setActiveSoundscape] = useState('rain');

  if (activeSession) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <ScrollView 
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingBottom: TAB_BAR_CLEARANCE + 32,
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="w-full flex-row justify-between items-center py-4 mb-8">
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

          {/* Timer Area */}
          <Animated.View entering={FadeIn.duration(800)} className="items-center justify-center min-h-[500px]">
             <RadialTimer 
                remainingTime={remainingTime} 
                progress={progress} 
                mode="Deep Work" 
             />

             {/* End Session Button */}
             <TouchableOpacity 
                onPress={stopSession}
                className="mt-16 bg-surface/80 px-10 py-4 rounded-full border border-white/5 shadow-2xl overflow-hidden"
             >
                <View className="flex-row items-center gap-3">
                   <StopCircle size={20} color={ERROR} />
                   <Text className="font-mono text-[14px] text-red-400 uppercase tracking-[0.2em] font-bold">
                      End Session
                   </Text>
                </View>
             </TouchableOpacity>
          </Animated.View>

          {/* Soundscapes */}
          <Animated.View entering={FadeInDown.delay(300)} className="w-full mt-12">
             <Text className="font-outfit-bold text-[24px] text-accent mb-8 border-b border-white/5 pb-4">
                Soundscape
             </Text>
             <View className="flex-col gap-4">
                {SOUNDSCAPES.map((s) => (
                   <SoundscapeCard 
                      key={s.id}
                      label={s.label}
                      volume={s.volume}
                      icon={s.icon}
                      isActive={activeSoundscape === s.id}
                      onPress={() => setActiveSoundscape(s.id)}
                   />
                ))}
             </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // IDLE State: Show a "Ready to start" view matching the high-fidelity aesthetic
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center px-12">
        <Animated.View entering={FadeInDown.duration(800)} className="items-center">
            <View className="w-24 h-24 rounded-full bg-surface2 items-center justify-center mb-8 shadow-2xl border-4 border-accent/20">
                <BrainCircuit size={48} color={ACCENT} />
            </View>
            <Text className="font-outfit-bold text-[32px] text-accent text-center mb-4">
                Ready to Grow?
            </Text>
            <Text className="font-outfit text-[16px] text-accent/60 text-center mb-12">
                Plant a focus session and watch your digital garden flourish.
            </Text>
            <LuxuryButton 
                label="Start 25m Session"
                onPress={() => startSession('pomodoro', 25)}
                className="w-full"
            />
        </Animated.View>
      </View>
    </View>
  );
}
