/**
 * 🎨 BRAND — central theme constants.
 *
 * Change ACCENT (and the matching tailwind.config.js color) to rebrand the
 * entire app in one edit. All components import from here instead of
 * hardcoding color strings.
 *
 * Steps to rebrand:
 *   1. Change ACCENT below to your hex color
 *   2. Change the `accent` key in tailwind.config.js to the same hex
 *   3. Optionally change BG for a different dark shade
 */

// ── Primary brand color ───────────────────────────────────────────────────────
// 🎨 Change this one value to rebrand the whole app
export const ACCENT = '#C6E4C5'           // Celadon White

// Derived from ACCENT — muted for a natural feel
export const ACCENT_DIM = 'rgba(198, 228, 197, 0.12)'
export const ACCENT_BORDER = 'rgba(198, 228, 197, 0.30)'
export const ACCENT_GLOW = 'rgba(198, 228, 197, 0.20)'
// Text color on dark background using accent tone
export const ACCENT_LIGHT = '#DFF2DE'

// ── Backgrounds ───────────────────────────────────────────────────────────────
export const BG = '#023A22'        // Off-Road Green (Deep)
export const SURFACE = '#034F32'        // Muted Forest Green
export const SURFACE2 = '#05623E'        // Elevated Pine
export const SURFACE3 = '#07754B'        // Interactive Moss

// ── Text ──────────────────────────────────────────────────────────────────────
export const TEXT_PRIMARY = '#C6E4C5'    // Celadon text
export const TEXT_SECONDARY = 'rgba(198, 228, 197, 0.75)'
export const TEXT_TERTIARY = 'rgba(198, 228, 197, 0.45)'
export const TEXT_DISABLED = 'rgba(198, 228, 197, 0.25)'
export const ON_ACCENT = '#023A22'       // Dark green for text on Celadon White

// ── Borders ───────────────────────────────────────────────────────────────────
export const BORDER = 'rgba(255,255,255,0.09)'
export const BORDER_ACTIVE = 'rgba(255,255,255,0.18)'

// ── Semantic ──────────────────────────────────────────────────────────────────
export const ERROR = '#f87171'
export const ERROR_DIM = 'rgba(248,113,113,0.10)'
export const WARNING = '#fbbf24'
export const SUCCESS = '#4ade80'
export const XP_GOLD = '#FFD700'

// ── Tab bar ───────────────────────────────────────────────────────────────────
export const TAB_ACTIVE = ACCENT
export const TAB_INACTIVE = 'rgba(255,255,255,0.40)'
export const TAB_HEIGHT = 68
