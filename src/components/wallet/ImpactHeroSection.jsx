import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, FieldIconBadge } from '../core/index.js';
import { TierGemIcon, ScoreChevronRightIcon } from '../../assets/vectors/index.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PREV_TIER = {
  general_trade: null,
  established: 'general_trade',
  key_account: 'established',
  flagship: 'key_account',
};

export const NEXT_TIER = {
  general_trade: 'established',
  established: 'key_account',
  key_account: 'flagship',
  flagship: null,
};

export const TIER_NAMES = {
  general_trade: 'General Trade',
  established: 'Established',
  key_account: 'Key Account',
  flagship: 'Flagship',
};

export const normalizeTier = (t) => {
  if (!t) return 'established';
  const s = String(t).toLowerCase().replace(/\s+/g, '_');
  if (s === 'emerging' || s === 'general_trade' || s === 'general') return 'general_trade';
  if (s === 'established') return 'established';
  if (s === 'senior' || s === 'key_account' || s === 'key') return 'key_account';
  if (s === 'distinguished' || s === 'flagship') return 'flagship';
  return 'established';
};

/**
 * Per-tier, per-mode palette sampled from Figma screens:
 * - general_trade (emerging palette): Mint/Teal
 * - established (established palette): Apricot/Orange
 * - key_account (senior palette): Sky Blue
 * - flagship (distinguished palette): Purple/Lavender
 */
const PALETTE = {
  general_trade: {
    light: {
      arcStart: '#C9F1E7', arcMid: '#8ADCC6', arcEnd: '#69D2B7', glow: '#69D2B7',
      pillText: '#4C9C88', pillBorder: 'rgba(255,255,255,0)', pillBg: '#FFFFFF',
    },
    dark: {
      arcStart: '#638B82', arcMid: '#70A89B', arcEnd: '#70D4BA', glow: '#70D4BA',
      pillText: '#7A938F', pillBorder: 'rgba(122, 147, 143, 0.25)', pillBg: '#1E2725',
    },
  },
  established: {
    light: {
      arcStart: '#FFC9A3', arcMid: '#FF9248', arcEnd: '#FF6A00', glow: '#FF6A00',
      pillText: '#FF6A00', pillBorder: 'rgba(255,255,255,0)', pillBg: '#FFFFFF',
    },
    dark: {
      arcStart: '#99581E', arcMid: '#CA5603', arcEnd: '#E76203', glow: '#E76203',
      pillText: '#C67F49', pillBorder: 'rgba(198, 127, 73, 0.25)', pillBg: '#2F261F',
    },
  },
  key_account: {
    light: {
      arcStart: '#BFE2F3', arcMid: '#7DBDE0', arcEnd: '#3E97C7', glow: '#3E97C7',
      pillText: '#0E435C', pillBorder: 'rgba(255,255,255,0)', pillBg: '#FFFFFF',
    },
    dark: {
      arcStart: '#7A8686', arcMid: '#5F93A9', arcEnd: '#5BA0BF', glow: '#5BA0BF',
      pillText: '#5E8494', pillBorder: 'rgba(94, 132, 148, 0.25)', pillBg: '#1E262B',
    },
  },
  flagship: {
    light: {
      arcStart: '#EAD6FA', arcMid: '#BC8DE3', arcEnd: '#8F5CC0', glow: '#A06FD0',
      pillText: '#9A6CC6', pillBorder: 'rgba(255,255,255,0)', pillBg: '#FFFFFF',
    },
    dark: {
      arcStart: '#817E91', arcMid: '#9575A4', arcEnd: '#A076B5', glow: '#A076B5',
      pillText: '#9F87A9', pillBorder: 'rgba(159, 135, 169, 0.25)', pillBg: '#29272C',
    },
  },
};

/**
 * ImpactHeroSection
 * Exact 1:1 port of OneRx ImpactHeroSection with dynamic arc gauge,
 * concentric track rings, tilted milestone gems, apex gem disc, and Impact Score counter.
 */
