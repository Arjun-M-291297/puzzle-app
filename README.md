# The Vanishing Hour

A noir point-and-click detective mystery, built as a single React Native (Expo) codebase for iOS and Android. Case No. 001 is a complete, playable locked-room mystery: explore a scene, collect clues, solve a hidden-key observation puzzle, a number lock, a Caesar cipher, and a symbol-match puzzle, then close the case on an Evidence Board with a branching correct/incorrect ending.

## Run it

```bash
npm install
npm start
```

Then scan the QR code with **Expo Go** (iOS/Android) or press `w` for a web preview. No native build tooling needed for this.

Note: this machine's Node is v20.18.0, one patch below Expo SDK 57's stated minimum (v20.19.4). It runs fine in practice (only a startup warning), but on a supported Node version the warning disappears.

## What's built

- **Google sign-in + Guest mode** ([src/services/auth.ts](src/services/auth.ts)) — Guest mode works immediately with zero setup. Google sign-in uses `expo-auth-session`'s generic OAuth flow (Expo Go–compatible) rather than the newer native `@react-native-google-signin/google-signin`, which requires a custom dev build. See "Google sign-in setup" below.
- **Local persistence** ([src/services/storage.ts](src/services/storage.ts)) — profile, streak, rank, and per-case progress are saved via AsyncStorage behind a `GameRepository` interface. Every screen reads/writes through this interface, never AsyncStorage directly, so swapping in a real backend later (see "Scaling to a backend") touches one file.
- **Data-driven cases** ([src/data/cases/vanishingHour.ts](src/data/cases/vanishingHour.ts), [src/types/case.ts](src/types/case.ts)) — a case is scenes + hotspots + puzzles + a deduction board, expressed as data. Adding Case No. 002 means writing a new file in this shape, not new screens.
- **Engagement mechanics**: daily streak with a grace-day "streak protection" charge, a persistent Detective Rank (Rookie → Sharp Eye → Sleuth → Master Detective) driven by cases solved, haptic feedback on every discovery/success/mistake, a "memorize it, it won't stay in your notebook" mechanic on one clue, and a locked Case No. 002 teaser card on the home screen.

## Google sign-in setup

1. Create an OAuth 2.0 Client ID in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) for each platform you need (Web, iOS, Android).
2. Drop the client IDs into [app.json](app.json) → `expo.extra.googleAuth`.
3. That's it — `useGoogleSignIn()` in [src/services/auth.ts](src/services/auth.ts) picks them up automatically. Until they're filled in, the Google button shows a one-time explainer and Guest mode covers the same app flow.

Before a real store release, swap `src/services/auth.ts` for `@react-native-google-signin/google-signin` (Expo's current recommendation) — it needs a custom dev build (`eas build --profile development`), which is why this scaffold defaults to the Expo-Go-compatible flow for now.

## Scaling to a backend

`GameRepository` in [src/services/storage.ts](src/services/storage.ts) is the only seam that touches storage. To move off-device (cross-device sync, analytics, server-driven case unlocks), implement the same interface against Firestore/Supabase/your API and swap the `gameRepository` export — no screen or store code changes.

## Project layout

```
src/
  types/case.ts          case/scene/hotspot/puzzle data shapes
  data/cases/             case content (Case No. 001 lives here)
  services/                auth.ts, storage.ts — the two pluggable seams
  store/gameStore.ts      zustand store; all game state + persistence calls
  navigation/              React Navigation stack + route types
  screens/                 one file per screen
  components/              scene rendering, hotspots, notebook, puzzle modals
  theme/                   noir palette, type, spacing tokens
```

## Known gaps (by design, for a first pass)

- Scene art is SVG/CSS shapes, not illustrated art — same "structural prototype first" approach as the original web version, so puzzle flow can be play-tested before investing in real art.
- No sound. No push notifications for the daily streak yet (the hook — `useHint`/streak logic — is in place; wiring `expo-notifications` is the next step).
- Case No. 002 is a teaser card only; there's no content behind it yet.
