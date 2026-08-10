import { create } from 'zustand';
import { CaseDefinition, CaseProgress, ClueEntry } from '../types/case';
import {
  PlayerProfile,
  RankData,
  StreakData,
  applyDailyVisit,
  gameRepository,
} from '../services/storage';
import { allCases } from '../data/cases/vanishingHour';

interface StreakGrowthEvent {
  currentStreak: number;
  at: number;
}

interface GameState {
  hydrated: boolean;
  profile: PlayerProfile | null;
  streak: StreakData;
  rank: RankData;
  progressByCase: Record<string, CaseProgress>;
  lastStreakGrowth: StreakGrowthEvent | null;

  hydrate: () => Promise<void>;
  signIn: (profile: PlayerProfile) => Promise<void>;
  signOut: () => Promise<void>;

  startOrResumeCase: (def: CaseDefinition) => CaseProgress;
  resetCase: (caseId: string, firstSceneId: string) => void;
  markIntroSeen: (caseId: string) => void;
  goToScene: (caseId: string, sceneId: string) => void;
  collectClue: (caseId: string, clue: ClueEntry) => void;
  solvePuzzle: (caseId: string, puzzleId: string, successClue: ClueEntry) => void;
  recordMistake: (caseId: string) => void;
  useHint: (caseId: string) => void;
  setDeductionSelection: (
    caseId: string,
    slot: 'suspect' | 'method' | 'motive',
    optionId: string
  ) => void;
  finishCase: (caseId: string, solvedCorrectly: boolean) => void;
}

