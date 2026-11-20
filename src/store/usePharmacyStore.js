import { create } from 'zustand';

/**
 * PII Tier definitions according to ONERETAIL_PRD.md
 */
export const PII_TIERS = {
  GENERAL: 'GENERAL',
  ESTABLISHED: 'ESTABLISHED',
  KEY_ACCOUNT: 'KEY_ACCOUNT',
  FLAGSHIP: 'FLAGSHIP',
};

const initialState = {
  pharmacyId: null,
  name: '',
  dslNumber: '',
  dslExpiryDate: '',
  dslPictureUri: null,
  furtherLicense1: '',
  furtherLicense1ExpiryDate: '',
  furtherLicense1PictureUri: null,
  furtherLicense2: '',
  furtherLicense2ExpiryDate: '',
  furtherLicense2PictureUri: null,
  address: '',
  locationPin: null, // { latitude, longitude, address }
  facadePhotoUri: null,

  // Territory
  territory: {
    id: 'default',
    name: 'Default Territory',
    isDefault: true,
  },

  // Pharmacy Impact Index (PII) + Wallet
  piiScore: 0,
  piiTier: PII_TIERS.GENERAL,
  walletBalance: 0,
  pendingCashout: 0,
  paymentHistory: [],

  // Settings
  skuVisibilityEnabled: true, // PRD: When false, cannot view or share SKU-level data
  isLoading: false,
};

/**
 * usePharmacyStore - Pharmacy Profile, Licenses, Territory & PII Store
 */
export const usePharmacyStore = create((set, get) => ({
  ...initialState,

  setPharmacyProfile: (profile) => {
    set((state) => ({
      ...state,
      ...profile,
    }));
  },

  updateLicenses: (licenses) => {
    set((state) => ({
      ...state,
      ...licenses,
    }));
  },

  setTerritory: (territory) => {
    set({ territory });
  },

  setSkuVisibility: (enabled) => {
    set({ skuVisibilityEnabled: Boolean(enabled) });
  },

  updatePii: ({ score, tier, walletBalance, pendingCashout }) => {
    set((state) => ({
      piiScore: score !== undefined ? score : state.piiScore,
      piiTier: tier || state.piiTier,
      walletBalance: walletBalance !== undefined ? walletBalance : state.walletBalance,
      pendingCashout: pendingCashout !== undefined ? pendingCashout : state.pendingCashout,
    }));
  },

  addPaymentHistoryRecord: (record) => {
    set((state) => ({
      paymentHistory: [record, ...state.paymentHistory],
    }));
  },

  resetPharmacy: () => {
    set(initialState);
  },
}));

export default usePharmacyStore;
