import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Animated, { FadeOut } from 'react-native-reanimated';

interface VideoSplashProps {
  onFinish: () => void;
}

/**
 * High-fidelity video splash screen.
 * Plays assets/logo_code.mp4 and triggers onFinish when done.
 */
export const VideoSplash: React.FC<VideoSplashProps> = ({ onFinish }) => {
  const videoRef = useRef<Video>(null);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      onFinish();
    }
  };

  return (
    <Animated.View 
      exiting={FadeOut.duration(400)}
      style={styles.container}
    >
      <Video
        ref={videoRef}
        source={require('@/assets/logo_code.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={true}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
    </Animated.View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#023A22', // Matches brand Off-Road Green
    zIndex: 9999,
  },
  video: {
    width: width,
    height: height,
  },
});
