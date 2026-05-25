import React, { useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { LucideIcon, Sprout, PersonStanding, Sparkles, Flame, BrainCircuit, Leaf } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { FocusScore } from '@/components/dashboard/FocusScore';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { PlantCard } from '@/components/dashboard/PlantCard';
import { HabitPulse } from '@/components/dashboard/HabitPulse';
import {
    ACCENT,
    BG,
    SURFACE,
} from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';
import { useProfile } from '@/hooks/useProfile';
import { useUsage } from '@/contexts/UsageContext';
import Animated, { 
    FadeInDown, 
    FadeIn,
} from 'react-native-reanimated';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    
    const { data: profile } = useProfile();
    const { bank } = useUsage();
    const todayUsageMinutes = 125; // Mocked for now

    const onRefresh = async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({ queryKey: ['profile'] });
        await queryClient.invalidateQueries({ queryKey: ['usage'] });
        setRefreshing(false);
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ 
                paddingTop: insets.top + 16, 
                paddingBottom: TAB_BAR_CLEARANCE + 32,
                paddingHorizontal: 24 
            }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />}
            showsVerticalScrollIndicator={false}
        >
            {/* Top AppBar */}
            <View className="flex-row justify-between items-center mb-8">
                <View className="flex-row items-center gap-3">
                    <Sprout size={28} color={ACCENT} />
                    <Text className="font-outfit-bold text-[24px] text-accent tracking-tighter">
                        FocusForge
                    </Text>
                </View>
                <View className="flex-row items-center gap-3">
                    <Pressable 
                        onPress={() => router.push('/coach')}
                        className="w-10 h-10 rounded-full bg-surface2 items-center justify-center border border-accent/20 shadow-lg active:scale-90 transition-transform"
                    >
                        <Sparkles size={20} color={ACCENT} />
                    </Pressable>
                    <Pressable 
                        onPress={() => router.push('/settings')}
                        className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-white/5"
                    >
                        <PersonStanding size={20} color={ACCENT} />
                    </Pressable>
                </View>
            </View>

            {/* Hero Section */}
            <Animated.View entering={FadeInDown.duration(800).springify()} className="mb-12">
                <View className="flex-row items-center mb-6">
                    <Text className="font-outfit-bold text-[56px] leading-[1.1] text-accent">
                        Cultivate{"\n"}
                        <Text className="relative">
                            Your Growth
                        </Text>
                    </Text>
                    {/* Botanical Puncture Decorative Image */}
                    <View className="ml-4 w-20 h-20 rounded-full overflow-hidden border-2 border-surface2 shadow-xl opacity-80">
                         <View className="flex-1 bg-surface2 items-center justify-center">
                            <Leaf size={32} color={ACCENT} opacity={0.6} />
                         </View>
                    </View>
                </View>

                <FocusScore score={84} /> 
            </Animated.View>

            {/* Action Section */}
            <Animated.View entering={FadeIn.delay(300)} className="mb-12">
                <LuxuryButton 
                    label="Enter Deep Work" 
                    icon={<BrainCircuit size={20} color="white" />}
                    onPress={() => router.push('/focus')}
                    className="w-full sm:w-auto"
                />
            </Animated.View>

            {/* Active Plants Section */}
            <Animated.View entering={FadeInDown.delay(500)} className="mb-12">
                <Text className="font-outfit-bold text-[28px] text-accent/90 mb-6">
                    Active Plants
                </Text>
                <View className="flex-col gap-6">
                    <PlantCard 
                        name="Monstera Deliciosa"
                        type="Focus Session"
                        duration="45m"
                        color="#9ed2b0"
                    />
                    <PlantCard 
                        name="Ficus Lyrata"
                        type="Reading"
                        duration="12m"
                        color="#566B5E"
                        delay={-4}
                    />
                </View>
            </Animated.View>

            {/* Habit Pulse Section */}
            <Animated.View entering={FadeInDown.delay(700)}>
                <HabitPulse 
                    deepWorkTime="4h 20m"
                    distractionsTime="1h 15m"
                    deepWorkPercent={75}
                    distractionsPercent={25}
                />
            </Animated.View>

        </ScrollView>
    );
}
