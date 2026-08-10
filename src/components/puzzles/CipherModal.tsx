import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CipherPuzzle } from '../../types/case';
import { PuzzleShell } from './PuzzleShell';
import { CipherWheel } from './CipherWheel';
import { caesarShift } from '../../utils/caseHelpers';
import { Button } from '../ui';
import { colors, fonts, radii, spacing } from '../../theme';

interface Props {
  puzzle: CipherPuzzle | null;
  onClose: () => void;
  onSolved: () => void;
  onMistake: () => void;
}

export function CipherModal({ puzzle, onClose, onSolved, onMistake }: Props) {
  const [shift, setShift] = useState(0);
  const [shakeSignal, setShakeSignal] = useState(0);

  if (!puzzle) return null;

  const decoded = caesarShift(puzzle.cipherText, -shift);

  const handleClose = () => {
    setShift(0);
    onClose();
  };

  const submit = () => {
    if (decoded === puzzle.plaintext) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShift(0);
      onSolved();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setShakeSignal((n) => n + 1);
      onMistake();
    }
  };

  return (
    <PuzzleShell
      visible={Boolean(puzzle)}
      title={puzzle.title}
      flavorText={puzzle.flavorText}
      onClose={handleClose}
      shakeSignal={shakeSignal}
    >
      <Text style={styles.cipherText}>{puzzle.cipherText}</Text>

      <CipherWheel shift={shift} onShiftChange={setShift} />

      <View style={styles.decodedBox}>
        <Text style={styles.decodedLabel}>DECODED</Text>
        <Text style={styles.decodedText}>{decoded}</Text>
      </View>

      <Button title="Submit" onPress={submit} />
    </PuzzleShell>
  );
}

const styles = StyleSheet.create({
  cipherText: {
    fontFamily: fonts.display,
    color: colors.brassBright,
    fontSize: 17,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  decodedBox: {
    backgroundColor: colors.inkRaised,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    minHeight: 56,
  },
  decodedLabel: { color: colors.paperDim, fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  decodedText: { color: colors.paper, fontFamily: fonts.display, fontSize: 15, letterSpacing: 1 },
});
