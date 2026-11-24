import { create } from 'zustand';
import {
  resolveTierFromPoints,
  PHARMACY_TIERS_CONFIG,
  normalizePharmacyTier,
} from '../theme/tierThemes.js';

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
  piiScore: 842,
  piiPoints: 842,
  piiTier: PII_TIERS.KEY_ACCOUNT,
  piiTierKey: 'key_account',
  levelUpNotification: null,
  walletBalance: 48500,
  pendingCashout: 0,
  paymentHistory: [],

  // Settings
  skuVisibilityEnabled: true, // PRD: Reciprocal SKU visibility flag (default true)
  isLoading: false,

  // Closing uploads history (for non-integrated pharmacies)
  closingUploadsHistory: [
    {
      id: 'closing_1',
      date: '22 Nov 2026',
      fileName: 'Daily_Closing_2026_11_22.xlsx',
      fileType: 'XLSX',
      skuCount: 142,
      period: 'Daily Closing',
      status: 'Verified',
      pointsEarned: 25,
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'closing_2',
      date: '21 Nov 2026',
      fileName: 'Daily_Closing_2026_11_21.csv',
      fileType: 'CSV',
      skuCount: 138,
      period: 'Daily Closing',
      status: 'Synced',
      pointsEarned: 25,
      timestamp: Date.now() - 172800000,
    },
  ],
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

  setPiiPoints: (points) => {
    const newPoints = Number(points) || 0;
    const oldTierKey = get().piiTierKey || normalizePharmacyTier(get().piiTier);
    const newTierKey = resolveTierFromPoints(newPoints);
    const hasTierChanged = oldTierKey !== newTierKey;

    set((state) => ({
      ...state,
      piiPoints: newPoints,
      piiScore: newPoints,
      piiTierKey: newTierKey,
      piiTier: PHARMACY_TIERS_CONFIG[newTierKey]?.label || 'Established',
      levelUpNotification: hasTierChanged
        ? {
            tierKey: newTierKey,
            tierName: PHARMACY_TIERS_CONFIG[newTierKey]?.label || 'Established',
            prevTierKey: oldTierKey,
          }
        : state.levelUpNotification,
    }));
  },

  setPiiTier: (tierKeyOrName) => {
    const tierKey = normalizePharmacyTier(tierKeyOrName);
    const tierLabel = PHARMACY_TIERS_CONFIG[tierKey]?.label || 'Established';
    const oldTierKey = get().piiTierKey;

    set((state) => ({
      ...state,
      piiTier: tierLabel,
      piiTierKey: tierKey,
      levelUpNotification: oldTierKey !== tierKey
        ? {
            tierKey,
            tierName: tierLabel,
            prevTierKey: oldTierKey,
          }
        : state.levelUpNotification,
    }));
  },

  clearLevelUpNotification: () => {
    set({ levelUpNotification: null });
  },

  updatePii: ({ score, points, tier, walletBalance, pendingCashout }) => {
    const rawScore = points !== undefined ? points : score;
    const newPoints = rawScore !== undefined ? Number(rawScore) : get().piiScore;
    const oldTierKey = get().piiTierKey || normalizePharmacyTier(get().piiTier);
    const resolvedTierKey = tier ? normalizePharmacyTier(tier) : resolveTierFromPoints(newPoints);
    const tierLabel = PHARMACY_TIERS_CONFIG[resolvedTierKey]?.label || 'Established';
    const hasTierChanged = oldTierKey !== resolvedTierKey;

    set((state) => ({
      ...state,
      piiScore: newPoints,
      piiPoints: newPoints,
      piiTier: tierLabel,
      piiTierKey: resolvedTierKey,
      walletBalance: walletBalance !== undefined ? walletBalance : state.walletBalance,
      pendingCashout: pendingCashout !== undefined ? pendingCashout : state.pendingCashout,
      levelUpNotification: hasTierChanged
        ? {
            tierKey: resolvedTierKey,
            tierName: tierLabel,
            prevTierKey: oldTierKey,
          }
        : state.levelUpNotification,
    }));
  },

  addPaymentHistoryRecord: (record) => {
    set((state) => ({
      paymentHistory: [record, ...state.paymentHistory],
    }));
  },

  addClosingUploadRecord: (record) => {
    const pointsAwarded = record?.pointsEarned || 25;
    const currentScore = get().piiScore || 842;
    const nextScore = currentScore + pointsAwarded;
    get().setPiiPoints(nextScore);

    set((state) => ({
      closingUploadsHistory: [
        {
          id: 'closing_' + Date.now(),
          date: record?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          fileName: record?.fileName || 'Closing_Report.xlsx',
          fileType: record?.fileType || 'XLSX',
          skuCount: record?.skuCount || 120,
          period: record?.period || 'Daily Closing',
          status: 'Synced',
          pointsEarned: pointsAwarded,
          timestamp: Date.now(),
          ...record,
        },
        ...(state.closingUploadsHistory || []),
      ],
    }));
  },

  resetPharmacy: () => {
    set(initialState);
  },
}));

export default usePharmacyStore;
