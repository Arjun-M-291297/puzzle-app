import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export function BootScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const stamp = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(stamp, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [fade, stamp]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ scale: stamp }] }}>
        <Text style={styles.eyebrow}>CASE FILE NO. 001</Text>
        <Text style={styles.title}>THE VANISHING HOUR</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  eyebrow: {
    color: colors.brass,
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    color: colors.paper,
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 2,
    textAlign: 'center',
  },
});
