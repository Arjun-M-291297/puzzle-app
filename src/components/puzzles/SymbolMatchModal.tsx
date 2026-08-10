import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SymbolMatchPuzzle } from '../../types/case';
import { PuzzleShell } from './PuzzleShell';
import { colors, radii, spacing } from '../../theme';

interface Props {
  puzzle: SymbolMatchPuzzle | null;
  onClose: () => void;
  onSolved: () => void;
  onMistake: () => void;
}

export function SymbolMatchModal({ puzzle, onClose, onSolved, onMistake }: Props) {
  const [selected, setSelected] = useState<number[]>([]); // indices into puzzle.symbols
  const [shakeSignal, setShakeSignal] = useState(0);

  if (!puzzle) return null;

  const handleClose = () => {
    setSelected([]);
    onClose();
  };

  const reset = () => {
    Haptics.selectionAsync();
    setSelected([]);
  };

  const pick = (index: number) => {
    if (selected.includes(index)) return;
    Haptics.selectionAsync();
    const next = [...selected, index];
    setSelected(next);

    if (next.length === puzzle.solutionOrder.length) {
      const chosen = next.map((i) => puzzle.symbols[i]);
      const correct = chosen.every((s, i) => s === puzzle.solutionOrder[i]);
      if (correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
          setSelected([]);
          onSolved();
        }, 250);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setShakeSignal((n) => n + 1);
        onMistake();
        setTimeout(() => setSelected([]), 350);
      }
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
      <View style={styles.selectedRow}>
        {puzzle.solutionOrder.map((_, i) => (
          <View key={i} style={styles.selectedSlot}>
            <Text style={styles.selectedSymbol}>
              {selected[i] !== undefined ? puzzle.symbols[selected[i]] : ''}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.optionsRow}>
        {puzzle.symbols.map((symbol, index) => (
          <Pressable
            key={index}
            style={[styles.option, selected.includes(index) && styles.optionUsed]}
            onPress={() => pick(index)}
            disabled={selected.includes(index)}
          >
            <Text style={styles.optionSymbol}>{symbol}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={reset} style={styles.resetLink}>
        <Text style={styles.resetText}>Reset order</Text>
      </Pressable>
    </PuzzleShell>
  );
}

const styles = StyleSheet.create({
  selectedRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  selectedSlot: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSymbol: { fontSize: 20 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.md },
  option: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: colors.inkRaised,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionUsed: { opacity: 0.25 },
  optionSymbol: { fontSize: 24 },
  resetLink: { alignSelf: 'center', marginTop: spacing.sm },
  resetText: { color: colors.paperDim, fontSize: 12, textDecorationLine: 'underline' },
});
