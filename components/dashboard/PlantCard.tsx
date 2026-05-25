import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

interface PlantCardProps {
  name: string;
  type: string;
  duration: string;
  color: string;
  delay?: number;
}

export function PlantCard({ name, type, duration, color, delay = 0 }: PlantCardProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-2, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="bg-surface rounded-[1.5rem] p-6 border border-white/5 flex-col gap-4 overflow-hidden">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="font-outfit-semibold text-[18px] text-accent">
            {name}
          </Text>
          <Text className="font-mono text-[12px] text-accent/60 uppercase tracking-widest mt-1">
            {type}
          </Text>
        </View>
        <Text className="font-mono-semibold text-[18px] text-accent/80">
          {duration}
        </Text>
      </View>

      <Animated.View style={animatedStyle} className="h-32 w-full mt-4 items-center justify-center">
        <Svg height="120" width="80" viewBox="0 0 80 120">
          <Path 
            d="M40 120C40 120 40 60 15 35C-5 15 15 0 15 0C15 0 40 25 40 50C40 75 40 120 40 120Z" 
            fill={color} 
            fillOpacity="0.3" 
          />
          <Path 
            d="M40 120C40 120 40 85 65 60C90 35 65 10 65 10C65 10 40 35 40 60C40 85 40 120 40 120Z" 
            fill={color} 
            fillOpacity="0.5" 
          />
          <Path 
            d="M40 120C40 120 40 40 40 20C40 0 40 0 40 0" 
            stroke={color} 
            strokeLinecap="round" 
            strokeWidth="4" 
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
