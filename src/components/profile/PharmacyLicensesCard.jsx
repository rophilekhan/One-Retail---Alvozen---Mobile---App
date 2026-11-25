import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  GlassCard,
  AppText,
  AppBadge,
  MetricIconDisc,
  DetailsChevronButton,
} from '../core/index.js';
import { IdCardOutlineIcon } from '../../assets/vectors/index.js';

/**
 * PharmacyLicensesCard - Card 3: Regulatory Drug Licenses List (DSL, Further 1 & 2)
 */
export const PharmacyLicensesCard = ({
  licenses,
  onPressUpdate,
  onPreviewLicense,
}) => {
  const { colors, isDark, spacing, typography } = useTheme();
  const discIconColor = isDark ? colors.text.primary : colors.brand.primaryDark;
  const dividerColor = colors.surface?.divider || colors.border.subtle;

  return (
    <GlassCard>
      <View style={[styles.cardHeaderRow, { marginBottom: spacing.sm }]}>
        <AppText
          style={[
            typography.titleMedium,
            styles.cardTitleText,
            { color: colors.text.primary },
          ]}
          numberOfLines={1}
        >
          Regulatory Licenses
        </AppText>
        <DetailsChevronButton label="Update" onPress={onPressUpdate} />
      </View>

      {licenses.map((license, index) => {
        const isFirst = index === 0;
        const isLast = index === licenses.length - 1;
        const badgeVariant = license.isVerified
          ? 'success'
          : license.number
            ? 'warning'
            : 'neutral';

        return (
          <React.Fragment key={license.id}>
            {!isFirst && (
              <View
                style={[styles.horizontalDivider, { backgroundColor: dividerColor }]}
              />
            )}
            <View
              style={[
                styles.licenseRow,
                {
                  paddingTop: isFirst ? 0 : spacing.sm,
                  paddingBottom: isLast ? 0 : spacing.sm,
                },
              ]}
            >
              <MetricIconDisc size={38} variant="first_visit">
                <IdCardOutlineIcon size={scale(18)} color={discIconColor} />
              </MetricIconDisc>

              <View style={[styles.licenseMidCol, { marginHorizontal: spacing.sm }]}>
                <AppText
                  style={[styles.licenseTitle, { color: colors.text.primary }]}
                  numberOfLines={1}
                >
                  {license.title}
                </AppText>
                <AppText
                  isMono
                  style={[styles.licenseNumber, { color: colors.text.secondary }]}
                  numberOfLines={1}
                >
                  {license.number || 'Not Assigned'}
                </AppText>
                <AppText
                  isMono
                  style={[styles.licenseExpiry, { color: colors.text.tertiary }]}
                  numberOfLines={1}
                >
                  {license.expiryDate ? `Expires ${license.expiryDate}` : 'No expiry date'}
                </AppText>
              </View>

              <View style={styles.licenseRightCol}>
                <AppBadge label={license.statusLabel} variant={badgeVariant} />
                {license.imageUri ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onPreviewLicense?.(license)}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${license.title} photo`}
                  >
                    <AppText
                      style={[styles.viewLinkText, { color: colors.brand.primary }]}
                      numberOfLines={1}
                    >
                      View &rsaquo;
                    </AppText>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </React.Fragment>
        );
      })}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitleText: {
    fontFamily: fontFamilies.primaryMedium,
    flex: 1,
    marginRight: scale(8),
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  licenseMidCol: {
    flex: 1,
    justifyContent: 'center',
  },
  licenseTitle: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(18),
  },
  licenseNumber: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    fontVariant: ['tabular-nums'],
    marginTop: verticalScale(2),
  },
  licenseExpiry: {
    fontFamily: fontFamilies.monoRegular,
    fontSize: scaleFont(11),
    lineHeight: scaleFont(15),
    fontVariant: ['tabular-nums'],
    marginTop: verticalScale(1),
  },
  licenseRightCol: {
    flexShrink: 0,
    alignItems: 'flex-end',
    gap: verticalScale(4),
  },
  viewLinkText: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(11),
    lineHeight: scaleFont(15),
  },
});

export default PharmacyLicensesCard;
