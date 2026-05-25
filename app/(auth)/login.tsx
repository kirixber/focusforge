/**
 * Login screen — OTP (passwordless email) authentication.
 *
 * Social login placeholders:
 *   Google and Apple buttons are included with placeholder handlers.
 *   To wire them up:
 *     1. Configure Google/Apple OAuth in your Supabase project → Auth → Providers
 *     2. Add a redirect URL (e.g. myapp://auth/callback)
 *     3. Install expo-web-browser and expo-auth-session
 *     4. Call supabase.auth.signInWithOAuth({ provider: 'google' }) in handleGoogleLogin
 *
 *   To remove a provider, simply delete the corresponding button.
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  View, Pressable, StyleSheet, Dimensions,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  TextInput as RNTextInput, ScrollView, DeviceEventEmitter,
} from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { ChevronLeft } from 'lucide-react-native'
import { Text } from '@/components/ui/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from 'nativewind'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { track } from '@/lib/analytics'
import { 
    ACCENT, 
    ACCENT_DIM, 
    ACCENT_BORDER, 
    BG, 
    SURFACE, 
    BORDER, 
    ERROR, 
    ERROR_DIM, 
    TEXT_PRIMARY,
    TEXT_SECONDARY,
    TEXT_TERTIARY,
    TEXT_DISABLED,
    ON_ACCENT,
    BORDER_ACTIVE
} from '@/lib/theme'
import { APP_NAME, APP_SCHEME } from '@/lib/constants'
import { adjustBrightness } from '@/lib/utils'
import { Fonts } from '@/lib/typography'

// Required for OAuth session handling on Android
WebBrowser.maybeCompleteAuthSession()

// ─── Set to true during development to show a "Skip to Home" button ───────────
// Set to false before shipping to production.
const DEV_ALLOW_SKIP = __DEV__

// ─── Disposable email blocklist ───────────────────────────────────────────────
// Prevents throwaway emails from creating accounts.

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'yopmail.com', 'trashmail.com', 'trashmail.me', 'maildrop.cc',
  'mailnesia.com', 'discard.email', 'throwaway.email', 'getnada.com', 'fakeinbox.com',
  'getairmail.com', 'spam4.me', 'spamgourmet.com', 'dispostable.com', 'filzmail.com',
])

function normalizeEmail(raw: string): string {
  const trimmed = raw.trim().toLowerCase()
  const atIdx = trimmed.lastIndexOf('@')
  if (atIdx === -1) return trimmed
  const local = trimmed.slice(0, atIdx)
  const domain = trimmed.slice(atIdx + 1)
  const cleanLocal = local.split('+')[0]
  // Remove dots for Gmail addresses
  const gmailDomains = ['gmail.com', 'googlemail.com']
  const finalLocal = gmailDomains.includes(domain) ? cleanLocal.replace(/\./g, '') : cleanLocal
  return `${finalLocal}@${domain}`
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()

  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null)
  const [lockoutLeft, setLockoutLeft] = useState(0)

  const otpRefs = useRef<(RNTextInput | null)[]>([])
  const emailRef = useRef<RNTextInput>(null)

  // Resend cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // Lockout countdown
  useEffect(() => {
    if (!lockoutEnd) return
    const tick = () => {
      const rem = Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000))
      setLockoutLeft(rem)
      if (rem === 0) setLockoutEnd(null)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [lockoutEnd])

  const handleSendOtp = async () => {
    const normalized = normalizeEmail(email)
    if (!normalized || !normalized.includes('@') || !normalized.includes('.')) {
      setError('Enter a valid email address')
      return
    }
    const domain = normalized.split('@')[1]
    if (DISPOSABLE_DOMAINS.has(domain)) {
      setError('Temporary email addresses are not allowed.')
      return
    }
    setLoading(true); setError(null)
    track('login_started')
    const { error: err } = await supabase.auth.signInWithOtp({ email: normalized })
    setLoading(false)
    if (err) { setError(err.message); return }
    track('otp_sent')
    setStep('otp')
    setCooldown(60)
    setTimeout(() => otpRefs.current[0]?.focus(), 300)
  }

  const handleVerifyOtp = useCallback(async (code: string) => {
    if (code.length < 6) return
    if (lockoutEnd && Date.now() < lockoutEnd) {
      setError(`Too many attempts. Wait ${Math.ceil((lockoutEnd - Date.now()) / 60000)} minute(s).`)
      return
    }
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.verifyOtp({
      email: normalizeEmail(email),
      token: code,
      type: 'email',
    })
    setLoading(false)
    if (err) {
      const next = failedAttempts + 1
      setFailedAttempts(next)
      if (next >= 5) {
        setLockoutEnd(Date.now() + 15 * 60 * 1000)
        setError('Too many failed attempts. Please wait 15 minutes.')
      } else {
        setError(`Invalid code. ${5 - next} attempt${5 - next === 1 ? '' : 's'} left.`)
      }
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
      return
    }
    track('login_success')
    // _layout.tsx auth guard handles navigation automatically
  }, [email, lockoutEnd, failedAttempts])

  const handleOtpChange = (val: string, index: number) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
    const code = next.join('')
    if (code.length === 6 && !next.includes('')) handleVerifyOtp(code)
  }

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const next = [...otp]
      next[index - 1] = ''
      setOtp(next)
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.signInWithOtp({ email: normalizeEmail(email) })
    setLoading(false)
    if (err) { setError(err.message); return }
    setCooldown(60)
    setOtp(['', '', '', '', '', ''])
    setTimeout(() => otpRefs.current[0]?.focus(), 50)
  }

  const goBack = () => {
    setStep('email'); setOtp(['', '', '', '', '', ''])
    setError(null); setFailedAttempts(0); setLockoutEnd(null)
    setTimeout(() => emailRef.current?.focus(), 150)
  }

  // ─── Dev skip — bypasses auth for testing UI flow ─────────────────────────────
  const handleDevSkip = () => {
    DeviceEventEmitter.emit('__dev_skip_auth__')
  }

  // ─── Social login handlers ───────────────────────────────────────────────────
  // Requires: Supabase → Auth → Providers → Google/Apple enabled
  // Requires: app.json scheme = 'myapp' (already set) so deep link works

  async function handleOAuthLogin(provider: 'google' | 'apple') {
    setLoading(true)
    setError(null)
    try {
      const redirectTo = `${APP_SCHEME}://auth/callback`
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      })
      if (err) throw err
      if (!data.url) throw new Error('No OAuth URL returned.')

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
      if (result.type === 'success') {
        const { error: sessionErr } = await supabase.auth.exchangeCodeForSession(result.url)
        if (sessionErr) throw sessionErr
        // _layout.tsx auth guard handles navigation automatically
      }
    } catch (e: any) {
      setError(e?.message ?? `${provider === 'google' ? 'Google' : 'Apple'} sign-in failed.`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => handleOAuthLogin('google')

  return (
    <View className="flex-1 bg-background">
      {/* Back button */}
      <Pressable onPress={() => router.back()} style={[s.backBtn, { top: insets.top + 14 }]} hitSlop={14}>
        <ChevronLeft size={24} color={TEXT_PRIMARY} />
      </Pressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(80).duration(400)} className="flex-1">
            {/* App badge */}
            <View className="bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5 self-start flex-row items-center gap-2 mb-10">
              <View className="w-2 h-2 rounded-full bg-accent" />
              <Text style={{ color: TEXT_PRIMARY, opacity: 0.6 }} className="font-mono text-[11px] uppercase tracking-widest">{APP_NAME}</Text>
            </View>

            {/* Heading */}
            {step === 'email' ? (
              <View className="mb-10 gap-3">
                <Text style={{ color: TEXT_PRIMARY }} className="font-outfit-bold text-[36px] leading-tight">Welcome back</Text>
                <Text style={{ color: TEXT_PRIMARY, opacity: 0.6 }} className="font-outfit text-[16px]">Enter your email — we'll send a one-time code.</Text>
              </View>
            ) : (
              <View className="mb-10 gap-3">
                <Text style={{ color: TEXT_PRIMARY }} className="font-outfit-bold text-[36px] leading-tight">Check your inbox</Text>
                <View className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-2 self-start">
                  <Text style={{ color: TEXT_PRIMARY }} className="font-mono-semibold text-[14px]" numberOfLines={1}>
                    {normalizeEmail(email)}
                  </Text>
                </View>
                <Text style={{ color: TEXT_PRIMARY, opacity: 0.6 }} className="font-outfit text-[16px]">Enter the 6-digit code we sent. Check spam if needed.</Text>
              </View>
            )}

            {/* ── Email step ── */}
            {step === 'email' && (
              <View className="gap-6">
                <View className="gap-2">
                  <Text style={{ color: TEXT_PRIMARY, opacity: 0.4 }} className="font-mono text-[11px] uppercase tracking-widest ml-1">Email Address</Text>
                  <RNTextInput
                    ref={emailRef}
                    value={email}
                    onChangeText={(v) => { setEmail(v); setError(null) }}
                    placeholder="you@example.com"
                    placeholderTextColor={TEXT_TERTIARY}
                    className={`h-16 bg-accent/5 border rounded-[20px] px-6 text-[16px] font-outfit`}
                    style={{ color: TEXT_PRIMARY, borderColor: error ? ERROR : BORDER_ACTIVE }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                    autoFocus
                  />
                </View>

                {error ? <ErrorBanner msg={error} /> : null}

                <Pressable
                  onPress={handleSendOtp}
                  disabled={loading || !email.trim()}
                  className="overflow-hidden rounded-[20px]"
                  style={({ pressed }) => ({
                    opacity: (loading || !email.trim()) ? 0.4 : pressed ? 0.85 : 1,
                  })}
                >
                  <View className="h-16 bg-accent items-center justify-center">
                    {loading
                      ? <ActivityIndicator size="small" color={ON_ACCENT} />
                      : <Text style={{ color: ON_ACCENT }} className="font-outfit-bold text-[17px]">Continue</Text>
                    }
                  </View>
                </Pressable>

                {/* ─── Social logins ────────────────────── */}
                <View className="flex-row items-center gap-4 my-4">
                  <View className="flex-1 h-[1px] bg-accent/10" />
                  <Text style={{ color: TEXT_PRIMARY, opacity: 0.3 }} className="font-mono text-[11px] uppercase tracking-widest">or continue with</Text>
                  <View className="flex-1 h-[1px] bg-accent/10" />
                </View>

                <View className="flex-row">
                  {/* Google */}
                  <Pressable
                    onPress={handleGoogleLogin}
                    className="flex-1 flex-row items-center justify-center gap-3 h-16 bg-surface border border-accent/10 rounded-[20px] active:opacity-75"
                  >
                    <View className="w-7 h-7 rounded-lg bg-white items-center justify-center shadow-sm">
                      <Text className="font-outfit-bold text-[16px] text-black">G</Text>
                    </View>
                    <Text style={{ color: TEXT_PRIMARY }} className="font-outfit-semibold text-[16px]">Google</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ── OTP step ── */}
            {step === 'otp' && (
              <View className="gap-6">
                <View className="flex-row justify-between gap-2.5">
                  {otp.map((digit, i) => (
                    <RNTextInput
                      key={i}
                      ref={(r) => { otpRefs.current[i] = r }}
                      value={digit}
                      onChangeText={(v) => handleOtpChange(v, i)}
                      onKeyPress={(e) => handleOtpKeyPress(e, i)}
                      className={`flex-1 h-16 bg-accent/5 border rounded-2xl text-center text-[28px] font-mono-semibold`}
                      style={{ color: TEXT_PRIMARY, borderColor: digit ? ACCENT : BORDER }}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      caretHidden
                      editable={!loading}
                    />
                  ))}
                </View>

                {error ? <ErrorBanner msg={error} /> : null}

                {lockoutEnd ? (
                  <Animated.View entering={FadeIn.duration(180)} className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 items-center">
                    <Text className="font-mono text-[14px] text-yellow-600">
                      Locked · {Math.floor(lockoutLeft / 60)}:{String(lockoutLeft % 60).padStart(2, '0')} remaining
                    </Text>
                  </Animated.View>
                ) : null}

                <Pressable
                  onPress={() => handleVerifyOtp(otp.join(''))}
                  disabled={loading || otp.includes('') || !!lockoutEnd}
                  className="overflow-hidden rounded-[20px]"
                  style={({ pressed }) => ({
                    opacity: (loading || otp.includes('') || !!lockoutEnd) ? 0.4 : pressed ? 0.85 : 1,
                  })}
                >
                  <View className="h-16 bg-accent items-center justify-center">
                    {loading
                      ? <ActivityIndicator size="small" color={ON_ACCENT} />
                      : <Text style={{ color: ON_ACCENT }} className="font-outfit-bold text-[17px]">Verify Code</Text>
                    }
                  </View>
                </Pressable>

                <View className="flex-row items-center justify-center gap-4">
                  <Pressable onPress={handleResend} disabled={cooldown > 0} hitSlop={10}>
                    <Text style={{ color: cooldown > 0 ? TEXT_DISABLED : TEXT_PRIMARY }} className="font-mono-semibold text-[14px]">
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                    </Text>
                  </Pressable>
                  <View className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                  <Pressable onPress={goBack} hitSlop={10}>
                    <Text style={{ color: TEXT_PRIMARY, opacity: 0.4 }} className="font-mono text-[14px]">Change email</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ─── Dev skip button (only visible in __DEV__) ─────────────────── */}
            {DEV_ALLOW_SKIP && (
              <Pressable
                onPress={handleDevSkip}
                className="flex-row items-center justify-center gap-2 self-center mt-10 border border-accent/20 border-dashed rounded-2xl px-6 py-4 bg-accent/5 active:opacity-60"
              >
                <Ionicons name="play-skip-forward-outline" size={16} color={TEXT_SECONDARY} />
                <Text style={{ color: TEXT_SECONDARY }} className="font-mono text-[13px]">Skip to Home (dev only)</Text>
              </Pressable>
            )}

            {/* Legal */}
            <View className="flex-row items-center justify-center gap-3 mt-auto pt-10">
              <Pressable onPress={() => router.push('/privacy')} hitSlop={10}>
                <Text style={{ color: TEXT_PRIMARY, opacity: 0.3 }} className="font-outfit text-[12px] underline">Privacy Policy</Text>
              </Pressable>
              <View className="w-1 h-1 rounded-full bg-accent/20" />
              <Pressable onPress={() => router.push('/terms')} hitSlop={10}>
                <Text style={{ color: TEXT_PRIMARY, opacity: 0.3 }} className="font-outfit text-[12px] underline">Terms of Service</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <Animated.View 
      entering={FadeIn.duration(180)} 
      className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
    >
      <Text className="text-red-500 font-outfit text-[13px]">{msg}</Text>
    </Animated.View>
  )
}

const { width: SW } = Dimensions.get('window')

const s = StyleSheet.create({
  backBtn: { position: 'absolute', left: 16, zIndex: 20 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  socialRow: { flexDirection: 'row', gap: 12 },
})
