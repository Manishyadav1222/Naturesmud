export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      50: '#F5F7EF',
      100: '#E8EFCB',
      200: '#D1E0A1',
      300: '#B0CA6E',
      400: '#8DB143',
      500: '#719A2D',
      600: '#5C7E25',
      700: '#365314', // Main brand green
      800: '#2D4312',
      900: '#1E2E0D',
      950: '#0F1806',
    },

    // Accent gold
    accent: {
      50: '#FEFCE8',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D9A441', // Main accent gold
      700: '#CA8A04',
      800: '#A16207',
      900: '#854D0E',
    },

    // Semantic colors
    success: {
      light: '#ECFDF5',
      main: '#059669',
      dark: '#047857',
    },
    warning: {
      light: '#FFFAEB',
      main: '#D97706',
      dark: '#B45309',
    },
    error: {
      light: '#FEF2F2',
      main: '#EF4444',
      dark: '#DC2626',
    },
    info: {
      light: '#EFF6FF',
      main: '#3B82F6',
      dark: '#2563EB',
    },

    // Neutral colors
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAF5',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#2B2B2B', // Main text
      900: '#1F2937',
      950: '#111827',
    },

    // Background
    background: {
      primary: '#FAFAF5',
      secondary: '#FFFFFF',
      tertiary: '#F5F7EF',
      inverse: '#2B2B2B',
    },

    // Text
    text: {
      primary: '#2B2B2B',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
      link: '#365314',
      linkHover: '#2D4312',
    },

    // Border
    border: {
      light: 'rgba(43, 43, 43, 0.08)',
      main: 'rgba(43, 43, 43, 0.12)',
      dark: 'rgba(43, 43, 43, 0.2)',
      focus: '#365314',
      error: '#EF4444',
    },

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },

  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },

  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },

  typography: {
    fontFamilies: {
      heading: 'Poppins_700Bold',
      body: 'Inter_400Regular',
      mono: 'SpaceMono_400Regular',
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    fontSizes: {
      xs: 11,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24,
      '4xl': 28,
      '5xl': 32,
      '6xl': 40,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacings: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
    },
  },

  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
    inner: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
  },

  transitions: {
    fast: 150,
    normal: 250,
    slow: 350,
  },

  zIndices: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    toast: 700,
    tooltip: 800,
  },

  breakpoints: {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
      },
      borderRadius: 9999,
    },
    input: {
      height: 48,
      borderRadius: 12,
    },
    card: {
      borderRadius: 20,
      padding: 16,
    },
    badge: {
      borderRadius: 9999,
      fontSize: 11,
      fontWeight: '700',
    },
  },
};

export type Theme = typeof theme;

// Helper functions
export const getColor = (path: string, fallback = 'transparent') => {
  const keys = path.split('.');
  let value: any = theme.colors;
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return fallback;
  }
  return value;
};

export const getSpacing = (key: keyof typeof theme.spacing) => theme.spacing[key];
export const getBorderRadius = (key: keyof typeof theme.borderRadius) => theme.borderRadius[key];
export const getFontSize = (key: keyof typeof theme.typography.fontSizes) => theme.typography.fontSizes[key];
export const getShadow = (key: keyof typeof theme.shadows) => theme.shadows[key];
export const getTransition = (key: keyof typeof theme.transitions) => theme.transitions[key];
export const getZIndex = (key: keyof typeof theme.zIndices) => theme.zIndices[key];