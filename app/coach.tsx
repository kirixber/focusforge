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
  ACCENT_DIM
} from '@/lib/theme';

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
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* Custom Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>Claude Coach</Text>
          <View style={s.statusRow}>
            <View style={s.onlineDot} />
            <Text style={s.statusText}>Premium AI</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          ref={scrollRef}
          contentContainerStyle={[s.chatContent, { paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <Animated.View entering={FadeInDown.delay(200)} style={s.welcomeCard}>
              <View style={s.iconWrap}>
                <Ionicons name="sparkles" size={32} color={ACCENT} />
              </View>
              <Text style={s.welcomeTitle}>Deep Behavioral Coaching</Text>
              <Text style={s.welcomeDesc}>
                I'm Claude. I have access to your focus patterns and mood logs. 
                How can I help you explore your focus today?
              </Text>
              <View style={s.suggestionGrid}>
                {['Why do I scroll on Sundays?', 'How can I stay focused longer?', 'Analyze my recent moods'].map((text) => (
                  <Pressable 
                    key={text}
                    onPress={() => {
                      setInputText(text);
                      Haptics.selectionAsync();
                    }}
                    style={s.suggestionBtn}
                  >
                    <Text style={s.suggestionText}>{text}</Text>
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
              <View style={[
                s.bubble,
                msg.role === 'user' ? s.userBubble : s.botBubble
              ]}>
                <Text style={[
                  s.messageText,
                  msg.role === 'user' ? s.userText : s.botText
                ]}>
                  {msg.content}
                </Text>
              </View>
            </Animated.View>
          ))}

          {isTyping && (
            <Animated.View entering={FadeInUp} style={s.botWrap}>
              <View style={[s.bubble, s.botBubble, s.typingBubble]}>
                <ActivityIndicator size="small" color={ACCENT} />
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[s.inputArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={s.inputContainer}>
            <TextInput 
              style={s.input}
              placeholder="Ask anything..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <Pressable 
              onPress={handleSend}
              disabled={!inputText.trim() || isTyping}
              style={[
                s.sendBtn,
                (!inputText.trim() || isTyping) && { opacity: 0.5 }
              ]}
            >
              <Ionicons name="arrow-up" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_PRIMARY,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chatContent: {
    padding: 20,
    gap: 16,
  },
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
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: ACCENT,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: SURFACE2,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  typingBubble: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
    fontWeight: '500',
  },
  botText: {
    color: TEXT_PRIMARY,
  },
  welcomeCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.1)',
    marginBottom: 20,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDesc: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  suggestionGrid: {
    width: '100%',
    gap: 10,
  },
  suggestionBtn: {
    backgroundColor: SURFACE,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  suggestionText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: SURFACE2,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  }
});
