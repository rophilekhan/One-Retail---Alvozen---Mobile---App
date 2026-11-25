import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';

const StorefrontSvg = ({ size = 26, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 21H21M5 21V8L12 4L19 8V21"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 21V15.5H14.5V21M9 10.5H10M14 10.5H15"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * PharmacyIdentityCard - Card 1: Storefront Façade & Identity Hero Card
 */
export const PharmacyIdentityCard = ({
  pharmacyName,
  territoryLabel,
  isIntegrated,
  ownerUsername,
  pharmacyCode,
  facadePhotoUri,
}) => {
  const { colors, radii, spacing, typography } = useTheme();
  const dividerColor = colors.surface?.divider || colors.border.subtle;

  return (
    <GlassCard>
      <View style={[styles.identityTopRow, { gap: spacing.md }]}>
        <View
          style={[
            styles.facadeThumbBox,
            {
              borderRadius: radii.lg,
              backgroundColor: colors.glass.secondary,
              borderColor: colors.border.subtle,
            },
          ]}
        >
          {facadePhotoUri ? (
            <Image
              source={{ uri: facadePhotoUri }}
              style={styles.facadeImage}
              resizeMode="cover"
            />
          ) : (
            <StorefrontSvg size={scale(26)} color={colors.brand.primary} />
          )}
        </View>

        <View style={styles.identityRightCol}>
          <AppText
            style={[
              typography.titleLarge,
              styles.pharmacyNameText,
              { color: colors.text.primary },
            ]}
            numberOfLines={2}
          >
            {pharmacyName}
          </AppText>

          <View style={[styles.badgeWrapRow, { gap: spacing.xs }]}>
            <AppBadge label={territoryLabel} variant="brand" />
            <AppBadge
              label={isIntegrated ? 'ERP Integrated' : 'Phone QR Mode'}
              variant={isIntegrated ? 'success' : 'neutral'}
            />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.horizontalDivider,
          { backgroundColor: dividerColor, marginVertical: spacing.md },
        ]}
      />

      <View style={styles.metaGridRow}>
        <View style={[styles.metaColLeft, { paddingRight: spacing.sm }]}>
          <AppText style={[styles.metaCaption, { color: colors.text.tertiary }]}>
            OWNER / ADMIN
          </AppText>
          <AppText
            isMono
            style={[styles.metaMonoValue, { color: colors.text.primary }]}
            numberOfLines={1}
          >
            {`@${ownerUsername}`}
          </AppText>
        </View>

        <View style={[styles.verticalSeparator, { backgroundColor: dividerColor }]} />

        <View style={[styles.metaColRight, { paddingLeft: spacing.md }]}>
          <AppText style={[styles.metaCaption, { color: colors.text.tertiary }]}>
            PHARMACY ID
          </AppText>
          <AppText
            isMono
            style={[styles.metaMonoValue, { color: colors.text.primary }]}
            numberOfLines={1}
          >
            {pharmacyCode}
          </AppText>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facadeThumbBox: {
    width: scale(64),
    height: scale(64),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
  },
  facadeImage: {
    width: '100%',
    height: '100%',
  },
  identityRightCol: {
    flex: 1,
    justifyContent: 'center',
    gap: verticalScale(4),
  },
  pharmacyNameText: {
    fontFamily: fontFamilies.primaryMedium,
  },
  badgeWrapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
  },
  metaGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaColLeft: {
    flex: 1,
  },
  metaColRight: {
    flex: 1,
  },
  verticalSeparator: {
    width: 1,
    height: verticalScale(28),
  },
  metaCaption: {
    fontFamily: fontFamilies.primaryRegular,
    fontSize: scaleFont(10),
    lineHeight: scaleFont(14),
    letterSpacing: 0.6,
  },
  metaMonoValue: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(18),
    fontVariant: ['tabular-nums'],
    marginTop: verticalScale(2),
  },
});

export default PharmacyIdentityCard;
