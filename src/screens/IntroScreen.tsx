import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../navigation/types';
import { allCases, vanishingHour } from '../data/cases/vanishingHour';
import { useGameStore } from '../store/gameStore';
import { IntroPanelArt } from '../components/IntroPanelArt';
import { SpeechBubble } from '../components/SpeechBubble';
import { Button, BodyText } from '../components/ui';
import { colors, fonts, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

export function IntroScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const def = allCases.find((c) => c.id === caseId) ?? vanishingHour;
  const markIntroSeen = useGameStore((s) => s.markIntroSeen);

  const [index, setIndex] = useState(0);
  const slide = def.intro[index];
  const isLast = index === def.intro.length - 1;

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

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <View style={styles.dots}>
            {def.intro.map((s, i) => (
              <View key={s.id} style={[styles.dot, i === index && styles.dotActive, i < index && styles.dotPast]} />
            ))}
          </View>
          <Pressable onPress={finish} hitSlop={10}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <Pressable style={styles.panelWrap} onPress={advance}>
          <IntroPanelArt visual={slide.visual} />
        </Pressable>

        <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: rise }] }]}>
          {slide.title && <Text style={styles.title}>{slide.title}</Text>}
          {slide.speaker && slide.speech && (
            <View style={styles.bubbleRow}>
              <SpeechBubble speaker={slide.speaker} speech={slide.speech} />
            </View>
          )}
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
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotPast: { backgroundColor: colors.brassDim },
  dotActive: { backgroundColor: colors.brassBright, width: 16 },
  skip: { color: colors.paperDim, fontFamily: fonts.display, fontSize: 12, letterSpacing: 1 },
  panelWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: spacing.md,
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
  bubbleRow: { marginBottom: spacing.md },
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