function emptyProgress(caseId: string, firstSceneId: string, introSeen = false): CaseProgress {
  return {
    caseId,
    introSeen,
    currentSceneId: firstSceneId,
    collectedClueIds: [],
    solvedPuzzleIds: [],
    unlockedHotspotIds: [],
    deductionSelections: {},
    hintsUsed: 0,
    mistakeCount: 0,
    completed: false,
    solvedCorrectly: null,
    startedAt: Date.now(),
    completedAt: null,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  hydrated: false,
  profile: null,
  streak: { currentStreak: 0, longestStreak: 0, lastActiveDateISO: null, streakProtectionCharges: 0 },
  rank: { totalCasesSolved: 0, totalHintsUsed: 0, totalMistakes: 0 },
  progressByCase: {},
  lastStreakGrowth: null,

  hydrate: async () => {
    const [profile, streak, rank, progressEntries] = await Promise.all([
      gameRepository.getProfile(),
      gameRepository.getStreak(),
      gameRepository.getRank(),
      Promise.all(allCases.map((def) => gameRepository.getCaseProgress(def.id))),
    ]);
    const progressByCase: Record<string, CaseProgress> = {};
    allCases.forEach((def, i) => {
      const saved = progressEntries[i];
      if (saved) progressByCase[def.id] = saved;
    });
    set({ profile, streak, rank, progressByCase, hydrated: true });
  },

  signIn: async (profile) => {
    await gameRepository.saveProfile(profile);
    const { streak: freshStreak, grew } = applyDailyVisit(await gameRepository.getStreak());
    await gameRepository.saveStreak(freshStreak);
    set({
      profile,
      streak: freshStreak,
      lastStreakGrowth: grew ? { currentStreak: freshStreak.currentStreak, at: Date.now() } : null,
    });
  },

  signOut: async () => {
    await gameRepository.clearProfile();
    set({ profile: null });
  },

  startOrResumeCase: (def) => {
    const existing = get().progressByCase[def.id];
    if (existing) return existing;
    const fresh = emptyProgress(def.id, def.scenes[0].id);
    set((s) => ({ progressByCase: { ...s.progressByCase, [def.id]: fresh } }));
    gameRepository.saveCaseProgress(fresh);
    return fresh;
  },

  resetCase: (caseId, firstSceneId) => {
    // A replay (Start Over, or trying again after a wrong deduction) never re-shows the
    // intro slides — carry the flag forward instead of wiping it with the rest of progress.
    const priorIntroSeen = get().progressByCase[caseId]?.introSeen ?? false;
    const fresh = emptyProgress(caseId, firstSceneId, priorIntroSeen);
    set((s) => ({ progressByCase: { ...s.progressByCase, [caseId]: fresh } }));
    gameRepository.saveCaseProgress(fresh);
  },

  markIntroSeen: (caseId) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current || current.introSeen) return s;
      const next = { ...current, introSeen: true };
      gameRepository.saveCaseProgress(next);
      return { progressByCase: { ...s.progressByCase, [caseId]: next } };
    });
  },

  goToScene: (caseId, sceneId) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current) return s;
      const next = { ...current, currentSceneId: sceneId };
      gameRepository.saveCaseProgress(next);
      return { progressByCase: { ...s.progressByCase, [caseId]: next } };
    });
  },

  collectClue: (caseId, clue) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current || current.collectedClueIds.includes(clue.id)) return s;
      const next = { ...current, collectedClueIds: [...current.collectedClueIds, clue.id] };
      gameRepository.saveCaseProgress(next);
      return { progressByCase: { ...s.progressByCase, [caseId]: next } };
    });
  },

  solvePuzzle: (caseId, puzzleId, successClue) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current || current.solvedPuzzleIds.includes(puzzleId)) return s;
      const next = {
        ...current,
        solvedPuzzleIds: [...current.solvedPuzzleIds, puzzleId],
        collectedClueIds: current.collectedClueIds.includes(successClue.id)
          ? current.collectedClueIds
          : [...current.collectedClueIds, successClue.id],
      };
      gameRepository.saveCaseProgress(next);
      return { progressByCase: { ...s.progressByCase, [caseId]: next } };
    });
  },

  recordMistake: (caseId) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current) return s;
      const next = { ...current, mistakeCount: current.mistakeCount + 1 };
      gameRepository.saveCaseProgress(next);
      const rank = { ...s.rank, totalMistakes: s.rank.totalMistakes + 1 };
      gameRepository.saveRank(rank);
      return { progressByCase: { ...s.progressByCase, [caseId]: next }, rank };
    });
  },

  useHint: (caseId) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current) return s;
      const next = { ...current, hintsUsed: current.hintsUsed + 1 };
      gameRepository.saveCaseProgress(next);
      const rank = { ...s.rank, totalHintsUsed: s.rank.totalHintsUsed + 1 };
      gameRepository.saveRank(rank);
      return { progressByCase: { ...s.progressByCase, [caseId]: next }, rank };
    });
  },

  setDeductionSelection: (caseId, slot, optionId) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current) return s;
      const next = {
        ...current,
        deductionSelections: { ...current.deductionSelections, [slot]: optionId },
      };
      gameRepository.saveCaseProgress(next);
      return { progressByCase: { ...s.progressByCase, [caseId]: next } };
    });
  },

  finishCase: (caseId, solvedCorrectly) => {
    set((s) => {
      const current = s.progressByCase[caseId];
      if (!current) return s;
      const next = { ...current, completed: true, solvedCorrectly, completedAt: Date.now() };
      gameRepository.saveCaseProgress(next);

      const { streak: freshStreak, grew } = applyDailyVisit(s.streak);
      gameRepository.saveStreak(freshStreak);

      const rank = solvedCorrectly
        ? { ...s.rank, totalCasesSolved: s.rank.totalCasesSolved + 1 }
        : s.rank;
      if (solvedCorrectly) gameRepository.saveRank(rank);

      return {
        progressByCase: { ...s.progressByCase, [caseId]: next },
        streak: freshStreak,
        rank,
        lastStreakGrowth: grew ? { currentStreak: freshStreak.currentStreak, at: Date.now() } : s.lastStreakGrowth,
      };
    });
  },
}));
