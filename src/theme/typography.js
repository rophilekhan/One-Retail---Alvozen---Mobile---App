import { scaleFont } from './responsive.js';

export const fontFamilies = {
  primaryLight: 'DMSans-Light',
  primary: 'DMSans-Regular',
  primaryMedium: 'DMSans-Medium',
  mono: 'DMMono-Regular',
  monoMedium: 'DMMono-Medium',
};

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

/**
 * Standard typography variants extracted from OneRx / OneRetail Figma designs
 * Using available font assets: DMSans-Light, DMSans-Regular, DMSans-Medium, DMMono-Regular, DMMono-Medium
 */
export const typography = {
  // Hero / Splash display
  displayLarge: {
    fontFamily: fontFamilies.primaryLight,
    fontSize: scaleFont(64),
    fontWeight: fontWeights.light,
    lineHeight: scaleFont(72),
    letterSpacing: -1,
  },
  // Screen main headlines
  headlineLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(40),
    fontWeight: fontWeights.regular,
    lineHeight: scaleFont(48),
    letterSpacing: -0.5,
  },
  // Section headers & Modal titles
  headlineMedium: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(28),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(34),
    letterSpacing: -0.2,
  },
  // Item titles & Card main headings
  titleLarge: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(20),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(26),
  },
  // Timers & Subsection headers
  titleMedium: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(18),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(24),
  },
  // Button text & Section tabs
  bodyLarge: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(16),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(22),
  },
  // Standard body & Input text
  bodyMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(14),
    fontWeight: fontWeights.regular,
    lineHeight: scaleFont(20),
  },
  bodyMediumMedium: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(14),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(20),
  },
  // Helper text, captions, secondary timestamps
  caption: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(12),
    fontWeight: fontWeights.regular,
    lineHeight: scaleFont(16),
  },
  captionMedium: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(12),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(16),
  },
  // Small chips, tags & status badges
  badge: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(10),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(12),
  },
  // Barcode numbers, SKU codes, prices, quantity counters
  monoClinical: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(13),
    fontWeight: fontWeights.medium,
    lineHeight: scaleFont(18),
    letterSpacing: 0.2,
  },
  monoSmall: {
    fontFamily: fontFamilies.mono,
    fontSize: scaleFont(11),
    fontWeight: fontWeights.regular,
    lineHeight: scaleFont(14),
  },
};
