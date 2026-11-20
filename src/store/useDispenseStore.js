import { create } from 'zustand';

const initialState = {
  activePrescription: null,
  scannedItems: [],
  matchedBrands: [],
  alternateBrands: [],
  substituteOptions: [],
  nearbyPharmaciesStock: [],
  isScanning: false,
  isSubmitting: false,
};

/**
 * useDispenseStore - QR Prescription Scanning & Dispense Confirmation Store
 * Grounded in ONERETAIL_PRD.md:
 * - Scanned QR items (Brand or Generic-ID mapped)
 * - Alternate brands of the same Generic with TP/MRP
 * - Nearby pharmacies stock (Pharmacy Name - Distance km)
 * - Dispense quantities & brand substitution recording
 */
export const useDispenseStore = create((set, get) => ({
  ...initialState,

  /**
   * Set scanned prescription and populate items
   * Supports both Brand-level and Generic-ID QR scan payloads
   */
  setScannedPrescription: (prescription) => {
    const items = Array.isArray(prescription?.items)
      ? prescription.items.map((item) => ({
          id: item.id || String(Math.random()),
          brandName: item.brandName || '',
          genericName: item.genericName || '',
          genericId: item.genericId || null,
          dosageForm: item.dosageForm || '',
          prescribedQuantity: Number(item.prescribedQuantity) || 1,
          dispensedQuantity: Number(item.dispensedQuantity) || Number(item.prescribedQuantity) || 1,
          isAvailable: item.isAvailable !== false,
          tp: Number(item.tp) || 0,
          mrp: Number(item.mrp) || 0,
          activeScheme: item.activeScheme || null,
          substitutedBrand: item.substitutedBrand || null,
          substituteReason: item.substituteReason || null,
        }))
      : [];

    set({
      activePrescription: prescription,
      scannedItems: items,
      matchedBrands: prescription?.matchedBrands || [],
      alternateBrands: prescription?.alternateBrands || [],
      nearbyPharmaciesStock: prescription?.nearbyPharmacies || [],
    });
  },

  /**
   * Update quantity dispensed against a specific prescription item
   */
  updateDispensedQuantity: (itemId, quantity) => {
    set((state) => ({
      scannedItems: state.scannedItems.map((item) =>
        item.id === itemId
          ? { ...item, dispensedQuantity: Math.max(Number(quantity) || 0, 0) }
          : item
      ),
    }));
  },

  /**
   * Record brand substitution (by Generic or Therapeutic Segment)
   */
  substituteBrand: (itemId, substituteBrand, substituteReason = 'Out of Stock') => {
    set((state) => ({
      scannedItems: state.scannedItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              substitutedBrand: substituteBrand,
              substituteReason,
            }
          : item
      ),
    }));
  },

  /**
   * Revert brand substitution
   */
  removeSubstitution: (itemId) => {
    set((state) => ({
      scannedItems: state.scannedItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              substitutedBrand: null,
              substituteReason: null,
            }
          : item
      ),
    }));
  },

  setMatchedBrands: (brands) => {
    set({ matchedBrands: Array.isArray(brands) ? brands : [] });
  },

  setAlternateBrands: (brands) => {
    set({ alternateBrands: Array.isArray(brands) ? brands : [] });
  },

  setSubstituteOptions: (options) => {
    set({ substituteOptions: Array.isArray(options) ? options : [] });
  },

  setNearbyPharmaciesStock: (stock) => {
    set({ nearbyPharmaciesStock: Array.isArray(stock) ? stock : [] });
  },

  setScanning: (isScanning) => {
    set({ isScanning: Boolean(isScanning) });
  },

  setSubmitting: (isSubmitting) => {
    set({ isSubmitting: Boolean(isSubmitting) });
  },

  clearDispenseSession: () => {
    set(initialState);
  },
}));

export default useDispenseStore;
