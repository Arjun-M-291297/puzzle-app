import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { BootScreen } from './src/screens/BootScreen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useGameStore } from './src/store/gameStore';
import { colors } from './src/theme';

export default function App() {
  // Loaded from a project-local asset rather than @expo-google-fonts/special-elite's
  // node_modules path — some static hosts (Netlify among them) silently drop any
  // folder literally named "node_modules" from an upload, even when, as here, it's
  // just an asset path segment left over from Metro's web export, not a real
  // dependency tree. Keeping the font under our own assets/ sidesteps that entirely.
  const [fontsLoaded] = useFonts({
    SpecialElite_400Regular: require('./assets/fonts/SpecialElite-Regular.ttf'),
  });
  const hydrated = useGameStore((s) => s.hydrated);
  const hydrate = useGameStore((s) => s.hydrate);
  const [minBootElapsed, setMinBootElapsed] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const t = setTimeout(() => setMinBootElapsed(true), 900);
    return () => clearTimeout(t);
  }, []);

  const ready = fontsLoaded && hydrated && minBootElapsed;

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {ready ? (
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        ) : (
          <BootScreen />
        )}
      </SafeAreaProvider>
    </View>
  );
}
