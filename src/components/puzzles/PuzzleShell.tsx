import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../../theme';

interface Props {
  visible: boolean;
  title: string;
  flavorText: string;
  onClose: () => void;
  children: React.ReactNode;
  shakeSignal: number; // increment to trigger a shake
}

export function PuzzleShell({ visible, title, flavorText, onClose, children, shakeSignal }: Props) {
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shakeSignal === 0) return;
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeSignal, shake]);

  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { transform: [{ translateX }] }]}>
          <Pressable onPress={onClose} style={styles.close} hitSlop={10}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.flavor}>{flavorText}</Text>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: {
    width: '100%',
    backgroundColor: colors.inkElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
  },
  close: { position: 'absolute', top: spacing.sm, right: spacing.sm, zIndex: 1, padding: spacing.xs },
  closeText: { color: colors.paperDim, fontSize: 16 },
  title: { fontFamily: fonts.display, color: colors.brassBright, fontSize: 17, marginBottom: spacing.sm, paddingRight: spacing.lg },
  flavor: { fontFamily: fonts.serif, color: colors.paperDim, fontSize: 14, lineHeight: 20, marginBottom: spacing.lg },
});
