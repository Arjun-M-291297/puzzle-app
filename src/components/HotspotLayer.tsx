import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Hotspot } from '../types/case';
import { isHotspotUnlocked } from '../utils/caseHelpers';
import { colors, radii } from '../theme';

interface Props {
  hotspots: Hotspot[];
  collectedClueIds: string[];
  solvedPuzzleIds: string[];
  onObservation: (hotspot: Extract<Hotspot, { kind: 'observation' }>, alreadyFound: boolean) => void;
  onNavigate: (hotspot: Extract<Hotspot, { kind: 'navigate' }>) => void;
  onPuzzle: (hotspot: Extract<Hotspot, { kind: 'puzzle' }>) => void;
  onLocked: (hotspot: Hotspot) => void;
}

export function HotspotLayer({
  hotspots,
  collectedClueIds,
  solvedPuzzleIds,
  onObservation,
  onNavigate,
  onPuzzle,
  onLocked,
}: Props) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="box-none">
      {size.width > 0 &&
        hotspots.map((hotspot) => {
          // A puzzle hotspot with no further purpose once solved simply disappears.
          if (hotspot.kind === 'puzzle' && solvedPuzzleIds.includes(hotspot.puzzleId)) return null;

          const unlocked = isHotspotUnlocked(hotspot, collectedClueIds);

          // Hotspots sharing a spot with another currently-active hotspot must not render (or
          // intercept taps) while locked, or they silently block the one underneath.
          if (!unlocked && hotspot.hideWhenLocked) return null;
          const alreadyFound = hotspot.kind === 'observation' && collectedClueIds.includes(hotspot.clue.id);

          const handlePress = () => {
            if (!unlocked) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              onLocked(hotspot);
              return;
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (hotspot.kind === 'observation') onObservation(hotspot, alreadyFound);
            else if (hotspot.kind === 'navigate') onNavigate(hotspot);
            else onPuzzle(hotspot);
          };

          return (
            <HotspotTouchable
              key={hotspot.id}
              left={hotspot.x * size.width}
              top={hotspot.y * size.height}
              width={hotspot.w * size.width}
              height={hotspot.h * size.height}
              onPress={handlePress}
            />
          );
        })}
    </View>
  );
}

/** A single hotspot's touch target — gives a brief, one-shot press flash (not a
 * persistent/looping indicator) so tapping something in the scene feels acknowledged. */
function HotspotTouchable({
  left,
  top,
  width,
  height,
  onPress,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flash, {
      toValue: pressed ? 1 : 0,
      duration: pressed ? 60 : 260,
      useNativeDriver: true,
    }).start();
  }, [pressed, flash]);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[styles.hotspot, { left, top, width, height }]}
      hitSlop={4}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flash,
          {
            opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
            transform: [{ scale: flash.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hotspot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flash: {
    width: '100%',
    height: '100%',
    borderRadius: radii.sm,
    backgroundColor: colors.brassBright,
    opacity: 0,
  },
});
