import React, { useRef } from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { ACCENT, ON_ACCENT } from '@/lib/theme';
import { adjustBrightness } from '@/lib/utils';

interface MagneticLiquidButtonProps {
  label: string;
  onPress: () => void;
}

/**
 * THE ULTIMATE LIQUID BUTTON
 * Ported from Web logic to high-performance React Native.
 * Uses SVG Filters on Web and high-fidelity Reanimated on Native.
 */
export const MagneticLiquidButton: React.FC<MagneticLiquidButtonProps> = ({ label, onPress }) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const isHovered = useSharedValue(0);

  const springConfig = { damping: 20, stiffness: 120, mass: 0.1 };

  // ─── Web Interaction Logic ───
  const handleMouseMoveWeb = (e: any) => {
    if (Platform.OS !== 'web') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull (35% strength for smoother feel)
    x.value = (e.clientX - centerX) * 0.35;
    y.value = (e.clientY - centerY) * 0.35;
    isHovered.value = withSpring(1);
  };

  const handleMouseLeaveWeb = () => {
    if (Platform.OS !== 'web') return;
    x.value = withSpring(0, springConfig);
    y.value = withSpring(0, springConfig);
    isHovered.value = withSpring(0);
  };

  // ─── Native Animation Styles ───
  const magneticStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
    ],
  }));

  const blobStyle = useAnimatedStyle(() => ({
    opacity: isHovered.value,
    transform: [
      { translateX: x.value * 0.5 },
      { translateY: y.value * 0.5 },
      { scale: interpolate(isHovered.value, [0, 1], [0.5, 1.6]) },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value * 0.1 },
      { translateY: y.value * 0.1 },
    ],
  }));

  return (
    <View style={s.root}>
      {/* ── LAYER 0: SVG Filter for Web Gooey effect ── */}
      {Platform.OS === 'web' && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="liquid-goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </svg>
      )}

      <Animated.View style={magneticStyle}>
        <Pressable 
          onPress={onPress}
          onPointerMove={handleMouseMoveWeb}
          onPointerLeave={handleMouseLeaveWeb}
          onPressIn={() => {
            if (Platform.OS !== 'web') {
              isHovered.value = withSpring(1);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
          onPressOut={() => {
            if (Platform.OS !== 'web') {
              isHovered.value = withSpring(0);
              x.value = withSpring(0);
              y.value = withSpring(0);
            }
          }}
          style={({ pressed }) => [
            s.button,
            pressed && { transform: [{ scale: 0.96 }] }
          ]}
        >
          {/* Base Container for Filter */}
          <View style={[s.gooContainer, Platform.OS === 'web' && { filter: 'url(#liquid-goo-filter)' } as any]}>
            {/* Base Shape */}
            <View style={s.baseShape}>
              <LinearGradient
                colors={[adjustBrightness(ACCENT, 10), adjustBrightness(ACCENT, -20)]}
                style={StyleSheet.absoluteFillObject}
              />
            </View>

            {/* Liquid Blob (The moving part) */}
            <Animated.View style={[s.blob, blobStyle]}>
               <View style={s.blobCircle} />
            </Animated.View>
          </View>

          {/* Luxury Overlay: Lighting & Texture */}
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'transparent']}
            style={s.lighting}
          />
          
          {/* Subtle Noise Texture Placeholder */}
          <View style={s.texture} pointerEvents="none" />

          {/* Content */}
          <Animated.View style={[s.textWrap, textStyle]}>
            <Text style={s.text}>{label}</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 120,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'transparent',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  gooContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 23,
    overflow: 'hidden',
  },
  baseShape: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 23,
  },
  blob: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: -17,
    left: 20,
  },
  blobCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#fff',
    opacity: 0.25,
  },
  lighting: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: '#000', // Mocking noise with a dark overlay
  },
  textWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  text: {
    color: ON_ACCENT,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
  }
});
