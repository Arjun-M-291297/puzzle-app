import * as Speech from "expo-speech";

// "Investigative narrator" read-aloud preset — a deliberate, lower-register voice
// rather than a flat default TTS reading. TTS engines don't have a "mood" knob, so
// this is built from what expo-speech actually exposes: a slower rate, a lowered
// pitch, and — where the platform's installed voice list has one — a deeper/male
// voice selected by name heuristics. All three degrade gracefully: if voice
// selection finds nothing, pitch+rate alone still shift the feel meaningfully.
export const NARRATOR_PITCH = 0.45;
export const NARRATOR_RATE = 0.92;

const VOICE_NAME_PREFERENCES = [
  "daniel", // iOS/macOS en-GB male
  "david", // Windows/Edge en-US male
  "fred", // macOS en-US male
  "oliver",
  "arthur",
  "google uk english male",
  "male",
];

let resolvedVoiceId: string | undefined | null = null; // null = not yet resolved this session

/** Resolves once per app session and caches the result — voice lists don't change mid-session. */
export async function resolveNarratorVoiceId(): Promise<string | undefined> {
  if (resolvedVoiceId !== null) return resolvedVoiceId;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const english = voices.filter((v) => v.language?.toLowerCase().startsWith("en"));
    let match: string | undefined;
    for (const preference of VOICE_NAME_PREFERENCES) {
      const found = english.find((v) => v.name?.toLowerCase().includes(preference));
      if (found) {
        match = found.identifier;
        break;
      }
    }
    resolvedVoiceId = match;
  } catch {
    resolvedVoiceId = undefined;
  }
  return resolvedVoiceId;
}
