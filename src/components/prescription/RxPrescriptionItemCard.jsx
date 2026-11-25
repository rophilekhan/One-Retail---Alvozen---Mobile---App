import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';
import {
  PillIcon,
  PillsMedicineIcon,
  RegimenTimelineIcon,
  ClockIcon,
  CalendarIcon,
} from '../../assets/vectors/index.js';

/**
 * RxPrescriptionItemCard
 *
 * Exact 1:1 OneRx MedicationCard.jsx style layout:
 * - Numbered index circle (1, 2, 3)
 * - Medicine Name + Dosage Form
 * - Generic Molecule & Strength subtitle
 * - Clinical Regimen, Timing & Duration row with SVG icons
 * - Price tags (TP / MRP) in typography.monoClinical
 * - Prominent action triggers for Generic Mapped Brands and Unavailable Alternates
 *
 * @param {Object} props
 * @param {number} [props.index=1]
 * @param {Object} props.item
 * @param {boolean} [props.skuVisibilityEnabled]
 * @param {Function} [props.onPressGeneric]
 * @param {Function} [props.onPressUnavailable]
 */
export const RxPrescriptionItemCard = ({
  index = 1,
  item = {},
  skuVisibilityEnabled,
  onPressGeneric,
  onPressUnavailable,
}) => {
  const { colors, isDark } = useTheme();

  const isGenericPrescription = !item.brandName && Boolean(item.genericName);
  const isAvailable = item.isAvailable !== false;
  const isSubstituted = Boolean(item.substitutedBrand);

  const displayName = isGenericPrescription
    ? item.genericName
    : isSubstituted
    ? item.substitutedBrand.name || item.substitutedBrand.brandName
    : item.brandName || item.genericName;

  const dosageForm = item.dosageForm || (isGenericPrescription ? 'Capsule/Tablet' : 'Tablet');
  const genericSubtitle = isGenericPrescription
    ? `Generic ID: ${item.genericId || 'gen_standard'}`
    : item.genericName || 'Standard Formulation';

  const dosage = item.dosage || '1-0-1';
  const timing = item.timing || 'After Meal';
  const duration = item.duration || '7 days';
  const prescribedQty = item.prescribedQuantity || 10;

  const tpValue = isSubstituted
    ? item.substitutedBrand.tp || item.tp
    : item.tp;
  const mrpValue = isSubstituted
    ? item.substitutedBrand.mrp || item.mrp
    : item.mrp;

  return (
    <GlassCard
      style={[
        styles.card,
        {
          borderColor: !isAvailable && !isGenericPrescription
            ? (colors.status?.error || '#FF4B4B')
            : (colors.border?.card || 'rgba(0,0,0,0.06)'),
        },
      ]}
    >
      {/* Strict Vertical Stack inside the card */}
      <View style={styles.cardCol}>
        {/* 1. Top Header Row: Index Circle, Medicine Title, Status Badge */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.indexCircle,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : (colors.surface?.pillSecondary || '#F1F5F9'),
              },
            ]}
          >
            <AppText style={[styles.indexText, { color: colors.text.primary }]}>
              {index}
            </AppText>
          </View>

          <View style={styles.titleCol}>
            <View style={styles.titleBadgeRow}>
              <View style={styles.titleTextWrap}>
                <AppText style={[styles.medName, { color: colors.text.primary }]}>
                  {displayName}
                  <AppText style={[styles.medType, { color: colors.text.muted }]}>
                    {' '}• {dosageForm}
                  </AppText>
                </AppText>

                <AppText style={[styles.medSubtitle, { color: colors.text.muted }]}>
                  {genericSubtitle}
                </AppText>
              </View>

              {/* Status Badge */}
              {isGenericPrescription ? (
                <AppBadge label="Generic ID" variant="accent" size="sm" isMono={true} />
              ) : isSubstituted ? (
                <AppBadge label="Substituted" variant="brand" size="sm" />
              ) : isAvailable ? (
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: colors.status?.availableBg || 'rgba(73, 200, 143, 0.12)',
                      borderColor: colors.status?.available || '#49C88F',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: colors.status?.available || '#49C88F' },
                    ]}
                  />
                  <AppText
                    style={[
                      styles.statusText,
                      { color: colors.status?.available || '#49C88F' },
                    ]}
                  >
                    In Stock
                  </AppText>
                </View>
              ) : (
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isDark ? 'rgba(255, 75, 75, 0.2)' : 'rgba(255, 75, 75, 0.12)',
                      borderColor: colors.status?.error || '#FF4B4B',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: colors.status?.error || '#FF4B4B' },
                    ]}
                  />
                  <AppText
                    style={[
                      styles.statusText,
                      { color: colors.status?.error || '#FF4B4B' },
                    ]}
                  >
                    Out of Stock
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 2. Clinical Regimen, Timing, Duration & Quantity Row */}
        <View
          style={[
            styles.clinicalRow,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.025)' : '#F8FAFC',
              borderColor: colors.border?.subtle,
            },
          ]}
        >
          <View style={styles.statInline}>
            <RegimenTimelineIcon color={colors.text.muted} size={15} style={{ marginRight: scale(4) }} />
            <AppText isMono style={[styles.statValue, { color: colors.text.primary }]}>
              {dosage}
            </AppText>
          </View>

          <View style={styles.statInline}>
            <ClockIcon color={colors.text.muted} size={15} style={{ marginRight: scale(4) }} />
            <AppText
              style={[
                styles.statValue,
                { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
              ]}
            >
              {timing}
            </AppText>
          </View>

          <View style={styles.statInline}>
            <CalendarIcon color={colors.text.muted} size={15} style={{ marginRight: scale(4) }} />
            <AppText isMono style={[styles.statValue, { color: colors.text.primary }]}>
              {duration}
            </AppText>
          </View>

          <View style={styles.statInline}>
            <PillIcon color={colors.brand?.primary} size={14} style={{ marginRight: scale(4) }} />
            <AppText
              style={[
                styles.statValue,
                { color: colors.brand?.primary, fontFamily: fontFamilies.primaryMedium },
              ]}
            >
              Qty:{' '}
              <AppText isMono style={[styles.statValue, { color: colors.brand?.primary }]}>
                {prescribedQty}
              </AppText>
            </AppText>
          </View>
        </View>

        {/* 3. Price Tags (TP / MRP) in typography.monoClinical (for brand prescriptions) */}
        {!isGenericPrescription && (tpValue > 0 || mrpValue > 0) && (
          <View style={styles.pricingRow}>
            <View style={styles.priceChip}>
              <AppText style={[styles.priceChipLabel, { color: colors.text.muted }]}>
                TP:
              </AppText>
              <AppText style={[styles.priceChipValue, { color: colors.text.primary }]}>
                PKR {Number(tpValue || 0).toLocaleString()}
              </AppText>
            </View>

            <View style={styles.priceChip}>
              <AppText style={[styles.priceChipLabel, { color: colors.text.muted }]}>
                MRP:
              </AppText>
              <AppText style={[styles.priceChipValue, { color: colors.text.primary }]}>
                PKR {Number(mrpValue || 0).toLocaleString()}
              </AppText>
            </View>

            {item.activeScheme && (
              <View
                style={[
                  styles.schemeChip,
                  {
                    backgroundColor: isDark ? 'rgba(251, 107, 3, 0.15)' : 'rgba(251, 107, 3, 0.1)',
                    borderColor: colors.brand?.accent || '#FB6B03',
                  },
                ]}
              >
                <AppText style={[styles.schemeChipText, { color: colors.brand?.accent || '#FB6B03' }]}>
                  {item.activeScheme}
                </AppText>
              </View>
            )}
          </View>
        )}

        {/* 4. Action Trigger Buttons */}
        {isGenericPrescription ? (
          /* Generic Prescribed Item -> Prominent "Map to In-Stock Brands" Button */
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPressGeneric?.(item)}
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.brand?.primary || '#009BA9',
              },
            ]}
          >
            <PillsMedicineIcon size={16} color="#FFFFFF" style={{ marginRight: scale(6) }} />
            <AppText style={styles.actionButtonText}>
              Map to In-Stock Brands ({item.mappedBrands?.length || 4} Available) &gt;
            </AppText>
          </TouchableOpacity>
        ) : !isAvailable ? (
          /* Unavailable Brand Item -> Prominent "Alternatives & Nearby Stock" Button */
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPressUnavailable?.(item)}
            style={[
              styles.actionButton,
              {
                backgroundColor: isDark ? 'rgba(251, 107, 3, 0.18)' : '#FFF3E8',
                borderColor: colors.brand?.accent || '#FB6B03',
                borderWidth: 1.2,
              },
            ]}
          >
            <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none" style={{ marginRight: scale(6) }}>
              <Path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke={colors.brand?.accent || '#FB6B03'}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 8v4M12 16h.01"
                stroke={colors.brand?.accent || '#FB6B03'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
            <AppText
              style={[
                styles.actionButtonText,
                { color: colors.brand?.accent || '#FB6B03', fontWeight: '700' },
              ]}
            >
              Alternatives & Nearby Stock &gt;
            </AppText>
          </TouchableOpacity>
        ) : null}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    borderRadius: scale(18),
    padding: scale(14),
  },
  cardCol: {
    flexDirection: 'column',
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indexCircle: {
    width: scale(28),
    height: scale(28),
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
    marginTop: verticalScale(2),
  },
  indexText: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(13),
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  titleCol: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleTextWrap: {
    flex: 1,
    paddingRight: scale(8),
  },
  medName: {
    fontSize: scaleFont(16),
    lineHeight: scaleFont(21),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  medType: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryRegular,
    fontWeight: '400',
  },
  medSubtitle: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(15),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(2),
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  statusDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
    marginRight: scale(5),
  },
  statusText: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
  },
  clinicalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: scale(10),
    borderWidth: 1,
    marginTop: verticalScale(10),
    gap: scale(6),
  },
  statInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.monoMedium,
    fontVariant: ['tabular-nums'],
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
    gap: scale(8),
    flexWrap: 'wrap',
  },
  priceChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceChipLabel: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryRegular,
    marginRight: scale(4),
  },
  priceChipValue: {
    ...typography.monoClinical,
    fontSize: scaleFont(12),
  },
  schemeChip: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  schemeChipText: {
    ...typography.monoBadge,
    fontSize: scaleFont(10.5),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(40),
    borderRadius: radii.pill,
    marginTop: verticalScale(10),
    paddingHorizontal: scale(12),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
});

export default RxPrescriptionItemCard;
