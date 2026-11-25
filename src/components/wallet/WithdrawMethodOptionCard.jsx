import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { fontFamilies } from '../../theme/typography.js';
import { scale, moderateScale } from '../../theme/responsive.js';
import { MetricIconDisc, AppText } from '../core/index.js';
import {
  JazzCashOfficialIcon,
  EasypaisaOfficialIcon,
  BankOfficialIcon,
} from '../../assets/vectors/ImpactIcons.jsx';

/**
 * Shared supported payout destination channels across wallet & cashout modals
 */
export const WITHDRAW_OPTIONS = [
  {
    id: 'jazzcash',
    channelKey: 'JAZZCASH',
    name: 'JazzCash',
    iconType: 'jazzcash',
    defaultAccount: '0345-2102014',
    minLimit: 'Min PKR 500',
  },
  {
    id: 'easypaisa',
    channelKey: 'EASYPAISA',
    name: 'Easypaisa',
    iconType: 'easypaisa',
    defaultAccount: '0342-8819204',
    minLimit: 'Min PKR 500',
  },
  {
    id: 'bank',
    channelKey: 'BANK',
    name: 'Bank Transfer',
    iconType: 'bank',
    defaultAccount: 'PK42 MEZN 0204 0104 8192 01',
    minLimit: 'Min PKR 2,500',
  },
];

/**
 * Checkmark stroke icon for selected payout indicator disc
 */
const SelectionCheckIcon = ({ size = 12, color }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M3.5 8.5L6.5 11.5L12.5 4.5"
      stroke={color}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Renders the 28x28 vector badge icon for a given payout channel.
 */
export const renderWithdrawMethodIcon = (iconType, { colors, isDark }) => {
  if (iconType === 'jazzcash') {
    return <JazzCashOfficialIcon width={scale(28)} height={scale(28)} />;
  }
  if (iconType === 'easypaisa') {
    return <EasypaisaOfficialIcon width={scale(28)} height={scale(28)} isDark={isDark} />;
  }
  return (
    <BankOfficialIcon
      width={scale(28)}
      height={scale(28)}
      color={isDark ? colors.text.primary : colors.brand.primaryDark}
    />
  );
};

/**
 * WithdrawMethodOptionCard
 *
 * Standardized horizontal withdrawal channel card with:
 * - Enlarged borderless scale(48) MetricIconDisc (variant="bank") + 28x28 vector icon
 * - DMSans-Medium title + DMMono-Regular linked account subtitle & DMMono-Medium limit
 * - scale(22) radio/check selection indicator on the right
 *
 * @param {Object} props
 * @param {Object} props.option
 * @param {boolean} [props.isSelected=false]
 * @param {string} [props.linkedAccount]
 * @param {Function} props.onPress
 * @param {Object} [props.style]
 */
export const WithdrawMethodOptionCard = ({
  option,
  isSelected = false,
  linkedAccount,
  onPress,
  style,
}) => {
  const { colors, isDark, spacing, radii } = useTheme();
  const accountText = linkedAccount || option.defaultAccount;
  const checkIconColor = isDark ? colors.text.primary : colors.text.inverse;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(option)}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`${option.name}, ${accountText}`}
      style={[
        styles.card,
        {
          padding: moderateScale(14),
          borderRadius: radii.lg,
          gap: spacing.md,
          backgroundColor: isSelected
            ? colors.surface.cardSelected
            : isDark
              ? colors.surface.inputSecondary
              : colors.surface.cardElevated,
          borderColor: isSelected
            ? colors.brand.primary
            : colors.border.card,
        },
        style,
      ]}
    >
      {/* Left: Borderless 48x48 MetricIconDisc + 28x28 vector emblem */}
      <MetricIconDisc
        variant="bank"
        size={scale(48)}
        disableSizeScale
        isDark={isDark}
        style={styles.iconDisc}
      >
        {renderWithdrawMethodIcon(option.iconType, { colors, isDark })}
      </MetricIconDisc>

      {/* Middle: Method Title (DMSans-Medium bodyLarge), min limit (DMMono-Medium), linked account (DMMono-Regular monoSmall) */}
      <View style={styles.middleCol}>
        <View style={styles.titleRow}>
          <AppText
            variant="bodyLarge"
            numberOfLines={1}
            style={[styles.optionTitle, { color: colors.text.primary }]}
          >
            {option.name}
          </AppText>
          {option.minLimit ? (
            <AppText
              variant="monoBadge"
              numberOfLines={1}
              style={[
                styles.minLimitText,
                { color: isSelected ? colors.brand.primary : colors.text.muted },
              ]}
            >
              {option.minLimit}
            </AppText>
          ) : null}
        </View>

        <AppText
          variant="monoSmall"
          numberOfLines={1}
          style={[styles.accountSubtitle, { color: colors.text.secondary }]}
        >
          {accountText}
        </AppText>
      </View>

      {/* Right: Radio / Check indicator disc (scale(22)) */}
      <View
        style={[
          styles.radioDisc,
          {
            backgroundColor: isSelected ? colors.brand.primary : 'transparent',
            borderColor: isSelected ? colors.brand.primary : colors.border.default,
            borderWidth: isSelected ? 0 : 1.5,
          },
        ]}
      >
        {isSelected ? (
          <SelectionCheckIcon size={scale(12)} color={checkIconColor} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconDisc: {
    borderWidth: 0,
    padding: 0,
    flexShrink: 0,
  },
  middleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(8),
  },
  optionTitle: {
    fontFamily: fontFamilies.primaryMedium,
    flexShrink: 1,
  },
  minLimitText: {
    fontFamily: fontFamilies.monoMedium,
    fontVariant: ['tabular-nums'],
    flexShrink: 0,
  },
  accountSubtitle: {
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    marginTop: scale(3),
  },
  radioDisc: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});

export default WithdrawMethodOptionCard;
