import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '../ui/Text';
import { MoodId } from '@/lib/types/engine';
import { ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, SURFACE2 } from '@/lib/theme';

const MOODS: { id: MoodId, emoji: string, label: string }[] = [
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'bored', emoji: '🥱', label: 'Bored' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'productive', emoji: '💪', label: 'Productive' },
  { id: 'focused', emoji: '🎯', label: 'Focused' },
];

interface MirrorMoodSelectorProps {
  selectedMood: MoodId | null;
  onSelect: (mood: MoodId) => void;
  title?: string;
}

/**
 * The "Mirror" component for high-EQ mood tracking.
 * Uses Reanimated spring animations and haptics for a tactile, expert feel.
 */
export const MirrorMoodSelector: React.FC<MirrorMoodSelectorProps> = ({ 
  selectedMood, 
  onSelect,
  title = "How are you feeling right now?"
}) => {

  const handleSelect = (mood: MoodId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(mood);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      <View style={s.moodGrid}>
        {MOODS.map((mood) => (
          <MoodItem 
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onPress={() => handleSelect(mood.id)}
          />
        ))}
      </View>
    </View>
  );
};

interface MoodItemProps {
  mood: { id: MoodId, emoji: string, label: string };
  isSelected: boolean;
  onPress: () => void;
}

const MoodItem: React.FC<MoodItemProps> = ({ mood, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1.2 : 1) }],
      backgroundColor: isSelected ? ACCENT : SURFACE2,
      borderColor: isSelected ? ACCENT : 'transparent',
    };
  });

  const emojiStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isSelected ? 1 : 0.8),
    };
  });

  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        s.moodItemWrap,
        pressed && { opacity: 0.7 }
      ]}
    >
      <Animated.View style={[s.moodItem, animatedStyle]}>
        <Animated.Text style={[s.emoji, emojiStyle]}>{mood.emoji}</Animated.Text>
      </Animated.View>
      <Text style={[s.moodLabel, isSelected && s.selectedLabel]}>{mood.label}</Text>
    </Pressable>
  );
};

const s = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  moodItemWrap: {
    alignItems: 'center',
    flex: 1,
  },
  moodItem: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 8,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: {
    fontSize: 26,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedLabel: {
    color: TEXT_PRIMARY,
    fontWeight: '800',
  }
});
