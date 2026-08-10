import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radii, spacing } from '../theme';

export function Screen({ children, style }: ViewProps) {
  return (
    <LinearGradient colors={[colors.inkRaised, colors.ink]} style={styles.fill}>
      <SafeAreaView style={[styles.fill, style]}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

export function CaseFileLabel({ children, style, ...rest }: TextProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Heading({ children, style, ...rest }: TextProps) {
  return (
    <Text style={[styles.heading, style]} {...rest}>
      {children}
    </Text>
  );
}

export function BodyText({ children, style, ...rest }: TextProps) {
  return (
    <Text style={[styles.body, style]} {...rest}>
      {children}
    </Text>
  );
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, icon }: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        (disabled || loading) && styles.buttonDisabled,
        pressed && !disabled && !loading && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'primary' && styles.buttonTextPrimary,
            variant !== 'primary' && styles.buttonTextSecondary,
          ]}
        >
          {icon ? `${icon}  ` : ''}
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  label: {
    fontFamily: fonts.display,
    color: colors.brass,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: fonts.display,
    color: colors.paper,
    fontSize: 24,
    letterSpacing: 0.5,
  },
  body: {
    fontFamily: fonts.serif,
    color: colors.paperDim,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: colors.brass,
    borderColor: colors.brass,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: colors.borderStrong,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  buttonText: {
    fontFamily: fonts.display,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buttonTextPrimary: { color: colors.ink },
  buttonTextSecondary: { color: colors.paper },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
