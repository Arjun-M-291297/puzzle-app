import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useGameStore } from '../store/gameStore';
import { allCases, vanishingHour } from '../data/cases/vanishingHour';
import { ClueEntry, Hotspot, Puzzle } from '../types/case';
import { clueRegistry, revealOnceClueIds } from '../utils/caseHelpers';
import { SceneIllustration } from '../components/SceneIllustration';
import { HotspotLayer } from '../components/HotspotLayer';

// The Study is a real reference photo (not hand-drawn SVG like the other
// scenes) — 1408x768, so the scene box matches that aspect ratio instead of
// the SVG scenes' square 100x100 viewBox.
const STUDY_BG = require('../../assets/scenes/study.jpeg');
const STUDY_ASPECT_RATIO = 1408 / 768;
import { NotebookSheet } from '../components/NotebookSheet';
import { ClueModal } from '../components/ClueModal';
import { Toast } from '../components/Toast';
import { NumberLockModal } from '../components/puzzles/NumberLockModal';
import { CipherModal } from '../components/puzzles/CipherModal';
import { SymbolMatchModal } from '../components/puzzles/SymbolMatchModal';
import { BodyText, CaseFileLabel } from '../components/ui';
import { colors, fonts, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Play'>;

export function PlayScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const def = allCases.find((c) => c.id === caseId) ?? vanishingHour;

  const progress = useGameStore((s) => s.progressByCase[caseId]);
  const startOrResumeCase = useGameStore((s) => s.startOrResumeCase);
  const goToScene = useGameStore((s) => s.goToScene);
  const collectClue = useGameStore((s) => s.collectClue);
  const solvePuzzle = useGameStore((s) => s.solvePuzzle);
  const recordMistake = useGameStore((s) => s.recordMistake);

  useEffect(() => {
    if (!progress) startOrResumeCase(def);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [notebookOpen, setNotebookOpen] = useState(false);
  const [activeClue, setActiveClue] = useState<{ clue: ClueEntry; revealOnce?: boolean } | null>(null);
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const registry = useMemo(() => clueRegistry(def), [def]);
  const revealOnceIds = useMemo(() => revealOnceClueIds(def), [def]);

  if (!progress) return null;

  const currentScene = def.scenes.find((s) => s.id === progress.currentSceneId) ?? def.scenes[0];
  const activePuzzle: Puzzle | undefined = def.puzzles.find((p) => p.id === activePuzzleId);
  const collectedClues = progress.collectedClueIds
    .map((id) => registry[id])
    .filter((c): c is ClueEntry => Boolean(c));

  const handleObservation = (
    hotspot: Extract<Hotspot, { kind: 'observation' }>,
    alreadyFound: boolean
  ) => {
    if (!alreadyFound) collectClue(caseId, hotspot.clue);
    setActiveClue({ clue: hotspot.clue, revealOnce: hotspot.revealOnce });
  };

  const handleNavigate = (hotspot: Extract<Hotspot, { kind: 'navigate' }>) => {
    if (hotspot.toSceneId === 'evidenceBoard') {
      navigation.navigate('EvidenceBoard', { caseId });
      return;
    }
    goToScene(caseId, hotspot.toSceneId);
  };

  const handlePuzzleOpen = (hotspot: Extract<Hotspot, { kind: 'puzzle' }>) => {
    setActivePuzzleId(hotspot.puzzleId);
  };

  const handleLocked = (hotspot: Hotspot) => {
    setToastMessage(hotspot.lockedHint ?? 'Nothing happens. Not yet, anyway.');
  };

  const handlePuzzleSolved = () => {
    if (!activePuzzle) return;
    solvePuzzle(caseId, activePuzzle.id, activePuzzle.successClue);
    setActivePuzzleId(null);
    setActiveClue({ clue: activePuzzle.successClue });
  };

  const handlePuzzleMistake = () => recordMistake(caseId);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.topBtn}>
            <Text style={styles.topBtnText}>‹ Cases</Text>
          </Pressable>
          <View style={styles.sceneLabelBox}>
            <CaseFileLabel>{currentScene.name}</CaseFileLabel>
          </View>
          <Pressable onPress={() => setNotebookOpen(true)} hitSlop={10} style={styles.notebookBtn}>
            <Text style={styles.topBtnText}>📓 {collectedClues.length}</Text>
          </Pressable>
        </View>

        {/* Box matches the background art's own aspect ratio (square 100x100 viewBox for
            the hand-drawn SVG scenes, or the reference photo's real 1408x768 ratio for the
            Study) — keeps hotspot fractions aligned with the art exactly, instead of
            stretching/cropping full-bleed and drifting out of sync with tap targets. */}
        <View style={[styles.sceneBox, currentScene.background === 'study' && { aspectRatio: STUDY_ASPECT_RATIO }]}>
          {currentScene.background === 'study' ? (
            <Image source={STUDY_BG} style={styles.sceneImage} contentFit="cover" />
          ) : (
            <SceneIllustration background={currentScene.background} />
          )}
          <HotspotLayer
            hotspots={currentScene.hotspots}
            collectedClueIds={progress.collectedClueIds}
            solvedPuzzleIds={progress.solvedPuzzleIds}
            onObservation={handleObservation}
            onNavigate={handleNavigate}
            onPuzzle={handlePuzzleOpen}
            onLocked={handleLocked}
          />
        </View>

        {currentScene.backTo && (
          <Pressable
            style={styles.backRow}
            onPress={() => {
              const target = currentScene.backTo as string;
              goToScene(caseId, target);
            }}
          >
            <Text style={styles.backRowText}>
              ‹ Back to {def.scenes.find((s) => s.id === currentScene.backTo)?.name ?? 'previous room'}
            </Text>
          </Pressable>
        )}

        <View style={styles.descriptionBox} pointerEvents="none">
          <BodyText style={styles.description}>{currentScene.description}</BodyText>
        </View>
      </SafeAreaView>

      <Toast message={toastMessage} onHide={() => setToastMessage(null)} />

      <NotebookSheet
        visible={notebookOpen}
        onClose={() => setNotebookOpen(false)}
        clues={collectedClues}
        revealOnceIds={revealOnceIds}
      />

      <ClueModal clue={activeClue?.clue ?? null} revealOnce={activeClue?.revealOnce} onDismiss={() => setActiveClue(null)} />

      <NumberLockModal
        puzzle={activePuzzle?.type === 'numberLock' ? activePuzzle : null}
        onClose={() => setActivePuzzleId(null)}
        onSolved={handlePuzzleSolved}
        onMistake={handlePuzzleMistake}
      />
      <CipherModal
        puzzle={activePuzzle?.type === 'cipher' ? activePuzzle : null}
        onClose={() => setActivePuzzleId(null)}
        onSolved={handlePuzzleSolved}
        onMistake={handlePuzzleMistake}
      />
      <SymbolMatchModal
        puzzle={activePuzzle?.type === 'symbolMatch' ? activePuzzle : null}
        onClose={() => setActivePuzzleId(null)}
        onSolved={handlePuzzleSolved}
        onMistake={handlePuzzleMistake}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  overlay: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sceneBox: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  sceneImage: { width: '100%', height: '100%' },
  topBtn: { backgroundColor: 'rgba(11,15,20,0.7)', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: 8 },
  notebookBtn: { backgroundColor: 'rgba(11,15,20,0.7)', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: 8 },
  topBtnText: { color: colors.paper, fontFamily: fonts.display, fontSize: 12 },
  sceneLabelBox: { backgroundColor: 'rgba(11,15,20,0.7)', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: 8 },
  backRow: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(11,15,20,0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backRowText: { color: colors.brassBright, fontFamily: fonts.display, fontSize: 12 },
  descriptionBox: {
    margin: spacing.md,
    backgroundColor: 'rgba(11,15,20,0.78)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  description: { fontSize: 13, color: colors.paperDim },
});
