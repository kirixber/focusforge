import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { LucideIcon, Play, Square, Activity } from 'lucide-react-native';
import { ACCENT, SURFACE, SURFACE2 } from '@/lib/theme';

interface SoundscapeCardProps {
  label: string;
  volume: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

export function SoundscapeCard({ label, volume, icon: Icon, isActive, onPress }: SoundscapeCardProps) {
  return (
    <Pressable 
      onPress={onPress}
      className={`relative w-full rounded-xl p-5 border flex-row items-center justify-between overflow-hidden ${
        isActive ? 'bg-surface border-white/10' : 'bg-surface/40 border-white/5'
      }`}
    >
      {isActive && (
        <View className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
      )}
      
      <View className="flex-row items-center gap-4">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${
          isActive ? 'bg-background' : 'bg-surface'
        }`}>
          <Icon size={20} color={isActive ? ACCENT : ACCENT} opacity={isActive ? 1 : 0.6} />
        </View>
        <View>
          <Text className={`font-outfit text-[18px] ${isActive ? 'text-accent' : 'text-accent/60'}`}>
            {label}
          </Text>
          <Text className="font-mono text-[12px] text-accent/40 uppercase tracking-widest">
            {isActive ? `${volume}% Volume` : 'Paused'}
          </Text>
        </View>
      </View>

      {isActive ? (
        <Activity size={20} color={ACCENT} />
      ) : (
        <Play size={20} color={ACCENT} opacity={0.4} />
      )}
    </Pressable>
  );
}
