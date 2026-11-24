import React from 'react';
import { PharmacyLocationPickerModal } from './PharmacyLocationPickerModal.jsx';

/**
 * LocationPickerModal
 * Backwards-compatible wrapper delegating to PharmacyLocationPickerModal.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Function} props.onAddLocation
 * @param {string} [props.selectedAddress]
 * @param {Object} [props.selectedCoordinates]
 */
export const LocationPickerModal = (props) => {
  return <PharmacyLocationPickerModal {...props} />;
};

export default LocationPickerModal;
