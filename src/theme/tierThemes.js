import React from 'react';
import { TierGemIcon } from '../assets/vectors/ImpactIcons.jsx';

/**
 * 4 Pharmacy Impact Index (PII) Tier Keys
 */
export const PHARMACY_TIER_KEYS = {
  GENERAL_TRADE: 'general_trade',
  ESTABLISHED: 'established',
  KEY_ACCOUNT: 'key_account',
  FLAGSHIP: 'flagship',
};

/**
 * Normalizes any tier identifier variant (e.g. 'Key Account', 'KEY_ACCOUNT', 'senior')
 * into a canonical key: 'general_trade' | 'established' | 'key_account' | 'flagship'
 *
 * @param {string} tier
 * @returns {'general_trade' | 'established' | 'key_account' | 'flagship'}
 */
export const normalizePharmacyTier = (tier) => {
  if (!tier) return PHARMACY_TIER_KEYS.ESTABLISHED;
  const s = String(tier).toLowerCase().replace(/[\s-]+/g, '_');
  if (s === 'emerging' || s === 'general_trade' || s === 'general') return PHARMACY_TIER_KEYS.GENERAL_TRADE;
  if (s === 'established') return PHARMACY_TIER_KEYS.ESTABLISHED;
  if (s === 'senior' || s === 'key_account' || s === 'key') return PHARMACY_TIER_KEYS.KEY_ACCOUNT;
  if (s === 'distinguished' || s === 'flagship') return PHARMACY_TIER_KEYS.FLAGSHIP;
  return PHARMACY_TIER_KEYS.ESTABLISHED;
};

/**
 * Resolves standard tier key from numerical PII points according to ONERETAIL_PRD.md:
 * - General Trade: 0 – 299
 * - Established: 300 – 599
 * - Key Account: 600 – 899
 * - Flagship: 900 – 1500+
 *
 * @param {number} points
 * @returns {'general_trade' | 'established' | 'key_account' | 'flagship'}
 */
export const resolveTierFromPoints = (points) => {
  const p = Number(points) || 0;
  if (p >= 900) return PHARMACY_TIER_KEYS.FLAGSHIP;
  if (p >= 600) return PHARMACY_TIER_KEYS.KEY_ACCOUNT;
  if (p >= 300) return PHARMACY_TIER_KEYS.ESTABLISHED;
  return PHARMACY_TIER_KEYS.GENERAL_TRADE;
};

/**
 * Exact 4-Tier Color Palettes (Light + Dark mode tokens) extracted 1:1 from OneRx Figma
 */
