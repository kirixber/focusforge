/**
 * 🎨 BRAND — central theme constants.
 *
 * NOTE: The app now uses NativeWind v4 with CSS variables for dynamic theme switching.
 * These constants are the DEFAULT (Light Mode) values.
 */

// ── Primary brand color ───────────────────────────────────────────────────────
export const ACCENT = '#023A22'           // Off-Road Green (Deep)

// Derived from ACCENT
export const ACCENT_DIM = 'rgba(2, 58, 34, 0.12)'
export const ACCENT_BORDER = 'rgba(2, 58, 34, 0.30)'
export const ACCENT_GLOW = 'rgba(2, 58, 34, 0.20)'
export const ACCENT_LIGHT = '#DFF2DE'

// ── Backgrounds ───────────────────────────────────────────────────────────────
export const BG = '#C6E4C5'               // Celadon White (Light)
export const SURFACE = '#DDF2DE'          // Paler Green for cards
export const SURFACE2 = '#B8DDB6'         // Muted Green for elevated cards
export const SURFACE3 = '#9ED2B0'         // Interactive elements
export const MUTED = '#566B5E'            // Wilted Sage

// ── Text ──────────────────────────────────────────────────────────────────────
export const TEXT_PRIMARY = '#023A22'     // Dark green text
export const TEXT_SECONDARY = 'rgba(2, 58, 34, 0.75)'
export const TEXT_TERTIARY = 'rgba(2, 58, 34, 0.45)'
export const TEXT_DISABLED = 'rgba(2, 58, 34, 0.25)'
export const ON_ACCENT = '#C6E4C5'        // Celadon text on Green background

// ── Borders ───────────────────────────────────────────────────────────────────
export const BORDER = 'rgba(2, 58, 34, 0.1)'
export const BORDER_ACTIVE = 'rgba(2, 58, 34, 0.2)'

// ── Semantic ──────────────────────────────────────────────────────────────────
export const ERROR = '#ef4444'
export const ERROR_DIM = 'rgba(239, 68, 68, 0.10)'
export const WARNING = '#f59e0b'
export const SUCCESS = '#10b981'
export const XP_GOLD = '#d97706'

// ── Tab bar ───────────────────────────────────────────────────────────────────
export const TAB_ACTIVE = ACCENT
export const TAB_INACTIVE = 'rgba(2, 58, 34, 0.40)'
export const TAB_HEIGHT = 68
