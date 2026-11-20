import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AppModal,
  AppText,
  AppButton,
  AppInput,
  AppCheckbox,
  AppBadge,
  AppToast,
} from '../components/core/index.js';
import { useDispenseStore } from '../store/useDispenseStore.js';
import { useStaffStore, PERMISSIONS } from '../store/useStaffStore.js';
import { useTheme } from '../theme/index.js';

/**
 * 1. QRScannerModal
 * Prescription QR scanner triggered via center FAB
 */
export const QRScannerModal = ({ navigation }) => {
  const setScannedPrescription = useDispenseStore((s) => s.setScannedPrescription);
  const { spacing } = useTheme();

  const handleSimulateScan = () => {
    // Mock prescription scan payload
    setScannedPrescription({
      id: 'rx_1001',
      prescriptionNumber: 'RX-99214',
      doctorName: 'Dr. Sarah Ahmed',
      patientName: 'Ali Khan',
      date: new Date().toISOString(),
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
          dispensedQuantity: 20,
          isAvailable: false,
          tp: 80,
          mrp: 95,
        },
      ],
    });

    AppToast.show({
      title: 'Prescription Scanned',
      message: 'Prescription RX-99214 loaded successfully.',
      type: 'success',
    });

    navigation.replace('DispenseConfirmModal');
  };

  return (
    <AppModal
      visible={true}
      type="bottomSheet"
      title="Prescription QR Scanner"
      onClose={() => navigation.goBack()}
    >
      <View style={styles.modalContent}>
        <AppText variant="bodyMedium" colorType="muted" style={{ marginBottom: 16 }}>
          Align the QR code printed on the patient prescription inside the camera frame.
        </AppText>

        <AppButton
          variant="primary"
          title="Simulate Scan Prescription"
          onPress={handleSimulateScan}
        />
        <View style={{ height: spacing.sm }} />
        <AppButton
          variant="ghost"
          title="Cancel"
          onPress={() => navigation.goBack()}
        />
      </View>
    </AppModal>
  );
};

/**
 * 2. DispenseConfirmModal
 * Prompts user to verify/enter dispensed quantities and substitute brands if needed
 */
export const DispenseConfirmModal = ({ navigation }) => {
  const { scannedItems, updateDispensedQuantity, clearDispenseSession } = useDispenseStore();
  const { spacing } = useTheme();

  const handleConfirmDispense = () => {
    AppToast.show({
      title: 'Dispense Recorded',
      message: 'Prescription dispense confirmed and recorded.',
      type: 'success',
    });
    clearDispenseSession();
    navigation.goBack();
  };

  return (
    <AppModal
      visible={true}
      type="bottomSheet"
      title="Dispense Confirmation"
      scrollable={true}
      onClose={() => navigation.goBack()}
    >
      <View style={styles.modalContent}>
        <AppText variant="caption" colorType="muted" style={{ marginBottom: 12 }}>
          Verify dispensed quantity against each prescribed item:
        </AppText>

        {scannedItems.map((item) => (
          <View key={item.id} style={styles.dispenseItem}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMediumMedium" colorType="primary">
                {item.substitutedBrand ? item.substitutedBrand.name : item.brandName}
              </AppText>
              <AppText variant="caption" colorType="muted">
                {item.genericName} • Prescribed: {item.prescribedQuantity}
              </AppText>
              {item.substitutedBrand && (
                <AppBadge label="Substituted" variant="accent" style={{ marginTop: 4 }} />
              )}
            </View>

            <View style={styles.qtyContainer}>
              <AppInput
                value={String(item.dispensedQuantity)}
                onChangeText={(val) => updateDispensedQuantity(item.id, val)}
                keyboardType="number-pad"
                style={{ width: 80, marginVertical: 0 }}
              />
            </View>

            {!item.isAvailable && !item.substitutedBrand && (
              <AppButton
                variant="outline"
                size="xs"
                title="Substitute"
                style={{ marginLeft: 8 }}
                onPress={() => navigation.navigate('SubstitutePickerModal', { itemId: item.id })}
              />
            )}
          </View>
        ))}

        <View style={{ height: spacing.md }} />
        <AppButton
          variant="primary"
          title="Confirm Dispense"
          onPress={handleConfirmDispense}
        />
      </View>
    </AppModal>
  );
};

/**
 * 3. SubstitutePickerModal
 * View alternate brands of the same generic
 */