export const PHARMACY_TIERS_CONFIG = {
  general_trade: {
    key: PHARMACY_TIER_KEYS.GENERAL_TRADE,
    label: 'General Trade',
    level: 1,
    minPoints: 0,
    maxPoints: 299,
    nextTierKey: PHARMACY_TIER_KEYS.ESTABLISHED,
    prevTierKey: null,
    perks: [
      'Direct digital prescription QR verification',
      'Standard off-take velocity data sharing',
      'Standard retail cashout multiplier rate',
    ],
    light: {
      accentColor: '#00C48C',
      secondaryColor: '#059669',
      arcGradient: ['#00C48C', '#34D399', '#A7F3D0'],
      arcTrack: 'rgba(255, 255, 255, 0.7)',
      glowColors: ['#B0E7E1', '#99E1D6', '#C4EDE7', '#DBF4F1', '#D6F3EF', '#FFFFFF'],
      badgeBg: '#FFFFFF',
      badgeText: '#059669',
      badgeBorder: 'rgba(16, 185, 129, 0.25)',
      cardTint: ['#9AE1D5', '#B8EDE5', '#D2F5F0'],
      arcStops: {
        arcStart: '#C9F1E7',
        arcMid: '#8ADCC6',
        arcEnd: '#69D2B7',
        glow: '#69D2B7',
        pillText: '#4C9C88',
        pillBorder: 'rgba(255, 255, 255, 0)',
        pillBg: '#FFFFFF',
      },
      discBg: ['#FFFFFF', '#D5F5ED'],
      withdrawBg: '#0F4761',
    },
    dark: {
      accentColor: '#10B981',
      secondaryColor: '#059669',
      arcGradient: ['#059669', '#10B981', '#34D399'],
      arcTrack: 'rgba(255, 255, 255, 0.08)',
      glowColors: ['#181E1E', '#141D1C', '#1C1D1F', '#212524', '#161616', '#010101'],
      badgeBg: 'rgba(16, 185, 129, 0.14)',
      badgeText: '#34D399',
      badgeBorder: 'rgba(52, 211, 153, 0.35)',
      cardTint: ['#172E29', '#12221E', '#0E1A17'],
      arcStops: {
        arcStart: '#638B82',
        arcMid: '#70A89B',
        arcEnd: '#70D4BA',
        glow: '#70D4BA',
        pillText: '#7A938F',
        pillBorder: 'rgba(122, 147, 143, 0.25)',
        pillBg: '#1E2725',
      },
      discBg: ['#52857C', '#2B574E', '#0A1714'],
      withdrawBg: '#009BA9',
    },
  },
  established: {
    key: PHARMACY_TIER_KEYS.ESTABLISHED,
    label: 'Established',
    level: 2,
    minPoints: 300,
    maxPoints: 599,
    nextTierKey: PHARMACY_TIER_KEYS.KEY_ACCOUNT,
    prevTierKey: PHARMACY_TIER_KEYS.GENERAL_TRADE,
    perks: [
      'Enhanced Rx scan cashout multiplier',
      'Direct-from-manufacturer scheme discounts',
      'Reciprocal SKU inventory sync & alerts',
    ],
    light: {
      accentColor: '#FF6B00',
      secondaryColor: '#EA580C',
      arcGradient: ['#FF5500', '#FF7A00', '#FFB366'],
      arcTrack: 'rgba(255, 255, 255, 0.75)',
      glowColors: ['#FEBA8B', '#FAA96A', '#FDAE75', '#FBDFCA', '#FEDCC3', '#FFFFFF'],
      badgeBg: '#FFFFFF',
      badgeText: '#EA580C',
      badgeBorder: 'rgba(255, 107, 0, 0.25)',
      cardTint: ['#FDAE78', '#FDC197', '#FED7BD'],
      arcStops: {
        arcStart: '#FFC9A3',
        arcMid: '#FF9248',
        arcEnd: '#FF6A00',
        glow: '#FF6A00',
        pillText: '#FF6A00',
        pillBorder: 'rgba(255, 255, 255, 0)',
        pillBg: '#FFFFFF',
      },
      discBg: ['#FFFFFF', '#FDE7D8'],
      withdrawBg: '#0F4761',
    },
    dark: {
      accentColor: '#FF7A00',
      secondaryColor: '#EA580C',
      arcGradient: ['#FF4500', '#FF7A00', '#FFA043'],
      arcTrack: 'rgba(255, 255, 255, 0.08)',
      glowColors: ['#211813', '#20150F', '#221B13', '#26221F', '#161616', '#010101'],
      badgeBg: 'rgba(255, 107, 0, 0.14)',
      badgeText: '#FF9233',
      badgeBorder: 'rgba(255, 122, 0, 0.35)',
      cardTint: ['#281C14', '#201610', '#1A120D'],
      arcStops: {
        arcStart: '#99581E',
        arcMid: '#CA5603',
        arcEnd: '#E76203',
        glow: '#E76203',
        pillText: '#C67F49',
        pillBorder: 'rgba(198, 127, 73, 0.25)',
        pillBg: '#2F261F',
      },
      discBg: ['#9C6235', '#5C381B', '#170E06'],
      withdrawBg: '#009BA9',
    },
  },
  key_account: {
    key: PHARMACY_TIER_KEYS.KEY_ACCOUNT,
    label: 'Key Account',
    level: 3,
    minPoints: 600,
    maxPoints: 899,
    nextTierKey: PHARMACY_TIER_KEYS.FLAGSHIP,
    prevTierKey: PHARMACY_TIER_KEYS.ESTABLISHED,
    perks: [
      'Priority commercial territory allocation',
      'Accelerated data sharing honoraria & weekly cashout',
      'Direct purchase order wholesaler sync',
    ],
    light: {
      accentColor: '#0284C7',
      secondaryColor: '#0369A1',
      arcGradient: ['#0284C7', '#38BDF8', '#BAE6FD'],
      arcTrack: 'rgba(255, 255, 255, 0.75)',
      glowColors: ['#B0D7E8', '#9CCAE1', '#C6E2F0', '#D9EDF6', '#D6EAF3', '#FFFFFF'],
      badgeBg: '#FFFFFF',
      badgeText: '#0284C7',
      badgeBorder: 'rgba(2, 132, 199, 0.25)',
      cardTint: ['#9CCAE1', '#BEE0F2', '#D8ECF7'],
      arcStops: {
        arcStart: '#BFE2F3',
        arcMid: '#7DBDE0',
        arcEnd: '#3E97C7',
        glow: '#3E97C7',
        pillText: '#0E435C',
        pillBorder: 'rgba(255, 255, 255, 0)',
        pillBg: '#FFFFFF',
      },
      discBg: ['#FFFFFF', '#D9EFFC'],
      withdrawBg: '#0F4761',
    },
    dark: {
      accentColor: '#0EA5E9',
      secondaryColor: '#0284C7',
      arcGradient: ['#0284C7', '#0EA5E9', '#38BDF8'],
      arcTrack: 'rgba(255, 255, 255, 0.08)',
      glowColors: ['#181C1F', '#151A1E', '#191D1C', '#202425', '#161616', '#010101'],
      badgeBg: 'rgba(14, 165, 233, 0.14)',
      badgeText: '#38BDF8',
      badgeBorder: 'rgba(56, 189, 248, 0.35)',
      cardTint: ['#162330', '#111B24', '#0E151C'],
      arcStops: {
        arcStart: '#7A8686',
        arcMid: '#5F93A9',
        arcEnd: '#5BA0BF',
        glow: '#5BA0BF',
        pillText: '#5E8494',
        pillBorder: 'rgba(94, 132, 148, 0.25)',
        pillBg: '#1E262B',
      },
      discBg: ['#597E9C', '#2B4A66', '#09131C'],
      withdrawBg: '#009BA9',
    },
  },
  flagship: {
    key: PHARMACY_TIER_KEYS.FLAGSHIP,
    label: 'Flagship',
    level: 4,
    minPoints: 900,
    maxPoints: 1500,
    nextTierKey: null,
    prevTierKey: PHARMACY_TIER_KEYS.KEY_ACCOUNT,
    perks: [
      'Pinnacle tier 1.5x honoraria multiplier',
      'Direct manufacturer trade schemes & early batch stock',
      'Exclusive regional market trend reports',
    ],
    light: {
      accentColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      arcGradient: ['#7C3AED', '#A855F7', '#DDD6FE'],
      arcTrack: 'rgba(255, 255, 255, 0.75)',
      glowColors: ['#F2DDFE', '#EFD2FE', '#EFDFF9', '#FAEDFF', '#FAEDFF', '#FFFFFF'],
      badgeBg: '#FFFFFF',
      badgeText: '#7C3AED',
      badgeBorder: 'rgba(124, 58, 237, 0.25)',
      cardTint: ['#D9B3F5', '#EAD2FA', '#F5E6FE'],
      arcStops: {
        arcStart: '#EAD6FA',
        arcMid: '#BC8DE3',
        arcEnd: '#8F5CC0',
        glow: '#A06FD0',
        pillText: '#9A6CC6',
        pillBorder: 'rgba(255, 255, 255, 0)',
        pillBg: '#FFFFFF',
      },
      discBg: ['#FFFFFF', '#EBD3FB'],
      withdrawBg: '#0F4761',
    },
    dark: {
      accentColor: '#A855F7',
      secondaryColor: '#7C3AED',
      arcGradient: ['#7C3AED', '#A855F7', '#C084FC'],
      arcTrack: 'rgba(255, 255, 255, 0.08)',
      glowColors: ['#1F1D20', '#1D1B20', '#1F1D20', '#262427', '#161616', '#010101'],
      badgeBg: 'rgba(139, 92, 246, 0.16)',
      badgeText: '#C084FC',
      badgeBorder: 'rgba(192, 132, 252, 0.35)',
      cardTint: ['#241730', '#1C1225', '#160E1D'],
      arcStops: {
        arcStart: '#817E91',
        arcMid: '#9575A4',
        arcEnd: '#A076B5',
        glow: '#A076B5',
        pillText: '#9F87A9',
        pillBorder: 'rgba(159, 135, 169, 0.25)',
        pillBg: '#29272C',
      },
      discBg: ['#9A88A5', '#473F4C', '#0D0B0D'],
      withdrawBg: '#009BA9',
    },
  },
};

