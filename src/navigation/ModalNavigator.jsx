import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AppModal,
  AppText,
  AppButton,
  AppInput,
  AppCheckbox,
  AppBadge,
  AppToast,
} from '../components/core/index.js';
import {
  WithdrawMethodOptionCard,
  WITHDRAW_OPTIONS,
} from '../components/wallet/index.js';
import { useDispenseStore } from '../store/useDispenseStore.js';
import { useStaffStore, PERMISSIONS } from '../store/useStaffStore.js';
import { usePharmacyStore } from '../store/usePharmacyStore.js';
import { useTheme } from '../theme/index.js';
import { scale, verticalScale } from '../theme/responsive.js';
import { SubstituteSearchModal } from '../screens/prescription/SubstituteSearchModal.jsx';

/**
 * 1. SubstituteSearchModalScreen
 * Transparent modal screen wrapper for DRAP Generic/Segment substitute search
 */
export const SubstituteSearchModalScreen = ({ navigation, route }) => {
  const initialGeneric = route?.params?.initialGeneric || '';
  const onSelectSubstitute = route?.params?.onSelectSubstitute;

  return (
    <SubstituteSearchModal
      visible={true}
      initialGeneric={initialGeneric}
      onClose={() => navigation.goBack()}
      onSelectSubstitute={(sub, reason) => {
        if (typeof onSelectSubstitute === 'function') {
          onSelectSubstitute(sub, reason);
        }
        navigation.goBack();
      }}
    />
  );
};

/**
 * 2. CashoutWithdrawModalScreen
 * Transparent modal screen for wallet withdrawal via EasyPaisa, JazzCash, or Bank Transfer
 */
export const CashoutWithdrawModalScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const walletBalance = usePharmacyStore((s) => s.walletBalance) || 48500;
  const updatePii = usePharmacyStore((s) => s.updatePii);
  const addPaymentHistoryRecord = usePharmacyStore((s) => s.addPaymentHistoryRecord);

  const [channel, setChannel] = useState('EASYPAISA'); // 'EASYPAISA' | 'JAZZCASH' | 'BANK'
  const [amount, setAmount] = useState('10000');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bankName, setBankName] = useState('Meezan Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minRequired = channel === 'BANK' ? 2500 : 500;

  const handleSubmit = () => {
    const numAmt = Number(amount);
    if (!numAmt || numAmt < minRequired || numAmt > walletBalance) {
      AppToast.show({
        title: 'Invalid Amount',
        message: `Please enter an amount between PKR ${minRequired.toLocaleString()} and PKR ${walletBalance.toLocaleString()}.`,
        type: 'warning',
      });
      return;
    }

    if (!accountNumber.trim() || !accountTitle.trim()) {
      AppToast.show({
        title: 'Required Fields',
        message: 'Please provide account title and account number.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      updatePii({
        walletBalance: walletBalance - numAmt,
        pendingCashout: numAmt,
      });
      if (typeof addPaymentHistoryRecord === 'function') {
        addPaymentHistoryRecord({
          id: 'pay_' + Date.now(),
          amount: numAmt,
          channel,
          accountNumber,
          date: new Date().toISOString(),
          status: 'PENDING',
        });
      }
      AppToast.show({
        title: 'Withdrawal Queued',
        message: `PKR ${numAmt.toLocaleString()} queued via ${channel}. Tax documentation generated.`,
        type: 'success',
      });
      navigation.goBack();
    }, 600);
  };

  return (
    <AppModal
      visible={true}
      type="bottomSheet"
      title="Request Cashout"
      scrollable={true}
      onClose={() => navigation.goBack()}
    >
      <View style={styles.modalContent}>
        <AppText variant="caption" colorType="muted" style={{ marginBottom: 12 }}>
          Available:{' '}
          <AppText variant="monoSmall" colorType="brand">
            PKR {walletBalance.toLocaleString()}
          </AppText>
          {' '}• Min:{' '}
          <AppText variant="monoSmall" colorType="brand">
            PKR {minRequired.toLocaleString()}
          </AppText>
          {' '}(WHT 1%)
        </AppText>

        <View style={styles.channelsStack}>
          {WITHDRAW_OPTIONS.map((opt) => (
            <WithdrawMethodOptionCard
              key={opt.id}
              option={opt}
              isSelected={channel === opt.channelKey}
              onPress={(selectedOpt) => setChannel(selectedOpt.channelKey)}
            />
          ))}
        </View>

        <AppInput
          label="Withdrawal Amount (PKR)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          isMono={true}
        />

        {channel === 'BANK' && (
          <AppInput
            label="Bank Name"
            value={bankName}
            onChangeText={setBankName}
            placeholder="e.g. Meezan Bank, HBL, Bank Alfalah"
          />
        )}

        <AppInput
          label={channel === 'BANK' ? 'Account Number / IBAN' : 'Mobile Account Number'}
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="number-pad"
          placeholder={channel === 'BANK' ? 'PK00MEZN0000000000000000' : '03001234567'}
          isMono={true}
        />

        <AppInput
          label="Account Title / Beneficiary Name"
          value={accountTitle}
          onChangeText={setAccountTitle}
          placeholder="e.g. Ali Khan / City Meds Pharmacy"
        />

        <View style={{ height: verticalScale(12) }} />
        <AppButton
          variant="primary"
          title={isSubmitting ? 'Processing...' : 'Confirm Cashout'}
          loading={isSubmitting}
          onPress={handleSubmit}
        />
      </View>
    </AppModal>
  );
};

/**
 * 3. QRScannerModal
 * Prescription QR scanner triggered via center FAB
 */
export const QRScannerModal = ({ navigation }) => {
  const setScannedPrescription = useDispenseStore((s) => s.setScannedPrescription);
  const { spacing } = useTheme();

  const handleSimulateScan = () => {
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
 * 4. DispenseConfirmModal
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
 * 5. SubstitutePickerModal
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
 * 6. StaffCreateModal
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

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: verticalScale(16),
  },
  channelsStack: {
    marginBottom: verticalScale(12),
    gap: verticalScale(8),
  },
  dispenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  qtyContainer: {
    marginHorizontal: scale(8),
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  permissionRow: {
    marginVertical: verticalScale(4),
  },
});

export default {
  SubstituteSearchModalScreen,
  CashoutWithdrawModalScreen,
  QRScannerModal,
  DispenseConfirmModal,
  SubstitutePickerModal,
  StaffCreateModal,
};
