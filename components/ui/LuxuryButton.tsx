import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LuxuryButtonProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export function LuxuryButton({ label, icon, onPress, className = '' }: LuxuryButtonProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress}
      className={`relative rounded-xl overflow-hidden ${className}`}
    >
      <View className="bg-surface2 px-8 py-5 flex-row items-center justify-center border border-white/5">
        {/* Glossy Overlay (Top 50%) */}
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
          className="absolute top-0 left-0 right-0 h-1/2"
        />
        
        {icon && (
          <View className="mr-3">
             {icon}
          </View>
        )}
        
        <Text className="font-mono text-[14px] text-white uppercase tracking-[0.2em]">
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
