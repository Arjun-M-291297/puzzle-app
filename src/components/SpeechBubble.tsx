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
    borderRadius: radii.sm,
    borderBottomLeftRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: '86%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  bubbleRight: {
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: 3,
  },
  speaker: {
    fontFamily: fonts.display,
    fontSize: 8,
    letterSpacing: 1.2,
    color: colors.rust,
    marginBottom: 2,
  },
  speech: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 17,
    color: colors.ink,
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: colors.paper,
    marginTop: -1,
  },
  tailLeft: {
    borderRightWidth: 7.5,
    borderRightColor: 'transparent',
    marginLeft: 5,
  },
  tailRight: {
    borderLeftWidth: 7.5,
    borderLeftColor: 'transparent',
    marginRight: 5,
  },
});
