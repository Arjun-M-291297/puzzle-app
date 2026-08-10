// Noir case-file design system — carried over from the original web prototype's
// palette so the mobile app reads as the same detective's file, not a reskin.

export const colors = {
  // Base
  ink: '#0b0f14', // near-black study
  inkRaised: '#10161d',
  inkElevated: '#161d26',

  // Accents
  brass: '#c99a52',
  brassBright: '#e0b877',
  brassDim: '#8a6a37',

  paper: '#ece2cd',
  paperDim: '#cfc3a4',

  rust: '#a4402e',
  rustBright: '#c2523c',

  teal: '#2f4d4d',
  tealBright: '#3f6666',

  // Semantic
  success: '#6f9c6a',
  danger: '#a4402e',
  overlay: 'rgba(11, 15, 20, 0.86)',
  border: 'rgba(201, 154, 82, 0.25)',
  borderStrong: 'rgba(201, 154, 82, 0.5)',
} as const;

export const gradients = {
  study: [colors.inkRaised, colors.ink] as const,
  paperCard: ['#f4ecd8', colors.paper] as const,
  brassGlow: ['rgba(201,154,82,0.35)', 'rgba(201,154,82,0)'] as const,
};

export const fonts = {
  display: 'SpecialElite_400Regular', // typewriter — chrome, headers, case-file stamps
  serif: 'System', // literary serif for narrative text (falls back until custom serif is loaded)
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.brass,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;
