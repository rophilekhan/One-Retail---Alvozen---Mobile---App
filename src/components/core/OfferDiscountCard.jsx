import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import AppText from './AppText.jsx';
import { ChevronRightSvg } from '../../assets/vectors/SettingsIcons.jsx';

/**
 * OfferDiscountCard
 *
 * 1:1 Port of OneRx OfferDiscountCard:
 * - Solid white surface in Light mode (#FFFFFF) / dark slate in Dark mode (#1C252A)
 * - Top row: Title + OFFER (orange #FB6B03) / DISCOUNT (mint green #48C68E) capsule badge + circular chevron disc
 * - Subtitle: e.g. '10 + 1 Free • Muller & Phipps Pakistan'
 * - Bottom row: Pill outline button 'Get Now' / 'Order Scheme' (deep teal #0F4761 in Light, cyan #009BA9 in Dark)
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {'OFFER' | 'DISCOUNT'} [props.badgeType='OFFER']
 * @param {string} props.subtitle
 * @param {string} [props.buttonText='Claim Scheme']
 * @param {Function} [props.onActionPress]
 * @param {Function} [props.onCardPress]
 * @param {React.ReactNode} [props.extraInfo]
 * @param {Object} [props.style]
 */
export const OfferDiscountCard = ({
  title,
  badgeType = 'OFFER',
  subtitle,
  buttonText = 'Claim Scheme',
  onActionPress,
  onCardPress,
  extraInfo,
  style,
}) => {
  const { isDark } = useTheme();

  const isOffer = badgeType?.toUpperCase() === 'OFFER';
  const badgeBg = isOffer ? '#FB6B03' : '#48C68E';
  const actionColor = isDark ? '#009BA9' : '#0F4761';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onCardPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1C252A' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          borderWidth: 1,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.04,
          shadowRadius: scale(8),
          elevation: isDark ? 1 : 2,
        },
        style,
      ]}
    >
      {/* Top Row: Title + Badge on left & Circular Chevron disc on right */}
      <View style={styles.topRow}>
        <View style={styles.titleBadgeRow}>
          <AppText
            style={[
              styles.title,
              { color: isDark ? '#FFFFFF' : '#020202' },
            ]}
            numberOfLines={1}
          >
            {title}
          </AppText>

          <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
            <AppText style={styles.badgeText}>
              {badgeType}
            </AppText>
          </View>
        </View>

        {/* Right Circular Chevron Disc */}
        <View
          style={[
            styles.chevronDisc,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.07)'
                : '#F5F5F7',
            },
          ]}
        >
          <ChevronRightSvg
            size={scale(14)}
            color={isDark ? 'rgba(255, 255, 255, 0.45)' : '#8E98A8'}
          />
        </View>
      </View>

      {/* Middle Row: Subtitle */}
      {subtitle && (
        <AppText
          style={[
            styles.subtitle,
            { color: isDark ? 'rgba(255, 255, 255, 0.55)' : '#787878' },
          ]}
          numberOfLines={2}
        >
          {subtitle}
        </AppText>
      )}

      {extraInfo}

      {/* Bottom Row: Outline Pill Action Button */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onActionPress || onCardPress}
          style={[
            styles.actionBtn,
            {
              borderColor: actionColor,
            },
          ]}
        >
          <AppText
            style={[
              styles.actionBtnText,
              {
                color: actionColor,
              },
            ]}
          >
            {buttonText}
          </AppText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(12),
    borderRadius: scale(22),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(10),
  },
  title: {
    fontSize: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    letterSpacing: -0.3,
    marginRight: scale(8),
    flexShrink: 1,
  },
  badgePill: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: scaleFont(10),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  chevronDisc: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  subtitle: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primary,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(10),
  },
  actionRow: {
    alignItems: 'flex-start',
    marginTop: verticalScale(4),
  },
  actionBtn: {
    height: verticalScale(34),
    paddingHorizontal: scale(18),
    borderRadius: scale(17),
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  actionBtnText: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
  },
});

export default OfferDiscountCard;
