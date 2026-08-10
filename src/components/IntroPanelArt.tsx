import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { IntroPanelVisual } from '../types/case';
import { colors, radii } from '../theme';

interface Props {
  visual: IntroPanelVisual;
}

// Real illustrated panels (externally generated, see the prompts used to make them
// in project history) — replaced the earlier SVG silhouette placeholders. The
// IntroPanelVisual keys are historical names from that placeholder era; they still
// map 1:1 to a panel, just no longer describe silhouette art literally.
const PANEL_IMAGES: Record<IntroPanelVisual, ImageSourcePropType> = {
  deskSilhouette: require('../../assets/intro/slide1-desk.jpg'),
  worriedSilhouette: require('../../assets/intro/slide2-notes.jpg'),
  twoSilhouettesDoor: require('../../assets/intro/slide3-silas.jpg'),
  clockCloseup: require('../../assets/intro/slide4-clock.jpg'),
  emptyStudyNight: require('../../assets/intro/slide5-empty.jpg'),
};

export function IntroPanelArt({ visual }: Props) {
  return (
    <View style={styles.frame}>
      <Image source={PANEL_IMAGES[visual]} style={styles.image} resizeMode="cover" />
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
