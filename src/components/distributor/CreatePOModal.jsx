import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Platform, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { AppModal, AppInput, AppButton, AppText, AppBadge, QuantityStepperInput } from '../core/index.js';
import { useDistributorStore } from '../../store/useDistributorStore.js';

/**
 * CreatePOModal - Draft & Submit Purchase Order Bottom Sheet
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Object} [props.selectedDistributor]
 * @param {Object} [props.initialScheme]
 * @param {Function} [props.onSuccess]
 */
export const CreatePOModal = ({
  visible,
  onClose,
  selectedDistributor,
  initialScheme,
  onSuccess,
}) => {
  const { colors, isDark, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { distributors, createPurchaseOrder } = useDistributorStore();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Active distributor
  const activeDistributor = useMemo(() => {
    if (selectedDistributor) return selectedDistributor;
    if (initialScheme?.distributor) {
      const match = distributors.find((d) =>
        d.name.toLowerCase().includes(initialScheme.distributor.toLowerCase()) ||
        initialScheme.distributor.toLowerCase().includes(d.shortName?.toLowerCase() || '')
      );
      if (match) return match;
    }
    return distributors[0] || null;
  }, [selectedDistributor, initialScheme, distributors]);

  // Form State
  const [skuName, setSkuName] = useState('');
  const [unitTP, setUnitTP] = useState('240');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');

  // Keyboard height tracking
  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  // Sync initialScheme when modal opens
  useEffect(() => {
    if (visible) {
      if (initialScheme) {
        setSkuName(initialScheme.brandName || '');
        setUnitTP(initialScheme.tp ? String(initialScheme.tp) : '240');
        const parsedMoq = parseInt(initialScheme.moq, 10);
        setQuantity(!isNaN(parsedMoq) && parsedMoq > 0 ? parsedMoq : 10);
        setNotes(initialScheme.slab ? `Scheme: ${initialScheme.slab} (${initialScheme.rebate || ''})` : '');
      } else {
        setSkuName('Augmentin 625mg Tab 10s');
        setUnitTP('240');
        setQuantity(10);
        setNotes('');
      }
    }
  }, [visible, initialScheme]);

  // Total TP Calculation
  const totalAmount = useMemo(() => {
    const tp = parseFloat(unitTP) || 0;
    const qty = parseInt(quantity, 10) || 0;
    return tp * qty;
  }, [unitTP, quantity]);

  const handleClose = () => {
    Keyboard.dismiss();
    setKeyboardHeight(0);
    onClose?.();
  };

  const handleSubmit = () => {
    if (!skuName.trim()) return;

    createPurchaseOrder({
      distributorId: activeDistributor?.id,
      distributorName: activeDistributor?.name,
      skuName: skuName.trim(),
      quantity,
      unitTP: parseFloat(unitTP) || 240,
      totalAmount,
      items: [
        {
          name: skuName.trim(),
          qty: quantity,
          tp: parseFloat(unitTP) || 240,
          subtotal: totalAmount,
        },
      ],
      notes: notes.trim(),
    });

    handleClose();
    onSuccess?.();
  };

  return (
    <AppModal
      visible={visible}
      onClose={handleClose}
      type="bottomSheet"
      title="Initiate Purchase Order"
      showBackButton={true}
      showCloseButton={false}
      scrollable={false}
      style={{ padding: 0 }}
    >
      <View style={styles.sheetContainer}>
        {/* Scrollable Body: Natural content height - NO flex: 1 on inner form wrappers */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: spacing?.screenHorizontal || scale(16),
              paddingTop: spacing?.sm || verticalScale(8),
              paddingBottom: verticalScale(16),
              gap: spacing?.md || verticalScale(14),
            },
          ]}
          style={{ flexShrink: 1 }}
        >
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
                  label={`Limit: ${activeDistributor.creditLimit?.replace('PKR ', '') || '2.5M'}`}
                  variant="brand"
                  size="sm"
                  isMono={true}
                />
              </View>
            </View>
          ) : null}

          {/* SKU / Medicine Name */}
          <AppInput
            label="SKU / Medicine Name"
            placeholder="e.g. Augmentin 625mg Tab 10s"
            value={skuName}
            onChangeText={setSkuName}
          />

          {/* Unit TP Input */}
          <AppInput
            label="Unit TP (PKR)"
            placeholder="240"
            value={unitTP}
            onChangeText={setUnitTP}
            keyboardType="numeric"
            isMono={true}
          />

          {/* Dedicated SKU Row: Brand Name + Unit TP & Stepper + Live Line Subtotal */}
          <View
            style={[
              styles.skuRowCard,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : (colors.background?.secondary || '#F8FAFC'),
                borderColor: colors.border?.subtle || (isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'),
              },
            ]}
          >
            {/* Top Sub-row: SKU Brand Name + Unit TP */}
            <View style={styles.skuTopSubRow}>
              <AppText
                style={[
                  styles.skuBrandName,
                  {
                    color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    marginRight: spacing?.sm || scale(8),
                  },
                ]}
                numberOfLines={1}
              >
                {skuName || 'Augmentin 625mg Tab 10s'}
              </AppText>

              <AppText
                style={[
                  styles.skuUnitTP,
                  {
                    color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                    fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                    fontVariant: ['tabular-nums'],
                  },
                ]}
                numberOfLines={1}
              >
                {`Unit TP: Rs. ${parseFloat(unitTP) || 0}`}
              </AppText>
            </View>

            {/* Bottom Sub-row: QuantityStepperInput + Live Line Subtotal */}
            <View style={[styles.skuBottomSubRow, { marginTop: spacing?.xs || verticalScale(6) }]}>
              <View style={styles.stepperWrap}>
                <QuantityStepperInput
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  style={{ width: scale(124), height: verticalScale(40) }}
                />
              </View>

              <View style={styles.subtotalWrap}>
                <AppText
                  style={[
                    styles.subtotalText,
                    {
                      color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761'),
                      fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                      fontVariant: ['tabular-nums'],
                    },
                  ]}
                  numberOfLines={1}
                >
                  {`Rs. ${totalAmount.toLocaleString()}`}
                </AppText>
              </View>
            </View>
          </View>

          {/* Booking & Delivery Notes */}
          <AppInput
            label="Booking Notes / Delivery Instructions"
            placeholder="e.g. Deliver before Friday morning shift"
            value={notes}
            onChangeText={setNotes}
          />
        </ScrollView>

        {/* Pinned Bottom Footer: Total Order TP + Submit Button */}
        <View
          style={[
            styles.pinnedFooter,
            {
              paddingHorizontal: spacing?.screenHorizontal || scale(16),
              paddingTop: spacing?.sm || verticalScale(8),
              paddingBottom: keyboardHeight > 0
                ? verticalScale(10)
                : Math.max(insets.bottom, verticalScale(16)),
              borderTopWidth: 1,
              borderTopColor: colors.border?.divider || colors.border?.subtle || (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'),
              backgroundColor: colors.surface?.card || (isDark ? '#020202' : '#FFFFFF'),
            },
          ]}
        >
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
              Total Order TP:
            </AppText>
            <AppText
              style={[
                styles.totalValue,
                {
                  color: colors.brand?.primary || '#009BA9',
                  fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                  fontVariant: ['tabular-nums'],
                },
              ]}
            >
              PKR {totalAmount.toLocaleString()}
            </AppText>
          </View>

          <AppButton
            variant="primary"
            title="Submit Purchase Order"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    width: '100%',
    maxHeight: '100%',
    flexDirection: 'column',
  },
  scrollContent: {
    flexGrow: 0,
  },
  distributorCard: {
    borderRadius: scale(14),
    borderWidth: 1,
    padding: scale(12),
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
  skuRowCard: {
    borderRadius: scale(12),
    borderWidth: 1,
    padding: scale(12),
  },
  skuTopSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skuBrandName: {
    flex: 1,
    fontSize: scaleFont(14),
    fontWeight: '500',
  },
  skuUnitTP: {
    flexShrink: 0,
    fontSize: scaleFont(13),
  },
  skuBottomSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperWrap: {
    flexShrink: 0,
  },
  subtotalWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  subtotalText: {
    fontSize: scaleFont(15),
    fontWeight: '600',
  },
  pinnedFooter: {
    flexShrink: 0,
    width: '100%',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  totalLabel: {
    fontSize: scaleFont(13),
  },
  totalValue: {
    fontSize: scaleFont(17),
    fontWeight: '700',
  },
  submitBtn: {
    height: verticalScale(46),
    width: '100%',
  },
});

export default CreatePOModal;
