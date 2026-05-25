import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  Layout
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/Text';
import { useAICoach } from '@/hooks/useAICoach';
import { 
  BG, 
  ACCENT, 
  SURFACE, 
  SURFACE2, 
  BORDER, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  ACCENT_DIM,
  ON_ACCENT
} from '@/lib/theme';
import { Sparkles, ChevronLeft } from 'lucide-react-native';

export default function CoachChatScreen() {
  const insets = useSafeAreaInsets();
  const { messages, isTyping, sendMessage } = useAICoach();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendMessage(inputText.trim());
    setInputText('');
  };

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <View className="flex-1 bg-background">
      {/* Custom Header */}
      <View 
        className="flex-row items-center justify-between px-4 pb-4 border-b border-accent/5"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <ChevronLeft size={24} color={ACCENT} />
        </Pressable>
        <View className="items-center">
          <Text className="font-outfit-bold text-[20px] text-accent">Claude Coach</Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <View className="w-1.5 h-1.5 rounded-full bg-success" />
            <Text className="font-mono text-[10px] text-accent/60 uppercase tracking-widest">Premium AI</Text>
          </View>
        </View>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          ref={scrollRef}
          contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <Animated.View entering={FadeInDown.delay(200)} className="bg-surface rounded-[2rem] p-8 border border-white/5 items-center mb-10">
              <View className="w-16 h-16 rounded-full bg-surface2 items-center justify-center mb-6">
                <Sparkles size={32} color={ACCENT} />
              </View>
              <Text className="font-outfit-bold text-[24px] text-accent mb-2 text-center">Behavioral Coaching</Text>
              <Text className="font-outfit text-[15px] text-accent/60 text-center leading-6 mb-8">
                I'm Claude. I have access to your focus patterns and digital nursery progress. 
                How can I help you refine your growth today?
              </Text>
              <View className="w-full gap-3">
                {['Analyze my focus patterns', 'How to reduce screen time?', 'Suggest a session duration'].map((text) => (
                  <Pressable 
                    key={text}
                    onPress={() => {
                      setInputText(text);
                      Haptics.selectionAsync();
                    }}
                    className="bg-surface2/50 px-6 py-4 rounded-xl border border-white/5 active:bg-surface2"
                  >
                    <Text className="font-mono text-[13px] text-accent text-center">{text}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {messages.map((msg, idx) => (
            <Animated.View 
              key={msg.id}
              entering={FadeInUp.duration(400).springify()}
              layout={Layout.springify()}
              style={[
                s.messageWrap,
                msg.role === 'user' ? s.userWrap : s.botWrap
              ]}
            >
              <View className={`${
                msg.role === 'user' 
                  ? 'bg-accent rounded-t-[1.5rem] rounded-bl-[1.5rem]' 
                  : 'bg-surface2 rounded-t-[1.5rem] rounded-br-[1.5rem] border border-white/5'
                } max-w-[85%] px-5 py-4 mb-4`}
              >
                <Text className={`font-outfit text-[16px] leading-6 ${
                  msg.role === 'user' ? 'text-background' : 'text-accent'
                }`}>
                  {msg.content}
                </Text>
              </View>
            </Animated.View>
          ))}

          {isTyping && (
            <Animated.View entering={FadeInUp} style={s.botWrap}>
              <View className="bg-surface2 rounded-t-[1.5rem] rounded-br-[1.5rem] border border-white/5 px-5 py-4 mb-4">
                <ActivityIndicator size="small" color={ACCENT} />
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View 
            className="px-4 pt-3 bg-background border-t border-accent/5"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <View className="flex-row items-end bg-surface rounded-[24px] px-4 py-2 gap-2.5 border border-accent/10">
            <TextInput 
              style={s.input}
              placeholder="Ask anything..."
              placeholderTextColor={TEXT_TERTIARY}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <Pressable 
              onPress={handleSend}
              disabled={!inputText.trim() || isTyping}
              className={`w-9 h-9 rounded-full items-center justify-center mb-1 ${
                (!inputText.trim() || isTyping) ? 'bg-accent/40' : 'bg-accent'
              }`}
            >
              <Ionicons name="arrow-up" size={20} color={ON_ACCENT} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  messageWrap: {
    width: '100%',
    flexDirection: 'row',
  },
  userWrap: {
    justifyContent: 'flex-end',
  },
  botWrap: {
    justifyContent: 'flex-start',
  },
  input: {
    flex: 1,
    color: TEXT_PRIMARY,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    fontFamily: 'Outfit_400Regular',
  },
});
