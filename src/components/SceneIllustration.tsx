import React from 'react';
import { Animated } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Line,
  Path,
  Polygon,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { colors } from '../theme';
import { usePulse } from '../hooks/usePulse';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
import {
  THIRD_SHELF_SYMBOLS,
  THIRD_SHELF_BOOK_WIDTH,
  THIRD_SHELF_BOOK_HEIGHT,
  THIRD_SHELF_BOOK_Y,
  thirdShelfBookX,
} from './thirdShelfLayout';

interface Props {
  background: 'study' | 'drawer' | 'passage' | 'hiddenRoom';
}

// Illustrative-noir SVG scenes. Every object is built from curved paths and
// layered shading (a grounding shadow, a base shape, an edge highlight) rather
// than single flat primitives, so props read as objects with weight and a
// light source instead of geometric placeholders. Coordinates use a 0-100
// viewBox matching the 0-1 hotspot fractions used in case data.
export function SceneIllustration({ background }: Props) {
  return (
    <Svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id="vignette" cx="50%" cy="42%" r="78%">
          <Stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <Stop offset="100%" stopColor="#0d0703" stopOpacity="0.68" />
        </RadialGradient>
        {/* warm-only wash, replacing the old cool-teal top stop — every scene now
            grades toward sepia/amber instead of blue, matching the reference art */}
        <LinearGradient id="ambientWash" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#3a2a15" stopOpacity="0.3" />
          <Stop offset="55%" stopColor="#150d08" stopOpacity="0" />
          <Stop offset="100%" stopColor="#1f1408" stopOpacity="0.38" />
        </LinearGradient>
        <RadialGradient id="lampGlowDesk" cx="46%" cy="66%" r="26%">
          <Stop offset="0%" stopColor="#f6c877" stopOpacity="0.55" />
          <Stop offset="60%" stopColor="#f6c877" stopOpacity="0.14" />
          <Stop offset="100%" stopColor="#f6c877" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="lampGlowBulb" cx="50%" cy="10%" r="42%">
          <Stop offset="0%" stopColor="#f6c877" stopOpacity="0.5" />
          <Stop offset="55%" stopColor="#f6c877" stopOpacity="0.12" />
          <Stop offset="100%" stopColor="#f6c877" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="lampGlowBoard" cx="72%" cy="40%" r="38%">
          <Stop offset="0%" stopColor="#f6c877" stopOpacity="0.45" />
          <Stop offset="60%" stopColor="#f6c877" stopOpacity="0.1" />
          <Stop offset="100%" stopColor="#f6c877" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="metalSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#3f4a58" stopOpacity="1" />
          <Stop offset="45%" stopColor="#232b34" stopOpacity="1" />
          <Stop offset="100%" stopColor="#12171d" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="woodDesk" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#31261b" stopOpacity="1" />
          <Stop offset="100%" stopColor="#17110a" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="shelfBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#171f28" stopOpacity="1" />
          <Stop offset="100%" stopColor="#0c1117" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="canvasSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#2a3b4d" stopOpacity="1" />
          <Stop offset="100%" stopColor="#141d26" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      <Rect x={0} y={0} width={100} height={100} fill={colors.inkRaised} />

      {background === 'study' && <StudyArt />}
      {background === 'drawer' && <DrawerArt />}
      {background === 'passage' && <PassageArt />}
      {background === 'hiddenRoom' && <HiddenRoomArt />}

      <Rect x={0} y={0} width={100} height={100} fill="url(#ambientWash)" />
      {/* flat sepia cast over the whole frame — the single biggest lever for "vintage
          photograph" over "flat vector art", subtle enough not to muddy any one scene */}
      <Rect x={0} y={0} width={100} height={100} fill="#3a2410" opacity={0.1} />
      <FilmGrain seed={background.length} />
      <Rect x={0} y={0} width={100} height={100} fill="url(#vignette)" />
    </Svg>
  );
}

/** Static (non-animated) speckle texture — an aged-photograph grain, not the
 * twinkling DustMotes used for in-scene atmosphere. One consistent seed per
 * background so it doesn't shift between renders of the same scene. */
function FilmGrain({ seed }: { seed: number }) {
  const specks = React.useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        x: pseudoRandom(i, seed) * 100,
        y: pseudoRandom(i + 300, seed) * 100,
        r: 0.08 + pseudoRandom(i + 400, seed) * 0.18,
        o: 0.05 + pseudoRandom(i + 500, seed) * 0.1,
      })),
    [seed]
  );
  return (
    <>
      {specks.map((s, i) => (
        <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#000000" opacity={s.o} />
      ))}
    </>
  );
}

