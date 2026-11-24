import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { GlassCard, AppText, AppBadge, AppButton, MetricIconDisc, DetailsChevronButton } from '../core/index.js';

/**
 * PharmaCapsuleIcon - Crisp SVG Pill Icon
 */
const PharmaCapsuleIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.5 4.5l9 9a4.24 4.24 0 01-6 6l-9-9a4.24 4.24 0 016-6z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.5 7.5l6 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * TradeSchemeCard - Clean 3-Zone Promotional Scheme Card
 * Modeled on OneRx OfferDiscountCard.jsx with strict vertical hierarchy:
 * - Zone 1: Header Row (MetricIconDisc + Title/Subtitle + Standout Promo Slab Pill)
 * - Zone 2: 3-Column Metrics Strip (MIN QTY, TP / UNIT, VALID TILL)
 * - Zone 3: Bottom Action Row (Distributor Note + "View Details" + "Order Scheme" button)
 *
 * @param {Object} props
 * @param {Object} props.scheme
 * @param {Function} [props.onOrder]
 * @param {Function} [props.onDetails]
 * @param {Object} [props.style]
 */
export const TradeSchemeCard = ({
  scheme,
  onOrder,
  onDetails,
  style,
}) => {
  const { colors, isDark, spacing } = useTheme();

  if (!scheme) return null;

  const iconColor = isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761');
  const distributorNote = `Via ${scheme.distributor || 'Alvozen Authorized Distributor'}`;

  return (
    <GlassCard
      style={[
        styles.card,
        {
          borderRadius: radii?.card || scale(20),
          gap: spacing?.md || verticalScale(12),
        },
        style,
      ]}
    >
      {/* ── ZONE 1: Top Header Row ──────────────────────────────────── */}
      <View style={styles.zone1Header}>
        {/* Left: MetricIconDisc with Pharma Icon */}
        <MetricIconDisc size={40} isDark={isDark} variant="first_visit">
          <PharmaCapsuleIcon color={iconColor} size={20} />
        </MetricIconDisc>

        {/* Middle: Brand/Scheme Title & Pharma/Generic Subtitle */}
        <View style={[styles.zone1Middle, { marginLeft: spacing?.sm || scale(8), marginRight: spacing?.sm || scale(8) }]}>
          <AppText
            style={[
              styles.brandTitle,
              typography?.bodyLarge,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium' },
            ]}
            numberOfLines={1}
          >
            {scheme.brandName}
          </AppText>
          <AppText
            style={[
              styles.pharmaSubtitle,
              typography?.caption,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            {scheme.pharma} • {scheme.generic || scheme.category}
          </AppText>
        </View>

        {/* Right: Standout Promo Slab Pill */}
        <View style={styles.zone1Right}>
          <AppBadge
            label={scheme.slab}
            variant="brand"
            size="md"
            style={{
              paddingHorizontal: scale(10),
            }}
          />
        </View>
      </View>

      {/* ── ZONE 2: Clean 3-Column Metrics Strip ────────────────────── */}
      <View
        style={[
          styles.zone2Strip,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.04)'
              : (colors.background?.secondary || '#F8FAFC'),
            borderRadius: radii?.md || scale(12),
            paddingVertical: spacing?.sm || verticalScale(8),
            paddingHorizontal: spacing?.md || scale(12),
          },
        ]}
      >
        {/* Column 1: Min Order */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            MIN QTY
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {scheme.moq || '10 Packs'}
          </AppText>
        </View>

        {/* Divider 1 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 2: Trade Price */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            TP / UNIT
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.brand?.primary || '#009BA9', fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {typeof scheme.tp === 'number' ? `Rs. ${scheme.tp}` : scheme.tp || 'Rs. 420'}
          </AppText>
        </View>

        {/* Divider 2 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 3: Valid Till */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            VALID TILL
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {scheme.validTill || '30 Nov 26'}
          </AppText>
        </View>
      </View>

      {/* ── ZONE 3: Bottom Action Row ────────────────────────────────── */}
      <View
        style={[
          styles.zone3Actions,
          { gap: spacing?.sm || scale(8) },
        ]}
      >
        {/* Left: Distributor / Eligibility Note */}
        <View style={styles.zone3Left}>
          <AppText
            style={[
              styles.distributorNoteText,
              typography?.caption,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            {distributorNote}
          </AppText>
        </View>

        {/* Right: View Details + Order Scheme Button */}
        <View style={styles.zone3RightButtons}>
          <DetailsChevronButton
            label="Details"
            onPress={() => onDetails && onDetails(scheme)}
          />

          <AppButton
            variant="primary"
            size="sm"
            title="Order Scheme"
            onPress={() => onOrder && onOrder(scheme)}
            style={styles.orderBtn}
          />
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'column',
  },
  zone1Header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  zone1Middle: {
    flex: 1,
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  pharmaSubtitle: {
    fontSize: scaleFont(11.5),
    marginTop: verticalScale(2),
  },
  zone1Right: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  zone2Strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: scaleFont(10),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: verticalScale(2),
  },
  metricValue: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  colDivider: {
    width: 1,
    height: verticalScale(22),
  },
  zone3Actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  zone3Left: {
    flex: 1,
    marginRight: scale(8),
  },
  distributorNoteText: {
    fontSize: scaleFont(11),
  },
  zone3RightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flexShrink: 0,
  },
  detailsBtn: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
  },
  detailsBtnText: {
    fontSize: scaleFont(12.5),
    fontWeight: '600',
  },
  orderBtn: {
    paddingHorizontal: scale(14),
    minHeight: verticalScale(34),
  },
});

export default TradeSchemeCard;

