/** @type {import('tailwindcss').Config} */

// 🎨 BRAND: Theme colors are now driven by CSS variables in global.css
// to support seamless inversion between light and dark modes.

module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        accent: 'rgb(var(--accent))',
        surface: 'rgb(var(--surface))',
        surface2: 'rgb(var(--surface2))',
        muted: 'rgb(var(--muted))',
      },
      fontFamily: {
        outfit: ['Outfit_400Regular'],
        'outfit-semibold': ['Outfit_600SemiBold'],
        'outfit-bold': ['Outfit_800ExtraBold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-medium': ['JetBrainsMono_500Medium'],
        'mono-semibold': ['JetBrainsMono_600SemiBold'],
        satoshi: ['Inter_400Regular'], 
      },
    },
  },
  plugins: [],
}
