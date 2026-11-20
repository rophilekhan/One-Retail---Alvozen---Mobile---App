import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, GlassCard, FieldIconBadge } from '../core/index.js';
import { PointsStarIcon, EarningsDollarIcon, ChevronRightIcon } from '../../assets/vectors/index.js';

/**
 * ImpactStatCard
 * Exact 1:1 port of OneRx ImpactStatCard with GlassCard, FieldIconBadge,
 * DM Mono value readout, and chevron.
 */
export const ImpactStatCard = ({
  type = 'points',
  value = '0',
  label,
  title,
  suffix,
  subValue,
  unit,
  onPress,
  icon,
  showChevron = true,
  cardStyle,
  badgeVariant,
  radius,
}) => {
  const { colors, isDark } = useTheme();

  const isPoints = type === 'points';
  const displayLabel = label || title || (isPoints ? 'Points' : 'Earnings');
  const displaySuffix = suffix || subValue || unit || (!isPoints ? 'PKR' : null);

  const iconColor = isDark ? '#FFFFFF' : '#0F172A';
  const cardRadius = radius || cardStyle?.borderRadius || scale(26);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.touchable}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${displayLabel}: ${value} ${displaySuffix || ''}`}
    >
      <GlassCard
        radius={cardRadius}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1.2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0 : 0.03,
            shadowRadius: 8,
            elevation: 0,
          },
          cardStyle,
        ]}
      >
        <View style={styles.content}>
          {/* Top Row: Icon wrapped inside FieldIconBadge + Chevron on right */}
          <View style={styles.topRow}>
            {icon ? (
              icon
            ) : (
              <FieldIconBadge
                isDark={isDark}
                size={38}
                variant={badgeVariant || (isPoints ? 'name' : 'first_visit')}
                marginRight={0}
              >
                {isPoints ? (
                  <PointsStarIcon size={scale(20)} color={iconColor} />
                ) : (
                  <EarningsDollarIcon size={scale(20)} color={iconColor} />
                )}
              </FieldIconBadge>
            )}

            {showChevron && (
              <ChevronRightIcon
                size={scale(16)}
                color={isDark ? 'rgba(255, 255, 255, 0.3)' : '#CBD5E1'}
              />
            )}
          </View>

          {/* Bottom Content */}
          <View style={styles.textContainer}>
            <AppText
              style={[
                styles.label,
                { color: isDark ? '#94A3B8' : '#737373' },
              ]}
            >
              {displayLabel}
            </AppText>

            <View style={styles.valueRow}>
              <AppText
                style={[
                  styles.valueText,
                  { color: isDark ? '#FFFFFF' : '#000000' },
                ]}
              >
                {value}
              </AppText>

              {displaySuffix && (
                <AppText
                  style={[
                    styles.suffixText,
                    { color: isDark ? '#94A3B8' : '#737373' },
                  ]}
                >
                  {displaySuffix}
                </AppText>
              )}
            </View>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    minHeight: verticalScale(120),
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    marginTop: verticalScale(14),
  },
  label: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
    fontWeight: '500',
    marginBottom: verticalScale(6),
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: scaleFont(28),
    lineHeight: scaleFont(34),
    fontFamily: fontFamilies.mono,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  suffixText: {
    fontSize: scaleFont(15),
    fontFamily: fontFamilies.mono,
    fontWeight: '500',
    marginLeft: scale(6),
  },
});

export default ImpactStatCard;
