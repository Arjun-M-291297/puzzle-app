import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * A continuous 0→1→0 driver for subtle ambient motion (breathing glows, drifting
 * dust) — not for anything tied to game state or discoverability, just atmosphere.
 * `phaseOffset` (0-1) desyncs multiple instances so they don't breathe in unison.
 * `nativeDriver` must be false when animating react-native-svg props (opacity on
 * <Circle>/<Ellipse> etc. isn't on the native-driver whitelist the way a plain
 * View's opacity is) — true is fine and cheaper for ordinary RN views.
 */
export function usePulse(durationMs: number, phaseOffset = 0, nativeDriver = true): Animated.Value {
  const value = useRef(new Animated.Value(phaseOffset)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: durationMs * (1 - phaseOffset),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: durationMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
        }),
        Animated.timing(value, {
          toValue: phaseOffset,
          duration: durationMs * phaseOffset,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [value, durationMs, phaseOffset, nativeDriver]);

  return value;
}
