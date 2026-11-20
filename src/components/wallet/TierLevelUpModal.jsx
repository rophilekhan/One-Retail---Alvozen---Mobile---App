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

const TIER_LEVELS = {
  general_trade: { level: 1, name: 'General Trade' },
  emerging: { level: 1, name: 'General Trade' },
  established: { level: 2, name: 'Established' },
  key_account: { level: 3, name: 'Key Account' },
  senior: { level: 3, name: 'Key Account' },
  flagship: { level: 4, name: 'Flagship' },
  distinguished: { level: 4, name: 'Flagship' },
};

const TIER_DISC_CONFIG = {
  general_trade: {
    lightBg: ['#FFFFFF', '#D5F5ED'],
    darkBg: ['#52857C', '#2B574E', '#0A1714'],
    stripe: '#00C48C',
  },
  emerging: {
    lightBg: ['#FFFFFF', '#D5F5ED'],
    darkBg: ['#52857C', '#2B574E', '#0A1714'],
    stripe: '#00C48C',
  },
  established: {
    lightBg: ['#FFFFFF', '#FDE7D8'],
    darkBg: ['#9C6235', '#5C381B', '#170E06'],
    stripe: '#FB6B03',
  },
  key_account: {
    lightBg: ['#FFFFFF', '#D9EFFC'],
    darkBg: ['#597E9C', '#2B4A66', '#09131C'],
    stripe: '#0284C7',
  },
  senior: {
    lightBg: ['#FFFFFF', '#D9EFFC'],
    darkBg: ['#597E9C', '#2B4A66', '#09131C'],
    stripe: '#0284C7',
  },
  flagship: {
    lightBg: ['#FFFFFF', '#EBD3FB'],
    darkBg: ['#9A88A5', '#473F4C', '#0D0B0D'],
    stripe: '#A855F7',
  },
  distinguished: {
    lightBg: ['#FFFFFF', '#EBD3FB'],
    darkBg: ['#9A88A5', '#473F4C', '#0D0B0D'],
    stripe: '#A855F7',
  },
};

const CHECK_DISC_GRADIENTS = {
  dark: ['#52696B', '#394546', '#232323'],
  light: ['#DCFCF7', '#EAF7F5', '#FFFFFF'],
};

const DEFAULT_PERKS = [
  'Direct-from-Manufacturer trade schemes',
  'Higher data sharing honoraria & payout multipliers',
  'Priority stock allocation & reciprocal generic visibility',
];

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

const CardHeader = ({ isDark, cfg, cardBg }) => {
  const stripes = useMemo(
    () => Array.from({ length: 87 }).map((_, i) => i * 4),
    []
  );
  const discColors = isDark ? cfg.darkBg : cfg.lightBg;

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${HV_W} ${HV_H}`}>
      <Defs>
        <ClipPath id="tierLevelCardClip">
          <Path d={CARD_PATH} />
        </ClipPath>
        <SvgLinearGradient id="tierLevelStripeGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={cfg.stripe} stopOpacity={isDark ? 0.4 : 0.3} />
          <Stop offset="55%" stopColor={cfg.stripe} stopOpacity={isDark ? 0.15 : 0.1} />
          <Stop offset="100%" stopColor={cfg.stripe} stopOpacity={0} />
        </SvgLinearGradient>
        <SvgLinearGradient id="tierLevelDiscGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0%" stopColor={discColors[0]} />
          {discColors.length > 2 && (
            <Stop offset="45%" stopColor={discColors[1]} />
          )}
          <Stop offset="100%" stopColor={discColors[discColors.length - 1]} />
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
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {'general_trade' | 'established' | 'key_account' | 'flagship'} [props.tier='established']
 * @param {Array<string>} [props.perks]
 */
export const TierLevelUpModal = ({
  visible,
  onClose,
  tier = 'established',
  perks = DEFAULT_PERKS,
}) => {
  const { isDark } = useTheme();

  const normTier = useMemo(() => {
    const raw = String(tier || 'established').toLowerCase();
    if (raw.includes('flag') || raw.includes('dist')) return 'flagship';
    if (raw.includes('key') || raw.includes('sen')) return 'key_account';
    if (raw.includes('gen') || raw.includes('emer')) return 'general_trade';
    return 'established';
  }, [tier]);

  const tierInfo = TIER_LEVELS[normTier] || TIER_LEVELS.established;
  const cfg = TIER_DISC_CONFIG[normTier] || TIER_DISC_CONFIG.established;
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
            <CardHeader isDark={isDark} cfg={cfg} cardBg={cardBg} />
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
              {`${tierInfo.name} Tier Unlocked`}
            </AppText>

            <AppText style={[styles.levelSubtitle, { color: cfg.stripe }]}>
              {`Level ${tierInfo.level} Retail Partner`}
            </AppText>

            {/* Perks Timeline */}
            <View style={styles.perksList}>
              {perks.map((perk, i) => (
                <View key={i} style={styles.perkRow}>
                  <LinearGradient
                    colors={isDark ? CHECK_DISC_GRADIENTS.dark : CHECK_DISC_GRADIENTS.light}
                    style={styles.checkDisc}
                  >
                    <Svg width={scale(12)} height={scale(12)} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M5 13L9 17L19 7"
                        stroke={cfg.stripe}
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
              style={[styles.claimButton, { backgroundColor: cfg.stripe }]}
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
