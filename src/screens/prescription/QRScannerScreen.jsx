import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppButton,
  AppInput,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { useDispenseStore } from '../../store/useDispenseStore.js';
import { PermissionGuard } from '../../components/common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';
import { QRScannerViewfinder } from '../../components/prescription/index.js';

/**
 * QRScannerScreen - Dual Mode Prescription Scanner
 * Mandated by ONERETAIL_PRD.md:
 * - Scan QR through Device Camera (for non-system pharmacies)
 * - Scan QR through Plug-in (for POS integrated / barcode scanners)
 * - Populates prescription items with generic mapping & nearby stock checks
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const QRScannerScreen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const [scanMode, setScanMode] = useState('DEVICE'); // 'DEVICE' | 'PLUGIN'
  const [pluginPayload, setPluginPayload] = useState('');
  const setScannedPrescription = useDispenseStore((s) => s.setScannedPrescription);

  const handleTriggerPrescriptionScan = (payloadText) => {
    // Grounded mock prescription complying with PRD:
    // Item 1: Prescribed by brand, available
    // Item 2: Prescribed by brand, out of stock (shows nearby pharmacies & alternate brands)
    // Item 3: Prescribed by Generic ID (shows mapped brands table with Brand - TP - MRP - Status - Scheme)
    const rxData = {
      id: 'rx_' + Date.now(),
      prescriptionNumber: payloadText ? 'RX-POS-' + Date.now().toString().slice(-5) : 'RX-99214',
      doctorName: 'Dr. Sarah Ahmed (FCPS Internal Medicine)',
      patientName: 'Ali Khan',
      patientAge: '34 Yrs',
      date: new Date().toLocaleDateString('en-GB'),
      items: [
        {
          id: 'item_1',
          brandName: 'Augmentin 625mg',
          genericName: 'Co-Amoxiclav',
          genericId: 'gen_coamox_625',
          dosageForm: 'Tablet',
          prescribedQuantity: 10,
          dispensedQuantity: 10,
          isAvailable: true,
          tp: 240,
          mrp: 280,
          activeScheme: '10+1 Free',
        },
        {
          id: 'item_2',
          brandName: 'Panadol Extra',
          genericName: 'Paracetamol + Caffeine',
          genericId: 'gen_para_caf',
          dosageForm: 'Tablet',
          prescribedQuantity: 20,
          dispensedQuantity: 0,
          isAvailable: false, // Out of stock -> Triggers Nearby Pharmacies & Alternates
          tp: 80,
          mrp: 95,
          activeScheme: null,
          alternateBrands: [
            { name: 'Disprin Extra', genericName: 'Paracetamol + Caffeine', tp: 75, mrp: 90, stock: 'In Stock' },
            { name: 'Calpol Plus', genericName: 'Paracetamol + Caffeine', tp: 80, mrp: 95, stock: 'In Stock' },
            { name: 'Febril Extra', genericName: 'Paracetamol + Caffeine', tp: 70, mrp: 85, stock: 'In Stock' },
          ],
          nearbyPharmacies: [
            { name: 'City Care Pharmacy', distanceKm: '0.4', stockUnits: 40, phone: '021-34567890' },
            { name: 'Al-Shifa Meds', distanceKm: '0.9', stockUnits: 25, phone: '021-34567891' },
            { name: 'Medix Express', distanceKm: '1.2', stockUnits: 18, phone: '021-34567892' },
          ],
        },
        {
          id: 'item_3',
          brandName: null, // Prescribed by generic name
          genericName: 'Omeprazole 20mg Capsule',
          genericId: 'gen_omeprazole_20',
          dosageForm: 'Capsule',
          prescribedQuantity: 14,
          dispensedQuantity: 14,
          isAvailable: true,
          mappedBrands: [
            { brandName: 'Risek 20mg', tp: 135, mrp: 160, isAvailable: true, activeScheme: '12+1 Bonus' },
            { brandName: 'Omega 20mg', tp: 120, mrp: 145, isAvailable: true, activeScheme: '5% Rebate' },
            { brandName: 'Omee 20mg', tp: 110, mrp: 130, isAvailable: false, activeScheme: null },
          ],
        },
      ],
    };

    setScannedPrescription(rxData);
    AppToast.show({
      title: 'Prescription Recognized',
      message: `${rxData.prescriptionNumber} loaded for ${rxData.patientName}`,
      type: 'success',
    });

    navigation.navigate('ScannedRxResult', { prescription: rxData });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Prescription QR Scanner" onBack={() => navigation.goBack()} />

      {/* Dual Mode Switcher */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setScanMode('DEVICE')}
          style={[
            styles.modeTab,
            scanMode === 'DEVICE' && { backgroundColor: colors.brand?.primary },
          ]}
        >
          <AppText
            variant="bodyMediumMedium"
            colorType={scanMode === 'DEVICE' ? 'inverse' : 'muted'}
          >
            Device Camera
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setScanMode('PLUGIN')}
          style={[
            styles.modeTab,
            scanMode === 'PLUGIN' && { backgroundColor: colors.brand?.primary },
          ]}
        >
          <AppText
            variant="bodyMediumMedium"
            colorType={scanMode === 'PLUGIN' ? 'inverse' : 'muted'}
          >
            Plug-in / POS Scanner
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Mode 1: Device Camera Mode */}
      {scanMode === 'DEVICE' ? (
        <PermissionGuard
          permission={PERMISSIONS.SCAN_QR_DEVICE}
          fallback={
            <GlassCard style={styles.card}>
              <AppText variant="titleMedium" colorType="primary">Access Restricted</AppText>
              <AppText variant="bodySmall" colorType="muted" style={{ marginVertical: 8 }}>
                Your staff profile does not have permission to scan QR through device camera.
              </AppText>
            </GlassCard>
          }
        >
          <View style={styles.scannerWrapper}>
            <QRScannerViewfinder instructionText="Center the QR code from the digital prescription within the frame" />

            <View style={{ height: verticalScale(14) }} />
            <AppButton
              variant="primary"
              title="Scan Patient Prescription QR"
              onPress={() => handleTriggerPrescriptionScan()}
            />
          </View>
        </PermissionGuard>
      ) : (
        /* Mode 2: Plug-in / Desktop POS Scanner Mode */
        <PermissionGuard
          permission={PERMISSIONS.SCAN_QR_PLUGIN}
          fallback={
            <GlassCard style={styles.card}>
              <AppText variant="titleMedium" colorType="primary">Access Restricted</AppText>
              <AppText variant="bodySmall" colorType="muted" style={{ marginVertical: 8 }}>
                Your staff profile does not have permission to scan QR through the desktop plug-in.
              </AppText>
            </GlassCard>
          }
        >
          <View style={styles.scannerWrapper}>
            <GlassCard style={styles.card}>
              <View style={styles.pluginHeader}>
                <View style={[styles.statusDot, { backgroundColor: colors.status?.success || '#00C853' }]} />
                <AppText variant="titleMedium" colorType="primary" style={{ marginLeft: 8 }}>
                  Desktop POS Plug-in Connected
                </AppText>
              </View>
              <AppText variant="caption" colorType="muted" style={{ marginVertical: 8 }}>
                Desktop 2D Barcode scanner linked via OneRetail Local Bridge (COM3 / WebHook).
                Trigger a scan from your physical scanner or enter payload below.
              </AppText>

              <AppInput
                label="Scanned QR Payload String"
                placeholder="e.g. ALVOZEN-RX://99214|GEN-COAMOX-625|2026"
                value={pluginPayload}
                onChangeText={setPluginPayload}
              />

              <View style={{ height: spacing.md }} />
              <AppButton
                variant="primary"
                title="Process Plug-in Scanned Rx"
                onPress={() => handleTriggerPrescriptionScan(pluginPayload)}
              />
            </GlassCard>
          </View>
        </PermissionGuard>
      )}
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(14),
    padding: scale(4),
    marginVertical: verticalScale(8),
  },
  modeTab: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    borderRadius: scale(10),
  },
  scannerWrapper: {
    marginVertical: verticalScale(8),
  },
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
  },
  pluginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default QRScannerScreen;
