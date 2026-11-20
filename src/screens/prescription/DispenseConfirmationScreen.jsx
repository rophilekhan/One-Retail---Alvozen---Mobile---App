import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  AppInput,
  AppToast,
  MetricIconDisc,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { useDispenseStore } from '../../store/useDispenseStore.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { SubstituteSearchModal } from './SubstituteSearchModal.jsx';

/**
 * DispenseConfirmationScreen - Non-Integrated Dispense & SKU Input
 * Mandated by ONERETAIL_PRD.md:
 * - Enter quantity dispensed against each SKU
 * - If a Brand is substituted, search and select substitute Brand & quantity
 * - Real-time calculation of TP, MRP, Margin, and PII points award
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const DispenseConfirmationScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const { scannedItems, updateDispensedQuantity, substituteBrand, clearDispenseSession, activePrescription } =
    useDispenseStore();
  const { updatePii, piiScore, walletBalance } = usePharmacyStore();

  const [activeSubstituteItemId, setActiveSubstituteItemId] = useState(null);
  const [substituteModalVisible, setSubstituteModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelectSubstitute = (subBrand, reason) => {
    if (activeSubstituteItemId) {
      substituteBrand(activeSubstituteItemId, subBrand, reason);
      AppToast.show({
        title: 'Brand Substituted',
        message: `Substituted with ${subBrand.name} (${reason})`,
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
              Rx: {activePrescription?.prescriptionNumber || 'RX-99214'}
            </AppText>
            <AppText variant="caption" colorType="muted">
              Patient: {activePrescription?.patientName || 'Ali Khan'} • Non-Integrated POS Mode
            </AppText>
          </View>
          <AppBadge label="+10 Pts" variant="accent" />
        </View>
        <AppText variant="caption" colorType="muted" style={{ marginTop: 8 }}>
          Verify and input exact dispensed quantities for each prescribed item below:
        </AppText>
      </GlassCard>

      {/* Scanned Items Dispense List */}
      <AppText variant="titleMedium" colorType="primary" style={styles.sectionTitle}>
        Prescribed SKUs ({scannedItems.length})
      </AppText>

      {scannedItems.map((item) => {
        const isSubstituted = Boolean(item.substitutedBrand);
        const displayName = isSubstituted
          ? item.substitutedBrand.name
          : item.brandName || item.genericName;

        return (
          <GlassCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemTopRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <AppText variant="bodyLargeMedium" colorType="primary">
                  {displayName}
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Generic: {item.genericName}
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Prescribed Qty: <AppText variant="caption" colorType="brand">{item.prescribedQuantity}</AppText>
                </AppText>

                {isSubstituted && (
                  <View style={{ marginTop: 4 }}>
                    <AppBadge
                      label={`Substituted (${item.substituteReason || 'Out of Stock'})`}
                      variant="accent"
                      size="sm"
                    />
                  </View>
                )}
              </View>

              {/* Quantity Input for Non-Integrated POS */}
              <View style={styles.qtyBox}>
                <AppText variant="caption" colorType="muted" style={{ marginBottom: 2 }}>
                  Dispensed Qty
                </AppText>
                <AppInput
                  value={String(item.dispensedQuantity || 0)}
                  onChangeText={(val) => updateDispensedQuantity(item.id, val)}
                  keyboardType="number-pad"
                  style={styles.qtyInput}
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
                  {isSubstituted ? 'Change Substitute Brand' : 'Substitute Alternative Brand &gt;'}
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
          <AppText variant="bodyMediumMedium" colorType="primary">{totalDispensedUnits} units</AppText>
        </View>

        <View style={styles.summaryRow}>
          <AppText variant="bodyMedium" colorType="muted">Total Trade Price (TP):</AppText>
          <AppText variant="bodyMediumMedium" colorType="primary">PKR {totalTP.toLocaleString()}</AppText>
        </View>

        <View style={styles.summaryRow}>
          <AppText variant="bodyMedium" colorType="muted">Total Retail Price (MRP):</AppText>
          <AppText variant="bodyMediumMedium" colorType="primary">PKR {totalMRP.toLocaleString()}</AppText>
        </View>

        <View style={[styles.summaryRow, styles.marginRow, { borderTopColor: colors.border?.subtle }]}>
          <AppText variant="titleMedium" colorType="brand">Pharmacy Margin:</AppText>
          <AppText variant="titleMedium" colorType="brand">PKR {grossMargin.toLocaleString()}</AppText>
        </View>
      </GlassCard>

      <View style={{ height: spacing.md }} />

      {/* Confirm Button */}
      <AppButton
        variant="primary"
        title="Confirm & Log Dispense"
        loading={isSubmitting}
        onPress={handleConfirmDispense}
      />

      <View style={{ height: verticalScale(20) }} />

      {/* Substitute Search Modal */}
      <SubstituteSearchModal
        visible={substituteModalVisible}
        onClose={() => setSubstituteModalVisible(false)}
        onSelectSubstitute={handleSelectSubstitute}
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
    marginBottom: verticalScale(4),
  },
  itemCard: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyBox: {
    width: scale(90),
    alignItems: 'flex-end',
  },
  qtyInput: {
    marginVertical: 0,
    width: '100%',
    textAlign: 'center',
  },
  itemActions: {
    borderTopWidth: 1,
    marginTop: verticalScale(8),
    paddingTop: verticalScale(6),
  },
  substituteBtn: {
    paddingVertical: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  marginRow: {
    borderTopWidth: 1,
    marginTop: verticalScale(6),
    paddingTop: verticalScale(8),
  },
});

export default DispenseConfirmationScreen;