/**
 * Resolver helper returning comprehensive visual tokens for the active pharmacy tier
 *
 * @param {string} tierKey
 * @param {boolean} [isDark=false]
 * @returns {{
 *   key: string,
 *   label: string,
 *   level: number,
 *   minPoints: number,
 *   maxPoints: number,
 *   nextTierKey: string|null,
 *   prevTierKey: string|null,
 *   perks: Array<string>,
 *   IconComponent: React.ComponentType,
 *   accentColor: string,
 *   secondaryColor: string,
 *   arcGradient: Array<string>,
 *   arcTrack: string,
 *   glowColors: Array<string>,
 *   badgeBg: string,
 *   badgeText: string,
 *   badgeBorder: string,
 *   cardTint: Array<string>,
 *   arcStops: Object,
 *   discBg: Array<string>,
 *   withdrawBg: string
 * }}
 */
export const getPharmacyTierTheme = (tierKey, isDark = false) => {
  const normKey = normalizePharmacyTier(tierKey);
  const config = PHARMACY_TIERS_CONFIG[normKey] || PHARMACY_TIERS_CONFIG.established;
  const mode = isDark ? config.dark : config.light;

  return {
    key: normKey,
    label: config.label,
    level: config.level,
    minPoints: config.minPoints,
    maxPoints: config.maxPoints,
    nextTierKey: config.nextTierKey,
    prevTierKey: config.prevTierKey,
    perks: config.perks,
    IconComponent: (props) => <TierGemIcon tier={normKey} {...props} />,
    accentColor: mode.accentColor,
    secondaryColor: mode.secondaryColor,
    arcGradient: mode.arcGradient,
    arcTrack: mode.arcTrack,
    glowColors: mode.glowColors,
    badgeBg: mode.badgeBg,
    badgeText: mode.badgeText,
    badgeBorder: mode.badgeBorder,
    cardTint: mode.cardTint,
    arcStops: mode.arcStops,
    discBg: mode.discBg,
    withdrawBg: mode.withdrawBg,
  };
};

export default {
  PHARMACY_TIER_KEYS,
  PHARMACY_TIERS_CONFIG,
  normalizePharmacyTier,
  resolveTierFromPoints,
  getPharmacyTierTheme,
};
