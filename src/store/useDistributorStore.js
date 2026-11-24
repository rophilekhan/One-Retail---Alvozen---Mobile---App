import { create } from 'zustand';
import { AppToast } from '../components/core/AppToast.jsx';

/**
 * Realistic Authorized Pharma Distributors in Pakistan
 */
export const INITIAL_DISTRIBUTORS = [
  {
    id: 'dist_1',
    name: 'Muller & Phipps (M&P) Pakistan',
    shortName: 'Muller & Phipps',
    territory: 'Central Lahore & Gujranwala',
    contactPerson: 'Tariq Mahmood (+92 300 8472910)',
    creditLimit: 'PKR 2,500,000',
    creditLimitValue: 2500000,
    openPOsCount: 1,
    expiryClaimsCount: 1,
    activeSchemesCount: 4,
    status: 'Authorized',
    email: 'orders.lahore@mulphico.pk',
  },
  {
    id: 'dist_2',
    name: 'Premier Sales (Pvt) Ltd',
    shortName: 'Premier Sales',
    territory: 'North Lahore & Shahdara',
    contactPerson: 'Farhan Qureshi (+92 321 4452109)',
    creditLimit: 'PKR 1,800,000',
    creditLimitValue: 1800000,
    openPOsCount: 0,
    expiryClaimsCount: 1,
    activeSchemesCount: 2,
    status: 'Authorized',
    email: 'cs@premiersales.pk',
  },
  {
    id: 'dist_3',
    name: 'UDL Distribution (Pvt) Ltd',
    shortName: 'UDL Distribution',
    territory: 'South Lahore & Faisal Town',
    contactPerson: 'Kashif Siddiqui (+92 333 5198422)',
    creditLimit: 'PKR 3,000,000',
    creditLimitValue: 3000000,
    openPOsCount: 1,
    expiryClaimsCount: 1,
    activeSchemesCount: 3,
    status: 'Authorized',
    email: 'supply@udl.com.pk',
  },
  {
    id: 'dist_4',
    name: 'IBL Healthcare',
    shortName: 'IBL Healthcare',
    territory: 'Gulberg, Model Town & DHA',
    contactPerson: 'Noman Bashir (+92 301 9283144)',
    creditLimit: 'PKR 2,200,000',
    creditLimitValue: 2200000,
    openPOsCount: 0,
    expiryClaimsCount: 0,
    activeSchemesCount: 1,
    status: 'Authorized',
    email: 'orders@iblhc.com',
  },
];

/**
 * Initial Purchase Orders Dataset
 */
export const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'po_101',
    poNumber: 'PO-2026-0041',
    distributorId: 'dist_1',
    distributorName: 'Muller & Phipps (M&P) Pakistan',
    itemsCount: 3,
    totalAmount: 18400,
    createdDate: '19 Nov 2026',
    status: 'PENDING_APPROVAL', // 'PENDING_APPROVAL' | 'APPROVED' | 'DISPATCHED'
    items: [
      { name: 'Augmentin 625mg Tab 10s', qty: 20, tp: 240, subtotal: 4800 },
      { name: 'Panadol Extra Tab 100s', qty: 10, tp: 720, subtotal: 7200 },
      { name: 'Amoxil 500mg Cap', qty: 20, tp: 320, subtotal: 6400 },
    ],
  },
  {
    id: 'po_102',
    poNumber: 'PO-2026-0038',
    distributorId: 'dist_3',
    distributorName: 'UDL Distribution (Pvt) Ltd',
    itemsCount: 4,
    totalAmount: 32600,
    createdDate: '17 Nov 2026',
    status: 'PENDING_APPROVAL',
    items: [
      { name: 'Risek 20mg Cap 14s', qty: 24, tp: 135, subtotal: 3240 },
      { name: 'Lipiget 20mg Tab 10s', qty: 30, tp: 210, subtotal: 6300 },
      { name: 'Getryl 2mg Tab 30s', qty: 40, tp: 290, subtotal: 11600 },
    ],
  },
  {
    id: 'po_103',
    poNumber: 'PO-2026-0035',
    distributorId: 'dist_2',
    distributorName: 'Premier Sales (Pvt) Ltd',
    itemsCount: 2,
    totalAmount: 14200,
    createdDate: '15 Nov 2026',
    status: 'DISPATCHED',
    items: [
      { name: 'Brufen 400mg Tab 30s', qty: 50, tp: 65, subtotal: 3250 },
      { name: 'Surbex Z Tab 30s', qty: 25, tp: 438, subtotal: 10950 },
    ],
  },
  {
    id: 'po_104',
    poNumber: 'PO-2026-0029',
    distributorId: 'dist_1',
    distributorName: 'Muller & Phipps (M&P) Pakistan',
    itemsCount: 2,
    totalAmount: 22100,
    createdDate: '10 Nov 2026',
    status: 'APPROVED',
    items: [
      { name: 'Cravit 500mg Tab 5s', qty: 30, tp: 310, subtotal: 9300 },
      { name: 'Flagyl 400mg Tab', qty: 80, tp: 160, subtotal: 12800 },
    ],
  },
];

