import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen, Heading, BodyText, CaseFileLabel, Button } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { allCases, vanishingHour } from '../data/cases/vanishingHour';
import { colors, fonts, radii, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Ending'>;

export function EndingScreen({ route, navigation }: Props) {
  const { caseId, solvedCorrectly } = route.params;
  const def = allCases.find((c) => c.id === caseId) ?? vanishingHour;
  const streak = useGameStore((s) => s.streak);
  const resetCase = useGameStore((s) => s.resetCase);

  const scale = useRef(new Animated.Value(2.2)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(solvedCorrectly ? -8 : -4)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(350),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
    ]).start();
  }, [scale, opacity]);

  const backToDesk = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

  const tryAgain = () => {
    resetCase(def.id, def.scenes[0].id);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }, { name: 'Play', params: { caseId: def.id } }] });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.stampWrap}>
          <Animated.View
            style={[
              styles.stamp,
              solvedCorrectly ? styles.stampSolved : styles.stampUnsolved,
              {
                opacity,
                transform: [{ scale }, { rotate: rotate.interpolate({ inputRange: [-8, 0], outputRange: ['-8deg', '0deg'] }) }],
              },
            ]}
          >
            <Text style={[styles.stampText, solvedCorrectly ? styles.stampTextSolved : styles.stampTextUnsolved]}>
              {solvedCorrectly ? 'CASE CLOSED' : 'UNRESOLVED'}
            </Text>
          </Animated.View>
        </View>

        <CaseFileLabel>{def.subtitle}</CaseFileLabel>
        <Heading style={styles.title}>{solvedCorrectly ? 'Solved.' : 'Not quite.'}</Heading>
        <BodyText style={styles.ending}>
          {solvedCorrectly ? def.correctEnding : def.incorrectEnding}
        </BodyText>

        {solvedCorrectly && streak.currentStreak > 1 && (
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <BodyText style={styles.streakText}>
              {streak.currentStreak}-day streak. Come back tomorrow to keep it alive.
            </BodyText>
          </View>
        )}

        <View style={styles.actions}>
          {solvedCorrectly ? (
            <Button title="Back to the Desk" onPress={backToDesk} />
          ) : (
            <>
              <Button title="Walk the Room Again" onPress={tryAgain} />
              <Button title="Back to the Desk" variant="ghost" onPress={backToDesk} />
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl, alignItems: 'center' },
  stampWrap: { height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  stamp: {
    borderWidth: 3,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  stampSolved: { borderColor: colors.rust },
  stampUnsolved: { borderColor: colors.paperDim },
  stampText: { fontFamily: fonts.display, fontSize: 22, letterSpacing: 2 },
  stampTextSolved: { color: colors.rustBright },
  stampTextUnsolved: { color: colors.paperDim },
  title: { fontSize: 26, marginTop: spacing.sm, marginBottom: spacing.md, textAlign: 'center' },
  ending: { fontSize: 15, textAlign: 'center', marginBottom: spacing.lg },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.inkElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  streakEmoji: { fontSize: 22 },
  streakText: { flex: 1, fontSize: 13 },
  actions: { width: '100%', gap: spacing.sm },
});
