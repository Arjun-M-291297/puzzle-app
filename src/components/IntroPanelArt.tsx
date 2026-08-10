import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { IntroPanelVisual } from '../types/case';
import { colors, radii } from '../theme';

interface Props {
  visual: IntroPanelVisual;
}

// Short looping animated panels (compressed from source video, ~500-700KB each)
// — replaced the earlier static illustrated stills. expo-image (not core RN
// Image, which doesn't reliably animate GIFs on Android) autoplays and loops
// these natively on iOS/Android/web. IntroPanelVisual keys are historical names
// from an even earlier SVG-silhouette era; they still map 1:1 to a panel.
const PANEL_IMAGES: Record<IntroPanelVisual, ImageSource> = {
  deskSilhouette: require('../../assets/intro/slide1.gif'),
  worriedSilhouette: require('../../assets/intro/slide2.gif'),
  twoSilhouettesDoor: require('../../assets/intro/slide3.gif'),
  clockCloseup: require('../../assets/intro/slide4.gif'),
  emptyStudyNight: require('../../assets/intro/slide5.gif'),
};

export function IntroPanelArt({ visual }: Props) {
  return (
    <View style={styles.frame}>
      <Image source={PANEL_IMAGES[visual]} style={styles.image} contentFit="cover" autoplay />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.ink,
  },
  image: { width: '100%', height: '100%' },
});
