import { Share, Platform } from 'react-native';

/**
 * Robust sharing utility that works on Native and Web.
 */
export const shareAchievement = async (label: string) => {
  const message = `I forged my focus today and earned time for: ${label}! Check out FocusForge. 🌿`;
  
  try {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        await navigator.share({
          title: 'FocusForge Achievement',
          text: message,
          url: window.location.origin,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        alert('Copying message to clipboard: \n\n' + message);
        await navigator.clipboard.writeText(message);
      }
    } else {
      // Native Share API
      await Share.share({
        message,
        title: 'FocusForge Achievement',
      });
    }
  } catch (error) {
    console.error('Error sharing achievement:', error);
  }
};
