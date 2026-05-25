import { useMemo, useState } from 'react'
import { View, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueryClient } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui/Text'
import { Card } from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import {
    ACCENT,
    ACCENT_DIM,
    BG,
    TEXT_SECONDARY,
    TEXT_TERTIARY,
} from '@/lib/theme'
import { TAB_BAR_CLEARANCE } from '@/components/TabBar'
import { statusLabel } from '@/lib/mockData'
import { useItems } from '@/hooks/useItems'
import { useActivityFeed } from '@/hooks/useActivityFeed'
import { useProfile } from '@/hooks/useProfile'
import { useUsage } from '@/contexts/UsageContext'
import { LeisureBankRing } from '@/components/gamification/LeisureBankRing'
import { DigitalGarden, GardenStage } from '@/components/garden/DigitalGarden'
import Animated, { 
    FadeInDown, 
    FadeInRight, 
    FadeIn,
    Layout
} from 'react-native-reanimated'

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
    const [refreshing, setRefreshing] = useState(false)
    const queryClient = useQueryClient()
    
    const { data: items = [] } = useItems()
    const { data: activityItems = [] } = useActivityFeed()
    const { data: profile } = useProfile()
    const { bank } = useUsage()

    // 🌿 Automated Garden Logic
    const { gardenStage, gardenWilted } = useMemo(() => {
        const streak = profile?.currentStreak ?? 0
        const lastFocusAt = profile?.lastFocusAt

        // Map streak to growth stage
        let stage: GardenStage = 'seedling'
        if (streak >= 14) stage = 'bonsai'
        else if (streak >= 7) stage = 'sapling'
        else if (streak >= 3) stage = 'sprout'

        // Wilt logic: more than 24 hours since last focus session
        let wilted = false
        if (lastFocusAt) {
            const lastDate = new Date(lastFocusAt)
            const diffHours = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60)
            if (diffHours > 24) wilted = true
        } else if (streak > 0) {
            wilted = true
        }

        return { gardenStage: stage, gardenWilted: wilted }
    }, [profile])

    const greeting = (() => {
        const h = new Date().getHours()
        if (h < 12) return 'Good morning'
        if (h < 17) return 'Good afternoon'
        return 'Good evening'
    })()

    const topItems = useMemo(() => items.slice(0, 3), [items])
    const latestActivity = useMemo(() => activityItems.slice(0, 3), [activityItems])

    const onRefresh = async () => {
        setRefreshing(true)
        await queryClient.invalidateQueries({ queryKey: ['items'] })
        await queryClient.invalidateQueries({ queryKey: ['activity'] })
        await queryClient.invalidateQueries({ queryKey: ['profile'] })
        setRefreshing(false)
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: BG }}
            contentContainerStyle={[s.container, { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_CLEARANCE + 16 }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View entering={FadeInDown.duration(600).springify()} style={s.header}>
                <View>
                    <Text style={s.greeting}>{greeting}, {(profile?.fullName ?? '').split(' ')[0]}</Text>
                    <Text style={s.subGreeting}>Forge your focus today.</Text>
                </View>
                <View style={s.headerRight}>
                    <Pressable 
                        onPress={() => router.push('/coach')}
                        style={({ pressed }) => [s.aiIconButton, pressed && { opacity: 0.7 }]}
                    >
                        <Ionicons name="sparkles" size={20} color={ACCENT} />
                    </Pressable>
                    <View style={s.streakFlame}>
                        <Ionicons name="flame" size={18} color="#FF6B35" />
                        <Text style={s.streakText}>{profile?.currentStreak ?? 0}</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Digital Garden Section */}
            <View style={s.gardenSection}>
                <DigitalGarden 
                    stage={gardenStage} 
                    isWilted={gardenWilted}
                    size={220}
                />
                
                {gardenWilted && (
                    <Animated.View entering={FadeInDown.duration(400)} style={s.wiltOverlay}>
                        <Text style={s.wiltText}>Your garden needs watering.</Text>
                        <Text style={s.wiltSubText}>Complete a focus session to revive it.</Text>
                    </Animated.View>
                )}
            </View>

            {/* Focus Engine Hero */}
            <Animated.View entering={FadeIn.delay(300).duration(800)} style={s.heroSection}>
                <LeisureBankRing balance={bank?.currentBalanceMinutes ?? 0} />
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(400)} style={s.sectionTitle}>Recent Items</Animated.Text>
            {topItems.map((item, index) => (
                <Animated.View 
                    entering={FadeInDown.delay(500 + index * 100).duration(500).springify()}
                    key={item.id}
                    layout={Layout.springify()}
                >
                    <Pressable
                        onPress={() => router.push(`/detail/${item.id}`)}
                        style={({ pressed }) => [pressed && { opacity: 0.75 }]}
                    >
                        <Card style={s.itemCard}>
                            <View style={s.itemTop}>
                                <View style={s.itemTitleWrap}>
                                    <Text style={s.cardTitle}>{item.name}</Text>
                                    <Text style={s.cardSub}>{item.owner} | Updated {item.updatedAt}</Text>
                                </View>
                                <StatusBadge status={item.status} label={statusLabel(item.status)} />
                            </View>

                            <Text style={[s.cardSub, { marginTop: 8 }]}>{item.summary}</Text>

                            <View style={s.itemMeta}>
                                <Text style={s.metaValue}>{item.completion}% complete</Text>
                                <Text style={s.metaValue}>Health {item.health}</Text>
                                <Text style={s.metaValue}>{item.activeUsers} active</Text>
                            </View>
                        </Card>
                    </Pressable>
                </Animated.View>
            ))}

            <Animated.Text entering={FadeInDown.delay(800)} style={s.sectionTitle}>Recent Activity</Animated.Text>
            <Animated.View entering={FadeInDown.delay(900)} style={s.activityCard}>
                <Card style={{ paddingVertical: 4, paddingHorizontal: 0 }}>
                    {latestActivity.map((activity, index) => (
                        <View key={activity.id} style={[s.activityRow, index < latestActivity.length - 1 && s.activityDivider]}>
                            <View style={s.activityIconWrap}>
                                <Ionicons name={activityIcon(activity.kind)} size={14} color={ACCENT} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.activityTitle}>{activity.title}</Text>
                                <Text style={s.cardSub}>{activity.detail}</Text>
                            </View>
                            <Text style={s.activityTime}>{activity.timeAgo}</Text>
                        </View>
                    ))}
                </Card>
            </Animated.View>
        </ScrollView>
    )
}

