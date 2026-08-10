import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen, Heading, BodyText, CaseFileLabel, Button, Divider } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { createGuestProfile, useGoogleSignIn } from '../services/auth';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export function AuthScreen({ navigation }: Props) {
  const signIn = useGameStore((s) => s.signIn);
  const { signIn: signInWithGoogle, isConfigured, request } = useGoogleSignIn();
  const [loading, setLoading] = useState<'google' | 'guest' | null>(null);

  const enterApp = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleGoogle = async () => {
    if (!isConfigured) {
      Alert.alert(
        'Google sign-in not configured',
        'Add your OAuth client IDs in app.json → expo.extra.googleAuth to enable this. Continuing as Guest works right now, with the same case progress saved on this device.'
      );
      return;
    }
    try {
      setLoading('google');
      const profile = await signInWithGoogle();
      if (profile) {
        await signIn(profile);
        enterApp();
      }
    } finally {
      setLoading(null);
    }
  };

  const handleGuest = async () => {
    setLoading('guest');
    const profile = await createGuestProfile();
    await signIn(profile);
    setLoading(null);
    enterApp();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.hero}>
          <CaseFileLabel>Case File No. 001</CaseFileLabel>
          <Heading style={styles.title}>THE VANISHING HOUR</Heading>
          <BodyText style={styles.tagline}>
            A recluse vanishes from a locked study at midnight. No body. No forced entry. You
            have the room, and an hour before the trail goes cold.
          </BodyText>
        </View>

        <View style={styles.actions}>
          <Button
            title="Sign in with Google"
            icon="G"
            onPress={handleGoogle}
            loading={loading === 'google'}
            disabled={!request && isConfigured}
          />
          <Divider />
          <Button
            title="Continue as Guest"
            variant="secondary"
            onPress={handleGuest}
            loading={loading === 'guest'}
          />
          <BodyText style={styles.fineprint}>
            Guest progress is saved on this device. Sign in with Google later to keep it safe
            across devices.
          </BodyText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  hero: { marginTop: spacing.xxl },
  title: { fontSize: 30, marginTop: spacing.sm, marginBottom: spacing.md },
  tagline: { fontSize: 16 },
  actions: { paddingBottom: spacing.lg },
  fineprint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.md,
    color: colors.paperDim,
    opacity: 0.7,
  },
});
