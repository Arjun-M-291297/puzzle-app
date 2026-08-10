import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { NumberLockPuzzle } from '../../types/case';
import { PuzzleShell } from './PuzzleShell';
import { colors, fonts, radii, spacing } from '../../theme';

interface Props {
  puzzle: NumberLockPuzzle | null;
  onClose: () => void;
  onSolved: () => void;
  onMistake: () => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];

export function NumberLockModal({ puzzle, onClose, onSolved, onMistake }: Props) {
  const [entry, setEntry] = useState('');
  const [shakeSignal, setShakeSignal] = useState(0);

  if (!puzzle) return null;

  const handleClose = () => {
    setEntry('');
    onClose();
  };

  const submit = (value: string) => {
    if (value === puzzle.solution) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEntry('');
      onSolved();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setShakeSignal((n) => n + 1);
      onMistake();
      setEntry('');
    }
  };

  const press = (key: string) => {
    if (key === '⌫') {
      setEntry((e) => e.slice(0, -1));
      return;
    }
    if (key === '✓') {
      if (entry.length === puzzle.digits) submit(entry);
      return;
    }
    Haptics.selectionAsync();
    setEntry((e) => {
      const next = e.length < puzzle.digits ? e + key : e;
      if (next.length === puzzle.digits) setTimeout(() => submit(next), 120);
      return next;
    });
  };

  return (
    <PuzzleShell
      visible={Boolean(puzzle)}
      title={puzzle.title}
      flavorText={puzzle.flavorText}
      onClose={handleClose}
      shakeSignal={shakeSignal}
    >
      <View style={styles.digitsRow}>
        {Array.from({ length: puzzle.digits }).map((_, i) => (
          <View key={i} style={styles.digitBox}>
            <Text style={styles.digitText}>{entry[i] ?? ''}</Text>
          </View>
        ))}
      </View>
      <View style={styles.keypad}>
        {KEYS.map((key) => (
          <Pressable key={key} style={styles.key} onPress={() => press(key)}>
            <Text style={styles.keyText}>{key}</Text>
          </Pressable>
        ))}
      </View>
    </PuzzleShell>
  );
}

const styles = StyleSheet.create({
  digitsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  digitBox: {
    width: 44,
    height: 54,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: { color: colors.paper, fontFamily: fonts.display, fontSize: 22 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  key: {
    width: '28%',
    aspectRatio: 1.6,
    borderRadius: radii.sm,
    backgroundColor: colors.inkRaised,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { color: colors.paper, fontFamily: fonts.display, fontSize: 18 },
});
