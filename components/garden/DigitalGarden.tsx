import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing,
  useDerivedValue,
  interpolateColor
} from 'react-native-reanimated';
import { ACCENT } from '@/lib/theme';

export type GardenStage = 'seedling' | 'sprout' | 'sapling' | 'bonsai';

interface DigitalGardenProps {
  stage: GardenStage;
  isWilted?: boolean;
  size?: number;
}

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * The Digital Garden: A visual anchor for focus consistency.
 * Optimized for maximum cross-platform stability.
 * Consolidates all animations into useAnimatedProps to avoid Web style-object conflicts.
 */
export const DigitalGarden: React.FC<DigitalGardenProps> = ({ 
  stage, 
  isWilted = false, 
  size = 200 
}) => {
  const rotation = useSharedValue(0);
  const wiltProgress = useSharedValue(0);

  // Initialize sway animation
  React.useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-2, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  // Handle wilt transition
  React.useEffect(() => {
    wiltProgress.value = withTiming(isWilted ? 1 : 0, { duration: 1000 });
  }, [isWilted]);

  const animatedColor = useDerivedValue(() => {
    return interpolateColor(
      wiltProgress.value,
      [0, 1],
      [ACCENT, '#566B5E']
    );
  });

  // ─── Animation Props (Native & Web reliable) ───

  // Helper for generating standard SVG rotate strings
  const getRotate = (val: number, cx: number, cy: number) => `rotate(${val} ${cx} ${cy})`;

  // Sapling canopy sway props
  const saplingCanopyProps = useAnimatedProps(() => ({
    transform: getRotate(rotation.value, 20, 10),
    fill: animatedColor.value,
  }));

  // Bonsai canopy sway props
  const bonsaiCanopyProps = useAnimatedProps(() => ({
    transform: getRotate(rotation.value, 35, 5),
    fill: animatedColor.value,
  }));

  // Trunk/Stem color props
  const trunkProps = useAnimatedProps(() => ({
    stroke: animatedColor.value,
  }));

  // Static leaf/circle color props
  const leafProps = useAnimatedProps(() => ({
    fill: animatedColor.value,
  }));

  const renderPlant = () => {
    const commonPathProps = { strokeLinecap: 'round' as const, fill: 'none' as const };
    
    switch (stage) {
      case 'seedling':
        return (
          <G transform={`translate(${size/2 - 10}, ${size - 40})`}>
            <AnimatedPath d="M0,10 Q10,0 20,10" animatedProps={trunkProps} strokeWidth="2" opacity={0.3} />
            <AnimatedPath d="M8,5 Q12,-5 16,5" animatedProps={leafProps} />
          </G>
        );
      case 'sprout':
        return (
          <G transform={`translate(${size/2 - 15}, ${size - 60})`}>
            <AnimatedPath d="M15,30 Q15,15 15,0" strokeWidth="3" animatedProps={trunkProps} {...commonPathProps} />
            <AnimatedG animatedProps={saplingCanopyProps}>
               <AnimatedPath d="M15,10 Q5,0 0,10" animatedProps={leafProps} />
               <AnimatedPath d="M15,5 Q25,-5 30,5" animatedProps={leafProps} />
            </AnimatedG>
          </G>
        );
      case 'sapling':
        return (
          <G transform={`translate(${size/2 - 20}, ${size - 85})`}>
            <AnimatedPath d="M20,55 Q20,30 20,10" strokeWidth="4" animatedProps={trunkProps} {...commonPathProps} />
            <AnimatedG animatedProps={saplingCanopyProps}>
               <AnimatedCircle cx="20" cy="5" r="18" animatedProps={leafProps} opacity={0.5} />
               <AnimatedCircle cx="8" cy="15" r="14" animatedProps={leafProps} opacity={0.3} />
               <AnimatedCircle cx="32" cy="15" r="14" animatedProps={leafProps} opacity={0.3} />
            </AnimatedG>
          </G>
        );
      case 'bonsai':
        return (
          <G transform={`translate(${size/2 - 40}, ${size - 110})`}>
            <AnimatedPath 
              d="M40,80 Q30,50 45,30 Q55,15 35,5" 
              strokeWidth="6" 
              animatedProps={trunkProps}
              {...commonPathProps}
            />
            <AnimatedG animatedProps={bonsaiCanopyProps}>
               <AnimatedCircle cx="35" cy="0" r="28" animatedProps={leafProps} opacity={0.6} />
               <AnimatedCircle cx="15" cy="12" r="22" animatedProps={leafProps} opacity={0.4} />
               <AnimatedCircle cx="60" cy="10" r="20" animatedProps={leafProps} opacity={0.4} />
               <AnimatedCircle cx="35" cy="-15" r="15" animatedProps={leafProps} opacity={0.3} />
               {!isWilted && (
                 <AnimatedCircle cx="35" cy="0" r="45" animatedProps={leafProps} opacity={0.05} />
               )}
            </AnimatedG>
          </G>
        );
    }
  };

  return (
    <View 
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      pointerEvents="box-none"
    >
      <Svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#C6E4C5" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="transparent" />
          </LinearGradient>
        </Defs>
        <Circle cx={size/2} cy={size - 25} r={size/4} fill="url(#groundGrad)" />
        {renderPlant()}
      </Svg>
    </View>
  );
};
