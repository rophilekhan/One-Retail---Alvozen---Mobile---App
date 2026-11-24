import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  ClipPath,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';
import { TierGemIcon } from '../../assets/vectors/ImpactIcons.jsx';
import { getPharmacyTierTheme } from '../../theme/tierThemes.js';

const CHECK_DISC_GRADIENTS = {
  dark: ['#52696B', '#394546', '#232323'],
  light: ['#DCFCF7', '#EAF7F5', '#FFFFFF'],
};

/* ---------- Header geometry ---------- */
const HV_W = 345;
const HV_H = 130;
const EDGE_Y = 50;
const DISC_CX = 172.5;
const DISC_CY = 65;
const HALO_R = 56;
const DISC_R = 50;
const CORNER_R = 26;

const CARD_PATH = `
  M0,${EDGE_Y + CORNER_R}
  A${CORNER_R},${CORNER_R} 0 0 1 ${CORNER_R},${EDGE_Y}
  L108.5,${EDGE_Y}
  Q116,${EDGE_Y} 121,43
  A${HALO_R},${HALO_R} 0 0 1 224,43
  Q229,${EDGE_Y} 236.5,${EDGE_Y}
  L${HV_W - CORNER_R},${EDGE_Y}
  A${CORNER_R},${CORNER_R} 0 0 1 ${HV_W},${EDGE_Y + CORNER_R}
  L${HV_W},${HV_H}
  L0,${HV_H}
  Z
`;

