import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../navigation/types';
import { Screen, Heading, BodyText, CaseFileLabel } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { rankTitleFor } from '../services/storage';
import { vanishingHour } from '../data/cases/vanishingHour';
import { colors, radii, shadow, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const profile = useGameStore((s) => s.profile);
  const streak = useGameStore((s) => s.streak);
  const rank = useGameStore((s) => s.rank);
  const progress = useGameStore((s) => s.progressByCase[vanishingHour.id]);
  const signOut = useGameStore((s) => s.signOut);

  const status = !progress
    ? 'New Case'
    : progress.completed
    ? progress.solvedCorrectly
      ? 'Solved'
      : 'Case Unresolved'
    : 'In Progress';

  const openCase = () => {
    Haptics.selectionAsync();
    navigation.navigate('CaseIntro', { caseId: vanishingHour.id });
  };

  const notifyMe = () => {
    Haptics.selectionAsync();
    Alert.alert('Noted, Detective', "You'll be the first to know when Case No. 002 opens.");
  };

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'Your case progress stays saved on this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { signOut(); navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }); } },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <CaseFileLabel>Detective's Desk</CaseFileLabel>
            <Heading style={styles.greeting}>
              {profile?.isGuest ? 'Welcome, Detective' : `Welcome back, ${profile?.displayName?.split(' ')[0] ?? 'Detective'}`}
            </Heading>
          </View>
          <Pressable onPress={handleSignOut} hitSlop={12}>
            <Text style={styles.signOut}>Sign Out</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak.currentStreak}</Text>
            <CaseFileLabel style={styles.statLabel}>Day Streak</CaseFileLabel>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🕵️</Text>
            <Text style={styles.statValue}>{rankTitleFor(rank)}</Text>
            <CaseFileLabel style={styles.statLabel}>Rank</CaseFileLabel>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📁</Text>
            <Text style={styles.statValue}>{rank.totalCasesSolved}</Text>
            <CaseFileLabel style={styles.statLabel}>Solved</CaseFileLabel>
          </View>
        </View>

        <CaseFileLabel style={styles.sectionLabel}>Open Cases</CaseFileLabel>

        <Pressable onPress={openCase} style={({ pressed }) => [styles.caseCard, pressed && styles.pressed]}>
          <View style={styles.caseCardTop}>
            <CaseFileLabel>Case No. 001 · Free</CaseFileLabel>
            <View style={[styles.statusPill, status === 'Solved' && styles.statusPillSolved]}>
              <Text style={styles.statusPillText}>{status}</Text>
            </View>
          </View>
          <Heading style={styles.caseTitle}>{vanishingHour.title}</Heading>
          <BodyText numberOfLines={2} style={styles.caseSummary}>
            {vanishingHour.premise}
          </BodyText>
          <Text style={styles.caseMeta}>~{vanishingHour.estimatedMinutes} min · Locked-room mystery</Text>
        </Pressable>

        <Pressable onPress={notifyMe} style={({ pressed }) => [styles.caseCard, styles.lockedCard, pressed && styles.pressed]}>
          <View style={styles.caseCardTop}>
            <CaseFileLabel>Case No. 002</CaseFileLabel>
            <View style={styles.statusPillLocked}>
              <Text style={styles.statusPillText}>🔒 Coming Soon</Text>
            </View>
          </View>
          <Heading style={[styles.caseTitle, styles.lockedTitle]}>The Second Shadow</Heading>
          <BodyText style={styles.caseSummary}>
            A twist ending leaves more questions than answers. Solve Case No. 001 first — the
            connection isn't a coincidence.
          </BodyText>
          <Text style={styles.notifyText}>Tap to get notified →</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: { fontSize: 20, marginTop: spacing.xs, maxWidth: 240 },
  signOut: { color: colors.paperDim, fontFamily: 'System', fontSize: 12, marginTop: spacing.sm },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: colors.inkElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: { fontSize: 18 },
  statValue: { color: colors.paper, fontFamily: 'System', fontWeight: '700', fontSize: 15 },
  statLabel: { fontSize: 9 },
  sectionLabel: { marginBottom: spacing.sm },
  caseCard: {
    backgroundColor: colors.inkElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },
  lockedCard: { opacity: 0.75 },
  caseCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  statusPill: {
    backgroundColor: 'rgba(201,154,82,0.15)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusPillSolved: { backgroundColor: 'rgba(111,156,106,0.2)' },
  statusPillLocked: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusPillText: { color: colors.paper, fontSize: 10, fontFamily: 'System', fontWeight: '600' },
  caseTitle: { fontSize: 20, marginBottom: spacing.xs },
  lockedTitle: { color: colors.paperDim },
  caseSummary: { fontSize: 13, marginBottom: spacing.sm },
  caseMeta: { color: colors.brass, fontSize: 11, fontFamily: 'System', fontWeight: '600' },
  notifyText: { color: colors.brass, fontSize: 12, fontFamily: 'System', fontWeight: '600' },
});
