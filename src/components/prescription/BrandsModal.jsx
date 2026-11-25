import React from 'react';
import { SelectMedicineModal } from './SelectMedicineModal.jsx';

/**
 * BrandsModal
 * Exact OneRx 4-view prescription bottom sheet entry point for ScannedRxResultScreen.
 * Delegates to SelectMedicineModal (single native <Modal>, explicit 84% sheetHeight,
 * top drag handle pill above sheet top edge, smooth translateY slide to 0) starting
 * directly on View 4 ('BRANDS') or View 2 ('PHARMACIES') for the selected medicine.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Object} [props.medicine]
 * @param {Function} [props.onSelectBrand]
 * @param {Function} [props.onNavigateSettings]
 * @param {'SEARCH' | 'BRANDS' | 'PHARMACIES' | 'PHARMACY_MAP'} [props.initialViewState='BRANDS']
 */
export const BrandsModal = ({
  visible,
  onClose,
  medicine = {},
  onSelectBrand,
  onNavigateSettings,
  initialViewState = 'BRANDS',
}) => {
  return (
    <SelectMedicineModal
      visible={visible}
      onClose={onClose}
      initialViewState={initialViewState}
      initialMedicine={medicine}
      onSelectMedicine={onSelectBrand}
      onNavigateSettings={onNavigateSettings}
      searchTitle="Alternative & Nearby Stock"
      tabs={['Generic', 'Therapeutic Segment']}
    />
  );
};

export default BrandsModal;
