import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText } from '../core/index.js';
import { TierGemIcon } from '../../assets/vectors/index.js';

export const TIER_THRESHOLDS = [
  { tier: 'General Trade', min: 0, max: 299, badge: 'muted' },
  { tier: 'Established', min: 300, max: 599, badge: 'brand' },
  { tier: 'Key Account', min: 600, max: 899, badge: 'accent' },
  { tier: 'Flagship', min: 900, max: 1500, badge: 'success' },
];

/**
 * PiiTierProgressCard - Displays Current PII Tier & 4-Tier Ladder Progress
 * Features exact 3D faceted gems from Figma & OneRx:
 * - General Trade: Emerging Emerald
 * - Established: Amber Hexagon
 * - Key Account: Senior Diamond Heart
 * - Flagship: Distinguished Brilliant Diamond
 *
 * @param {Object} props
 * @param {string} props.piiTier - 'General Trade' | 'Established' | 'Key Account' | 'Flagship'
 * @param {number} props.piiScore - Composite score
 */
export const PiiTierProgressCard = ({ piiTier = 'Key Account', piiScore = 842 }) => {
  const { colors, isDark } = useTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.tierHeaderRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" colorType="muted">Current Tier Status</AppText>
          <AppText variant="headlineMedium" colorType="primary">
            {piiTier}
          </AppText>
        </View>

        {/* Apex Tier Gem Icon from Figma */}
        <TierGemIcon tier={piiTier} size={44} isApex={true} />
      </View>

      {/* Tier Hierarchy Progress with Milestone Gems */}
      <View style={styles.tierBarWrap}>
        {TIER_THRESHOLDS.map((t, idx) => {
          const isCurrent = piiScore >= t.min && piiScore <= t.max;
          const isPassed = piiScore > t.max;

          return (
            <View key={idx} style={styles.tierSegment}>
              <View style={styles.milestoneGemWrap}>
                <TierGemIcon tier={t.tier} size={16} isApex={false} />
              </View>

              <View
                style={[
                  styles.segmentLine,
                  {
                    backgroundColor: isPassed
                      ? colors.brand?.primary
                      : isCurrent
                      ? colors.brand?.accent
                      : isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
              />
              <AppText
                variant="caption"
                colorType={isCurrent ? 'accent' : isPassed ? 'brand' : 'muted'}
                style={{ marginTop: 4, fontWeight: isCurrent ? '700' : '400', fontSize: scale(10) }}
                numberOfLines={1}
              >
                {t.tier}
              </AppText>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  tierHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  tierBarWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(6),
  },
  tierSegment: {
    flex: 1,
    marginHorizontal: scale(2),
    alignItems: 'center',
  },
  milestoneGemWrap: {
    marginBottom: 4,
  },
  segmentLine: {
    width: '100%',
    height: 6,
    borderRadius: 3,
  },
});

export default PiiTierProgressCard;
