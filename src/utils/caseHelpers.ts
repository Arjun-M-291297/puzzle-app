import { CaseDefinition, ClueEntry, Hotspot } from '../types/case';

export function allHotspots(def: CaseDefinition): Hotspot[] {
  return def.scenes.flatMap((s) => s.hotspots);
}

/** Every clue in the case, keyed by id — sourced from observation hotspots and puzzle success clues. */
export function clueRegistry(def: CaseDefinition): Record<string, ClueEntry> {
  const registry: Record<string, ClueEntry> = {};
  for (const hotspot of allHotspots(def)) {
    if (hotspot.kind === 'observation') registry[hotspot.clue.id] = hotspot.clue;
  }
  for (const puzzle of def.puzzles) {
    registry[puzzle.successClue.id] = puzzle.successClue;
  }
  return registry;
}

/** Clue ids that should only flash briefly on discovery, not sit fully in the notebook. */
export function revealOnceClueIds(def: CaseDefinition): Set<string> {
  const ids = new Set<string>();
  for (const hotspot of allHotspots(def)) {
    if (hotspot.kind === 'observation' && hotspot.revealOnce) ids.add(hotspot.clue.id);
  }
  return ids;
}

export function isHotspotUnlocked(hotspot: Hotspot, collectedClueIds: string[]): boolean {
  if (!hotspot.requiresClueId) return true;
  return collectedClueIds.includes(hotspot.requiresClueId);
}

export function caesarShift(text: string, shift: number): string {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return text.replace(/[A-Z]/gi, (char) => {
    const base = char === char.toUpperCase() ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + normalizedShift) % 26) + base);
  });
}
