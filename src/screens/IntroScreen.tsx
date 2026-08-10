import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../navigation/types';
import { allCases, vanishingHour } from '../data/cases/vanishingHour';
import { useGameStore } from '../store/gameStore';
import { IntroPanelArt } from '../components/IntroPanelArt';
import { SpeechBubble } from '../components/SpeechBubble';
import { ReadAloudButton } from '../components/ReadAloudButton';
import { Button, BodyText } from '../components/ui';
import { colors, fonts, spacing } from '../theme';
import { IntroSlide } from '../types/case';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

// Matches the old fixed top-left inset when a slide doesn't specify exactly
// where in frame the speaker's mouth is.
const DEFAULT_BUBBLE_ORIGIN = { x: 0.08, y: 0.12 };

function slideNarration(slide: IntroSlide): string {
  const parts: string[] = [];
  if (slide.title) parts.push(slide.title);
  if (slide.speaker && slide.speech) parts.push(`${slide.speaker}: ${slide.speech}`);
  else if (slide.speech) parts.push(slide.speech);
  if (slide.caption) parts.push(slide.caption);
  return parts.join('. ');
}

export function IntroScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const def = allCases.find((c) => c.id === caseId) ?? vanishingHour;
  const markIntroSeen = useGameStore((s) => s.markIntroSeen);

  const [index, setIndex] = useState(0);
  const slide = def.intro[index];
  const isLast = index === def.intro.length - 1;

  // The bubble's tail anchors to this exact point in the video frame (the
  // speaker's mouth); the bubble body extends left or right from there —
  // auto-picked to stay in frame, or overridden per-slide via bubbleAlign.
  const bubbleOrigin = slide.bubbleOrigin ?? DEFAULT_BUBBLE_ORIGIN;
  const bubbleAlign: 'left' | 'right' = slide.bubbleAlign ?? (bubbleOrigin.x < 0.5 ? 'left' : 'right');
  const bubblePositionStyle: ViewStyle = {
    bottom: `${(1 - bubbleOrigin.y) * 100}%` as `${number}%`,
    ...(bubbleAlign === 'left'
      ? { left: `${bubbleOrigin.x * 100}%` as `${number}%` }
      : { right: `${(1 - bubbleOrigin.x) * 100}%` as `${number}%` }),
  };

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    fade.setValue(0);
    rise.setValue(14);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, [index, fade, rise]);

  const finish = () => {
    markIntroSeen(caseId);
    navigation.replace('Play', { caseId });
  };

  const advance = () => {
    Haptics.selectionAsync();
    if (isLast) finish();
    else setIndex((i) => i + 1);
  };

  const goBack = () => {
    Haptics.selectionAsync();
    // Even on slide one, "back" is never a dead end — it returns to the case intro screen.
    if (index > 0) setIndex((i) => i - 1);
    else navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable onPress={goBack} hitSlop={10} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </Pressable>
          <View style={styles.dots}>
            {def.intro.map((s, i) => (
              <View key={s.id} style={[styles.dot, i === index && styles.dotActive, i < index && styles.dotPast]} />
            ))}
          </View>
          <View style={styles.topRight}>
            <ReadAloudButton text={slideNarration(slide)} resetKey={slide.id} />
            <Pressable onPress={finish} hitSlop={10}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.panelWrap} onPress={advance}>
          <IntroPanelArt visual={slide.visual} />
          {slide.speaker && slide.speech && (
            <Animated.View
              style={[
                styles.bubbleOverlay,
                bubblePositionStyle,
                { opacity: fade, transform: [{ translateY: rise }] },
              ]}
              pointerEvents="none"
            >
              <SpeechBubble speaker={slide.speaker} speech={slide.speech} align={bubbleAlign} />
            </Animated.View>
          )}
        </Pressable>

        <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: rise }] }]}>
          {slide.title && <Text style={styles.title}>{slide.title}</Text>}
          {slide.caption && <BodyText style={styles.caption}>{slide.caption}</BodyText>}
        </Animated.View>

        <View style={styles.footer}>
          <Button title={isLast ? 'Begin Investigation' : 'Continue'} onPress={advance} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backBtn: { minWidth: 60 },
  backText: { color: colors.paperDim, fontFamily: fonts.display, fontSize: 12, letterSpacing: 1 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotPast: { backgroundColor: colors.brassDim },
  dotActive: { backgroundColor: colors.brassBright, width: 16 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: 60, justifyContent: 'flex-end' },
  skip: { color: colors.paperDim, fontFamily: fonts.display, fontSize: 12, letterSpacing: 1 },
  panelWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: spacing.md,
    position: 'relative',
  },
  bubbleOverlay: {
    position: 'absolute',
    maxWidth: '78%',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontFamily: fonts.display,
    color: colors.brassBright,
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  caption: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.85,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
