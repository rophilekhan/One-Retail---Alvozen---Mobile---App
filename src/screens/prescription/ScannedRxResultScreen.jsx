import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useDispenseStore } from '../../store/useDispenseStore.js';
import { ShieldCheckIcon } from '../../assets/vectors/index.js';
import {
  MedicationCard,
  BrandsModal,
  SelectMedicineModal,
  PharmacyMapView,
} from '../../components/prescription/index.js';

/**
 * ScannedRxResultScreen - Prescription Inspection & Stock Availability
 *
 * Direct 1:1 integration of OneRx Prescription Builder components:
 * - MedicationCard item cards with exact OneRx styling
 * - BrandsModal for Generic-ID mapped brands & unavailable alternate brands
 * - PharmacyMapView bottom sheet for live map & nearby stock availability
 * - SelectMedicineModal for substitution lookup
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const ScannedRxResultScreen = ({ navigation, route }) => {
  const { colors, spacing, isDark } = useTheme();
  const storeRx = useDispenseStore((s) => s.activePrescription);
  const scannedItems = useDispenseStore((s) => s.scannedItems);
  const rx = route?.params?.rxData || route?.params?.prescription || storeRx;
  const skuVisibilityEnabled = usePharmacyStore((s) => s.skuVisibilityEnabled);
  const { mapGenericToBrand, substituteBrand } = useDispenseStore();

  // Bottom Sheet States
  const [activeBrandModalItem, setActiveBrandModalItem] = useState(null);
  const [selectMedicineModalVisible, setSelectMedicineModalVisible] = useState(false);

  // Auto-open trigger on QR scan recognition
  useEffect(() => {
    const rxData = route?.params?.rxData || route?.params?.prescription || rx;
    if (!rxData?.items || rxData.items.length === 0) return;

    const isGenericQr = rxData.qrType === 'GENERIC' || rxData.qrType === 'GENERIC_ID_QR' || route?.params?.autoOpenGeneric;
    if (isGenericQr) {
      const genericItem = rxData.items.find((it) => (!it.brandName && it.genericName) || it.genericId) || rxData.items[0];
      if (genericItem) {
        setActiveBrandModalItem(genericItem);
        return;
      }
    }

    if (route?.params?.autoOpenUnavailable) {
      const unavailItem = rxData.items.find((it) => it.isAvailable === false) || rxData.items[0];
      if (unavailItem) {
        setActiveBrandModalItem(unavailItem);
      }
    }
  }, [rx, route?.params]);

  if (!rx) {
    return (
      <AppScreenContainer withAmbientGlow={true}>
        <AppHeader title="Scanned Prescription" onBack={() => navigation.goBack()} />
        <GlassCard style={styles.card}>
          <AppText variant="titleMedium" colorType="primary">
            No active prescription loaded
          </AppText>
          <AppButton
            variant="primary"
            title="Scan Prescription"
            onPress={() => navigation.replace('QRScanner')}
            style={{ marginTop: verticalScale(12) }}
          />
        </GlassCard>
      </AppScreenContainer>
    );
  }

  const itemsList = scannedItems && scannedItems.length > 0 ? scannedItems : (rx?.items || []);

  const handleOpenBrands = (item) => {
    setActiveBrandModalItem(item);
  };

  const handleSelectAlternateOrMappedBrand = (targetItem, selectedBrand) => {
    const item = targetItem || activeBrandModalItem;
    if (!item || !selectedBrand) return;

    const isGeneric = (!item.brandName && Boolean(item.genericName)) || Boolean(item.genericId);
    if (isGeneric) {
      mapGenericToBrand(item.id, selectedBrand);
    } else {
      substituteBrand(item.id, selectedBrand, 'Out of Stock');
    }

    setActiveBrandModalItem(null);
    setSelectMedicineModalVisible(false);

    AppToast.show({
      type: 'success',
      title: 'Brand Selected',
      message: `${selectedBrand.brandName || selectedBrand.name} selected for dispensing`,
    });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Prescription Details" onBack={() => navigation.goBack()} />

      {/* Prescription Metadata Card */}
      <GlassCard style={styles.card}>
        <View style={styles.rxHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.rxNumberRow}>
              <ShieldCheckIcon size={20} color={colors.brand?.primary} style={{ marginRight: 6 }} />
              <AppText variant="headlineSmall" colorType="primary">
                {rx?.prescriptionNumber || rx?.rxId || 'RX-99214'}
              </AppText>
            </View>
            <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
              {rx?.doctorName || 'Authorized Physician'} • Date: {rx?.date || 'Today'}
            </AppText>
          </View>
          <AppBadge label="Verified Digital Rx" variant="brand" />
        </View>

        <View
          style={[
            styles.patientBadgeWrap,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              borderColor: colors.border?.subtle,
            },
          ]}
        >
          <AppText variant="bodySmall" colorType="primary">
            Patient: <AppText variant="bodyMediumMedium" colorType="primary">{rx?.patientName || 'Patient'}</AppText> ({rx?.patientAge || 'Adult'})
          </AppText>
        </View>
      </GlassCard>

      {/* Items List Heading */}
      <AppText variant="titleMedium" colorType="primary" style={styles.sectionTitle}>
        Prescribed Items & Availability ({itemsList.length})
      </AppText>

      {/* Exact OneRx MedicationCard Item List */}
      {itemsList.map((item, index) => {
        const isGenericItem = (!item.brandName && Boolean(item.genericName)) || rx?.qrType === 'GENERIC';
        return (
          <MedicationCard
            key={item.id || index}
            index={index + 1}
            item={item}
            name={item.brandName || item.genericName}
            type={item.dosageForm || 'Tablet'}
            strength={item.strength || ''}
            medClass={item.genericName || ''}
            dosage={item.dosage || '1-0-1'}
            timing={item.timing || 'After Meal'}
            duration={item.duration || '7 days'}
            isAvailable={item.isAvailable !== false}
            tp={item.tp}
            mrp={item.mrp}
            activeScheme={item.activeScheme}
            onPressBrands={() => handleOpenBrands(item)}
            onPressCard={isGenericItem ? () => handleOpenBrands(item) : undefined}
          />
        );
      })}

      <View style={{ height: verticalScale(14) }} />

      {/* Proceed to Dispense Confirmation Button */}
      <AppButton
        variant="primary"
        title="Proceed to Dispense Confirmation"
        onPress={() => navigation.navigate('DispenseConfirmation')}
      />

      <View style={{ height: verticalScale(20) }} />

      {/* Exact OneRx BrandsModal (multi-step: Alternate Brands -> Nearby Medical Stores -> Map Location) */}
      <BrandsModal
        visible={Boolean(activeBrandModalItem)}
        onClose={() => setActiveBrandModalItem(null)}
        medicine={activeBrandModalItem || {}}
        onSelectBrand={(selectedBrand) => handleSelectAlternateOrMappedBrand(activeBrandModalItem, selectedBrand)}
        onNavigateSettings={() => navigation.navigate('Settings')}
      />

      {/* Exact OneRx SelectMedicineModal (with MedicineSearchView, MedicineBrandsView, PharmacyMapView) */}
      <SelectMedicineModal
        visible={selectMedicineModalVisible}
        onClose={() => setSelectMedicineModalVisible(false)}
        onSelectMedicine={(selectedBrand, med) => handleSelectAlternateOrMappedBrand(med || activeBrandModalItem, selectedBrand)}
        onNavigateSettings={() => navigation.navigate('Settings')}
      />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
  },
  rxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rxNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientBadgeWrap: {
    padding: scale(10),
    borderRadius: scale(8),
    borderWidth: 1,
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    marginTop: verticalScale(14),
    marginBottom: verticalScale(6),
  },
});

export default ScannedRxResultScreen;
