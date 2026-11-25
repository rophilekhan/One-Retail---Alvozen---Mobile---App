import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { AppModal, AppInput, AppButton, AppText, AppBadge, CustomDatePicker, QuantityStepperInput } from '../core/index.js';
import { useDistributorStore } from '../../store/useDistributorStore.js';

/**
 * CreateExpiryClaimModal - Log Near-Expiry Items for Distributor Return Claim
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Object} [props.selectedDistributor]
 * @param {Function} [props.onSuccess]
 */
export const CreateExpiryClaimModal = ({
  visible,
  onClose,
  selectedDistributor,
  onSuccess,
}) => {
  const { colors, isDark } = useTheme();
  const { distributors, createExpiryClaim } = useDistributorStore();

  const activeDistributor = useMemo(() => {
    return selectedDistributor || distributors[0] || null;
  }, [selectedDistributor, distributors]);

  // Form State
  const [skuName, setSkuName] = useState('Augmentin 625mg Tab 10s');
  const [batchNo, setBatchNo] = useState('AG-99120');
  const [quantity, setQuantity] = useState(15);
  const [unitValue, setUnitValue] = useState('240');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Expiry Date State for CustomDatePicker
  const [dobDay, setDobDay] = useState('28');
  const [dobMonth, setDobMonth] = useState('Dec');
  const [dobYear, setDobYear] = useState('2026');

  useEffect(() => {
    if (visible) {
      setSkuName('Augmentin 625mg Tab 10s');
      setBatchNo('AG-99120');
      setQuantity(15);
      setUnitValue('240');
      setDobDay('28');
      setDobMonth('Dec');
      setDobYear('2026');
      setShowDatePicker(false);
    }
  }, [visible]);

  const formattedExpiryDate = `${dobDay} ${dobMonth} ${dobYear}`;

  const claimValue = useMemo(() => {
    const val = parseFloat(unitValue) || 0;
    const qty = parseInt(quantity, 10) || 0;
    return val * qty;
  }, [unitValue, quantity]);

  const handleStepQty = (delta) => {
    setQuantity((prev) => Math.max(1, (parseInt(prev, 10) || 1) + delta));
  };

  const handleSubmit = () => {
    if (!skuName.trim() || !batchNo.trim()) return;

    createExpiryClaim({
      distributorId: activeDistributor?.id,
      distributorName: activeDistributor?.name,
      skuName: skuName.trim(),
      batchNo: batchNo.trim(),
      expiryDate: formattedExpiryDate,
      quantity,
      claimValue,
    });

    onSuccess?.();
    onClose?.();
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      title="Log Expiry Return Claim"
      showBackButton={true}
      scrollable={true}
    >
      <View style={styles.modalBody}>
        {/* Distributor Overview Card */}
        {activeDistributor ? (
          <View
            style={[
              styles.distributorCard,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : (colors.background?.secondary || '#F8FAFC'),
                borderColor: colors.border?.card || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
              },
            ]}
          >
            <View style={styles.distHeaderRow}>
              <View style={{ flex: 1 }}>
                <AppText
                  style={[
                    styles.distName,
                    typography?.bodyMedium,
                    {
                      color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                      fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {activeDistributor.name}
                </AppText>
                <AppText
                  style={[
                    styles.distTerritory,
                    typography?.caption,
                    {
                      color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                      fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {activeDistributor.territory}
                </AppText>
              </View>

              <AppBadge
                label="Return Eligible"
                variant="accent"
                size="sm"
              />
            </View>
          </View>
        ) : null}

        {/* SKU Name Input */}
        <AppInput
          label="SKU / Medicine Name"
          placeholder="e.g. Risek 20mg Cap 14s"
          value={skuName}
          onChangeText={setSkuName}
        />

        {/* Batch Number Input */}
        <AppInput
          label="Manufacturer Batch Number"
          placeholder="e.g. B-88214"
          value={batchNo}
          onChangeText={setBatchNo}
          autoCapitalize="characters"
        />

        {/* Quantity & Unit Value Row */}
        <View style={styles.twoColRow}>
          {/* Stepper Quantity */}
          <View style={styles.halfCol}>
            <AppText
              style={[
                styles.inputLabel,
                {
                  color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                  fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                  fontSize: scaleFont(13),
                  marginBottom: verticalScale(6),
                },
              ]}
            >
              Units to Return
            </AppText>
            <QuantityStepperInput
              value={quantity}
              onChange={setQuantity}
              min={1}
            />
          </View>

          {/* Unit Claim Value */}
          <View style={styles.halfCol}>
            <AppInput
              label="Unit Claim (PKR)"
              placeholder="240"
              value={unitValue}
              onChangeText={setUnitValue}
              keyboardType="numeric"
              isMono={true}
            />
          </View>
        </View>

        {/* Expiry Date Selector Button */}
        <View style={styles.dateSelectorContainer}>
          <AppText
            style={[
              styles.inputLabel,
              {
                color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular',
              },
            ]}
          >
            Labeled Expiry Date
          </AppText>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowDatePicker((prev) => !prev)}
            style={[
              styles.dateTriggerBtn,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : (colors.surface?.input || '#F8FAFC'),
                borderColor: colors.border?.default || (isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'),
              },
            ]}
          >
            <AppText
              style={[
                styles.dateTriggerText,
                {
                  color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                  fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                  fontVariant: ['tabular-nums'],
                },
              ]}
            >
              {formattedExpiryDate}
            </AppText>
            <AppBadge
              label={showDatePicker ? 'Done' : 'Change Date'}
              variant="brand"
              size="sm"
            />
          </TouchableOpacity>
        </View>

        {/* CustomDatePicker Dropdown/Expansion */}
        {showDatePicker && (
          <CustomDatePicker
            dobDay={dobDay}
            setDobDay={setDobDay}
            dobMonth={dobMonth}
            setDobMonth={setDobMonth}
            dobYear={dobYear}
            setDobYear={setDobYear}
            visible={showDatePicker}
            startYear={2024}
            endYear={2030}
          />
        )}

        {/* Total Claim Value Summary Strip with Live Line Subtotal */}
        <View
          style={[
            styles.totalStrip,
            {
              backgroundColor: isDark
                ? 'rgba(251, 107, 3, 0.12)'
                : 'rgba(251, 107, 3, 0.08)',
              borderColor: isDark
                ? 'rgba(251, 107, 3, 0.30)'
                : 'rgba(251, 107, 3, 0.20)',
            },
          ]}
        >
          <View style={styles.subtotalLineRow}>
            <AppText
              style={[
                styles.subtotalLineLabel,
                {
                  color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                  fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                },
              ]}
            >
              Unit Value:{' '}
              <AppText isMono style={[styles.subtotalLineLabel, { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761') }]}>
                Rs. {unitValue || '0'}
              </AppText>
              {' × '}
              <AppText isMono style={[styles.subtotalLineLabel, { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761') }]}>
                {quantity}
              </AppText>
              {' units'}
            </AppText>
            <AppText
              style={[
                styles.subtotalLineVal,
                {
                  color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761'),
                  fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                  fontVariant: ['tabular-nums'],
                },
              ]}
            >
              Subtotal: Rs. {claimValue.toLocaleString()}
            </AppText>
          </View>

          <View style={styles.totalRow}>
            <AppText
              style={[
                styles.totalLabel,
                {
                  color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761'),
                  fontFamily: fontFamilies.primaryBold || 'DMSans-Bold',
                },
              ]}
            >
              Total Return Claim Value:
            </AppText>
            <AppText
              style={[
                styles.totalValue,
                {
                  color: colors.brand?.accent || '#FB6B03',
                  fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                  fontVariant: ['tabular-nums'],
                },
              ]}
            >
              PKR {claimValue.toLocaleString()}
            </AppText>
          </View>
        </View>

        {/* Submit Claim Button */}
        <AppButton
          variant="accent"
          title="Submit Expiry Claim"
          onPress={handleSubmit}
          style={styles.submitBtn}
        />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    paddingBottom: verticalScale(20),
    gap: verticalScale(12),
  },
  distributorCard: {
    borderRadius: scale(14),
    borderWidth: 1,
    padding: scale(12),
    marginBottom: verticalScale(4),
  },
  distHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distName: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  distTerritory: {
    fontSize: scaleFont(11.5),
    marginTop: verticalScale(1),
  },
  twoColRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  halfCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(4),
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: verticalScale(44),
    borderRadius: radii?.md || scale(10),
    borderWidth: 1,
    paddingHorizontal: scale(8),
  },
  stepperBtn: {
    width: scale(32),
    height: verticalScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSign: {
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  stepperValue: {
    fontSize: scaleFont(14),
    fontWeight: '700',
  },
  dateSelectorContainer: {
    width: '100%',
  },
  dateTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: verticalScale(44),
    borderRadius: radii?.md || scale(10),
    borderWidth: 1,
    paddingHorizontal: scale(14),
  },
  dateTriggerText: {
    fontSize: scaleFont(13.5),
  },
  totalStrip: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    borderRadius: radii?.md || scale(12),
    borderWidth: 1,
    gap: verticalScale(6),
  },
  subtotalLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtotalLineLabel: {
    fontSize: scaleFont(12),
  },
  subtotalLineVal: {
    fontSize: scaleFont(12.5),
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(4),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(251, 107, 3, 0.25)',
  },
  totalLabel: {
    fontSize: scaleFont(12.5),
  },
  totalValue: {
    fontSize: scaleFont(16),
    fontWeight: '700',
  },
  submitBtn: {
    height: verticalScale(46),
    width: '100%',
    marginTop: verticalScale(8),
  },
});

export default CreateExpiryClaimModal;
