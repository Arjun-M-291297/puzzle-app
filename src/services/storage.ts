import AsyncStorage from '@react-native-async-storage/async-storage';
import { CaseProgress } from '../types/case';

// Local-first persistence behind a small repository interface. Every read/write
// in the app goes through GameRepository, not AsyncStorage directly — so the
// backing store can be swapped for Firestore/Supabase later (see README) without
// touching a single screen or the store.

export interface PlayerProfile {
  id: string;
  displayName: string;
  email?: string;
  photoUrl?: string;
  isGuest: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDateISO: string | null; // yyyy-mm-dd, local
  streakProtectionCharges: number;
}

export interface RankData {
  totalCasesSolved: number;
  totalHintsUsed: number;
  totalMistakes: number;
}

export const RANK_TIERS = [
  { minSolved: 0, title: 'Rookie' },
  { minSolved: 1, title: 'Sharp Eye' },
  { minSolved: 3, title: 'Sleuth' },
  { minSolved: 6, title: 'Master Detective' },
] as const;

export function rankTitleFor(rank: RankData): string {
  let title: string = RANK_TIERS[0].title;
  for (const tier of RANK_TIERS) {
    if (rank.totalCasesSolved >= tier.minSolved) title = tier.title;
  }
  return title;
}

const KEYS = {
  profile: 'vh:profile',
  streak: 'vh:streak',
  rank: 'vh:rank',
  audioEnabled: 'vh:audioEnabled',
  progress: (caseId: string) => `vh:progress:${caseId}`,
} as const;

export interface GameRepository {
  getProfile(): Promise<PlayerProfile | null>;
  saveProfile(profile: PlayerProfile): Promise<void>;
  clearProfile(): Promise<void>;

  getCaseProgress(caseId: string): Promise<CaseProgress | null>;
  saveCaseProgress(progress: CaseProgress): Promise<void>;

  getStreak(): Promise<StreakData>;
  saveStreak(streak: StreakData): Promise<void>;

  getRank(): Promise<RankData>;
  saveRank(rank: RankData): Promise<void>;

  /** Read-aloud narration preference — defaults to on (true) the first time it's read. */
  getAudioEnabled(): Promise<boolean>;
  saveAudioEnabled(enabled: boolean): Promise<void>;
}

async function readJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJSON(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

class AsyncStorageGameRepository implements GameRepository {
  async getProfile(): Promise<PlayerProfile | null> {
    return readJSON<PlayerProfile>(KEYS.profile);
  }

  async saveProfile(profile: PlayerProfile): Promise<void> {
    await writeJSON(KEYS.profile, profile);
  }

  async clearProfile(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.profile);
  }

  async getCaseProgress(caseId: string): Promise<CaseProgress | null> {
    return readJSON<CaseProgress>(KEYS.progress(caseId));
  }

  async saveCaseProgress(progress: CaseProgress): Promise<void> {
    await writeJSON(KEYS.progress(progress.caseId), progress);
  }

  async getStreak(): Promise<StreakData> {
    const existing = await readJSON<StreakData>(KEYS.streak);
    return (
      existing ?? {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDateISO: null,
        streakProtectionCharges: 0,
      }
    );
  }

  async saveStreak(streak: StreakData): Promise<void> {
    await writeJSON(KEYS.streak, streak);
  }

  async getRank(): Promise<RankData> {
    const existing = await readJSON<RankData>(KEYS.rank);
    return existing ?? { totalCasesSolved: 0, totalHintsUsed: 0, totalMistakes: 0 };
  }

  async saveRank(rank: RankData): Promise<void> {
    await writeJSON(KEYS.rank, rank);
  }

  async getAudioEnabled(): Promise<boolean> {
    const raw = await AsyncStorage.getItem(KEYS.audioEnabled);
    return raw === null ? true : raw === 'true';
  }

  async saveAudioEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.audioEnabled, enabled ? 'true' : 'false');
  }
}

export const gameRepository: GameRepository = new AsyncStorageGameRepository();

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO + 'T00:00:00');
  const b = new Date(bISO + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** Applies today's visit to streak data, returning the updated streak and whether it grew today. */
export function applyDailyVisit(streak: StreakData): { streak: StreakData; grew: boolean } {
  const today = todayISO();
  if (streak.lastActiveDateISO === today) {
    return { streak, grew: false };
  }
  if (!streak.lastActiveDateISO) {
    const next = { ...streak, currentStreak: 1, longestStreak: Math.max(1, streak.longestStreak), lastActiveDateISO: today };
    return { streak: next, grew: true };
  }
  const gap = daysBetween(streak.lastActiveDateISO, today);
  if (gap === 1) {
    const currentStreak = streak.currentStreak + 1;
    const next = { ...streak, currentStreak, longestStreak: Math.max(currentStreak, streak.longestStreak), lastActiveDateISO: today };
    return { streak: next, grew: true };
  }
  if (gap === 2 && streak.streakProtectionCharges > 0) {
    const currentStreak = streak.currentStreak + 1;
    const next = {
      ...streak,
      currentStreak,
      longestStreak: Math.max(currentStreak, streak.longestStreak),
      lastActiveDateISO: today,
      streakProtectionCharges: streak.streakProtectionCharges - 1,
    };
    return { streak: next, grew: true };
  }
  const next = { ...streak, currentStreak: 1, longestStreak: Math.max(1, streak.longestStreak), lastActiveDateISO: today };
  return { streak: next, grew: true };
}