const CardHeader = ({ isDark, stripeColor, discColors, cardBg }) => {
  const stripes = useMemo(
    () => Array.from({ length: 87 }).map((_, i) => i * 4),
    []
  );

  const safeDiscColors = Array.isArray(discColors) && discColors.length > 0
    ? discColors
    : ['#FFFFFF', '#00C48C'];

  const discStops = useMemo(() => {
    if (safeDiscColors.length > 2) {
      return [
        { offset: '0%', color: safeDiscColors[0] },
        { offset: '45%', color: safeDiscColors[1] },
        { offset: '100%', color: safeDiscColors[safeDiscColors.length - 1] },
      ];
    }
    return [
      { offset: '0%', color: safeDiscColors[0] },
      { offset: '100%', color: safeDiscColors[safeDiscColors.length - 1] },
    ];
  }, [safeDiscColors]);

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${HV_W} ${HV_H}`}>
      <Defs>
        <ClipPath id="tierLevelCardClip">
          <Path d={CARD_PATH} />
        </ClipPath>
        <SvgLinearGradient id="tierLevelStripeGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={stripeColor || '#00C48C'} stopOpacity={isDark ? 0.4 : 0.3} />
          <Stop offset="55%" stopColor={stripeColor || '#00C48C'} stopOpacity={isDark ? 0.15 : 0.1} />
          <Stop offset="100%" stopColor={stripeColor || '#00C48C'} stopOpacity={0} />
        </SvgLinearGradient>
        <SvgLinearGradient id="tierLevelDiscGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          {discStops.map((stop, idx) => (
            <Stop key={`disc-stop-${idx}`} offset={stop.offset} stopColor={stop.color} />
          ))}
        </SvgLinearGradient>
      </Defs>

      <Path d={CARD_PATH} fill={cardBg} />

      <G clipPath="url(#tierLevelCardClip)">
        {stripes.map((x) => (
          <Rect
            key={x}
            x={x}
            y={EDGE_Y - 14}
            width={2}
            height={62}
            fill="url(#tierLevelStripeGrad)"
          />
        ))}
      </G>

      <Circle cx={DISC_CX} cy={DISC_CY} r={HALO_R} fill={cardBg} />
      <Circle cx={DISC_CX} cy={DISC_CY} r={DISC_R} fill="url(#tierLevelDiscGrad)" />
    </Svg>
  );
};

/**
 * TierLevelUpModal
 *
 * Full-screen gamified celebration modal when a pharmacy reaches a new PII tier.
 * Driven by getPharmacyTierTheme(tier, isDark).
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {string} [props.tier='key_account']
 * @param {Array<string>} [props.perks]
 */
export const TierLevelUpModal = ({
  visible,
  onClose,
  tier = 'key_account',
  perks,
}) => {
  const { isDark } = useTheme();

  const tierTheme = useMemo(() => {
    return getPharmacyTierTheme(tier, isDark);
  }, [tier, isDark]);

  const {
    key: normTier,
    label: tierName,
    level,
    accentColor,
    discBg,
    perks: defaultPerks,
  } = tierTheme;

  const activePerks = perks || defaultPerks;
  const cardBg = isDark ? '#141416' : '#FFFFFF';

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Background Rays / Poppers */}
        <Image
          source={require('../../assets/images/sunshine.png')}
          style={styles.sunshineBg}
          resizeMode="cover"
        />
        <Image
          source={require('../../assets/images/poppers.png')}
          style={styles.poppersBg}
          resizeMode="contain"
        />

        {/* Floating Card */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          {/* Card Header SVG with Pinstripes & Circular Disc */}
          <View style={styles.headerSvgWrapper}>
            <CardHeader
              isDark={isDark}
              stripeColor={accentColor}
              discColors={discBg}
              cardBg={cardBg}
            />
            <View style={styles.gemContainer}>
              <TierGemIcon tier={normTier} size={scale(54)} isApex />
            </View>
          </View>

          {/* Body Content */}
          <View style={styles.cardBody}>
            <AppText style={[styles.congratsText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              CONGRATULATIONS!
            </AppText>

            <AppText style={[styles.tierTitle, { color: isDark ? '#FFFFFF' : '#020202' }]}>
              {`${tierName} Tier Unlocked`}
            </AppText>

            <AppText style={[styles.levelSubtitle, { color: accentColor }]}>
              {`Level ${level} Retail Partner`}
            </AppText>

            {/* Perks Timeline */}
            <View style={styles.perksList}>
              {activePerks.map((perk, i) => (
                <View key={i} style={styles.perkRow}>
                  <LinearGradient
                    colors={isDark ? CHECK_DISC_GRADIENTS.dark : CHECK_DISC_GRADIENTS.light}
                    style={styles.checkDisc}
                  >
                    <Svg width={scale(12)} height={scale(12)} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M5 13L9 17L19 7"
                        stroke={accentColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </LinearGradient>
                  <AppText style={[styles.perkText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                    {perk}
                  </AppText>
                </View>
              ))}
            </View>

            {/* Claim CTA */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={[styles.claimButton, { backgroundColor: accentColor }]}
            >
              <AppText style={styles.claimButtonText}>
                Claim Perks & Continue
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  sunshineBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.35,
  },
  poppersBg: {
    position: 'absolute',
    width: scale(320),
    height: verticalScale(320),
    top: verticalScale(60),
    opacity: 0.8,
  },
  card: {
    width: '100%',
    maxWidth: scale(350),
    borderRadius: scale(26),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerSvgWrapper: {
    width: '100%',
    height: verticalScale(130),
    position: 'relative',
  },
  gemContainer: {
    position: 'absolute',
    top: verticalScale(38),
    left: '50%',
    marginLeft: -scale(27),
  },
  cardBody: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(28),
    alignItems: 'center',
  },
  congratsText: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.primaryBold,
    letterSpacing: 1.5,
    marginBottom: verticalScale(6),
  },
  tierTitle: {
    fontSize: scaleFont(22),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  levelSubtitle: {
    fontSize: scaleFont(14),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '600',
    marginBottom: verticalScale(20),
  },
  perksList: {
    width: '100%',
    gap: verticalScale(12),
    marginBottom: verticalScale(24),
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkDisc: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  perkText: {
    fontSize: scaleFont(13.5),
    fontFamily: fontFamilies.primaryMedium,
    flex: 1,
  },
  claimButton: {
    width: '100%',
    height: verticalScale(48),
    borderRadius: scale(999),
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(15),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
});

export default TierLevelUpModal;
