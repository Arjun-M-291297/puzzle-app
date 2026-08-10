import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ClueEntry } from '../types/case';
import { Button } from './ui';
import { colors, fonts, radii, spacing } from '../theme';

interface Props {
  clue: ClueEntry | null;
  revealOnce?: boolean;
  onDismiss: () => void;
}

export function ClueModal({ clue, revealOnce, onDismiss }: Props) {
  const bar = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!clue) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (revealOnce) {
      bar.setValue(1);
      Animated.timing(bar, { toValue: 0, duration: 4200, useNativeDriver: false }).start(({ finished }) => {
        if (finished) onDismiss();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clue]);

  return (
    <Modal visible={Boolean(clue)} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>{clue?.icon}</Text>
          <Text style={styles.title}>{clue?.title}</Text>
          <Text style={styles.detail}>{clue?.detail}</Text>
          {revealOnce ? (
            <>
              <View style={styles.trackBg}>
                <Animated.View
                  style={[
                    styles.trackFill,
                    { width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                  ]}
                />
              </View>
              <Text style={styles.warn}>Memorize this — it won't stay in your notebook.</Text>
            </>
          ) : (
            <Button title="Add to Notebook" onPress={onDismiss} />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.inkElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
    alignItems: 'center',
  },
  icon: { fontSize: 34, marginBottom: spacing.sm },
  title: {
    fontFamily: fonts.display,
    color: colors.brassBright,
    fontSize: 16,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  detail: {
    fontFamily: fonts.serif,
    color: colors.paper,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  trackBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  trackFill: { height: '100%', backgroundColor: colors.rust },
  warn: { color: colors.rustBright, fontSize: 12, textAlign: 'center' },
});