export const ImpactHeroSection = ({
  tier = 'established',
  score = 842,
  onScorePress,
  onTierPillPress,
}) => {
  const { isDark } = useTheme();
  const mode = isDark ? 'dark' : 'light';
  const normTier = normalizeTier(tier);
  const pal = (PALETTE[normTier] || PALETTE.established)[mode];
  const tierName = TIER_NAMES[normTier] || 'Established';

  // Geometry
  const svgW = SCREEN_WIDTH;
  const wrapperH = verticalScale(185);
  const svgH = verticalScale(300);

  const strokeW = scale(68);
  const arcRadius = svgW * 0.55;
  const cx = svgW / 2;
  const apexY = verticalScale(35);
  const cy = apexY + arcRadius;

  const polar = (deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + arcRadius * Math.sin(a), y: cy - arcRadius * Math.cos(a) };
  };

  const arcSpan = 82;
  const L = polar(-arcSpan);
  const R = polar(arcSpan);
  const apex = polar(0);
  const gemL = polar(-48);
  const gemR = polar(48);

  const S90L = polar(-90);
  const progressPath = `M ${S90L.x} ${S90L.y} A ${arcRadius} ${arcRadius} 0 0 1 ${apex.x} ${apex.y}`;

  const TRACK_RINGS = 18;
  const radialProfile = isDark
    ? [[0, 0.55], [0.3, 0.7], [0.6, 0.9], [0.85, 1], [1, 1]]
    : [[0, 0.1], [0.3, 0.28], [0.6, 0.72], [0.85, 1], [1, 1]];

  const radialAlpha = (t) => {
    for (let i = 1; i < radialProfile.length; i += 1) {
      const [t1, a1] = radialProfile[i];
      const [t0, a0] = radialProfile[i - 1];
      if (t <= t1) return a0 + ((t - t0) / (t1 - t0)) * (a1 - a0);
    }
    return 1;
  };

  const trackRings = Array.from({ length: TRACK_RINGS }, (_, i) => {
    const t = (i + 0.5) / TRACK_RINGS;
    const r = arcRadius - strokeW / 2 + t * strokeW;
    return {
      key: i,
      opacity: radialAlpha(t),
      d: `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`,
    };
  });

  const domePath = `M ${L.x} ${L.y} A ${arcRadius} ${arcRadius} 0 0 1 ${R.x} ${R.y} Z`;

  const gid = `${normTier}-${mode}`;
  const progressGradId = `heroProgress-${gid}`;
  const trackGradId = `heroTrack-${mode}`;
  const domeGradId = `heroDome-${gid}`;

  const prevTier = PREV_TIER[normTier];
  const nextTier = NEXT_TIER[normTier];

  const progressStops = isDark
    ? [
        { o: '0%', c: pal.arcStart, a: 0 },
        { o: '9%', c: pal.arcStart, a: 0.5 },
        { o: '18%', c: pal.arcStart, a: 0.6 },
        { o: '40%', c: pal.arcMid, a: 0.75 },
        { o: '70%', c: pal.arcEnd, a: 0.95 },
        { o: '100%', c: pal.arcEnd, a: 1 },
      ]
    : [
        { o: '0%', c: pal.arcStart, a: 0 },
        { o: '9%', c: pal.arcStart, a: 0.3 },
        { o: '18%', c: pal.arcStart, a: 0.42 },
        { o: '40%', c: pal.arcMid, a: 0.7 },
        { o: '70%', c: pal.arcEnd, a: 0.95 },
        { o: '100%', c: pal.arcEnd, a: 1 },
      ];

  const trackStops = isDark
    ? [
        { o: '0%', c: '#000000', a: 0.92 },
        { o: '40%', c: '#000000', a: 0.9 },
        { o: '55%', c: '#000000', a: 0.86 },
        { o: '74%', c: '#000000', a: 0.75 },
        { o: '85%', c: '#000000', a: 0.55 },
        { o: '91%', c: '#000000', a: 0.38 },
        { o: '97%', c: '#000000', a: 0.12 },
        { o: '100%', c: '#000000', a: 0 },
      ]
    : [
        { o: '0%', c: '#FFFFFF', a: 1 },
        { o: '40%', c: '#FFFFFF', a: 0.98 },
        { o: '55%', c: '#FFFFFF', a: 0.9 },
        { o: '74%', c: '#FFFFFF', a: 0.58 },
        { o: '85%', c: '#FFFFFF', a: 0.34 },
        { o: '91%', c: '#FFFFFF', a: 0.17 },
        { o: '97%', c: '#FFFFFF', a: 0.05 },
        { o: '100%', c: '#FFFFFF', a: 0 },
      ];

  const domeStops = isDark
    ? [
        { o: '0%', c: pal.glow, a: 0.2 },
        { o: '55%', c: pal.glow, a: 0.06 },
        { o: '100%', c: pal.glow, a: 0 },
      ]
    : [
        { o: '0%', c: '#FFFFFF', a: 0.4 },
        { o: '55%', c: '#FFFFFF', a: 0.15 },
        { o: '100%', c: '#FFFFFF', a: 0 },
      ];

  const subtitleColor = isDark ? '#94A3B8' : '#787878';
  const chevronBg = isDark ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF';
  const chevronColor = isDark ? '#94A3B8' : '#9E9E9E';
  const chevronBorder = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.04)';

  return (
    <View style={styles.container}>
      <View style={[styles.arcWrapper, { height: wrapperH }]}>
        <Svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={styles.svg}
        >
          <Defs>
            <LinearGradient id={progressGradId} x1="0" y1="0" x2="1" y2="0">
              {progressStops.map((st) => (
                <Stop
                  key={st.o}
                  offset={st.o}
                  stopColor={st.c}
                  stopOpacity={st.a}
                />
              ))}
            </LinearGradient>

            <LinearGradient
              id={trackGradId}
              gradientUnits="userSpaceOnUse"
              x1={cx}
              y1="0"
              x2={cx + arcRadius}
              y2="0"
            >
              {trackStops.map((st) => (
                <Stop
                  key={st.o}
                  offset={st.o}
                  stopColor={st.c}
                  stopOpacity={st.a}
                />
              ))}
            </LinearGradient>

            <LinearGradient id={domeGradId} x1="0" y1="0" x2="0" y2="1">
              {domeStops.map((st) => (
                <Stop
                  key={st.o}
                  offset={st.o}
                  stopColor={st.c}
                  stopOpacity={st.a}
                />
              ))}
            </LinearGradient>
          </Defs>

          <Path d={domePath} fill={`url(#${domeGradId})`} />

          {trackRings.map((ring) => (
            <Path
              key={ring.key}
              d={ring.d}
              fill="none"
              stroke={`url(#${trackGradId})`}
              strokeOpacity={ring.opacity}
              strokeWidth={strokeW / TRACK_RINGS + 0.25}
              strokeLinecap="butt"
            />
          ))}

          <Path
            d={progressPath}
            fill="none"
            stroke={`url(#${progressGradId})`}
            strokeWidth={strokeW}
            strokeLinecap="butt"
          />

          <Circle cx={apex.x} cy={apex.y} r={strokeW / 2} fill={pal.arcEnd} />
        </Svg>

        {/* Previous tier milestone gem */}
        {prevTier && (
          <View
            style={[
              styles.floatingGemWrapper,
              {
                left: gemL.x - scale(22),
                top: gemL.y - scale(22),
                opacity: isDark ? 0.38 : 0.42,
              },
            ]}
          >
            <FieldIconBadge
              isDark={isDark}
              size={44}
              variant={prevTier === 'general_trade' ? 'tier_emerging' : prevTier}
              marginRight={0}
              style={styles.previousMilestoneBadge}
            >
              <View style={styles.tiltedGem}>
                <TierGemIcon tier={prevTier} size={scale(24)} />
              </View>
            </FieldIconBadge>
          </View>
        )}

        {/* Current tier apex gem */}
        <View
          style={[
            styles.floatingGemWrapper,
            { left: apex.x - scale(28), top: apex.y - scale(28), zIndex: 20 },
          ]}
        >
          <FieldIconBadge
            isDark={isDark}
            size={56}
            variant={
              normTier === 'general_trade'
                ? 'tier_emerging'
                : normTier === 'key_account'
                ? 'tier_senior'
                : normTier === 'flagship'
                ? 'tier_distinguished'
                : 'tier_established'
            }
            marginRight={0}
            style={styles.apexShadow}
          >
            <TierGemIcon tier={normTier} size={scale(28)} isApex={true} />
          </FieldIconBadge>
        </View>

        {/* Next tier milestone gem */}
        {nextTier && (
          <View
            style={[
              styles.floatingGemWrapper,
              { left: gemR.x - scale(22), top: gemR.y - scale(22) },
            ]}
          >
            <FieldIconBadge
              isDark={isDark}
              size={44}
              variant={
                nextTier === 'key_account'
                  ? 'tier_senior'
                  : nextTier === 'flagship'
                  ? 'tier_distinguished'
                  : 'tier_established'
              }
              marginRight={0}
              style={styles.milestoneShadow}
            >
              <TierGemIcon tier={nextTier} size={scale(24)} />
            </FieldIconBadge>
          </View>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onTierPillPress}
          style={[
            styles.tierPill,
            {
              backgroundColor: pal.pillBg,
              borderColor: pal.pillBorder,
              borderWidth: isDark ? 1 : 0,
              shadowColor: isDark ? 'transparent' : pal.pillText,
              shadowOpacity: isDark ? 0 : 0.1,
              elevation: isDark ? 0 : 2,
            },
          ]}
        >
          <AppText style={[styles.tierText, { color: pal.pillText }]}>{tierName}</AppText>
        </TouchableOpacity>

        <View style={styles.scoreRow}>
          <AppText
            style={[styles.scoreNumber, { color: isDark ? '#FFFFFF' : '#0A0A0A' }]}
          >
            {score}
          </AppText>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onScorePress}
            style={[
              styles.chevronTouchable,
              {
                backgroundColor: chevronBg,
                borderColor: chevronBorder,
                borderWidth: isDark ? 1 : 0.5,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0 : 0.06,
                shadowRadius: 3,
                elevation: isDark ? 0 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="View Impact Score Details"
          >
            <ScoreChevronRightIcon size={scale(20)} color={chevronColor} />
          </TouchableOpacity>
        </View>

        <AppText style={[styles.scoreSubtitle, { color: subtitleColor }]}>IMPACT SCORE</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
    paddingBottom: verticalScale(12),
  },
  arcWrapper: {
    position: 'relative',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    zIndex: 1,
    overflow: 'visible',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  floatingGemWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  previousMilestoneBadge: {
    shadowOpacity: 0,
    elevation: 0,
  },
  tiltedGem: {
    transform: [{ rotate: '18deg' }],
  },
  milestoneShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  apexShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: -verticalScale(80),
    zIndex: 5,
  },
  tierPill: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(5),
    borderRadius: scale(999),
    marginBottom: verticalScale(6),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  tierText: {
    fontSize: scaleFont(14),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: scaleFont(62),
    lineHeight: scaleFont(68),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    letterSpacing: -1,
  },
  chevronTouchable: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(13),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(10),
  },
  scoreSubtitle: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: verticalScale(4),
  },
});

export default ImpactHeroSection;
