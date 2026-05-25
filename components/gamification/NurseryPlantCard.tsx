import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lock, CheckCircle2, Sprout, ArrowRight } from 'lucide-react-native';
import { ACCENT, SURFACE, SURFACE2, MUTED } from '@/lib/theme';

interface NurseryPlantCardProps {
  name: string;
  description: string;
  cost: number;
  imageUrl: string;
  status: 'active' | 'claimable' | 'locked';
  onPress?: () => void;
}

export function NurseryPlantCard({ name, description, cost, imageUrl, status, onPress }: NurseryPlantCardProps) {
  const isLocked = status === 'locked';
  const isActive = status === 'active';
  const isClaimable = status === 'claimable';

  return (
    <View 
      className={`bg-surface rounded-[1.5rem] border overflow-hidden flex-col ${
        isClaimable ? 'border-accent/20 shadow-2xl' : 'border-white/5'
      } ${isLocked ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <View className="h-48 bg-background relative overflow-hidden items-center justify-center">
        <Image 
          source={{ uri: imageUrl }} 
          className={`w-full h-full object-cover ${isLocked ? 'opacity-50' : ''}`} 
        />
        {isLocked && (
          <View className="absolute inset-0 items-center justify-center">
            <View className="w-12 h-12 rounded-full bg-surface/80 items-center justify-center border border-white/10">
              <Lock size={24} color={MUTED} />
            </View>
          </View>
        )}
      </View>

      <View className="p-6 flex-grow flex-col justify-between -mt-8 bg-surface rounded-t-xl">
        <View>
          <View className="flex-row justify-between items-start mb-2">
            <Text className={`font-outfit-bold text-[24px] ${isLocked ? 'text-muted' : 'text-accent'}`}>
              {name}
            </Text>
            {isActive ? (
              <CheckCircle2 size={24} color={ACCENT} />
            ) : (
              <View className="bg-surface2 px-2 py-1 rounded-md flex-row items-center gap-1">
                <Text className={`font-mono text-[12px] ${isLocked ? 'text-muted' : 'text-accent'}`}>
                   {cost}
                </Text>
              </View>
            )}
          </View>
          <Text className={`font-outfit text-[14px] mb-4 ${isLocked ? 'text-muted' : 'text-accent/60'}`}>
            {description}
          </Text>
        </View>

        {isActive && (
          <View className="w-full py-3 rounded-lg bg-surface2 items-center justify-center border border-white/5">
            <Text className="font-mono text-[12px] text-accent/60 uppercase">Active in Garden</Text>
          </View>
        )}

        {isClaimable && (
          <TouchableOpacity 
            onPress={onPress}
            className="w-full py-3 rounded-lg bg-accent items-center justify-center flex-row gap-2"
          >
            <Text className="font-mono-semibold text-[12px] text-background uppercase">Claim Reward</Text>
            <ArrowRight size={18} color="#023A22" />
          </TouchableOpacity>
        )}

        {isLocked && (
          <View className="w-full py-3 rounded-lg bg-surface2/50 items-center justify-center border border-white/5">
            <Text className="font-mono text-[12px] text-muted uppercase">Locked</Text>
          </View>
        )}
      </View>
    </View>
  );
}
