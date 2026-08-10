import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { PlayerProfile } from './storage';

// NOTE on Google sign-in strategy:
// Expo's current guidance (SDK 57) points production apps at native libraries
// (@react-native-google-signin/google-signin), which require a custom dev
// build and cannot run in Expo Go. The old expo-auth-session/providers/google
// convenience wrapper is deprecated. This uses the generic, non-deprecated
// expo-auth-session OAuth flow against Google's own discovery document instead
// — it still works inside Expo Go, so the app is testable today. Before a
// store release, swap this module for @react-native-google-signin/google-signin
// (see README "Google sign-in setup").

WebBrowser.maybeCompleteAuthSession();

const googleConfig = (Constants.expoConfig?.extra as Record<string, unknown> | undefined)?.[
  'googleAuth'
] as { iosClientId?: string; androidClientId?: string; webClientId?: string } | undefined;

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    googleConfig &&
      (googleConfig.iosClientId || googleConfig.androidClientId || googleConfig.webClientId)
  );
}

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  userInfoEndpoint: 'https://www.googleapis.com/userinfo/v2/me',
};

export function useGoogleSignIn() {
  const configured = isGoogleAuthConfigured();
  const clientId = googleConfig?.webClientId ?? googleConfig?.androidClientId ?? googleConfig?.iosClientId ?? '';

  // useLoadedAuthRequest only builds the request (which kicks off PKCE/crypto setup) when
  // `discovery` is truthy — passing null while unconfigured skips that work entirely instead
  // of letting it fail in the background (e.g. WebCrypto being unavailable on some origins).
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ scheme: 'vanishinghour' }),
      responseType: AuthSession.ResponseType.Token,
    },
    configured ? discovery : null
  );

  const signIn = async (): Promise<PlayerProfile | null> => {
    const result = await promptAsync();
    if (result.type !== 'success') return null;
    const accessToken = result.authentication?.accessToken ?? (result.params as Record<string, string>)?.access_token;
    if (!accessToken) return null;

    const res = await fetch(discovery.userInfoEndpoint as string, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = (await res.json()) as { id: string; name: string; email: string; picture?: string };

    return {
      id: `google:${userInfo.id}`,
      displayName: userInfo.name,
      email: userInfo.email,
      photoUrl: userInfo.picture,
      isGuest: false,
    };
  };

  return { request, response, signIn, isConfigured: isGoogleAuthConfigured() };
}

export async function createGuestProfile(): Promise<PlayerProfile> {
  // Not `Crypto.randomUUID()` — expo-crypto's web shim depends on WebCrypto, which some
  // browser contexts (non-HTTPS origins, certain embedded webviews) refuse to expose. A guest
  // id has no security purpose, just needs to be locally unique, so a plain random string
  // avoids that dependency entirely and works identically on web/iOS/Android.
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return {
    id: `guest:${id}`,
    displayName: 'Detective',
    isGuest: true,
  };
}