function pseudoRandom(i: number, seed: number) {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function DustMotes({ seed = 0, count = 10, area }: { seed?: number; count?: number; area: [number, number, number, number] }) {
  const [x0, y0, w, h] = area;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const rx = pseudoRandom(i, seed);
        const ry = pseudoRandom(i + 50, seed);
        const r = pseudoRandom(i + 100, seed);
        const phase = pseudoRandom(i + 200, seed);
        const baseOpacity = 0.15 + r * 0.25;
        return (
          <DustMote
            key={i}
            cx={x0 + rx * w}
            cy={y0 + ry * h}
            radius={0.15 + r * 0.25}
            baseOpacity={baseOpacity}
            phase={phase}
          />
        );
      })}
    </>
  );
}

/** A light source's glow, breathing gently — reserved for actual bulbs/lamps, not full-scene washes. */
function BreathingGlow({
  cx,
  cy,
  rx,
  ry,
  gradientId,
  minOpacity = 0.75,
  durationMs = 3400,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  gradientId: string;
  minOpacity?: number;
  durationMs?: number;
}) {
  const pulse = usePulse(durationMs, 0.3, false);
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [minOpacity, 1] });
  return <AnimatedEllipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${gradientId})`} opacity={opacity} />;
}

/** A single mote, twinkling gently on its own desynced cycle — decorative only. */
function DustMote({
  cx,
  cy,
  radius,
  baseOpacity,
  phase,
}: {
  cx: number;
  cy: number;
  radius: number;
  baseOpacity: number;
  phase: number;
}) {
  const pulse = usePulse(2600 + phase * 1400, phase, false);
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [baseOpacity * 0.4, baseOpacity] });
  return <AnimatedCircle cx={cx} cy={cy} r={radius} fill={colors.brassBright} opacity={opacity} />;
}

/** A single upright book spine with a softly rounded top-left corner and a title tick. */
function BookSpine({ x, y, w, h, fill, tilt = 0 }: { x: number; y: number; w: number; h: number; fill: string; tilt?: number }) {
  return (
    <G transform={tilt ? `rotate(${tilt} ${x + w / 2} ${y + h})` : undefined}>
      <Path
        d={`M${x},${y + h} L${x},${y + 1.4} Q${x},${y} ${x + 1.2},${y} L${x + w},${y} L${x + w},${y + h} Z`}
        fill={fill}
      />
      <Line x1={x + w * 0.3} y1={y + h * 0.22} x2={x + w * 0.3} y2={y + h * 0.42} stroke="#00000055" strokeWidth={0.25} />
      <Line x1={x + 0.5} y1={y + 1.6} x2={x + 0.5} y2={y + h - 0.6} stroke="#ffffff22" strokeWidth={0.3} />
    </G>
  );
}

const bookPalette = ['#7a3232', '#2f4d3a', '#a8843a', '#2c3a54', '#5c3a24'];

function StudyArt() {
  return (
    <>
      {/* floor with plank lines */}
      <Rect x={0} y={82} width={100} height={18} fill="#0a0704" />
      {[8, 22, 36, 50, 64, 78, 92].map((x) => (
        <Line key={x} x1={x} y1={82} x2={x - 4} y2={100} stroke="#000000" strokeWidth={0.3} opacity={0.5} />
      ))}
      {/* wall wash + subtle panel seams */}
      {[18, 40, 62, 84].map((x) => (
        <Line key={x} x1={x} y1={0} x2={x} y2={82} stroke={colors.border} strokeWidth={0.3} />
      ))}

      {/* heavy curtain, stage-left */}
      <Path d="M0,0 L12,0 Q7,42 13,82 L0,82 Z" fill="#1c1210" opacity={0.92} />
      <Path d="M0,0 L12,0 Q7,42 13,82 L0,82 Z" fill="none" stroke="#000" strokeWidth={0.3} opacity={0.4} />
      {[2, 5, 8, 11].map((x) => (
        <Path key={x} d={`M${x},0 Q${x - 2},42 ${x + 1},82`} stroke="#000" strokeWidth={0.25} opacity={0.32} fill="none" />
      ))}
      <Path d="M0,0 L12,0 Q9,4 6,3 Q3,4 0,2 Z" fill="#120c0a" opacity={0.8} />

      {/* cold fireplace: dead ash and a spent, unlit log — no glow, matches "cold ashes" clue */}
      <Path d="M2,82 L2,64 Q10,58 18,64 L18,82 Z" fill="#050403" stroke={colors.rust} strokeWidth={0.4} />
      <Path d="M4,82 L4,66 Q10,61 16,66 L16,82 Z" fill="#0a0605" />
      <Path d="M6,80.5 Q10,78.5 14,80.5" stroke="#1a1512" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Ellipse cx={10} cy={80} rx={5} ry={1.8} fill="#3a3630" opacity={0.7} />
      <Ellipse cx={9} cy={80.3} rx={2.2} ry={0.9} fill="#4a463e" opacity={0.6} />
      <Ellipse cx={12} cy={80.6} rx={1.6} ry={0.7} fill="#28251f" opacity={0.7} />

      {/* armchair — distinct back/seat/arms so it reads as furniture, not a blob */}
      <Ellipse cx={14} cy={83.5} rx={11} ry={1.6} fill="#000" opacity={0.35} />
      {/* backrest */}
      <Path d="M8,85 L8,64 Q8,60 13,60 Q18,60 18,64 L18,85 Z" fill="#4a2e24" stroke="#000" strokeWidth={0.3} />
      <Path d="M9.5,63 Q13,60.6 16.5,63" stroke="#00000055" strokeWidth={0.25} fill="none" />
      <Line x1={13} y1={62} x2={13} y2={85} stroke="#00000044" strokeWidth={0.25} />
      {/* seat cushion */}
      <Rect x={6.5} y={76} width={13} height={7} rx={1.4} fill="#3f281f" stroke="#000" strokeWidth={0.25} />
      <Line x1={7.5} y1={79.4} x2={18.5} y2={79.4} stroke="#00000044" strokeWidth={0.25} />
      {/* rolled arms, flanking the seat, reaching the floor */}
      <Path d="M4,85 L4,72 Q4,69.4 6.6,69.4 Q9,69.4 9,72 L9,85 Z" fill="#412720" stroke="#000" strokeWidth={0.3} />
      <Path d="M17,85 L17,72 Q17,69.4 19.6,69.4 Q22,69.4 22,72 L22,85 Z" fill="#412720" stroke="#000" strokeWidth={0.3} />
      <Ellipse cx={6.5} cy={70} rx={2.5} ry={1.1} fill="#523327" />
      <Ellipse cx={19.5} cy={70} rx={2.5} ry={1.1} fill="#523327" />
      {/* throw blanket draped over the left arm */}
      <Path d="M3.6,72 Q2.2,76 4,81 Q6.4,82.4 7,79 Q5.6,75.6 6.2,72 Q4.8,71 3.6,72 Z" fill={colors.teal} opacity={0.88} />
      <Line x1={4.6} y1={74} x2={5.8} y2={79} stroke="#00000033" strokeWidth={0.25} />
      <Line x1={6} y1={70} x2={7.5} y2={76} stroke="#00000033" strokeWidth={0.25} />

      {/* crooked painting: layered frame, mat, small landscape */}
      <G transform="rotate(-4 18 23)">
        <Ellipse cx={18} cy={36.5} rx={12} ry={1.2} fill="#000" opacity={0.2} />
        <Rect x={6.5} y={10.5} width={23} height={25} rx={1.2} fill="#241812" stroke={colors.brass} strokeWidth={0.8} />
        <Rect x={8.3} y={12.3} width={19.4} height={21.4} fill="none" stroke={colors.brassDim} strokeWidth={0.35} opacity={0.7} />
        {[[8, 12], [27, 12], [8, 33], [27, 33]].map(([sx, sy]) => (
          <Circle key={`${sx}-${sy}`} cx={sx} cy={sy} r={0.55} fill={colors.brassBright} opacity={0.8} />
        ))}
        <Rect x={9.5} y={13.5} width={17} height={19} fill="url(#canvasSky)" />
        <Circle cx={23.5} cy={16.5} r={1.7} fill="#e8d9ad" opacity={0.55} />
        <Path d="M9.5,29 Q13,22 16,27 Q19,20 22,26 Q24.5,23 26.5,27 L26.5,32.5 L9.5,32.5 Z" fill="#0e161d" opacity={0.9} />
        <Line x1={13} y1={27} x2={13} y2={22} stroke="#0e161d" strokeWidth={0.4} />
        <Circle cx={13} cy={21} r={1.1} fill="#12191f" opacity={0.9} />
        <Path d="M10,11 L26,11" stroke="#ffffff" strokeWidth={0.3} opacity={0.15} />
      </G>

      {/* mantel ledge under the clock, grounding it — extended right to hold the bottle */}
      <Rect x={38} y={21.6} width={30} height={1.8} rx={0.4} fill="#1a1108" stroke={colors.brassDim} strokeWidth={0.3} />
      <Ellipse cx={53} cy={23.6} rx={16} ry={1.1} fill="#000" opacity={0.3} />

      {/* prescription bottle, half-tucked behind the clock's shadow */}
      <Ellipse cx={63.8} cy={21.9} rx={2.6} ry={0.6} fill="#000" opacity={0.35} />
      <Rect x={61.8} y={17.6} width={4} height={4.4} rx={0.6} fill="#a8752e" stroke="#5c3a13" strokeWidth={0.25} />
      <Rect x={62.5} y={16.4} width={2.6} height={1.4} rx={0.3} fill="#c9c2b4" stroke="#8a8474" strokeWidth={0.2} />
      <Rect x={62.1} y={18.6} width={3.2} height={2.2} fill={colors.paper} opacity={0.9} />
      <Line x1={62.4} y1={19.3} x2={65} y2={19.3} stroke="#5c3a13" strokeWidth={0.12} opacity={0.6} />
      <Line x1={62.4} y1={19.9} x2={64.4} y2={19.9} stroke="#5c3a13" strokeWidth={0.12} opacity={0.5} />

      {/* mantel clock: pediment, casing, face, ticks, hands */}
      <Path d="M45.5,4.4 Q50,1 54.5,4.4 L52.5,6 L47.5,6 Z" fill={colors.brassDim} stroke={colors.brass} strokeWidth={0.3} />
      <Circle cx={50} cy={13} r={9.4} fill="url(#metalSheen)" stroke={colors.brass} strokeWidth={0.75} />
      <Circle cx={50} cy={13} r={7.6} fill="#12181f" stroke={colors.brassDim} strokeWidth={0.3} />
      {Array.from({ length: 12 }).map((_, i) => {
        const deg = i * 30;
        const rad = (deg * Math.PI) / 180;
        const inner = 6.5;
        const outer = 7.35;
        const big = deg % 90 === 0;
        return (
          <Line
            key={deg}
            x1={50 + Math.sin(rad) * inner}
            y1={13 - Math.cos(rad) * inner}
            x2={50 + Math.sin(rad) * outer}
            y2={13 - Math.cos(rad) * outer}
            stroke={big ? colors.paper : colors.paperDim}
            strokeWidth={big ? 0.5 : 0.22}
          />
        );
      })}
      {/* hands fixed at 11:23 — matches the "Stopped Clock — 11:23" clue */}
      <Line x1={50} y1={13} x2={48.35} y2={8.07} stroke={colors.paper} strokeWidth={0.65} strokeLinecap="round" />
      <Line x1={50} y1={13} x2={54.68} y2={18.2} stroke={colors.paper} strokeWidth={0.5} strokeLinecap="round" />
      <Circle cx={50} cy={13} r={0.55} fill={colors.brassBright} />
      <Path d="M44,7.2 Q50,3.2 56.5,8" stroke="#fff" strokeWidth={0.4} opacity={0.16} fill="none" />
      <Circle cx={50} cy={20.4} r={0.5} fill={colors.brassDim} opacity={0.8} />

      {/* bookshelf: casing, shaded back panel, curved-spine books, top clutter, bust */}
      <Ellipse cx={82.5} cy={64.5} rx={15} ry={1.4} fill="#000" opacity={0.3} />
      <Rect x={69} y={5} width={27} height={58} fill="url(#shelfBack)" stroke={colors.brass} strokeWidth={0.55} />
      <Rect x={69} y={5} width={27} height={58} fill="url(#lampGlowBulb)" opacity={0.4} />
      {[16, 27, 38, 49, 60].map((y) => (
        <G key={y}>
          <Line x1={69} y1={y} x2={96} y2={y} stroke={colors.brass} strokeWidth={0.45} opacity={0.75} />
          <Line x1={69} y1={y + 0.4} x2={96} y2={y + 0.4} stroke="#000" strokeWidth={0.3} opacity={0.3} />
        </G>
      ))}
      {[
        { row: 0, col: 0, h: 9.2, w: 3.4, tilt: 0 },
        { row: 0, col: 1, h: 8, w: 3, tilt: -6 },
        { row: 0, col: 2, h: 9.6, w: 3.6, tilt: 0 },
        { row: 0, col: 3, h: 7.4, w: 2.8, tilt: 0 },
        { row: 0, col: 4, h: 9, w: 3.2, tilt: 5 },
        { row: 1, col: 0, h: 8.6, w: 3.2, tilt: 0 },
        { row: 1, col: 1, h: 9.4, w: 3.6, tilt: 0 },
        { row: 1, col: 2, h: 7.8, w: 3, tilt: 0 },
        { row: 1, col: 3, h: 9, w: 3.4, tilt: -4 },
        { row: 1, col: 4, h: 8.2, w: 3, tilt: 0 },
      ].map((b, i) => {
        const x = 71.3 + b.col * 5.1;
        const y = 6 + b.row * 11 + (9.6 - b.h);
        return <BookSpine key={i} x={x} y={y} w={b.w} h={b.h} fill={bookPalette[(i + b.row) % bookPalette.length]} tilt={b.tilt} />;
      })}

      {/* the third shelf — the actual "SEEK THE THIRD SHELF" target, visually distinct
          from the plain shelves above so an observant player can spot it before the cipher.
          The symbols themselves render as a separate <ThirdShelfSymbols> text overlay in
          PlayScreen — see thirdShelfLayout.ts for why. */}
      {THIRD_SHELF_SYMBOLS.map((symbol, col) => (
        <BookSpine
          key={symbol}
          x={thirdShelfBookX(col)}
          w={THIRD_SHELF_BOOK_WIDTH}
          h={THIRD_SHELF_BOOK_HEIGHT}
          y={THIRD_SHELF_BOOK_Y}
          fill="#20262d"
        />
      ))}
      {/* horizontal stack resting on top of the casing */}
      <Rect x={73} y={2.4} width={9} height={1.6} rx={0.4} fill={bookPalette[1]} transform="rotate(-2 77 3)" />
      <Rect x={74} y={0.9} width={7.4} height={1.5} rx={0.4} fill={bookPalette[3]} transform="rotate(2 77 1.6)" />
      {/* small bust on a pedestal — warm-toned so it pops off the dark shelf back */}
      <Rect x={80.6} y={59.6} width={3.8} height={2.6} rx={0.3} fill="#3a2f22" stroke={colors.brassDim} strokeWidth={0.3} />
      <Path d="M81,59.7 Q82.5,55.6 84,59.7 Z" fill="#d9c48f" opacity={0.9} />
      <Circle cx={82.5} cy={56} r={1.15} fill="#d9c48f" opacity={0.9} />
      <Path d="M81.6,55.6 Q82.5,54.6 83.4,55.6" stroke="#00000033" strokeWidth={0.15} fill="none" />

      {/* desk: wood grain, warm pool, clutter, lamp anchored to the surface */}
      <Ellipse cx={49} cy={87.5} rx={24} ry={2.5} fill="#000" opacity={0.35} />
      <Rect x={27} y={58} width={44} height={26} rx={2} fill="url(#woodDesk)" stroke={colors.brass} strokeWidth={0.5} />
      <Line x1={28} y1={58.6} x2={70} y2={58.6} stroke="#ffffff2a" strokeWidth={0.35} />
      <Rect x={27} y={58} width={44} height={26} rx={2} fill="url(#lampGlowDesk)" />
      {[63, 67, 71, 75, 79].map((y) => (
        <Line key={y} x1={29} y1={y} x2={69} y2={y} stroke="#000" strokeWidth={0.15} opacity={0.22} />
      ))}

      {/* desk lamp, base sitting flush on the surface */}
      <Ellipse cx={63} cy={58.4} rx={2.4} ry={0.7} fill="#000" opacity={0.4} />
      <Ellipse cx={63} cy={58.2} rx={2} ry={0.6} fill="#2a2f36" stroke={colors.brassDim} strokeWidth={0.25} />
      <Path d="M63,57.8 Q63.4,52 60.2,49.4" stroke="#2a2f36" strokeWidth={0.8} fill="none" strokeLinecap="round" />
      <Path d="M56.5,49.6 L60.5,48.8 L61.6,45.6 L57.2,44.6 Z" fill="#3a3128" stroke={colors.brassDim} strokeWidth={0.3} />
      <BreathingGlow cx={58.8} cy={47.2} rx={3.6} ry={2.2} gradientId="lampGlowBulb" />
      <Circle cx={58.8} cy={47.4} r={0.5} fill="#ffe6a8" opacity={0.9} />

      {/* papers, pen, mug — kept clear of the drawer hotspot */}
      <G transform="rotate(-6 38 64)">
        <Rect x={33} y={60.5} width={11} height={8} rx={0.4} fill={colors.paperDim} opacity={0.85} />
      </G>
      <G transform="rotate(4 40 65)">
        <Rect x={35} y={61.5} width={11} height={8} rx={0.4} fill={colors.paper} opacity={0.92} />
        <Line x1={37} y1={64} x2={44} y2={64} stroke="#2a2018" strokeWidth={0.25} opacity={0.5} />
        <Line x1={37} y1={66} x2={42} y2={66} stroke="#2a2018" strokeWidth={0.25} opacity={0.4} />
      </G>
      <Line x1={30.5} y1={80} x2={34.5} y2={75.5} stroke="#1a1108" strokeWidth={0.5} strokeLinecap="round" />
      <Circle cx={34.6} cy={75.3} r={0.4} fill={colors.brassDim} />
      <Path d="M64,78 L64,74.5 Q64,73.5 65,73.5 L67.6,73.5 Q68.6,73.5 68.6,74.5 L68.6,78 Z" fill="#1c232b" stroke={colors.brassDim} strokeWidth={0.25} />
      <Path d="M68.6,75 Q70,75 70,76.2 Q70,77.4 68.6,77.2" fill="none" stroke={colors.brassDim} strokeWidth={0.3} />

      {/* the drawer / lock housing — the actionable hotspot, kept brightest */}
      <Rect x={33} y={68} width={32} height={12} rx={1} fill="#141b23" stroke={colors.brassDim} strokeWidth={0.4} />
      <Line x1={35} y1={69.2} x2={63} y2={69.2} stroke="#ffffff1a" strokeWidth={0.3} />
      <Circle cx={49} cy={74} r={1.6} fill={colors.brass} />
      <Circle cx={49} cy={74} r={2.7} fill="none" stroke={colors.brassBright} strokeWidth={0.25} opacity={0.55} />

      <DustMotes seed={1} count={12} area={[20, 10, 60, 50]} />
    </>
  );
}

function DrawerArt() {
  return (
    <>
      <Rect x={0} y={0} width={100} height={100} fill="#10151b" />
      <Rect x={0} y={0} width={100} height={100} fill="url(#lampGlowBulb)" opacity={0.4} />

      {/* drawer housing, wood grain, handle */}
      <Rect x={6} y={62} width={88} height={28} rx={3} fill="url(#woodDesk)" stroke={colors.brass} strokeWidth={0.5} />
      <Line x1={9} y1={63.2} x2={91} y2={63.2} stroke="#ffffff22" strokeWidth={0.3} />
      {[68, 74, 80, 86].map((y) => (
        <Line key={y} x1={9} y1={y} x2={91} y2={y} stroke="#000" strokeWidth={0.15} opacity={0.25} />
      ))}
      <Rect x={44} y={64} width={12} height={2.4} rx={1.2} fill={colors.brassDim} stroke={colors.brass} strokeWidth={0.25} />
      <Line x1={46} y1={64.6} x2={54} y2={64.6} stroke="#ffffff33" strokeWidth={0.25} />

      {/* number dial: layered rings, gradient, tick marks, lever */}
      <Ellipse cx={50} cy={51.5} rx={19} ry={2.2} fill="#000" opacity={0.3} />
      <Circle cx={50} cy={50} r={18} fill="url(#metalSheen)" stroke={colors.brass} strokeWidth={0.85} />
      <Circle cx={50} cy={50} r={15.4} fill="none" stroke="#ffffff1f" strokeWidth={0.4} />
      <Circle cx={50} cy={50} r={12} fill="#141b23" stroke={colors.brassDim} strokeWidth={0.4} />
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const accent = i === 0;
        return (
          <Line
            key={i}
            x1={50 + Math.cos(angle) * 13}
            y1={50 + Math.sin(angle) * 13}
            x2={50 + Math.cos(angle) * 16}
            y2={50 + Math.sin(angle) * 16}
            stroke={accent ? colors.brassBright : colors.paperDim}
            strokeWidth={accent ? 0.6 : 0.3}
          />
        );
      })}
      {[[36, 36], [64, 36], [36, 64], [64, 64]].map(([sx, sy]) => (
        <Circle key={`${sx}-${sy}`} cx={sx} cy={sy} r={0.7} fill="#0a0d10" stroke={colors.brassDim} strokeWidth={0.15} />
      ))}
      <Rect x={66} y={48.5} width={4} height={3} rx={1} fill={colors.brassDim} stroke={colors.brass} strokeWidth={0.25} />
      <Path d="M40,40 Q50,35 60,40" stroke="#fff" strokeWidth={0.5} opacity={0.13} fill="none" />

      {/* handwritten note with a dog-eared corner */}
      <G transform="rotate(-3 22 20)">
        <Path d="M9,10 L31,10 L35,14 L35,30 L9,30 Z" fill={colors.paper} opacity={0.95} />
        <Path d="M31,10 L31,14 L35,14 Z" fill="#cbb896" opacity={0.9} />
        <Path d="M9,10 L31,10 L35,14 L35,30 L9,30 Z" fill="none" stroke="#00000022" strokeWidth={0.35} />
        {[15, 18, 21, 24, 27].map((y, i) => (
          <Line key={y} x1={12} y1={y} x2={12 + [20, 18, 21, 15, 19][i]} y2={y} stroke="#2a2018" strokeWidth={0.35} opacity={0.55} />
        ))}
      </G>

      {/* polaroid-style photograph with a clearer figure silhouette */}
      <G transform="rotate(3 77 20)">
        <Ellipse cx={77} cy={33} rx={15} ry={1.3} fill="#000" opacity={0.25} />
        <Rect x={62} y={7} width={30} height={28} rx={0.6} fill={colors.paper} />
        <Rect x={64.4} y={9.2} width={25.2} height={18.6} fill="#0d1620" />
        {[13, 17, 21].map((y) => (
          <Line key={y} x1={65.5} y1={y} x2={70} y2={y} stroke="#1c2a38" strokeWidth={0.3} opacity={0.6} />
        ))}
        <Circle cx={77} cy={16.5} r={2.5} fill="#182430" />
        <Path d="M71.5,27.5 Q71.5,20.5 77,20.5 Q82.5,20.5 82.5,27.5 Z" fill="#182430" />
        <Line x1={64.4} y1={27.8} x2={89.6} y2={27.8} stroke="#233241" strokeWidth={0.3} opacity={0.5} />
      </G>

      {/* letters bundle with a wax seal */}
      <G transform="rotate(2 27 69)">
        <Rect x={14} y={58} width={26} height={18} rx={1} fill={colors.paperDim} opacity={0.9} />
      </G>
      <G transform="rotate(-4 27 69)">
        <Ellipse cx={27} cy={78.5} rx={15} ry={1.2} fill="#000" opacity={0.25} />
        <Rect x={12} y={60} width={26} height={18} rx={1} fill={colors.paper} opacity={0.95} />
        {[65, 68, 71, 74].map((y) => (
          <Line key={y} x1={16} y1={y} x2={34} y2={y} stroke="#2a2018" strokeWidth={0.3} opacity={0.5} />
        ))}
        <Circle cx={33} cy={72} r={2.1} fill={colors.rust} opacity={0.9} />
        <Circle cx={33} cy={72} r={1.1} fill={colors.rustBright} opacity={0.7} />
      </G>
    </>
  );
}

function PassageArt() {
  return (
    <>
      <Rect x={0} y={0} width={100} height={100} fill="#070a0d" />
      <Polygon points="20,100 80,100 62,10 38,10" fill="#0d1116" stroke={colors.brassDim} strokeWidth={0.4} />
      <Polygon points="20,100 80,100 62,10 38,10" fill="url(#lampGlowBulb)" opacity={0.6} />

      {/* stone side walls with a subtle block/mortar texture */}
      <Path d="M20,100 L38,10 L34,10 L14,100 Z" fill="#050708" opacity={0.75} />
      <Path d="M80,100 L62,10 L66,10 L86,100 Z" fill="#050708" opacity={0.75} />
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 14 + i * 10;
        const leftX = 16 + i * 0.4;
        return <Line key={`l${i}`} x1={leftX} y1={y} x2={leftX + 8} y2={y} stroke="#000" strokeWidth={0.2} opacity={0.35} />;
      })}
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 14 + i * 10;
        const rightX = 76 - i * 0.4;
        return <Line key={`r${i}`} x1={rightX} y1={y} x2={rightX - 8} y2={y} stroke="#000" strokeWidth={0.2} opacity={0.35} />;
      })}

      {/* stair treads: lighter top face + darker riser for real depth */}
      {[20, 32, 44, 56, 68, 80, 92].map((y, i) => {
        const half = 20 + i * 1.2;
        return (
          <G key={y}>
            <Rect x={50 - half} y={y} width={half * 2} height={1.8} fill="#1a1510" opacity={0.9} />
            <Line x1={50 - half} y1={y} x2={50 + half} y2={y} stroke={colors.border} strokeWidth={0.35} />
            <Rect x={50 - half} y={y + 1.8} width={half * 2} height={2.6} fill="#000" opacity={0.32} />
          </G>
        );
      })}

      {/* hanging bulb fixture: cord, socket, bulb with a filament hint */}
      <Line x1={50} y1={2} x2={50} y2={11.5} stroke="#2a2f36" strokeWidth={0.45} />
      <Rect x={48.4} y={11} width={3.2} height={1.6} rx={0.4} fill="#2a2f36" />
      <Circle cx={50} cy={13.6} r={1.7} fill="#f2d9a0" opacity={0.92} />
      <Path d="M49.2,13 Q50,12.4 50.8,13 Q50,13.6 49.2,13" stroke="#a8752e" strokeWidth={0.15} fill="none" opacity={0.6} />
      <BreathingGlow cx={50} cy={13.6} rx={5.5} ry={5.5} gradientId="lampGlowBulb" durationMs={2900} />
      <Rect x={40} y={2} width={20} height={7} fill={colors.inkRaised} />

      {/* cobweb corner */}
      <Path d="M38,12 Q42,14 40,18 M38,12 Q40,16 44,15 M38,12 L44,17" stroke={colors.paperDim} strokeWidth={0.15} opacity={0.3} fill="none" />

      <DustMotes seed={7} count={14} area={[35, 15, 30, 70]} />
    </>
  );
}

function HiddenRoomArt() {
  return (
    <>
      <Rect x={0} y={0} width={100} height={100} fill="#0a0d12" />
      <Ellipse cx={50} cy={4} rx={30} ry={8} fill="url(#lampGlowBulb)" opacity={0.35} />

      {/* packed travel case: handle, straps, texture, tag */}
      <Ellipse cx={25} cy={78.5} rx={16} ry={2.2} fill="#000" opacity={0.35} />
      <Path d="M20,51 Q25,46 30,51" stroke="#3a2a1c" strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <Rect x={10} y={55} width={30} height={22} rx={2} fill={colors.rust} opacity={0.92} />
      <Rect x={10} y={55} width={30} height={22} rx={2} fill="none" stroke="#000" strokeWidth={0.3} opacity={0.4} />
      <Line x1={12} y1={59} x2={38} y2={59} stroke="#ffffff22" strokeWidth={0.3} />
      {[60, 65, 70, 74].map((y) => (
        <Line key={y} x1={11} y1={y} x2={39} y2={y} stroke="#00000033" strokeWidth={0.25} />
      ))}
      <Rect x={10} y={51} width={30} height={6} rx={2} fill={colors.rustBright} opacity={0.95} />
      <Line x1={25} y1={51} x2={25} y2={77} stroke="#000" strokeWidth={0.5} opacity={0.5} />
      {[16, 34].map((x) => (
        <G key={x}>
          <Rect x={x} y={54} width={4} height={22} fill="#1a120c" opacity={0.55} />
          <Rect x={x} y={58} width={4} height={3} rx={0.5} fill={colors.brassDim} stroke={colors.brass} strokeWidth={0.2} />
        </G>
      ))}
      <Rect x={35} y={63} width={5} height={3} rx={0.5} fill={colors.paper} opacity={0.92} transform="rotate(20 37 64)" />
      <Line x1={36} y1={64} x2={39} y2={65} stroke="#2a2018" strokeWidth={0.2} opacity={0.6} transform="rotate(20 37 64)" />

      {/* second set of clothes on a hook — tapered garment silhouette */}
      <Circle cx={50} cy={38.5} r={1.1} fill="none" stroke={colors.brassDim} strokeWidth={0.3} />
      <Path
        d="M47,40 L46,42.5 Q45.4,44 47,44.4 L47.8,42 L47.8,50 Q47.8,51 48.8,51 L51.2,51 Q52.2,51 52.2,50 L52.2,42 L53,44.4 Q54.6,44 54,42.5 L53,40 Q53,38.5 50,38.5 Q47,38.5 47,40 Z"
        fill="#232a31"
        opacity={0.9}
      />
      <Line x1={50} y1={40.5} x2={50} y2={50} stroke="#00000044" strokeWidth={0.25} />

      {/* evidence board: corkboard, angled pinned cards, red string, warm lamp glow */}
      <Ellipse cx={73} cy={71.5} rx={18} ry={1.6} fill="#000" opacity={0.3} />
      <Rect x={56} y={16} width={34} height={54} fill="#241a10" stroke={colors.brass} strokeWidth={0.6} />
      <Rect x={57} y={17} width={32} height={1.4} fill="#ffffff14" />
      <Rect x={56} y={16} width={34} height={54} fill="url(#lampGlowBoard)" />
      {[
        { x: 60, y: 20, r: -6, flag: false },
        { x: 74, y: 22, r: 4, flag: true },
        { x: 61, y: 34, r: 3, flag: false },
        { x: 76, y: 36, r: -4, flag: false },
        { x: 63, y: 48, r: -3, flag: true },
        { x: 78, y: 50, r: 5, flag: false },
        { x: 66, y: 60, r: 2, flag: false },
      ].map((card, i) => (
        <G key={i} transform={`rotate(${card.r} ${card.x + 5} ${card.y + 4})`}>
          <Rect x={card.x + 0.4} y={card.y + 0.6} width={10} height={8} fill="#000" opacity={0.25} />
          <Rect x={card.x} y={card.y} width={10} height={8} fill={colors.paper} opacity={0.94} />
          <Line x1={card.x + 1.5} y1={card.y + 3} x2={card.x + 8} y2={card.y + 3} stroke="#2a2018" strokeWidth={0.25} opacity={0.5} />
          <Line x1={card.x + 1.5} y1={card.y + 5.5} x2={card.x + 6} y2={card.y + 5.5} stroke="#2a2018" strokeWidth={0.25} opacity={0.4} />
          {card.flag && <Circle cx={card.x + 8.4} cy={card.y + 1.2} r={0.7} fill={colors.rustBright} />}
          <Circle cx={card.x + 5} cy={card.y} r={0.5} fill={colors.brassBright} />
        </G>
      ))}
      <Path d="M65,24 L79,26 L66,38 L81,40 L68,52 L83,54" stroke={colors.rustBright} strokeWidth={0.35} fill="none" opacity={0.85} />

      <DustMotes seed={3} count={10} area={[0, 0, 100, 45]} />
    </>
  );
}
