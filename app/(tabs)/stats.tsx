import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { TimeTranslatorCard } from '@/components/gamification/TimeTranslatorCard';
import { translator } from '@/lib/engine/translator';
import { BG, ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, SURFACE2 } from '@/lib/theme';
import { TAB_BAR_CLEARANCE } from '@/components/TabBar';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  
  // Simulated focus minutes for today
  const totalFocusMinutes = 125;
  
  const equivalents = useMemo(() => 
    translator.getEquivalents(totalFocusMinutes).slice(0, 3), 
  [totalFocusMinutes]);

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={[s.container, { paddingTop: insets.top + 20, paddingBottom: TAB_BAR_CLEARANCE + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={s.title}>Insights</Text>
        <Text style={s.subtitle}>Your focus is paying off.</Text>
      </View>

      {/* Time Translator Hero */}
      <View style={s.translatorHero}>
        <Text style={s.heroTitle}>Today's Achievements</Text>
        <View style={s.cardStack}>
          {equivalents.map((eq, i) => (
            <View key={eq.id} style={[s.stackedCard, { marginTop: i === 0 ? 0 : -60, zIndex: 10 - i, transform: [{ scale: 1 - i * 0.05 }] }]}>
               <TimeTranslatorCard 
                equivalent={eq} 
                onShare={() => console.log('Share achievement:', eq.id)} 
               />
            </View>
          ))}
        </View>
      </View>

      <Text style={s.sectionTitle}>Daily Overview</Text>
      <Card style={s.summaryCard}>
        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Text style={s.summaryValue}>{totalFocusMinutes}m</Text>
            <Text style={s.summaryLabel}>Focused</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryItem}>
            <Text style={s.summaryValue}>5</Text>
            <Text style={s.summaryLabel}>Sessions</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryItem}>
            <Text style={s.summaryValue}>92%</Text>
            <Text style={s.summaryLabel}>Success</Text>
          </View>
        </View>
      </Card>

      <Text style={s.sectionTitle}>Weekly Trend</Text>
      <Card style={s.chartPlaceholder}>
        {/* Placeholder for Victory Native XL Chart */}
        <View style={s.barContainer}>
          {[40, 70, 20, 90, 100, 60, 45].map((h, i) => (
            <View key={i} style={s.barWrap}>
              <View style={[s.bar, { height: h }, i === 4 && { backgroundColor: ACCENT }]} />
              <Text style={s.barDay}>MTWTFSS'[i]</Text>
            </View>
          ))}
        </View>
        <Text style={s.chartHint}>Total focused this week: 14.5 hours</Text>
      </Card>

      <Text style={s.sectionTitle}>Mood Trigger Map</Text>
      <Card style={s.moodMapCard}>
        <Text style={s.moodText}>You focus best when feeling <Text style={{ color: ACCENT, fontWeight: '700' }}>Productive</Text>.</Text>
        <Text style={s.moodSubText}>High vulnerability detected on Sunday evenings (Anxiety triggers scrolling).</Text>
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: TEXT_SECONDARY, marginTop: 4 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_TERTIARY,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  translatorHero: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    marginBottom: 16,
  },
  cardStack: {
    // Stacked effect
  },
  stackedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  summaryCard: {
    paddingVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PRIMARY,
  },
  summaryLabel: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    marginTop: 4,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  chartPlaceholder: {
    height: 180,
    padding: 20,
    justifyContent: 'flex-end',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  barWrap: {
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
  },
  barDay: {
    fontSize: 10,
    color: TEXT_TERTIARY,
    fontWeight: '600',
  },
  chartHint: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  moodMapCard: {
    padding: 20,
    gap: 8,
  },
  moodText: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    lineHeight: 22,
  },
  moodSubText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  }
});
