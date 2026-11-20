import { create } from 'zustand';

/**
 * PII Tier definitions according to ONERETAIL_PRD.md:
 * - General Trade (0 - 299)
 * - Established (300 - 599)
 * - Key Account (600 - 899)
 * - Flagship (900 - 1500)
 */
export const PII_TIERS = {
  GENERAL_TRADE: 'General Trade',
  ESTABLISHED: 'Established',
  KEY_ACCOUNT: 'Key Account',
  FLAGSHIP: 'Flagship',
  // Backwards compatibility aliases
  GENERAL: 'General Trade',
};

const initialState = {
  pharmacyId: null,
  name: '',

  // Structured licenses
  dsl: {
    number: '',
    expiryDate: '',
    imageUri: null,
  },
  furtherLicense1: {
    number: '',
    expiryDate: '',
    imageUri: null,
  },
  furtherLicense2: {
    number: '',
    expiryDate: '',
    imageUri: null,
  },

  // Flattened license properties for backwards compatibility
  dslNumber: '',
  dslExpiryDate: '',
  dslPictureUri: null,
  furtherLicense1Number: '',
  furtherLicense1ExpiryDate: '',
  furtherLicense1PictureUri: null,
  furtherLicense2Number: '',
  furtherLicense2ExpiryDate: '',
  furtherLicense2PictureUri: null,

  address: '',
  locationPin: null, // { latitude, longitude, address }
  facadePhotoUri: null,

  // Territory
  territory: {
    id: 'default',
    name: 'PECHS / Tariq Road, Karachi',
    isDefault: true,
  },

  // Non-integrated / Integrated POS flag
  isSystemIntegrated: false,

  // Pharmacy Impact Index (PII) + Wallet
  piiScore: 0,
  piiTier: PII_TIERS.GENERAL_TRADE,
  walletBalance: 0,
  pendingCashout: 0,
  paymentHistory: [],

  // Settings
  skuVisibilityEnabled: true, // PRD: Reciprocal SKU visibility flag (default true)
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

  setLicenses: (licenses) => {
    get().updateLicenses(licenses);
  },

  setLocation: (locationData) => {
    set((state) => ({
      ...state,
      address: locationData?.address || state.address,
      locationPin: locationData,
      latitude: locationData?.latitude ?? state.latitude,
      longitude: locationData?.longitude ?? state.longitude,
    }));
  },

  setFacadePhoto: (photoUri) => {
    set({
      facadePhotoUri: photoUri,
    });
  },

  completeOnboarding: () => {
    set({
      isOnboarded: true,
    });
  },

  updateLicenses: (licenses) => {
    set((state) => {
      const dslNumber = licenses.dslNumber ?? licenses.dsl?.number ?? state.dsl.number;
      const dslExpiryDate = licenses.dslExpiryDate ?? licenses.dsl?.expiryDate ?? state.dsl.expiryDate;
      const dslPictureUri = licenses.dslPictureUri ?? licenses.dsl?.imageUri ?? state.dsl.imageUri;

      const lic1Number =
        licenses.furtherLicense1Number ??
        (typeof licenses.furtherLicense1 === 'string' ? licenses.furtherLicense1 : licenses.furtherLicense1?.number) ??
        state.furtherLicense1.number;
      const lic1ExpiryDate =
        licenses.furtherLicense1ExpiryDate ?? licenses.furtherLicense1?.expiryDate ?? state.furtherLicense1.expiryDate;
      const lic1PictureUri =
        licenses.furtherLicense1PictureUri ?? licenses.furtherLicense1?.imageUri ?? state.furtherLicense1.imageUri;

      const lic2Number =
        licenses.furtherLicense2Number ??
        (typeof licenses.furtherLicense2 === 'string' ? licenses.furtherLicense2 : licenses.furtherLicense2?.number) ??
        state.furtherLicense2.number;
      const lic2ExpiryDate =
        licenses.furtherLicense2ExpiryDate ?? licenses.furtherLicense2?.expiryDate ?? state.furtherLicense2.expiryDate;
      const lic2PictureUri =
        licenses.furtherLicense2PictureUri ?? licenses.furtherLicense2?.imageUri ?? state.furtherLicense2.imageUri;

      return {
        ...state,
        ...licenses,
        dsl: {
          number: dslNumber,
          expiryDate: dslExpiryDate,
          imageUri: dslPictureUri,
        },
        furtherLicense1: {
          number: lic1Number,
          expiryDate: lic1ExpiryDate,
          imageUri: lic1PictureUri,
        },
        furtherLicense2: {
          number: lic2Number,
          expiryDate: lic2ExpiryDate,
          imageUri: lic2PictureUri,
        },
        dslNumber,
        dslExpiryDate,
        dslPictureUri,
        furtherLicense1: lic1Number,
        furtherLicense1Number: lic1Number,
        furtherLicense1ExpiryDate: lic1ExpiryDate,
        furtherLicense1PictureUri: lic1PictureUri,
        furtherLicense2: lic2Number,
        furtherLicense2Number: lic2Number,
        furtherLicense2ExpiryDate: lic2ExpiryDate,
        furtherLicense2PictureUri: lic2PictureUri,
      };
    });
  },

  setTerritory: (territory) => {
    set({ territory });
  },

  setIsSystemIntegrated: (isSystemIntegrated) => {
    set({ isSystemIntegrated: Boolean(isSystemIntegrated) });
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
