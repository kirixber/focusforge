import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LucideIcon, PersonStanding, Settings, Timer, Trees, Flame, Bell, Palette, RefreshCcw, LogOut, ChevronRight, Leaf } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { RecordCard } from '@/components/profile/RecordCard';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useColorScheme } from 'nativewind';
import { ACCENT, BG, SURFACE, MUTED, ERROR } from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';
import { supabase } from '@/lib/supabase';
import { logoutRevenueCat } from '@/lib/purchases';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile();
  const { isPremium } = useSubscription();
  const [signingOut, setSigningOut] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  async function handleSignOut() {
    setSigningOut(true);
    try {
        await logoutRevenueCat();
        await supabase.auth.signOut();
    } catch (e) {
        console.error(e);
    } finally {
        setSigningOut(false);
    }
  }

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
      {/* Top AppBar */}
      <View className="flex-row justify-between items-center mb-12">
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-white/10 overflow-hidden">
            {profile?.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} className="w-full h-full" />
            ) : (
                <PersonStanding size={20} color={ACCENT} />
            )}
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

      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(800)} className="flex-row items-center gap-8 mb-12">
        <View className="relative">
          <View className="w-32 h-32 rounded-full overflow-hidden border border-white/10 bg-surface items-center justify-center shadow-2xl">
            <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400' }} 
                className="w-full h-full object-cover" 
            />
          </View>
          <View className="absolute -bottom-2 -right-4 bg-accent px-4 py-2 rounded-full border border-background shadow-xl flex-row items-center gap-2">
            <Leaf size={14} color="#023A22" />
            <Text className="font-mono text-[10px] text-background uppercase font-bold">Master Gardener</Text>
          </View>
        </View>
        <View className="flex-1">
          <Text className="font-outfit-bold text-[40px] text-accent leading-none mb-2">Elena R.</Text>
          <Text className="font-outfit text-[14px] text-accent/60">Cultivating focus since Oct 2023. Growing deeper roots.</Text>
        </View>
      </Animated.View>

      {/* Personal Records */}
      <View className="mb-12">
        <Text className="font-outfit-bold text-[24px] text-accent mb-6">Personal Records</Text>
        <View className="flex-row flex-wrap gap-4">
            <View className="w-[47%]">
                <RecordCard 
                    label="Longest Session"
                    value="4h 12m"
                    icon={Timer}
                />
            </View>
            <View className="w-[47%]">
                <RecordCard 
                    label="Total Growth"
                    value="1,204"
                    unit="hrs"
                    icon={Trees}
                    variant="primary"
                />
            </View>
            <View className="w-[47%]">
                <RecordCard 
                    label="Current Streak"
                    value="14"
                    unit="days"
                    icon={Flame}
                />
            </View>
        </View>
      </View>

      {/* Preferences / Settings */}
      <View className="bg-surface rounded-[1.5rem] p-8 border border-white/5">
        <Text className="font-outfit-bold text-[24px] text-accent mb-8">Preferences</Text>
        <View className="flex-col gap-4">
            {[
                { label: 'Notifications', icon: Bell, action: () => {} },
                { 
                  label: 'Appearance', 
                  icon: Palette, 
                  right: colorScheme === 'dark' ? 'Dark' : 'Light', 
                  action: toggleColorScheme 
                },
                { label: 'Sync Data', icon: RefreshCcw, action: () => {} },
            ].map((item, i) => (
                <Pressable 
                    key={i}
                    onPress={item.action}
                    className="w-full bg-surface2 px-6 py-4 rounded-xl border border-white/5 flex-row justify-between items-center"
                >
                    <View className="flex-row items-center gap-4">
                        <item.icon size={20} color={ACCENT} />
                        <Text className="font-outfit text-[16px] text-accent">{item.label}</Text>
                    </View>
                    {item.right ? (
                        <View className="bg-background px-2 py-1 rounded">
                            <Text className="font-mono text-[10px] text-accent/60 uppercase">{item.right}</Text>
                        </View>
                    ) : (
                        <ChevronRight size={20} color={ACCENT} opacity={0.4} />
                    )}
                </Pressable>
            ))}

            <View className="mt-4 pt-8 border-t border-white/5">
                <TouchableOpacity 
                    onPress={handleSignOut}
                    disabled={signingOut}
                    className="w-full border border-red-500/20 py-4 rounded-xl items-center justify-center flex-row gap-3"
                >
                    <LogOut size={20} color="#ef4444" />
                    <Text className="font-outfit text-[16px] text-red-500">{signingOut ? 'Signing out...' : 'Sign Out'}</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>

    </ScrollView>
  );
}
