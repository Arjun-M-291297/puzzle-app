import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useGameStore } from '../store/gameStore';
import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CaseIntroScreen } from '../screens/CaseIntroScreen';
import { IntroScreen } from '../screens/IntroScreen';
import { PlayScreen } from '../screens/PlayScreen';
import { EvidenceBoardScreen } from '../screens/EvidenceBoardScreen';
import { EndingScreen } from '../screens/EndingScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const profile = useGameStore((s) => s.profile);

  return (
    <Stack.Navigator
      initialRouteName={profile ? 'Home' : 'Auth'}
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: colors.ink },
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CaseIntro" component={CaseIntroScreen} />
      <Stack.Screen name="Intro" component={IntroScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Play" component={PlayScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="EvidenceBoard" component={EvidenceBoardScreen} />
      <Stack.Screen name="Ending" component={EndingScreen} options={{ animation: 'fade' }} />
    </Stack.Navigator>
  );
}