/**
 * Initial Expiry Return Claims Dataset
 */
export const INITIAL_EXPIRY_CLAIMS = [
  {
    id: 'clm_1',
    claimNumber: 'CLM-2026-0012',
    distributorId: 'dist_1',
    distributorName: 'Muller & Phipps (M&P) Pakistan',
    skuName: 'Augmentin 625mg Tab 10s',
    batchNo: 'AG-99120',
    expiryDate: '28 Nov 2026',
    quantity: 15,
    claimValue: 3600,
    status: 'PENDING_APPROVAL', // 'PENDING_APPROVAL' | 'APPROVED' | 'SETTLED'
  },
  {
    id: 'clm_2',
    claimNumber: 'CLM-2026-0009',
    distributorId: 'dist_3',
    distributorName: 'UDL Distribution (Pvt) Ltd',
    skuName: 'Risek 20mg Cap 14s',
    batchNo: 'B-88214',
    expiryDate: '30 Dec 2026',
    quantity: 24,
    claimValue: 3240,
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'clm_3',
    claimNumber: 'CLM-2026-0005',
    distributorId: 'dist_2',
    distributorName: 'Premier Sales (Pvt) Ltd',
    skuName: 'Brufen 400mg Tab 30s',
    batchNo: 'BF-1092',
    expiryDate: '15 Jan 2027',
    quantity: 30,
    claimValue: 1950,
    status: 'APPROVED',
  },
  {
    id: 'clm_4',
    claimNumber: 'CLM-2026-0001',
    distributorId: 'dist_1',
    distributorName: 'Muller & Phipps (M&P) Pakistan',
    skuName: 'Klavox 625mg Tab 10s',
    batchNo: 'KL-44102',
    expiryDate: '20 Oct 2026',
    quantity: 12,
    claimValue: 2580,
    status: 'SETTLED',
  },
];

const initialState = {
  distributors: INITIAL_DISTRIBUTORS,
  purchaseOrders: INITIAL_PURCHASE_ORDERS,
  expiryClaims: INITIAL_EXPIRY_CLAIMS,
  isLoading: false,
};

/**
 * useDistributorStore - Interactive Distributor Orders & Expiry Claims Store
 */
