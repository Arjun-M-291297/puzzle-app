import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

interface Props {
  speaker: string;
  speech: string;
  align?: 'left' | 'right';
}

export function SpeechBubble({ speaker, speech, align = 'left' }: Props) {
  return (
    <View style={[styles.wrap, align === 'right' && styles.wrapRight]}>
      <View style={[styles.bubble, align === 'right' && styles.bubbleRight]}>
        <Text style={styles.speaker}>{speaker.toUpperCase()}</Text>
        <Text style={styles.speech}>{speech}</Text>
      </View>
      <View style={[styles.tail, align === 'right' ? styles.tailRight : styles.tailLeft]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-start' },
  wrapRight: { alignItems: 'flex-end' },
  bubble: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    borderBottomLeftRadius: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    maxWidth: '86%',
  },
  bubbleRight: {
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: 4,
  },
  speaker: {
    fontFamily: fonts.display,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.rust,
    marginBottom: 3,
  },
  speech: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: colors.paper,
    marginTop: -1,
  },
  tailLeft: {
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    marginLeft: 6,
  },
  tailRight: {
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    marginRight: 6,
  },
});
