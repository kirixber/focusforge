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
import { insightCards, statusLabel } from '@/lib/mockData'
import { useItems } from '@/hooks/useItems'
import { useActivityFeed } from '@/hooks/useActivityFeed'
import { useProfile } from '@/hooks/useProfile'
import { useUsage } from '@/contexts/UsageContext'
import { LeisureBankRing } from '@/components/gamification/LeisureBankRing'

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
    const [refreshing, setRefreshing] = useState(false)
    const queryClient = useQueryClient()

    const { data: items = [] } = useItems()
    const { data: activityItems = [] } = useActivityFeed()
    const { data: profile } = useProfile()
    const { bank } = useUsage()

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
        setRefreshing(false)
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: BG }}
            contentContainerStyle={[s.container, { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_CLEARANCE + 16 }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />}
            showsVerticalScrollIndicator={false}
        >
            <View style={s.header}>
                <View>
                    <Text style={s.greeting}>{greeting}, {(profile?.fullName ?? '').split(' ')[0]}</Text>
                    <Text style={s.subGreeting}>Forge your focus today.</Text>
                </View>
                <View style={s.streakFlame}>
                    <Ionicons name="flame" size={18} color="#FF6B35" />
                    <Text style={s.streakText}>5</Text>
                </View>
            </View>

            {/* Focus Engine Hero */}
            <View style={s.heroSection}>
                <LeisureBankRing balance={bank?.currentBalanceMinutes ?? 0} />
            </View>

            <Text style={s.sectionTitle}>Recent Items</Text>
            {topItems.map((item) => (
                <Pressable
                    key={item.id}
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
            ))}

            <Text style={s.sectionTitle}>Recent Activity</Text>
            <Card style={s.activityCard}>
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