export const useDistributorStore = create((set, get) => ({
  ...initialState,

  /**
   * Create a new Purchase Order
   * @param {Object} payload
   */
  createPurchaseOrder: (payload) => {
    const { distributors, purchaseOrders } = get();
    const poCount = purchaseOrders.length + 42;
    const poNumber = `PO-2026-00${poCount}`;

    const dist = distributors.find(
      (d) => d.id === payload.distributorId || d.name === payload.distributorName
    ) || distributors[0];

    const newPO = {
      id: `po_${Date.now()}`,
      poNumber,
      distributorId: dist.id,
      distributorName: dist.name,
      itemsCount: payload.itemsCount || payload.items?.length || 1,
      totalAmount: Number(payload.totalAmount) || 12500,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'PENDING_APPROVAL',
      items: payload.items || [
        { name: payload.skuName || 'Augmentin 625mg Tab 10s', qty: payload.quantity || 10, tp: payload.unitTP || 240, subtotal: Number(payload.totalAmount) || 12500 },
      ],
      notes: payload.notes || '',
    };

    const updatedDistributors = distributors.map((d) =>
      d.id === dist.id ? { ...d, openPOsCount: (d.openPOsCount || 0) + 1 } : d
    );

    set({
      purchaseOrders: [newPO, ...purchaseOrders],
      distributors: updatedDistributors,
    });

    AppToast.show({
      type: 'success',
      title: 'Purchase Order Created',
      message: `${newPO.poNumber} submitted to ${dist.shortName || dist.name} for approval.`,
    });

    return newPO;
  },

  /**
   * Approve a Purchase Order
   * @param {string} poId
   */
  approvePurchaseOrder: (poId) => {
    const { purchaseOrders } = get();
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    const updatedPOs = purchaseOrders.map((p) =>
      p.id === poId ? { ...p, status: 'APPROVED' } : p
    );

    set({ purchaseOrders: updatedPOs });

    AppToast.show({
      type: 'success',
      title: 'PO Approved & Transmitted',
      message: `${po.poNumber} authorized and transmitted directly to ${po.distributorName}.`,
    });
  },

  /**
   * Create an Expiry Return Claim
   * @param {Object} payload
   */
  createExpiryClaim: (payload) => {
    const { distributors, expiryClaims } = get();
    const claimCount = expiryClaims.length + 13;
    const claimNumber = `CLM-2026-00${claimCount}`;

    const dist = distributors.find(
      (d) => d.id === payload.distributorId || d.name === payload.distributorName
    ) || distributors[0];

    const newClaim = {
      id: `clm_${Date.now()}`,
      claimNumber,
      distributorId: dist.id,
      distributorName: dist.name,
      skuName: payload.skuName || 'Augmentin 625mg Tab 10s',
      batchNo: payload.batchNo || 'AG-99120',
      expiryDate: payload.expiryDate || '28 Dec 2026',
      quantity: Number(payload.quantity) || 10,
      claimValue: Number(payload.claimValue) || ((Number(payload.quantity) || 10) * 240),
      status: 'PENDING_APPROVAL',
      notes: payload.notes || '',
    };

    const updatedDistributors = distributors.map((d) =>
      d.id === dist.id ? { ...d, expiryClaimsCount: (d.expiryClaimsCount || 0) + 1 } : d
    );

    set({
      expiryClaims: [newClaim, ...expiryClaims],
      distributors: updatedDistributors,
    });

    AppToast.show({
      type: 'success',
      title: 'Expiry Claim Logged',
      message: `${newClaim.claimNumber} logged for ${newClaim.skuName}. Awaiting approval.`,
    });

    return newClaim;
  },

  /**
   * Approve an Expiry Return Claim
   * @param {string} claimId
   */
  approveExpiryClaim: (claimId) => {
    const { expiryClaims } = get();
    const claim = expiryClaims.find((c) => c.id === claimId);
    if (!claim) return;

    const updatedClaims = expiryClaims.map((c) =>
      c.id === claimId ? { ...c, status: 'APPROVED' } : c
    );

    set({ expiryClaims: updatedClaims });

    AppToast.show({
      type: 'success',
      title: 'Expiry Claim Approved',
      message: `${claim.claimNumber} authorized. Return credit note issued.`,
    });
  },

  /**
   * Reset store to initial state
   */
  resetDistributorStore: () => {
    set(initialState);
  },
}));

export default useDistributorStore;
