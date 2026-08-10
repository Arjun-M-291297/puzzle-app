import React, { useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, fonts } from '../../theme';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ANGLE_STEP = 360 / 26;

interface Props {
  shift: number;
  onShiftChange: (shift: number) => void;
}

function angleFromCenter(x: number, y: number, size: number) {
  const cx = size / 2;
  const cy = size / 2;
  return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
}

/** Point on a ring at `deg` (0deg = top, clockwise), as a fraction of the wheel's own size. */
function ringPoint(deg: number, radiusFraction: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    xFraction: 0.5 + Math.sin(rad) * radiusFraction,
    yFraction: 0.5 - Math.cos(rad) * radiusFraction,
  };
}

// A literal cipher disk: drag the inner ring against the fixed outer ring to pick
// a shift, instead of tapping +/-. Two rings of real RN <Text> (react-native-svg's
// own <Text> doesn't render reliably cross-platform — confirmed earlier in this
// project) sit on top of a purely decorative SVG ring/tick-mark background.
export function CipherWheel({ shift, onShiftChange }: Props) {
  const [size, setSize] = useState(0);
  const rotationValue = useRef(shift * ANGLE_STEP);
  const rotationAnim = useRef(new Animated.Value(shift * ANGLE_STEP)).current;
  const dragStartAngle = useRef(0);
  const rotationAtGrant = useRef(0);
  const lastShift = useRef(shift);

  const onLayout = (e: LayoutChangeEvent) => setSize(e.nativeEvent.layout.width);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        dragStartAngle.current = angleFromCenter(locationX, locationY, size);
        rotationAtGrant.current = rotationValue.current;
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const currentAngle = angleFromCenter(locationX, locationY, size);
        const delta = currentAngle - dragStartAngle.current;
        const next = rotationAtGrant.current + delta;
        rotationValue.current = next;
        rotationAnim.setValue(next);

        const rawShift = Math.round(next / ANGLE_STEP);
        const normalized = ((rawShift % 26) + 26) % 26;
        if (normalized !== lastShift.current) {
          lastShift.current = normalized;
          Haptics.selectionAsync();
          onShiftChange(normalized);
        }
      },
      onPanResponderRelease: () => {
        const snapped = lastShift.current * ANGLE_STEP;
        rotationValue.current = snapped;
        Animated.spring(rotationAnim, { toValue: snapped, friction: 7, useNativeDriver: false }).start();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    })
  ).current;

  const rotateStyle = {
    transform: [
      {
        rotate: rotationAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'], extrapolate: 'extend' as const }),
      },
    ],
  };

  return (
    <View style={styles.wheel} onLayout={onLayout} {...panResponder.panHandlers}>
      {size > 0 && (
        <>
          <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
            <Circle cx={50} cy={50} r={46} fill="#141b23" stroke={colors.brass} strokeWidth={1.2} />
            <Circle cx={50} cy={50} r={31} fill="#0f151b" stroke={colors.brassDim} strokeWidth={0.8} />
            {LETTERS.map((_, i) => {
              const deg = i * ANGLE_STEP;
              const rad = (deg * Math.PI) / 180;
              return (
                <Line
                  key={`outer-tick-${i}`}
                  x1={50 + Math.sin(rad) * 42}
                  y1={50 - Math.cos(rad) * 42}
                  x2={50 + Math.sin(rad) * 45.5}
                  y2={50 - Math.cos(rad) * 45.5}
                  stroke={colors.brassDim}
                  strokeWidth={0.5}
                />
              );
            })}
            <Circle cx={50} cy={50} r={4} fill={colors.brassDim} stroke={colors.brass} strokeWidth={0.6} />
            <Polygon points="50,1 46,8 54,8" fill={colors.rustBright} />
          </Svg>

          {/* outer ring — fixed */}
          {LETTERS.map((letter, i) => {
            const { xFraction, yFraction } = ringPoint(i * ANGLE_STEP, 0.385);
            return (
              <Text
                key={`o-${letter}`}
                style={[styles.letter, styles.outerLetter, { left: xFraction * size - 9, top: yFraction * size - 9 }]}
              >
                {letter}
              </Text>
            );
          })}

          {/* inner ring — rotates as one group */}
          <Animated.View style={[StyleSheet.absoluteFill, rotateStyle]} pointerEvents="none">
            {LETTERS.map((letter, i) => {
              const { xFraction, yFraction } = ringPoint(i * ANGLE_STEP, 0.25);
              return (
                <Text
                  key={`i-${letter}`}
                  style={[styles.letter, styles.innerLetter, { left: xFraction * size - 8, top: yFraction * size - 8 }]}
                >
                  {letter}
                </Text>
              );
            })}
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 260,
    alignSelf: 'center',
  },
  letter: {
    position: 'absolute',
    width: 18,
    height: 18,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 11,
  },
  outerLetter: { color: colors.paper },
  innerLetter: { color: colors.brassBright, fontWeight: '700' },
});
