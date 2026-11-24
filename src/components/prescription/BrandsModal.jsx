import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale } from '../../theme/responsive.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { AppText, AppModal, AppBackButton } from '../core/index.js';
import { useTheme } from '../../theme/index.js';
import { MedicineBrandsView } from './MedicineBrandsView.jsx';
import { PharmacyMapView } from './PharmacyMapView.jsx';

/**
 * BrandsModal
 * Exact OneRx multi-step bottom sheet:
 * - Step 1 ('brands'): Alternate / Mapped Brands list (MedicineBrandsView)
 * - Step 2 ('stores'): Nearby Medical Stores list (PharmacyMapView 'PHARMACIES')
 * - Step 3 ('map'): Selected Medical Store location on Google Map (PharmacyMapView 'PHARMACY_MAP')
 *
 * Controlled with LEFT-side <AppBackButton /> and NO right-side cross X button!
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Object} props.medicine
 * @param {Function} props.onSelectBrand
 * @param {Function} [props.onNavigateSettings]
 */
export const BrandsModal = ({
  visible,
  onClose,
  medicine = {},
  onSelectBrand,
  onNavigateSettings,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState('brands'); // 'brands' | 'stores' | 'map'
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    if (visible) {
      setStep('brands');
      setSelectedPharmacy(null);
      setSelectedBrand(null);
    }
  }, [visible]);

  const handleClose = () => {
    setStep('brands');
    setSelectedPharmacy(null);
    setSelectedBrand(null);
    onClose?.();
  };

  const handleSelectBrand = (brand) => {
    onSelectBrand?.(brand, medicine);
    handleClose();
  };

  const activeMed = selectedBrand || medicine;
  const displayName = activeMed?.brandName || activeMed?.name || activeMed?.genericName
    ? `${activeMed.brandName || activeMed.name || activeMed.genericName} ${activeMed.strength || ''}`.trim()
    : 'Metformin 500mg';
  const displaySubtitle = activeMed?.genericName || activeMed?.use || activeMed?.genericId || activeMed?.medClass || 'Diabetes management';

  return (
    <AppModal
      visible={visible}
      onClose={handleClose}
      type="bottomSheet"
      showBackButton={false}
      showCloseButton={false}
      scrollable={false}
      style={{
        maxHeight: '92%',
        backgroundColor: colors.surface?.sheet || (isDark ? '#020202' : '#FFFFFF'),
        padding: spacing?.cardPadding || scale(16),
      }}
    >
      <View style={styles.viewContainer}>
        {/* Step 1: Alternate / Mapped Brands View */}
        {step === 'brands' && (
          <View style={styles.innerContainer}>
            {/* Header: LEFT Back Button, NO right-side cross X */}
            <View style={styles.header}>
              <AppBackButton
                onPress={handleClose}
                size={scale(36)}
                style={styles.backBtn}
              />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
                  {displayName}
                </AppText>
                <AppText style={[styles.headerSubtitle, { color: colors.text.brandCompany || colors.text.secondary }]}>
                  {displaySubtitle}
                </AppText>
              </View>
            </View>

            <MedicineBrandsView
              medicine={medicine}
              hideHeader={true}
              onSelectBrand={handleSelectBrand}
              onPressAvailableStores={(brand) => {
                setSelectedBrand(brand);
                setStep('stores');
              }}
              onSetViewState={(nextState, brand) => {
                if (brand) setSelectedBrand(brand);
                if (nextState === 'stores' || nextState === 'PHARMACIES') {
                  setStep('stores');
                } else if (nextState === 'map' || nextState === 'PHARMACY_MAP') {
                  setStep('map');
                } else {
                  setStep('brands');
                }
              }}
              onClose={handleClose}
            />

            <TouchableOpacity
              style={[
                styles.footerCloseBtn,
                {
                  borderColor: colors.border.modalCloseBtn || colors.border.subtle,
                  backgroundColor: colors.surface.modalCloseBtnBg || (isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF'),
                },
              ]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <AppText style={[styles.closeBtnText, { color: colors.text.modalCloseBtn || colors.brand?.primary }]}>
                Close
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Nearby Medical Stores List */}
        {step === 'stores' && (
          <View style={styles.innerContainer}>
            {/* Header: LEFT Back Button returns to 'brands' */}
            <View style={styles.header}>
              <AppBackButton
                onPress={() => setStep('brands')}
                size={scale(36)}
                style={styles.backBtn}
              />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
                  Nearby Brand Availability
                </AppText>
                <AppText style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                  {`${selectedBrand?.brandName || selectedBrand?.name || displayName} • Nearby Pharmacies`}
                </AppText>
              </View>
            </View>

            <PharmacyMapView
              viewState="PHARMACIES"
              hideHeader={true}
              selectedPharmacy={selectedPharmacy}
              setSelectedPharmacy={setSelectedPharmacy}
              onSetViewState={(nextState, pharma) => {
                if (pharma) setSelectedPharmacy(pharma);
                if (nextState === 'map' || nextState === 'PHARMACY_MAP') {
                  setStep('map');
                } else if (nextState === 'brands' || nextState === 'BRANDS') {
                  setStep('brands');
                }
              }}
              medicine={selectedBrand || medicine}
              onNavigateSettings={onNavigateSettings}
              onClose={handleClose}
            />
          </View>
        )}

        {/* Step 3: Google Map Store Location */}
        {step === 'map' && (
          <View style={styles.innerContainer}>
            {/* Header: LEFT Back Button returns to 'stores' */}
            <View style={styles.header}>
              <AppBackButton
                onPress={() => setStep('stores')}
                size={scale(36)}
                style={styles.backBtn}
              />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
                  {selectedPharmacy?.name || 'Medical Store Location'}
                </AppText>
                <AppText style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                  {`${selectedPharmacy?.distance || '0.4 km'} • ${selectedPharmacy?.status || 'In Stock'}`}
                </AppText>
              </View>
            </View>

            <PharmacyMapView
              viewState="PHARMACY_MAP"
              hideHeader={true}
              selectedPharmacy={selectedPharmacy}
              setSelectedPharmacy={setSelectedPharmacy}
              onSetViewState={(nextState) => {
                if (nextState === 'stores' || nextState === 'PHARMACIES') {
                  setStep('stores');
                } else if (nextState === 'brands' || nextState === 'BRANDS') {
                  setStep('brands');
                }
              }}
              medicine={selectedBrand || medicine}
              onNavigateSettings={onNavigateSettings}
              onClose={handleClose}
            />
          </View>
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.titleLarge,
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    marginTop: spacing.xxs,
  },
  footerCloseBtn: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  closeBtnText: {
    ...typography.bodyLarge,
  },
});

export default BrandsModal;
