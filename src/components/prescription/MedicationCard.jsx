import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { typography } from '../../theme/typography.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { shadows } from '../../theme/shadows.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { AppText } from '../global/index.js';
import { WarningTooltip } from './WarningTooltip.jsx';
import {
  RegimenTimelineIcon,
  ClockIcon,
  CalendarIcon,
  EditIcon,
  ChevronDown,
} from '../../assets/vectors/PrescriptionIcons.jsx';

/**
 * MedicationCard
 * Exact OneRx layout with bottom View Brands v & Available v pills.
 *
 * @param {Object} props
 */
export const MedicationCard = ({
  index = 1,
  name = 'Metoprolol',
  type = 'Tablet',
  strength = 'Metoprolol 50mg',
  medClass = 'Beta blocker',
  dosage = '1-0-1',
  timing = 'Before Meal',
  duration = '7 days',
  instructions = '"Take one tablet morning and night before meals."',
  hasWarning = false,
  warningText = 'Patient allergic to beta blockers; avoid metoprolol, use alternative.',
  onEdit,
  onDelete,
  item = {},
  isAvailable = true,
  onPressBrands,
  onPressPharmacies,
  onPressCard,
}) => {
  const { colors, isDark } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  const medName = item?.brandName || item?.name || name;
  const medType = item?.dosageForm || item?.type || type;
  const medStrength = item?.strength || strength;
  const medSubtitleClass = item?.genericName || item?.medClass || medClass;
  const isGeneric = (!item?.brandName && Boolean(item?.genericName)) || item?.isGeneric;
  const isAvail = item?.isAvailable !== undefined ? item.isAvailable : isAvailable;

  const formattedInstructions = instructions
    ? instructions.startsWith('"')
      ? instructions
      : `"${instructions}"`
    : '';

  return (
    <TouchableOpacity
      activeOpacity={onPressCard ? 0.85 : 1}
      onPress={onPressCard}
      disabled={!onPressCard}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface.card,
          borderColor: !isAvail && !isGeneric ? colors.status.error : colors.border.card,
          zIndex: showTooltip ? 10 : 1,
          ...(isDark ? shadows.dark.card : shadows.light.card),
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.indexCircle, { backgroundColor: colors.surface.pillSecondary }]}>
          <AppText style={[styles.indexText, { color: colors.text.primary }]}>{index}</AppText>
        </View>

        <View style={styles.titleCol}>
          <View style={styles.nameHeaderRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <AppText style={[styles.medName, { color: colors.text.primary }]}>
                {medName} <AppText style={[styles.medType, { color: colors.text.secondary }]}>• {medType}</AppText>
              </AppText>
              <AppText style={[styles.medSubtitle, { color: colors.text.secondary }]}>
                {medStrength ? `${medStrength} • ` : ''}
                {medSubtitleClass}
              </AppText>
            </View>

            <View style={styles.actionsContainer}>
              {onEdit && (
                <TouchableOpacity
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    onEdit();
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
                  activeOpacity={0.7}
                  style={styles.actionBtn}
                >
                  <EditIcon color={colors.text.primary} size={17} />
                </TouchableOpacity>
              )}

              {onEdit && onDelete && (
                <View style={[styles.actionDivider, { backgroundColor: colors.border.subtle }]} />
              )}

              {onDelete && (
                <TouchableOpacity
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    onDelete();
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                  activeOpacity={0.7}
                  style={styles.actionBtn}
                >
                  <Svg width={scale(17)} height={scale(17)} viewBox="0 0 24 24" fill="none">
                    <Path d="M3 6H21" stroke={colors.text.primary} strokeWidth="1.6" strokeLinecap="round" />
                    <Path
                      d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6"
                      stroke={colors.text.primary}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
                      stroke={colors.text.primary}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path d="M10 11V17M14 11V17" stroke={colors.text.primary} strokeWidth="1.6" strokeLinecap="round" />
                  </Svg>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border.subtle }]} />

      <View style={styles.statsRow}>
        <View style={styles.statsList}>
          <View style={styles.statInline}>
            <RegimenTimelineIcon color={colors.text.secondary} size={15} style={{ marginRight: scale(5) }} />
            <AppText isMono style={[styles.statValue, { color: colors.text.primary }]}>{dosage}</AppText>
          </View>

          <View style={styles.statInline}>
            <ClockIcon color={colors.text.secondary} size={15} style={{ marginRight: scale(5) }} />
            <AppText style={[styles.statValue, { color: colors.text.primary }]}>{timing}</AppText>
          </View>

          <View style={styles.statInline}>
            <CalendarIcon color={colors.text.secondary} size={15} style={{ marginRight: scale(5) }} />
            <AppText isMono style={[styles.statValue, { color: colors.text.primary }]}>{duration}</AppText>
          </View>
        </View>

        {hasWarning && (
          <View style={styles.warningContainer}>
            <TouchableOpacity
              onPress={(e) => {
                e?.stopPropagation?.();
                setShowTooltip(!showTooltip);
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.warningBtn}
            >
              <Svg width={scale(19)} height={scale(19)} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M10.29 3.86L1.82 18C1.64539 18.3024 1.55299 18.6453 1.552 18.9975C1.55101 19.3497 1.64146 19.693 1.815 19.996C1.98854 20.299 2.23968 20.5518 2.54583 20.7314C2.85198 20.9109 3.20336 21.011 3.56 21.02H20.44C20.7966 21.011 21.148 20.9109 21.4542 20.7314C21.7603 20.5518 22.0115 20.299 22.185 19.996C22.3585 19.693 22.449 19.3497 22.448 18.9975C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5318 3.56613 13.2807 3.32185 12.9786 3.14856C12.6766 2.97528 12.3327 2.87817 11.9765 2.86548C11.6204 2.8528 11.2625 2.925 10.9329 3.0763C10.6033 3.2276 10.3116 3.45367 10.082 3.735L10.29 3.86Z"
                  fill={colors.status.drugInteraction}
                />
                <Path d="M12 9V13.5" stroke={colors.cta.sliderKnob} strokeWidth="2" strokeLinecap="round" />
                <Circle cx="12" cy="16.5" r="1.1" fill={colors.cta.sliderKnob} />
              </Svg>
            </TouchableOpacity>

            <WarningTooltip
              visible={showTooltip}
              text={warningText}
              arrowSide="right"
              offsetTop={-38}
              offsetSide={28}
            />
          </View>
        )}
      </View>

      {formattedInstructions !== '""' && formattedInstructions !== '' && (
        <AppText style={[styles.instructionsText, { color: colors.text.secondary }]}>
          {formattedInstructions}
        </AppText>
      )}

      {/* Exact OneRx Bottom Row: View Brands v (Left) & Available v (Right) */}
      {(onPressBrands || onPressPharmacies) && (
        <View style={styles.cardFooter}>
          <TouchableOpacity
            onPress={(e) => {
              e?.stopPropagation?.();
              onPressBrands?.(item);
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={[
              styles.viewBrandsBtn,
              { backgroundColor: colors.surface.durationTabBg },
            ]}
          >
            <AppText style={[styles.viewBrandsText, { color: colors.text.primary }]}>
              View Brands
            </AppText>
            <ChevronDown size={12} color={colors.text.primary} strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e?.stopPropagation?.();
              if (onPressPharmacies) {
                onPressPharmacies(item);
              } else {
                onPressBrands?.(item);
              }
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={[
              styles.bottomRightTag,
              { backgroundColor: colors.status.accentBg },
            ]}
          >
            <AppText style={[styles.bottomRightTagText, { color: colors.brand.accent }]}>
              Available
            </AppText>
            <ChevronDown size={12} color={colors.brand.accent} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
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
    marginRight: spacing.md,
  },
  indexText: {
    ...typography.monoClinical,
    fontWeight: '500',
  },
  titleCol: {
    flex: 1,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medName: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  medType: {
    ...typography.caption,
  },
  medSubtitle: {
    ...typography.badge,
    marginTop: spacing.xxs,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDivider: {
    width: 1,
    height: scale(14),
    marginHorizontal: spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  statInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statValue: {
    ...typography.caption,
    fontWeight: '500',
  },
  warningContainer: {
    position: 'relative',
    marginRight: spacing.xs,
  },
  warningBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  viewBrandsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: radii.pill,
  },
  viewBrandsText: {
    ...typography.badge,
    fontWeight: '500',
    marginRight: scale(6),
  },
  bottomRightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: radii.pill,
    justifyContent: 'center',
  },
  bottomRightTagText: {
    ...typography.badge,
    fontWeight: '600',
    marginRight: scale(6),
  },
  instructionsText: {
    marginTop: spacing.md,
    ...typography.badge,
  },
});

export default MedicationCard;