export const SubstitutePickerModal = ({ navigation, route }) => {
  const itemId = route?.params?.itemId;
  const substituteBrand = useDispenseStore((s) => s.substituteBrand);

  const substitutes = [
    { name: 'Disprin Extra', mrp: 90, tp: 75, stock: 'Available' },
    { name: 'Calpol Plus', mrp: 95, tp: 80, stock: 'Available' },
  ];

  const handleSelect = (sub) => {
    substituteBrand(itemId, sub, 'Selected Alternate Brand');
    AppToast.show({
      title: 'Substitute Selected',
      message: `Substituted with ${sub.name}`,
      type: 'info',
    });
    navigation.goBack();
  };

  return (
    <AppModal
      visible={true}
      type="bottomSheet"
      title="Select Alternate Brand"
      onClose={() => navigation.goBack()}
    >
      <View style={styles.modalContent}>
        <AppText variant="caption" colorType="muted" style={{ marginBottom: 12 }}>
          Alternative brands for this Generic & Therapeutic segment:
        </AppText>

        {substitutes.map((sub, idx) => (
          <View key={idx} style={styles.subItemRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMediumMedium" colorType="primary">{sub.name}</AppText>
              <AppText variant="caption" colorType="muted">
                MRP: PKR {sub.mrp} • TP: PKR {sub.tp}
              </AppText>
            </View>
            <AppButton
              variant="secondary"
              size="xs"
              title="Select"
              onPress={() => handleSelect(sub)}
            />
          </View>
        ))}
      </View>
    </AppModal>
  );
};

/**
 * 4. StaffCreateModal
 * Staff Profile Creator with RBAC Permission Checkboxes
 */
export const StaffCreateModal = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState({
    [PERMISSIONS.SCAN_QR_DEVICE]: true,
    [PERMISSIONS.SCAN_QR_PLUGIN]: false,
    [PERMISSIONS.PO_INITIATOR]: false,
    [PERMISSIONS.PO_APPROVER]: false,
    [PERMISSIONS.EXPIRY_INITIATOR]: false,
    [PERMISSIONS.EXPIRY_APPROVER]: false,
    [PERMISSIONS.UPLOAD_CLOSING_DATA]: false,
  });

  const addStaff = useStaffStore((s) => s.addStaff);

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveStaff = () => {
    if (!username || !password) {
      AppToast.show({
        title: 'Validation Error',
        message: 'Username and password are required.',
        type: 'warning',
      });
      return;
    }

    const granted = Object.keys(permissions).filter((k) => permissions[k]);
    addStaff({
      id: 'staff_' + Date.now(),
      username,
      role: 'STAFF',
      allowedPermissions: granted,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    AppToast.show({
      title: 'Staff Profile Created',
      message: `Profile created for @${username}`,
      type: 'success',
    });
    navigation.goBack();
  };

  return (
    <AppModal
      visible={true}
      type="bottomSheet"
      title="Create Staff Profile"
      scrollable={true}
      onClose={() => navigation.goBack()}
    >
      <View style={styles.modalContent}>
        <AppInput
          label="Username"
          placeholder="e.g. staff_ali"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <AppInput
          label="Temporary Password"
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <AppText variant="titleMedium" colorType="primary" style={{ marginTop: 12, marginBottom: 8 }}>
          Allowed Access Permissions
        </AppText>

        {[
          { key: PERMISSIONS.SCAN_QR_DEVICE, label: 'Scan QR through device' },
          { key: PERMISSIONS.SCAN_QR_PLUGIN, label: 'Scan QR through Plug-in' },
          { key: PERMISSIONS.PO_INITIATOR, label: 'Purchase Order Initiator' },
          { key: PERMISSIONS.PO_APPROVER, label: 'Purchase Order Approver' },
          { key: PERMISSIONS.EXPIRY_INITIATOR, label: 'Expiry Initiator' },
          { key: PERMISSIONS.EXPIRY_APPROVER, label: 'Expiry Approver' },
          { key: PERMISSIONS.UPLOAD_CLOSING_DATA, label: 'Upload Closing Data' },
        ].map((perm) => (
          <View key={perm.key} style={styles.permissionRow}>
            <AppCheckbox
              checked={permissions[perm.key]}
              onChange={() => togglePermission(perm.key)}
              label={perm.label}
            />
          </View>
        ))}

        <View style={{ height: 16 }} />
        <AppButton
          variant="primary"
          title="Save Staff Profile"
          onPress={handleSaveStaff}
        />
      </View>
    </AppModal>
  );
};

export default {
  QRScannerModal,
  DispenseConfirmModal,
  SubstitutePickerModal,
  StaffCreateModal,
};
