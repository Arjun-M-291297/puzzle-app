import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../navigation/types';
import { Screen, Heading, BodyText, CaseFileLabel, Button } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { allCases, vanishingHour } from '../data/cases/vanishingHour';
import { colors, radii, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EvidenceBoard'>;

export function EvidenceBoardScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const def = allCases.find((c) => c.id === caseId) ?? vanishingHour;

  const progress = useGameStore((s) => s.progressByCase[caseId]);
  const setDeductionSelection = useGameStore((s) => s.setDeductionSelection);
  const finishCase = useGameStore((s) => s.finishCase);

  if (!progress) return null;

  const selections = progress.deductionSelections;
  const allChosen = def.deduction.every((slot) => selections[slot.id]);

  const choose = (slotId: 'suspect' | 'method' | 'motive', optionId: string) => {
    Haptics.selectionAsync();
    setDeductionSelection(caseId, slotId, optionId);
  };

  const closeCase = () => {
    const correct = def.deduction.every((slot) => selections[slot.id] === slot.correctOptionId);
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    );
    finishCase(caseId, correct);
    navigation.replace('Ending', { caseId, solvedCorrectly: correct });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CaseFileLabel>Final Deduction</CaseFileLabel>
        <Heading style={styles.title}>The Evidence Board</Heading>
        <BodyText style={styles.intro}>
          Pin your conclusion. Choose one answer for each — there's no going back once the case
          is closed.
        </BodyText>

        {def.deduction.map((slot) => (
          <View key={slot.id} style={styles.slotCard}>
            <CaseFileLabel style={styles.slotLabel}>{slot.label}</CaseFileLabel>
            {slot.options.map((option) => {
              const selected = selections[slot.id] === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => choose(slot.id, option.id)}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]} />
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        <Button title="Close the Case" onPress={closeCase} disabled={!allChosen} />
        <View style={{ height: spacing.lg }} />
        <Button title="Back to the Room" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: 24, marginTop: spacing.xs, marginBottom: spacing.sm },
  intro: { fontSize: 14, marginBottom: spacing.lg },
  slotCard: {
    backgroundColor: colors.inkElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  slotLabel: { marginBottom: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.sm,
  },
  optionSelected: { backgroundColor: 'rgba(201,154,82,0.1)' },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  radioSelected: { backgroundColor: colors.brass, borderColor: colors.brass },
  optionText: { color: colors.paperDim, fontSize: 14, flex: 1 },
  optionTextSelected: { color: colors.paper, fontWeight: '600' },
});
