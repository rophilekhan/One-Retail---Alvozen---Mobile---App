import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppModal,
  AppText,
  AppToast,
} from '../core/index.js';
import { CloseIcon, ChevronRightIcon } from '../../assets/vectors/AuthIcons.jsx';

/**
 * JazzCash Stylized Brand Vector
 */
const JazzCashBrandIcon = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="13" fill="#FFFFFF" />
    <Path
      d="M8.5 16.5 C8.5 11.5 13 9 15.5 9 C13 12.5 10.8 16.5 8.5 16.5 Z"
      fill="#F59E0B"
    />
    <Path
      d="M19.5 11.5 C19.5 16.5 15 19 12.5 19 C15 15.5 17.2 11.5 19.5 11.5 Z"
      fill="#DC2626"
    />
  </Svg>
);

/**
 * Easypaisa Stylized Brand Vector
 */
const EasypaisaBrandIcon = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="13" fill="#FFFFFF" />
    <Path
      d="M14 8C10.68 8 8 10.68 8 14C8 14.8 8.16 15.56 8.44 16.25C9.4 15.19 11.4 14.5 14 14.5C16.6 14.5 18.6 15.19 19.56 16.25C19.84 15.56 20 14.8 20 14C20 10.68 17.32 8 14 8Z"
      fill="#1E293B"
    />
    <Path
      d="M8.44 16.25C9.4 18.5 11.5 20 14 20C16.5 20 18.6 18.5 19.56 16.25C18.4 17.2 16.3 17.8 14 17.8C11.7 17.8 9.6 17.2 8.44 16.25Z"
      fill="#10B981"
    />
    <Circle cx="14" cy="12" r="2.2" fill="#FFFFFF" />
  </Svg>
);

/**
 * Bank Column Building Vector
 */
const BankBuildingIcon = ({ size = 20, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9.5L12 3L21 9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="4" y="9.5" width="16" height="2" rx="0.5" fill={color} />
    <Rect x="5.5" y="11.5" width="2.5" height="7" rx="0.5" fill={color} />
    <Rect x="10.75" y="11.5" width="2.5" height="7" rx="0.5" fill={color} />
    <Rect x="16" y="11.5" width="2.5" height="7" rx="0.5" fill={color} />
    <Rect x="3" y="18.5" width="18" height="2.5" rx="0.5" fill={color} />
  </Svg>
);

/**
 * Supported withdrawal channels
 */
const WITHDRAW_OPTIONS = [
  {
    id: 'jazzcash',
    name: 'JazzCash',
    iconType: 'jazzcash',
  },
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    iconType: 'easypaisa',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    iconType: 'bank',
  },
];

/**
 * SelectWithdrawMethodModal
 *
 * Dedicated bottom-sheet modal presenting selectable withdrawal options:
 * JazzCash, Easypaisa, and Bank Transfer with authentic brand icons and right chevrons.
 *
 * @param {Object} props
 * @param {boolean} [props.visible]
 * @param {boolean} [props.isVisible]
 * @param {Function} props.onClose
 * @param {Function} [props.onSelectMethod]
 */
export const SelectWithdrawMethodModal = ({
  visible,
  isVisible,
  onClose,
  onSelectMethod,
}) => {
  const { colors, isDark } = useTheme();
  const isModalVisible = visible !== undefined ? visible : isVisible;

  const handleSelect = (option) => {
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
          backgroundColor: isDark ? '#141416' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <AppText
          style={[
            styles.title,
            { color: colors.text.primary },
          ]}
        >
          Select withdraw option
        </AppText>

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[
            styles.closeBtn,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          <CloseIcon size={scale(16)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {WITHDRAW_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.8}
            onPress={() => handleSelect(option)}
            style={[
              styles.optionCard,
              {
                backgroundColor: isDark ? '#1C1C20' : '#F8FAFC',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                {option.iconType === 'jazzcash' && <JazzCashBrandIcon size={scale(24)} />}
                {option.iconType === 'easypaisa' && <EasypaisaBrandIcon size={scale(24)} />}
                {option.iconType === 'bank' && (
                  <BankBuildingIcon size={scale(20)} color={isDark ? '#FFFFFF' : '#0B3B4B'} />
                )}
              </View>

              <AppText
                style={[
                  styles.optionName,
                  { color: colors.text.primary },
                ]}
              >
                {option.name}
              </AppText>
            </View>

            <ChevronRightIcon
              size={scale(18)}
              color={isDark ? '#94A3B8' : '#64748B'}
            />
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: scaleFont(18),
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  closeBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: verticalScale(12),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: scale(20),
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(14),
  },
  optionName: {
    fontSize: scaleFont(15.5),
    fontFamily: 'DMSans-Medium',
    fontWeight: '600',
  },
});

export default SelectWithdrawMethodModal;
