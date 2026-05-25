import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { demoUser } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'

export interface UserProfile {
    fullName: string
    email: string
    initials: string
    avatarUrl: string | null
    planType: 'free' | 'premium'
    currentStreak: number
    lastFocusAt: string | null
}

export function useProfile() {
    return useQuery<UserProfile>({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data: { user }, error: authErr } = await supabase.auth.getUser()
            if (authErr || !user) throw authErr ?? new Error('Not authenticated')

            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, plan_type, current_streak, avatar_url')
                .eq('id', user.id)
                .maybeSingle()

            // Fetch last focus session timestamp for wilt logic
            const { data: lastSession } = await supabase
                .from('focus_sessions')
                .select('ended_at')
                .eq('user_id', user.id)
                .eq('completed', true)
                .order('ended_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            const fullName =
                profile?.display_name ||
                (user.user_metadata?.full_name as string | undefined) ||
                user.email?.split('@')[0] ||
                'User'

            return {
                fullName,
                email: user.email ?? '',
                initials: getInitials(fullName),
                avatarUrl: profile?.avatar_url ?? null,
                planType: (profile?.plan_type as 'free' | 'premium') ?? 'free',
                currentStreak: profile?.current_streak ?? 0,
                lastFocusAt: lastSession?.ended_at ?? null,
            }
        },
        placeholderData: {
            fullName: demoUser.fullName,
            email: demoUser.email,
            initials: demoUser.initials,
            avatarUrl: null,
            planType: 'free',
            currentStreak: 5,
            lastFocusAt: new Date().toISOString(),
        },
    })
}
