import React, { useRef } from 'react';
import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Animated, { FadeOut } from 'react-native-reanimated';

interface VideoSplashProps {
  onFinish: () => void;
}

/**
 * High-fidelity video splash screen.
 * Uses orientation-specific assets and explicit window dimensions to ensure full coverage.
 */
export const VideoSplash: React.FC<VideoSplashProps> = ({ onFinish }) => {
  const videoRef = useRef<Video>(null);
  const { width, height } = useWindowDimensions();

  // Choose asset based on current orientation
  const isPortrait = height > width;
  const videoSource = isPortrait 
    ? require('@/assets/logo_code_916.mp4') 
    : require('@/assets/logo_code.mp4');

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      onFinish();
    }
  };

  return (
    <Animated.View 
      exiting={FadeOut.duration(400)}
      style={{
        position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: '#C6E4C5', // Exact Celadon White
        zIndex: 99999,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Video
        ref={videoRef}
        source={videoSource}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={true}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
    </Animated.View>
  );
};
