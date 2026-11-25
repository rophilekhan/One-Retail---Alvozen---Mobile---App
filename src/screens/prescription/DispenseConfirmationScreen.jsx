import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  AppToast,
  MetricIconDisc,
  QuantityStepperInput,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { useDispenseStore } from '../../store/useDispenseStore.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { SelectMedicineModal } from '../../components/prescription/index.js';
import {
  PillsMedicineIcon,
  TransferArrowsIconSvg,
  PointsStarIcon,
} from '../../assets/vectors/index.js';

/**
 * DispenseConfirmationScreen - Non-Integrated Dispense & SKU Input
 * Mandated by ONERETAIL_PRD.md:
 * - Enter quantity dispensed against each SKU
 * - If a Brand is substituted, search and select substitute Brand & quantity
 * - Real-time calculation of TP, MRP, Margin, and PII points award
 * Features exact SVG vector icons (Zero emoji/text placeholders).
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const DispenseConfirmationScreen = ({ navigation, route }) => {
  const { colors, spacing, isDark } = useTheme();
  const { scannedItems, updateDispensedQuantity, substituteBrand, clearDispenseSession, activePrescription } =
    useDispenseStore();
  const { updatePii, piiScore, walletBalance } = usePharmacyStore();

  const [activeSubstituteItemId, setActiveSubstituteItemId] = useState(null);
  const [substituteModalVisible, setSubstituteModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync route params when coming from GenericMappedBrandsSheet or UnavailableBrandSheet
  React.useEffect(() => {
    if (route?.params?.itemId && (route?.params?.brandName || route?.params?.selectedBrand)) {
      const targetId = route.params.itemId;
      const brand = route.params.selectedBrand || {
        brandId: route.params.brandId,
        name: route.params.brandName,
        brandName: route.params.brandName,
        tp: route.params.tp,
        mrp: route.params.mrp,
      };
      substituteBrand(targetId, brand, route.params.substituteReason || 'Generic Mapped');
    }
  }, [route?.params, substituteBrand]);

  // Financial calculations
  let totalMRP = 0;
  let totalTP = 0;
  let totalDispensedUnits = 0;

  scannedItems.forEach((item) => {
    const qty = Number(item.dispensedQuantity) || 0;
    const activeItem = item.substitutedBrand || item;
    const itemMRP = Number(activeItem.mrp) || Number(item.mrp) || 0;
    const itemTP = Number(activeItem.tp) || Number(item.tp) || 0;

    totalDispensedUnits += qty;
    totalMRP += itemMRP * qty;
    totalTP += itemTP * qty;
  });

  const grossMargin = totalMRP - totalTP;

  const openSubstitutePicker = (itemId) => {
    setActiveSubstituteItemId(itemId);
    setSubstituteModalVisible(true);
  };

  const handleSelectSubstitute = (subBrand, contextMed) => {
    if (activeSubstituteItemId) {
      const brandTitle = subBrand?.brandName || subBrand?.name || 'Substitute Brand';
      const reason = contextMed?.isAvailable === false ? 'Out of Stock' : 'Out of Stock';
      substituteBrand(activeSubstituteItemId, subBrand, reason);
      setSubstituteModalVisible(false);
      AppToast.show({
        title: 'Brand Substituted',
        message: `Substituted with ${brandTitle} (${reason})`,
        type: 'info',
      });
    }
  };

  const handleConfirmDispense = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Award PII points & wallet incentive for Digital Rx Scan
      updatePii({
        score: (piiScore || 842) + 10,
        walletBalance: (walletBalance || 48500) + 50,
      });

      setIsSubmitting(false);
      AppToast.show({
        title: 'Dispense Confirmed',
        message: 'Prescription dispense recorded! +10 PII Points & +PKR 50 earned.',
        type: 'success',
      });

      clearDispenseSession();
      navigation.navigate('MainTabs');
    }, 600);
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Dispense Confirmation" onBack={() => navigation.goBack()} />

      {/* Header Info */}
      <GlassCard style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="titleMedium" colorType="primary">
              Rx:{' '}
              <AppText isMono colorType="primary">
                {activePrescription?.prescriptionNumber || 'RX-99214'}
              </AppText>
            </AppText>
            <AppText variant="caption" colorType="muted">
              Patient: {activePrescription?.patientName || 'Ali Khan'} • Non-Integrated POS Mode
            </AppText>
          </View>
          <AppBadge label="+10 Pts" variant="accent" isMono={true} />
        </View>
        <AppText variant="caption" colorType="muted" style={{ marginTop: 8 }}>
          Verify and input exact dispensed quantities for each prescribed item below:
        </AppText>
      </GlassCard>

      {/* Scanned Items Dispense List */}
      <AppText variant="titleMedium" colorType="primary" style={styles.sectionTitle}>
        Prescribed SKUs (
        <AppText isMono colorType="primary">
          {scannedItems.length}
        </AppText>
        )
      </AppText>

      {scannedItems.map((item) => {
        const isSubstituted = Boolean(item.substitutedBrand);
        const displayName = isSubstituted
          ? item.substitutedBrand?.brandName || item.substitutedBrand?.name || item.brandName
          : item.brandName || item.genericName;

        return (
          <GlassCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemTopRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.displayNameRow}>
                  <PillsMedicineIcon size={18} color={colors.brand?.primary} style={{ marginRight: 6 }} />
                  <AppText variant="bodyLargeMedium" colorType="primary">
                    {displayName}
                  </AppText>
                </View>
                <AppText variant="caption" colorType="muted">
                  Generic: {item.genericName}
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Prescribed Qty:{' '}
                  <AppText variant="monoSmall" colorType="brand">
                    {item.prescribedQuantity}
                  </AppText>
                </AppText>

                {isSubstituted && (
                  <View style={styles.substitutedBadgeRow}>
                    <TransferArrowsIconSvg size={12} color={colors.brand?.accent} style={{ marginRight: 4 }} />
                    <AppBadge
                      label={`Substituted (${item.substituteReason || 'Out of Stock'})`}
                      variant="accent"
                      size="sm"
                    />
                  </View>
                )}
              </View>

              {/* Quantity Stepper for Non-Integrated POS */}
              <View style={styles.qtyBox}>
                <AppText variant="caption" colorType="muted" style={{ marginBottom: 4 }}>
                  Dispensed Qty
                </AppText>
                <QuantityStepperInput
                  value={Number(item.dispensedQuantity) || 1}
                  onChange={(val) => updateDispensedQuantity(item.id, val)}
                  min={1}
                  style={{ width: scale(116), height: verticalScale(40) }}
                />
              </View>
            </View>

            {/* Substitution Trigger Button */}
            <View style={[styles.itemActions, { borderTopColor: colors.border?.subtle }]}>
              <TouchableOpacity
                onPress={() => openSubstitutePicker(item.id)}
                style={styles.substituteBtn}
              >
                <AppText variant="caption" colorType="brand" style={{ fontWeight: '600' }}>
                  {isSubstituted ? 'Change Substitute Brand' : 'Substitute Brand'}
                </AppText>
              </TouchableOpacity>
            </View>
          </GlassCard>
        );
      })}

      {/* Financial Summary Card */}
      <GlassCard style={styles.card}>
        <AppText variant="titleMedium" colorType="primary">
          Dispense Financial Summary
        </AppText>
        <AppText variant="caption" colorType="muted" style={{ marginBottom: 10 }}>
          Real-time trade value and margin calculation
        </AppText>

        <View style={styles.summaryRow}>
          <AppText variant="bodyMedium" colorType="muted">Total Dispensed Units:</AppText>
          <AppText variant="bodyMediumMedium" isMono colorType="primary">{totalDispensedUnits} units</AppText>
        </View>

        <View style={styles.summaryRow}>
          <AppText variant="bodyMedium" colorType="muted">Total Trade Price (TP):</AppText>
          <AppText variant="bodyMediumMedium" isMono colorType="primary">PKR {totalTP.toLocaleString()}</AppText>
        </View>

        <View style={styles.summaryRow}>
          <AppText variant="bodyMedium" colorType="muted">Total Retail Price (MRP):</AppText>
          <AppText variant="bodyMediumMedium" isMono colorType="primary">PKR {totalMRP.toLocaleString()}</AppText>
        </View>

        <View style={[styles.summaryDivider, { backgroundColor: colors.border?.subtle }]} />

        <View style={styles.summaryRow}>
          <AppText variant="bodyLargeMedium" colorType="primary">Gross Retail Margin:</AppText>
          <AppText variant="bodyLargeMedium" isMono colorType="success">PKR {grossMargin.toLocaleString()}</AppText>
        </View>
      </GlassCard>

      {/* PII Reward Card */}
      <GlassCard style={styles.card}>
        <View style={styles.rewardRow}>
          <MetricIconDisc variant="gold" size={40} marginRight={10}>
            <PointsStarIcon size={20} color={isDark ? colors.cta.sliderKnob : colors.brand.primaryDark} />
          </MetricIconDisc>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">
              Impact Rewards Earned
            </AppText>
            <AppText variant="caption" colorType="muted">
              <AppText variant="monoSmall" colorType="muted">+10</AppText> PII Points &{' '}
              <AppText variant="monoSmall" colorType="muted">+PKR 50</AppText> Wallet balance on confirmation
            </AppText>
          </View>
          <AppBadge label="+10 Pts" variant="accent" isMono={true} />
        </View>
      </GlassCard>

      <View style={{ height: spacing.md }} />

      <AppButton
        variant="primary"
        title="Confirm Prescription Dispense"
        loading={isSubmitting}
        onPress={handleConfirmDispense}
      />

      <View style={{ height: verticalScale(20) }} />

      {/* Ported OneRx 4-View SelectMedicineModal starting on View 1 (Select Medicine) */}
      <SelectMedicineModal
        visible={substituteModalVisible}
        onClose={() => setSubstituteModalVisible(false)}
        onSelectMedicine={handleSelectSubstitute}
        onNavigateSettings={() => navigation.navigate('Settings')}
        tabs={['Generic', 'Therapeutic Segment']}
      />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(6),
  },
  itemCard: {
    width: '100%',
    marginVertical: verticalScale(5),
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  substitutedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyBox: {
    width: scale(100),
    alignItems: 'flex-end',
  },
  qtyInput: {
    width: '100%',
    textAlign: 'center',
  },
  itemActions: {
    borderTopWidth: 1,
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
  },
  substituteBtn: {
    alignSelf: 'flex-start',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryDivider: {
    height: 1,
    marginVertical: verticalScale(8),
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DispenseConfirmationScreen;
