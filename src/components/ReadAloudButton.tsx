import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { NARRATOR_PITCH, NARRATOR_RATE, resolveNarratorVoiceId } from '../services/narratorVoice';
import { useGameStore } from '../store/gameStore';
import { colors, radii } from '../theme';

interface Props {
  text: string;
  /** identifies the current slide/screen's content — auto-narration re-fires when this changes */
  resetKey?: string | number;
}

export function ReadAloudButton({ text, resetKey }: Props) {
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const setAudioEnabled = useGameStore((s) => s.setAudioEnabled);
  const [speaking, setSpeaking] = useState(false);

  const speak = async () => {
    setSpeaking(true);
    const voice = await resolveNarratorVoiceId();
    Speech.speak(text, {
      pitch: NARRATOR_PITCH,
      rate: NARRATOR_RATE,
      voice,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  // Narration is on by default and starts itself whenever new content shows up —
  // deliberately keyed on `resetKey` alone (not `audioEnabled`) so muting mid-slide
  // doesn't get immediately re-triggered, and toggling back on (below) is instant
  // rather than waiting for the next slide.
  useEffect(() => {
    if (audioEnabled) speak();
    return () => {
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const toggle = () => {
    Haptics.selectionAsync();
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      setAudioEnabled(false); // sticks — the next slide won't auto-narrate either, until turned back on
    } else {
      setAudioEnabled(true);
      speak();
    }
  };

  return (
    <Pressable onPress={toggle} hitSlop={10} style={styles.btn}>
      <Text style={styles.icon}>{speaking ? '🔇' : '🔊'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,154,82,0.12)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { fontSize: 15 },
});
