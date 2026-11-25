import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/index.js';
import { fontFamilies } from '../../theme/typography.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppModal,
  AppText,
  AppToast,
} from '../core/index.js';
import { CloseIcon } from '../../assets/vectors/AuthIcons.jsx';
import {
  WithdrawMethodOptionCard,
  WITHDRAW_OPTIONS,
} from './WithdrawMethodOptionCard.jsx';

const resolveMethodId = (method) => {
  if (!method) return 'jazzcash';
  if (typeof method === 'string') return method.toLowerCase();
  return (method.id || 'jazzcash').toLowerCase();
};

/**
 * SelectWithdrawMethodModal
 *
 * Dedicated bottom-sheet modal presenting selectable withdrawal options:
 * JazzCash, Easypaisa, and Bank Transfer with enlarged 48px borderless discs,
 * crisp 28x28 brand marks, linked account subtitles, DMMono min limits, and active radio indicators.
 *
 * @param {Object} props
 * @param {boolean} [props.visible]
 * @param {boolean} [props.isVisible]
 * @param {Function} props.onClose
 * @param {Function} [props.onSelectMethod]
 * @param {string|Object} [props.selectedMethod]
 * @param {Object} [props.linkedAccounts]
 */
export const SelectWithdrawMethodModal = ({
  visible,
  isVisible,
  onClose,
  onSelectMethod,
  selectedMethod,
  linkedAccounts = {},
}) => {
  const { colors, isDark, spacing } = useTheme();
  const isModalVisible = visible !== undefined ? visible : isVisible;
  const [selectedId, setSelectedId] = useState(() => resolveMethodId(selectedMethod));

  useEffect(() => {
    if (selectedMethod) {
      setSelectedId(resolveMethodId(selectedMethod));
    }
  }, [selectedMethod, isModalVisible]);

  const handleSelect = (option) => {
    setSelectedId(option.id);
    AppToast.show({
      title: 'Withdraw Method',
      message: `${option.name} selected as payout destination.`,
      type: 'info',
    });
    if (onSelectMethod) {
      onSelectMethod(option);
    }
    onClose?.();
  };

  return (
    <AppModal
      visible={Boolean(isModalVisible)}
      onClose={onClose}
      type="bottomSheet"
      style={[
        styles.modalContainer,
        {
          backgroundColor: isDark ? colors.surface.sheetElevated : colors.surface.sheet,
          borderColor: colors.border.card,
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleCol}>
          <AppText
            variant="titleLarge"
            style={[styles.title, { color: colors.text.primary }]}
          >
            Select withdraw option
          </AppText>
          <AppText
            variant="caption"
            style={[styles.subtitle, { color: colors.text.secondary }]}
          >
            Min payout:{' '}
            <AppText
              variant="monoSmall"
              style={[styles.monoLimit, { color: colors.brand.primary }]}
            >
              PKR 500
            </AppText>
            {' '}wallet •{' '}
            <AppText
              variant="monoSmall"
              style={[styles.monoLimit, { color: colors.brand.primary }]}
            >
              PKR 2,500
            </AppText>
            {' '}bank
          </AppText>
        </View>

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Close withdraw options"
          style={[
            styles.closeBtn,
            { backgroundColor: colors.surface.pillSecondary },
          ]}
        >
          <CloseIcon size={scale(16)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Withdrawal Method Cards List */}
      <View style={[styles.optionsList, { gap: spacing.md }]}>
        {WITHDRAW_OPTIONS.map((option) => (
          <WithdrawMethodOptionCard
            key={option.id}
            option={option}
            isSelected={selectedId === option.id}
            linkedAccount={linkedAccounts[option.id]}
            onPress={handleSelect}
          />
        ))}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(28),
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: verticalScale(18),
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: scale(12),
  },
  title: {
    fontSize: scaleFont(18),
    fontFamily: fontFamilies.primaryMedium,
  },
  subtitle: {
    marginTop: verticalScale(4),
  },
  monoLimit: {
    fontFamily: fontFamilies.monoMedium,
    fontVariant: ['tabular-nums'],
  },
  closeBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    width: '100%',
  },
});

export default SelectWithdrawMethodModal;
