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

interface Props {
  // 'study' isn't included — that scene uses a real reference photo (see
  // PlayScreen) instead of hand-drawn SVG.
  background: 'drawer' | 'passage' | 'hiddenRoom';
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

      {/* a torn diary page, smaller and more private a hand than the ledger notes —
          the Mara thread's resolving clue */}
      <G transform="rotate(4 66 70)">
        <Ellipse cx={66} cy={85} rx={16} ry={1.4} fill="#000" opacity={0.25} />
        <Path d="M53,58 L79,58 L79,82 Q66,85 53,82 Z" fill={colors.paper} opacity={0.92} stroke="#00000022" strokeWidth={0.3} />
        {[63, 66, 69, 72, 75, 78].map((y, i) => (
          <Line
            key={y}
            x1={57}
            y1={y}
            x2={57 + [19, 17, 20, 14, 18, 11][i]}
            y2={y}
            stroke="#2a2018"
            strokeWidth={0.3}
            opacity={0.5}
          />
        ))}
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

      {/* a note, half-tucked into the spare coat's pocket — the Silas thread's
          resolving clue, found only after reaching this room */}
      <G transform="rotate(-8 47.5 43)">
        <Ellipse cx={47.5} cy={46.3} rx={3.6} ry={0.7} fill="#000" opacity={0.25} />
        <Path d="M45,40.6 L50,40.6 L50,45.4 L45,45.4 Z" fill={colors.paper} opacity={0.94} stroke="#00000022" strokeWidth={0.25} />
        {[42, 43.2, 44.4].map((y) => (
          <Line key={y} x1={45.8} y1={y} x2={49.2} y2={y} stroke="#2a2018" strokeWidth={0.22} opacity={0.5} />
        ))}
      </G>

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
