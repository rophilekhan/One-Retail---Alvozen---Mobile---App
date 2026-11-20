import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { verticalScale } from '../../theme/responsive.js';
import { AppModal, AppInput, AppButton } from '../core/index.js';

/**
 * CreatePoModal - Bottom sheet modal to draft a purchase order
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Function} props.onCreate
 */
export const CreatePoModal = ({ visible, onClose, onCreate }) => {
  const { spacing } = useTheme();
  const [distributorName, setDistributorName] = useState('Muller & Phipps Pakistan');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderAmount, setOrderAmount] = useState('14500');

  const handleSubmit = () => {
    onCreate({
      distributor: distributorName,
      totalAmount: Number(orderAmount) || 12000,
      notes: orderNotes,
    });
  };

  return (
    <AppModal
      visible={visible}
      type="bottomSheet"
      title="Draft New Purchase Order"
      onClose={onClose}
    >
      <View style={styles.modalBody}>
        <AppInput
          label="Distributor Name"
          value={distributorName}
          onChangeText={setDistributorName}
        />
        <AppInput
          label="Order Estimated Amount (PKR)"
          value={orderAmount}
          onChangeText={setOrderAmount}
          keyboardType="number-pad"
        />
        <AppInput
          label="Booking Notes / Delivery Window"
          placeholder="e.g. Urgent stock delivery before Friday"
          value={orderNotes}
          onChangeText={setOrderNotes}
        />
        <View style={{ height: spacing.md }} />
        <AppButton
          variant="primary"
          title="Submit Draft for Approval"
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

export default CreatePoModal;
