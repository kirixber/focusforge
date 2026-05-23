import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BG, ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, XP_GOLD, SURFACE2 } from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();

  const level = 12;
  const xpCurrent = 450;
  const xpNext = 1000;
  const progress = xpCurrent / xpNext;

  const challenges = [
    { id: '1', title: 'Deep Work Pioneer', detail: 'Complete 3 Work sessions', progress: 2, total: 3, xp: 150 },
    { id: '2', title: 'Morning Warrior', detail: 'Start a session before 9AM', progress: 1, total: 1, xp: 50, completed: true },
    { id: '3', title: 'Mood Master', detail: 'Log 5 mood check-ins', progress: 4, total: 5, xp: 100 },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={[s.container, { paddingTop: insets.top + 20, paddingBottom: TAB_BAR_CLEARANCE + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={s.title}>Rewards</Text>
        <Text style={s.subtitle}>Level up your discipline.</Text>
      </View>

      {/* XP Hero */}
      <Card style={s.xpHero}>
        <View style={s.xpTop}>
          <View>
            <Text style={s.levelLabel}>Level</Text>
            <Text style={s.levelValue}>{level}</Text>
          </View>
          <View style={s.xpTextWrap}>
            <Text style={s.xpText}>{xpCurrent} / {xpNext} XP</Text>
          </View>
        </View>
        <View style={s.progressBarWrap}>
          <View style={s.progressBarBg}>
            <View style={[s.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
        <Text style={s.xpHint}>{xpNext - xpCurrent} XP until Level {level + 1}</Text>
      </Card>

      <Text style={s.sectionTitle}>Daily Challenges</Text>
      {challenges.map(c => (
        <Card key={c.id} style={s.challengeCard}>
          <View style={s.challengeInfo}>
            <View style={s.challengeText}>
              <Text style={[s.challengeTitle, c.completed && s.completedText]}>{c.title}</Text>
              <Text style={s.challengeDetail}>{c.detail}</Text>
            </View>
            <View style={s.challengeReward}>
              <Text style={s.challengeXp}>+{c.xp} XP</Text>
            </View>
          </View>
          <View style={s.challengeFooter}>
            <View style={s.miniProgressBg}>
              <View style={[s.miniProgressFill, { width: `${(c.progress / c.total) * 100}%` }, c.completed && { backgroundColor: '#4ade80' }]} />
            </View>
            <Text style={s.challengeCount}>{c.progress}/{c.total}</Text>
          </View>
          {c.completed && (
            <View style={s.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
            </View>
          )}
        </Card>
      ))}

      <Text style={s.sectionTitle}>Achievements</Text>
      <View style={s.achievementGrid}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={s.achievementItem}>
            <View style={[s.achievementIcon, i > 2 && s.lockedIcon]}>
              <Ionicons name={i === 1 ? 'flame' : i === 2 ? 'trophy' : 'lock-closed'} size={24} color={i > 2 ? TEXT_TERTIARY : XP_GOLD} />
            </View>
            <Text style={s.achievementLabel}>{i === 1 ? '7 Day Streak' : i === 2 ? 'Focus King' : 'Locked'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: TEXT_SECONDARY, marginTop: 4 },
  xpHero: {
    padding: 24,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  xpTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT,
    textTransform: 'uppercase',
  },
  levelValue: {
    fontSize: 48,
    fontWeight: '900',
    color: TEXT_PRIMARY,
    lineHeight: 48,
    marginTop: 4,
  },
  xpTextWrap: {
    paddingBottom: 8,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_SECONDARY,
  },
  progressBarWrap: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 5,
  },
  xpHint: {
    fontSize: 12,
    color: TEXT_TERTIARY,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_TERTIARY,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 12,
  },
  challengeCard: {
    padding: 16,
    gap: 16,
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  challengeText: {
    flex: 1,
    gap: 4,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  completedText: {
    color: TEXT_SECONDARY,
    textDecorationLine: 'line-through',
  },
  challengeDetail: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  challengeReward: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  challengeXp: {
    fontSize: 12,
    fontWeight: '800',
    color: XP_GOLD,
  },
  challengeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniProgressBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: ACCENT,
  },
  challengeCount: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    width: 30,
    textAlign: 'right',
  },
  completedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: BG,
    borderRadius: 12,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  achievementItem: {
    width: '22%',
    alignItems: 'center',
    gap: 8,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: SURFACE2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  lockedIcon: {
    borderColor: 'transparent',
    opacity: 0.5,
  },
  achievementLabel: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    fontWeight: '600',
  }
});
