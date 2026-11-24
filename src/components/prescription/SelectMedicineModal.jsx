import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { verticalScale } from '../../theme/responsive.js';
import { AppModal } from '../global/index.js';

import { MedicineSearchView } from './MedicineSearchView.jsx';
import { MedicineBrandsView } from './MedicineBrandsView.jsx';
import { PharmacyMapView } from './PharmacyMapView.jsx';

export const SelectMedicineModal = ({
  visible,
  onClose,
  addedMedicines = [],
  onSelectMedicine,
  onNavigateSettings,
  tabs = ['Generic', 'Therapeutic Segment', 'Brand'],
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [viewState, setViewState] = useState('SEARCH');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const handleClose = () => {
    setViewState('SEARCH');
    setSelectedMedicine(null);
    onClose?.();
  };

  const handleSetViewState = (newState, data = null) => {
    if (newState === 'BRANDS' && data) {
      setSelectedMedicine(data);
    }
    setViewState(newState);
  };

  const handleSelectBrand = (brand, contextMed) => {
    handleClose();
    onSelectMedicine?.(brand, contextMed);
  };

  const isCompactModal = viewState === 'PHARMACIES' || viewState === 'PHARMACY_MAP' || viewState === 'BRANDS';

  return (
    <AppModal
      visible={visible}
      onClose={handleClose}
      type="bottomSheet"
      style={{
        maxHeight: '92%',
        backgroundColor: isDark ? '#000000' : '#F8F9FA',
      }}
    >
      <View style={styles.container}>
        {viewState === 'SEARCH' && (
          <MedicineSearchView
            addedMedicines={addedMedicines}
            onClose={handleClose}
            onSetViewState={handleSetViewState}
            onSelectMedicine={handleSelectBrand}
            tabs={tabs}
          />
        )}
        {viewState === 'BRANDS' && (
          <MedicineBrandsView
            medicine={selectedMedicine}
            onClose={handleClose}
            onSetViewState={handleSetViewState}
            onSelectBrand={handleSelectBrand}
          />
        )}
        {(viewState === 'PHARMACIES' || viewState === 'PHARMACY_MAP') && (
          <PharmacyMapView
            viewState={viewState}
            selectedPharmacy={selectedPharmacy}
            setSelectedPharmacy={setSelectedPharmacy}
            onClose={handleClose}
            onSetViewState={handleSetViewState}
            onNavigateSettings={onNavigateSettings}
          />
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default SelectMedicineModal;
