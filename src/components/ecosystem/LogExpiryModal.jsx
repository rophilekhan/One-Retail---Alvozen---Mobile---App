import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { verticalScale } from '../../theme/responsive.js';
import { AppModal, AppInput, AppButton } from '../core/index.js';

/**
 * LogExpiryModal - Bottom sheet modal to log near-expiry medicines
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Function} props.onLog
 */
export const LogExpiryModal = ({ visible, onClose, onLog }) => {
  const { spacing } = useTheme();
  const [expiryBrand, setExpiryBrand] = useState('Augmentin 625mg');
  const [expiryBatch, setExpiryBatch] = useState('AG-99120');
  const [expiryUnits, setExpiryUnits] = useState('15');

  const handleSubmit = () => {
    onLog({
      brandName: expiryBrand,
      batchNo: expiryBatch,
      units: Number(expiryUnits) || 10,
    });
  };

  return (
    <AppModal
      visible={visible}
      type="bottomSheet"
      title="Log Near-Expiry Medicines"
      onClose={onClose}
    >
      <View style={styles.modalBody}>
        <AppInput
          label="Brand Name"
          value={expiryBrand}
          onChangeText={setExpiryBrand}
        />
        <AppInput
          label="Batch Number"
          value={expiryBatch}
          onChangeText={setExpiryBatch}
        />
        <AppInput
          label="Units to Return"
          value={expiryUnits}
          onChangeText={setExpiryUnits}
          keyboardType="number-pad"
        />
        <View style={{ height: spacing.md }} />
        <AppButton
          variant="primary"
          title="Log Expiry Batch"
          onPress={handleSubmit}
        />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    paddingBottom: verticalScale(16),
  },
});

export default LogExpiryModal;
