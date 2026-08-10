export type PuzzleType = 'numberLock' | 'cipher' | 'symbolMatch' | 'deduction';

export interface ClueEntry {
  id: string;
  title: string;
  detail: string;
  icon: string; // emoji glyph used as a lightweight icon (no art assets required)
}

export interface HotspotBase {
  id: string;
  label: string;
  x: number; // 0-1 fraction of scene width
  y: number; // 0-1 fraction of scene height
  w: number; // 0-1 fraction of scene width
  h: number; // 0-1 fraction of scene height
  requiresClueId?: string; // gate: hidden/locked until this clue is in the notebook
  lockedHint?: string; // shown (as a toast) if tapped while locked
  /** briefly reveal the clue detail then only log the title to the notebook — recreates the "write it down yourself" tension */
  revealOnce?: boolean;
  /** don't render (or intercept taps) at all until unlocked — for a hotspot that occupies the same spot as another, currently-active hotspot (e.g. a passage that only appears after a puzzle solved in that exact spot is cleared) */
  hideWhenLocked?: boolean;
}

export interface ObservationHotspot extends HotspotBase {
  kind: 'observation';
  clue: ClueEntry;
}

export interface NavigateHotspot extends HotspotBase {
  kind: 'navigate';
  toSceneId: string;
}

export interface PuzzleHotspot extends HotspotBase {
  kind: 'puzzle';
  puzzleId: string;
}

export type Hotspot = ObservationHotspot | NavigateHotspot | PuzzleHotspot;

export interface NumberLockPuzzle {
  id: string;
  type: 'numberLock';
  title: string;
  flavorText: string;
  digits: number;
  solution: string;
  successClue: ClueEntry;
  unlocksSceneOrHotspot?: string;
}

export interface CipherPuzzle {
  id: string;
  type: 'cipher';
  title: string;
  flavorText: string;
  cipherText: string; // already shifted text the player must decode
  shift: number; // correct Caesar shift to reveal plaintext
  plaintext: string;
  successClue: ClueEntry;
}

export interface SymbolMatchPuzzle {
  id: string;
  type: 'symbolMatch';
  title: string;
  flavorText: string;
  symbols: string[]; // emoji/glyphs shown shuffled
  solutionOrder: string[]; // correct order (subset of symbols, same values)
  successClue: ClueEntry;
}

export type Puzzle = NumberLockPuzzle | CipherPuzzle | SymbolMatchPuzzle;

export interface Scene {
  id: string;
  name: string;
  description: string;
  background: 'study' | 'drawer' | 'passage' | 'hiddenRoom';
  hotspots: Hotspot[];
  /** id of the scene a persistent "back" control returns to; omitted for top-level scenes */
  backTo?: string;
}

export type IntroPanelVisual =
  | 'deskSilhouette'
  | 'worriedSilhouette'
  | 'twoSilhouettesDoor'
  | 'clockCloseup'
  | 'emptyStudyNight';

export interface IntroSlide {
  id: string;
  visual: IntroPanelVisual;
  /** big typewriter title card, e.g. "SIX MONTHS AGO" — omit for slides that are pure scene/dialogue */
  title?: string;
  /** who's speaking, for the speech bubble's tail/attribution — omit for caption-only slides */
  speaker?: string;
  /** speech bubble line */
  speech?: string;
  /** smaller narrative line under the visual, shown with or without a speech bubble */
  caption?: string;
}

export interface DeductionOption {
  id: string;
  label: string;
}

export interface DeductionSlot {
  id: 'suspect' | 'method' | 'motive';
  label: string;
  options: DeductionOption[];
  correctOptionId: string;
}

export interface CaseDefinition {
  id: string;
  title: string;
  subtitle: string;
  premise: string;
  isFree: boolean;
  priceLabel?: string;
  /** cold-open slides shown before the room, first playthrough only — sets mood/character without giving anything away */
  intro: IntroSlide[];
  scenes: Scene[];
  puzzles: Puzzle[];
  deduction: DeductionSlot[];
  correctEnding: string;
  incorrectEnding: string;
  estimatedMinutes: number;
}

export interface CaseProgress {
  caseId: string;
  /** has the player watched (or skipped) the intro slides at least once? survives resetCase — replays never re-show it */
  introSeen: boolean;
  currentSceneId: string;
  collectedClueIds: string[];
  solvedPuzzleIds: string[];
  unlockedHotspotIds: string[];
  deductionSelections: Partial<Record<'suspect' | 'method' | 'motive', string>>;
  hintsUsed: number;
  mistakeCount: number;
  completed: boolean;
  solvedCorrectly: boolean | null;
  startedAt: number;
  completedAt: number | null;
}
