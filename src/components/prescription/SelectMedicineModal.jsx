import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { radii } from '../../theme/radii.js';
import { spacing } from '../../theme/spacing.js';

import { MedicineSearchView } from './MedicineSearchView.jsx';
import { MedicineBrandsView } from './MedicineBrandsView.jsx';
import { PharmacyMapView } from './PharmacyMapView.jsx';

/**
 * SelectMedicineModal - Exact OneRx 4-View Prescription Bottom Sheet
 *
 * Views:
 * - View 1 ('SEARCH'): Select Medicine / Substitution Search (MedicineSearchView + OptionPills)
 * - View 2 ('PHARMACIES'): Nearby Brand Availability List (PharmacyMapView list state)
 * - View 3 ('PHARMACY_MAP'): Store Location Map Pin (PharmacyMapView map state)
 * - View 4 ('BRANDS'): Available / Alternate & Generic-Mapped Brands (MedicineBrandsView)
 *
 * Uses a single native <Modal> (never double-wrapped) with an explicit
 * height: Math.round(windowHeight * 0.84) and top drag handle pill above the sheet top edge.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Array} [props.addedMedicines]
 * @param {Function} [props.onSelectMedicine]
 * @param {Function} [props.onNavigateSettings]
 * @param {string[]} [props.tabs]
 * @param {'SEARCH' | 'BRANDS' | 'PHARMACIES' | 'PHARMACY_MAP'} [props.initialViewState='SEARCH']
 * @param {Object} [props.initialMedicine=null]
 * @param {string} [props.searchTitle='Select Medicine']
 */
export const SelectMedicineModal = ({
  visible,
  onClose,
  addedMedicines = [],
  onSelectMedicine,
  onNavigateSettings,
  tabs = ['Generic', 'Therapeutic Segment'],
  initialViewState = 'SEARCH',
  initialMedicine = null,
  searchTitle = 'Select Medicine',
}) => {
  const { colors, isDark, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const sheetHeight = Math.round(windowHeight * 0.84);
  const slideAnim = useRef(new Animated.Value(windowHeight)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [viewStack, setViewStack] = useState([initialViewState || 'SEARCH']);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(initialMedicine || null);
  const [selectedBrandForStores, setSelectedBrandForStores] = useState(null);

  const viewState = viewStack[viewStack.length - 1] || 'SEARCH';

  useEffect(() => {
    if (visible) {
      setViewStack([initialViewState || 'SEARCH']);
      setSelectedMedicine(initialMedicine || null);
      setSelectedBrandForStores(null);
      setSelectedPharmacy(null);
      setKeyboardHeight(0);
      slideAnim.setValue(windowHeight);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        mass: 0.9,
        useNativeDriver: true,
      }).start();
    } else {
      setKeyboardHeight(0);
      slideAnim.setValue(windowHeight);
    }
  }, [visible, initialViewState, initialMedicine, windowHeight, slideAnim]);

  useEffect(() => {
    if (!visible) return undefined;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    setKeyboardHeight(0);
    setViewStack([initialViewState || 'SEARCH']);
    setSelectedMedicine(initialMedicine || null);
    setSelectedBrandForStores(null);
    setSelectedPharmacy(null);
    onClose?.();
  }, [initialViewState, initialMedicine, onClose]);

  const handleSetViewState = useCallback((newState, data = null) => {
    Keyboard.dismiss();
    if (newState === 'BRANDS' && data) {
      setSelectedMedicine(data);
    } else if (newState === 'PHARMACIES' && data) {
      if (data.brandName || data.brandId || data.tp || data.mrp) {
        setSelectedBrandForStores(data);
      } else {
        setSelectedMedicine(data);
      }
    }

    setViewStack((prev) => {
      const current = prev[prev.length - 1];
      if (current === newState) return prev;
      return [...prev, newState];
    });
  }, []);

  const handleBack = useCallback(() => {
    Keyboard.dismiss();
    if (viewStack.length > 1) {
      setViewStack((prev) => prev.slice(0, -1));
      return;
    }
    handleClose();
  }, [viewStack.length, handleClose]);

  const handleSelectBrand = useCallback(
    (brand, contextMed) => {
      handleClose();
      onSelectMedicine?.(brand, contextMed);
    },
    [handleClose, onSelectMedicine]
  );

  const effectiveSheetHeight =
    keyboardHeight > 0 && Platform.OS === 'android'
      ? Math.min(sheetHeight, Math.max(windowHeight - insets.top - verticalScale(24) - keyboardHeight, verticalScale(280)))
      : sheetHeight;

  const activeMedicineForStores = selectedBrandForStores || selectedMedicine || initialMedicine || {};

  const sheetBody = (
    <Animated.View
      style={[
        styles.animatedOuterWrap,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Drag Handle Pill centered above sheet top edge (matching OneRx Figma) */}
      <View style={styles.handleAboveSheet}>
        <View
          style={[
            styles.handlePill,
            { backgroundColor: colors.templateScreen.sheetHandle },
          ]}
        />
      </View>

      {/* Animated Sheet Surface with explicit height (never maxHeight-only collapse) */}
      <View
        style={[
          styles.sheetContainer,
          {
            width: '100%',
            height: effectiveSheetHeight,
            backgroundColor: colors.surface.sheet,
            borderColor: colors.border.card,
            borderTopLeftRadius: radii.sheet,
            borderTopRightRadius: radii.sheet,
            overflow: 'hidden',
            paddingTop: spacing.lg,
            paddingHorizontal: spacing.cardPadding,
            paddingBottom:
              keyboardHeight > 0
                ? verticalScale(12)
                : Math.max(insets.bottom, verticalScale(16)),
          },
          isDark ? shadows.dark.card : shadows.light.card,
        ]}
      >
        <View style={styles.container}>
          {viewState === 'SEARCH' && (
            <MedicineSearchView
              title={searchTitle}
              addedMedicines={addedMedicines}
              onClose={handleClose}
              onSetViewState={handleSetViewState}
              onSelectMedicine={handleSelectBrand}
              tabs={tabs}
            />
          )}
          {viewState === 'BRANDS' && (
            <MedicineBrandsView
              medicine={selectedMedicine || initialMedicine || {}}
              onClose={handleClose}
              onBack={handleBack}
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
              onBack={handleBack}
              onSetViewState={(nextState, data) => {
                if (nextState === 'PHARMACIES' && viewState === 'PHARMACY_MAP') {
                  handleBack();
                } else {
                  handleSetViewState(nextState, data);
                }
              }}
              onNavigateSettings={onNavigateSettings}
              medicine={activeMedicineForStores}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );

  return (
    <Modal
      transparent
      visible={Boolean(visible)}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleBack}
    >
      <View
        style={[
          styles.backdropOverlay,
          {
            backgroundColor: colors.background.overlay,
            paddingBottom: Platform.OS === 'android' ? keyboardHeight : 0,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />

        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView behavior="padding" style={styles.kavWrap}>
            {sheetBody}
          </KeyboardAvoidingView>
        ) : (
          sheetBody
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdropOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  kavWrap: {
    width: '100%',
  },
  animatedOuterWrap: {
    width: '100%',
  },
  handleAboveSheet: {
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  handlePill: {
    width: scale(44),
    height: verticalScale(4),
    borderRadius: radii.pill,
  },
  sheetContainer: {
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  container: {
    flex: 1,
    width: '100%',
  },
});

export default SelectMedicineModal;
