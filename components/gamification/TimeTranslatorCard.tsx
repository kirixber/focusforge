import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, SURFACE2 } from '@/lib/theme';
import { TimeEquivalent } from '@/lib/types/engine';

interface TimeTranslatorCardProps {
  equivalent: TimeEquivalent;
  onShare?: () => void;
}

/**
 * A beautiful, shareable card that translates focused time into real-world achievements.
 * Part of the "Time Translator" virality loop.
 */
export const TimeTranslatorCard: React.FC<TimeTranslatorCardProps> = ({ 
  equivalent, 
  onShare 
}) => {
  const getIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case 'health': return 'fitness-outline';
      case 'learning': return 'book-outline';
      case 'social': return 'people-outline';
      case 'leisure': return 'cafe-outline';
      default: return 'star-outline';
    }
  };

  return (
    <Card style={s.card}>
      <View style={s.header}>
        <View style={s.iconWrap}>
          <Ionicons name={getIcon(equivalent.category)} size={20} color={ACCENT} />
        </View>
        <Text style={s.category}>{equivalent.category.toUpperCase()}</Text>
      </View>

      <View style={s.content}>
        <Text style={s.label}>This focus earned you time for:</Text>
        <Text style={s.achievement}>{equivalent.label}</Text>
      </View>

      <View style={s.footer}>
        <View style={s.timeInfo}>
          <Ionicons name="time-outline" size={14} color={TEXT_SECONDARY} />
          <Text style={s.timeText}>{equivalent.minutesRequired} minutes</Text>
        </View>
        
        {onShare && (
          <TouchableOpacity onPress={onShare} style={s.shareButton}>
            <Ionicons name="share-social-outline" size={18} color={ACCENT} />
            <Text style={s.shareText}>Share</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const s = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: ACCENT,
    letterSpacing: 1,
  },
  content: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  achievement: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    lineHeight: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  shareText: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT,
  }
});
