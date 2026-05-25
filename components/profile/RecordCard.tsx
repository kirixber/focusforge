import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { LucideIcon } from 'lucide-react-native';
import { ACCENT, SURFACE, SURFACE2 } from '@/lib/theme';

interface RecordCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'surface';
}

export function RecordCard({ label, value, unit, icon: Icon, variant = 'surface' }: RecordCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <View 
      className={`p-6 rounded-[1.5rem] border border-white/5 flex-col justify-between h-40 ${
        isPrimary ? 'bg-surface2/40' : 'bg-surface/80'
      }`}
    >
      <View className="flex-row items-center gap-3">
        <Icon size={20} color={isPrimary ? ACCENT : ACCENT} opacity={isPrimary ? 1 : 0.6} />
        <Text className="font-mono text-[12px] text-accent/60 uppercase tracking-widest">{label}</Text>
      </View>
      <View className="mt-auto flex-row items-end gap-2">
        <Text className={`font-mono-semibold text-[24px] ${isPrimary ? 'text-accent' : 'text-accent'}`}>
            {value}
        </Text>
        {unit && (
          <Text className="font-outfit text-[14px] text-accent/50 pb-1">{unit}</Text>
        )}
      </View>
    </View>
  );
}