function activityIcon(kind: 'milestone' | 'comment' | 'alert' | 'review') {
    switch (kind) {
        case 'milestone':
            return 'flag-outline'
        case 'comment':
            return 'chatbubble-ellipses-outline'
        case 'alert':
            return 'alert-circle-outline'
        case 'review':
            return 'checkmark-done-outline'
        default:
            return 'ellipse-outline'
    }
}

const s = StyleSheet.create({
    container: { paddingHorizontal: 20, gap: 14 },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 8 
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    aiIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
    },
    greeting: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.6 },
    subGreeting: { fontSize: 14, color: TEXT_SECONDARY },
    streakFlame: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,107,53,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,107,53,0.2)'
    },
    streakText: {
        color: '#FF6B35',
        fontWeight: '700',
        fontSize: 14
    },
    gardenSection: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 8,
    },
    wiltOverlay: {
        marginTop: -10,
        alignItems: 'center',
    },
    wiltText: {
        fontSize: 14,
        fontWeight: '700',
        color: TEXT_SECONDARY,
    },
    wiltSubText: {
        fontSize: 11,
        color: TEXT_TERTIARY,
        marginTop: 2,
    },
    heroSection: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: TEXT_TERTIARY,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginTop: 12,
    },
    itemCard: { gap: 2, paddingVertical: 14 },
    itemTop: { flexDirection: 'row', gap: 10 },
    itemTitleWrap: { flex: 1, gap: 3 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
    cardSub: { fontSize: 12, color: TEXT_SECONDARY, lineHeight: 18 },
    itemMeta: { flexDirection: 'row', gap: 12, marginTop: 10, flexWrap: 'wrap' },
    metaValue: { fontSize: 11, color: TEXT_TERTIARY },
    activityCard: { paddingVertical: 4, paddingHorizontal: 0 },
    activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
    activityDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
    activityIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ACCENT_DIM,
    },
    activityTitle: { fontSize: 13.5, color: '#fff', fontWeight: '600', marginBottom: 1 },
    activityTime: { fontSize: 11, color: TEXT_TERTIARY },
})
