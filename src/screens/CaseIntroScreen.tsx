import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen, Heading, BodyText, CaseFileLabel, Button } from '../components/ui';
import { ReadAloudButton } from '../components/ReadAloudButton';
import { useGameStore } from '../store/gameStore';
import { vanishingHour } from '../data/cases/vanishingHour';
import { colors, radii, spacing } from '../theme';

const edmundPortrait = require('../../assets/intro/edmund-portrait.jpg');

type Props = NativeStackScreenProps<RootStackParamList, 'CaseIntro'>;

export function CaseIntroScreen({ navigation }: Props) {
  const def = vanishingHour; // single-case MVP; swap for a lookup once more cases ship
  const startOrResumeCase = useGameStore((s) => s.startOrResumeCase);
  const progress = useGameStore((s) => s.progressByCase[def.id]);

  const hasStarted = Boolean(progress && !progress.completed && progress.collectedClueIds.length > 0);
  const isCompleted = Boolean(progress?.completed);

  const begin = () => {
    const current = startOrResumeCase(def);
    if (current.introSeen) navigation.navigate('Play', { caseId: def.id });
    else navigation.navigate('Intro', { caseId: def.id });
  };

  const replay = () => {
    // resetCase preserves introSeen — a replay never re-shows the cold open.
    useGameStore.getState().resetCase(def.id, def.scenes[0].id);
    navigation.navigate('Play', { caseId: def.id });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View>
          <View style={styles.subtitleRow}>
            <CaseFileLabel>{def.subtitle}</CaseFileLabel>
            <ReadAloudButton text={`${def.title}. ${def.premise}`} resetKey={def.id} />
          </View>
          <Heading style={styles.title}>{def.title}</Heading>
          <BodyText style={styles.premise}>{def.premise}</BodyText>
          <BodyText style={styles.meta}>
            Estimated {def.estimatedMinutes} minutes · {def.scenes.length} locations ·{' '}
            {def.puzzles.length} puzzles to solve
          </BodyText>

          <View style={styles.portraitRow}>
            <Image source={edmundPortrait} style={styles.portrait} resizeMode="cover" />
            <View style={styles.portraitCaption}>
              <CaseFileLabel>Subject</CaseFileLabel>
              <BodyText style={styles.portraitName}>Edmund Voss</BodyText>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title={isCompleted ? 'Review the Case' : hasStarted ? 'Continue Investigation' : 'Begin Investigation'}
            onPress={begin}
          />
          {(hasStarted || isCompleted) && (
            <Button title="Start Over" variant="ghost" onPress={replay} />
          )}
          <Button title="Back to Desk" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: spacing.xl },
  subtitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, marginTop: spacing.sm, marginBottom: spacing.lg },
  premise: { fontSize: 16, marginBottom: spacing.lg },
  meta: { fontSize: 12, opacity: 0.7 },
  portraitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  portrait: {
    width: 64,
    height: 64,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.brass,
  },
  portraitCaption: { gap: 2 },
  portraitName: { fontSize: 15, marginBottom: 0 },
  actions: { gap: spacing.sm, paddingBottom: spacing.lg },
});
