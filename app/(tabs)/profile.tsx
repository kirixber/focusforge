import { useState } from 'react'
import { View, ScrollView, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Card } from '@/components/ui/Card'
import { AlertModal } from '@/components/ui/AppModal'
import SettingsRow from '@/components/ui/SettingsRow'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { logoutRevenueCat } from '@/lib/purchases'
import { supabase } from '@/lib/supabase'
import { track } from '@/lib/analytics'
import { adjustBrightness } from '@/lib/utils'
import {
    ACCENT,
    ACCENT_BORDER,
    BG,
    TEXT_PRIMARY,
    TEXT_SECONDARY,
    TEXT_TERTIARY,
    ON_ACCENT,
} from '@/lib/theme'
import { TAB_BAR_CLEARANCE } from '@/components/TabBar'
import { demoUser } from '@/lib/mockData'
import { useProfile } from '@/hooks/useProfile'

export default function ProfileScreen() {
    const insets = useSafeAreaInsets()
    const { isPremium, customerInfo } = useSubscription()
    const { data: profile } = useProfile()
    const [signOutModal, setSignOutModal] = useState(false)
    const [signingOut, setSigningOut] = useState(false)
    const [errorModal, setErrorModal] = useState<string | null>(null)

    const expiryMs = customerInfo?.entitlements.active['premium']?.expirationDate
    const expiryDate = expiryMs
        ? new Date(expiryMs).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : null

    async function handleSignOut() {
        setSigningOut(true)
        try {
            track('logout')
            await logoutRevenueCat()
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (e: any) {
            setErrorModal(e?.message ?? 'Sign out failed. Please try again.')
        } finally {
            setSigningOut(false)
        }
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: BG }}
            contentContainerStyle={[s.container, { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_CLEARANCE + 16 }]}
            showsVerticalScrollIndicator={false}
        >
            <Card style={s.heroCard}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.02)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={s.avatarWrap}>
                    <Text style={s.avatarText}>{profile?.initials ?? demoUser.initials}</Text>
                    {isPremium && (
                        <View style={s.premiumDot}>
                            <Ionicons name="sparkles" size={10} color={ON_ACCENT} />
                        </View>
                    )}
                </View>

                <Text style={s.name}>{profile?.fullName ?? demoUser.fullName}</Text>
                <Text style={s.metaText}>{demoUser.role} · {demoUser.teamName}</Text>
                <Text style={s.metaText}>{profile?.email ?? demoUser.email}</Text>
            </Card>

            {isPremium ? (
                <Card style={[s.planCard, { borderColor: ACCENT_BORDER }]}>
                    <View style={s.planTop}>
                        <View style={s.planBadge}>
                            <Ionicons name="sparkles" size={11} color={ON_ACCENT} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.planTitle}>Premium Active</Text>
                            <Text style={s.planSub}>{expiryDate ? `Renews ${expiryDate}` : 'Billing cycle active'}</Text>
                        </View>
                        <Pressable onPress={() => router.push('/upgrade')} style={s.manageBtn}>
                            <Text style={s.manageBtnText}>Manage</Text>
                        </Pressable>
                    </View>
                </Card>
            ) : (
                <Pressable 
                    onPress={() => router.push('/upgrade')} 
                    style={({ pressed }) => [s.upgradeCard, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                >
                    <LinearGradient
                        colors={[ACCENT, adjustBrightness(ACCENT, -12)]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={s.upgradeIconWrap}>
                        <Ionicons name="sparkles" size={18} color={ON_ACCENT} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text style={s.upgradeTitle}>Invest in your peace</Text>
                        <Text style={s.upgradeSub}>Don't just block distractions—forge focus with AI Coaching.</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={18} color="rgba(2, 58, 34, 0.5)" />
                </Pressable>
            )}

            <Text style={s.sectionTitle}>Account</Text>
            <Card compact style={s.sectionCard}>
                <SettingsRow icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />
                <SettingsRow icon="help-buoy-outline" label="Support" onPress={() => router.push('/support')} />
                <SettingsRow icon="document-text-outline" label="Privacy Policy" onPress={() => router.push('/privacy')} />
                <SettingsRow icon="shield-checkmark-outline" label="Terms of Service" onPress={() => router.push('/terms')} last={true} />
            </Card>

            <Pressable
                onPress={() => setSignOutModal(true)}
                disabled={signingOut}
                style={({ pressed }) => [s.signOutBtn, (pressed || signingOut) && { opacity: 0.72 }]}
            >
                <Ionicons name="log-out-outline" size={17} color="rgba(255,255,255,0.45)" />
                <Text style={s.signOutText}>{signingOut ? 'Signing out…' : 'Sign out'}</Text>
            </Pressable>

            <AlertModal
                visible={signOutModal}
                title="Sign out"
                message="You will be signed out of your account."
                buttons={[
                    { text: 'Cancel', style: 'cancel', onPress: () => setSignOutModal(false) },
                    { text: 'Sign out', style: 'destructive', onPress: () => { setSignOutModal(false); handleSignOut() } },
                ]}
                onDismiss={() => setSignOutModal(false)}
            />

            <AlertModal
                visible={!!errorModal}
                title="Error"
                message={errorModal ?? ''}
                buttons={[{ text: 'OK', onPress: () => setErrorModal(null) }]}
                onDismiss={() => setErrorModal(null)}
            />
        </ScrollView>
    )
}


const s = StyleSheet.create({
    container: { paddingHorizontal: 20, gap: 14 },
    heroCard: {
        overflow: 'hidden',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 16,
    },
    avatarWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.18)',
        marginBottom: 4,
    },
    avatarText: { fontSize: 24, fontWeight: '800', color: TEXT_PRIMARY },
    premiumDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 999,
        backgroundColor: ACCENT,
        borderWidth: 2,
        borderColor: BG,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: { fontSize: 22, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -0.4 },
    metaText: { fontSize: 12.5, color: TEXT_SECONDARY },
    planCard: {
        borderWidth: 1,
        paddingVertical: 12,
    },
    planTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    planBadge: {
        width: 30,
        height: 30,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ACCENT,
    },
    planTitle: { color: ACCENT, fontSize: 14.5, fontWeight: '700' },
    planSub: { color: TEXT_SECONDARY, fontSize: 12 },
    manageBtn: {
        borderWidth: 1,
        borderColor: ACCENT_BORDER,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    manageBtnText: { color: ACCENT, fontSize: 12, fontWeight: '600' },
    upgradeCard: {
        minHeight: 74,
        borderRadius: 18,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        // High-end bevel shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    upgradeIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(2, 58, 34, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    upgradeTitle: { color: ON_ACCENT, fontSize: 16, fontWeight: '800' },
    upgradeSub: { color: 'rgba(2, 58, 34, 0.6)', fontSize: 12, lineHeight: 18 },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: TEXT_TERTIARY,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginTop: 3,
        marginBottom: -4,
    },
    sectionCard: { padding: 0, overflow: 'hidden' },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        paddingVertical: 10,
    },
    signOutText: { color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: '500' },
})
