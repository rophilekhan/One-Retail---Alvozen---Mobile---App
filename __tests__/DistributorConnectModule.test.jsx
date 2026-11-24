import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import { useDistributorStore } from '../src/store/useDistributorStore.js';
import { DistributorCard } from '../src/components/distributor/DistributorCard.jsx';
import { PurchaseOrderCard } from '../src/components/distributor/PurchaseOrderCard.jsx';
import { ExpiryClaimCard } from '../src/components/distributor/ExpiryClaimCard.jsx';
import { CreatePOModal } from '../src/components/distributor/CreatePOModal.jsx';
import { DistributorConnectScreen } from '../src/screens/ecosystem/DistributorConnectScreen.jsx';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('Distributor Connect Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDistributorStore.getState().resetDistributorStore();
  });

  test('useDistributorStore manages distributors, POs, and expiry claims with actions', () => {
    const store = useDistributorStore.getState();

    // Verify initial dataset
    expect(store.distributors.length).toBeGreaterThanOrEqual(4);
    expect(store.purchaseOrders.length).toBeGreaterThanOrEqual(4);
    expect(store.expiryClaims.length).toBeGreaterThanOrEqual(4);

    // Create a new PO
    const newPO = store.createPurchaseOrder({
      distributorId: 'dist_1',
      skuName: 'Augmentin 625mg Tab 10s',
      quantity: 20,
      unitTP: 240,
      totalAmount: 4800,
    });
    expect(newPO).toBeDefined();
    expect(newPO.status).toBe('PENDING_APPROVAL');
    expect(useDistributorStore.getState().purchaseOrders[0].id).toBe(newPO.id);

    // Approve PO
    store.approvePurchaseOrder(newPO.id);
    const approvedPO = useDistributorStore.getState().purchaseOrders.find((p) => p.id === newPO.id);
    expect(approvedPO.status).toBe('APPROVED');

    // Create an Expiry Claim
    const newClaim = store.createExpiryClaim({
      distributorId: 'dist_1',
      skuName: 'Risek 20mg Cap 14s',
      batchNo: 'B-99881',
      quantity: 12,
      claimValue: 1620,
    });
    expect(newClaim).toBeDefined();
    expect(newClaim.status).toBe('PENDING_APPROVAL');
    expect(useDistributorStore.getState().expiryClaims[0].id).toBe(newClaim.id);

    // Approve Expiry Claim
    store.approveExpiryClaim(newClaim.id);
    const approvedClaim = useDistributorStore.getState().expiryClaims.find((c) => c.id === newClaim.id);
    expect(approvedClaim.status).toBe('APPROVED');
  });

  test('DistributorCard renders 3-zone structure with 2 action buttons', () => {
    const dist = useDistributorStore.getState().distributors[0];
    const onInitiatePO = jest.fn();
    const onExpiryClaim = jest.fn();

    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <DistributorCard
            distributor={dist}
            onInitiatePO={onInitiatePO}
            onExpiryClaim={onExpiryClaim}
          />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    // Zone 1: Distributor Name & Authorized Badge
    const nameText = root.findAll((node) => node.props && node.props.children === dist.name);
    expect(nameText.length).toBeGreaterThan(0);

    const authBadge = root.findAll((node) => node.props && node.props.children === 'Authorized');
    expect(authBadge.length).toBeGreaterThan(0);

    // Zone 2: 3-Column Metrics (Credit limit, Open POs, Expiry claims)
    const creditText = root.findAll((node) => node.props && node.props.children === 'CREDIT LIMIT');
    expect(creditText.length).toBeGreaterThan(0);

    const openPosText = root.findAll((node) => node.props && node.props.children === 'OPEN POs');
    expect(openPosText.length).toBeGreaterThan(0);

    // Zone 3: Action Buttons
    const poBtn = root.findAll((node) => node.props && node.props.title === 'Initiate PO');
    expect(poBtn.length).toBeGreaterThan(0);

    const expBtn = root.findAll((node) => node.props && node.props.title === 'Expiry Claim');
    expect(expBtn.length).toBeGreaterThan(0);
  });

  test('PurchaseOrderCard renders Zone 1 (PO#), Zone 2 (Metrics), Zone 3 (Approve Button)', () => {
    const po = useDistributorStore.getState().purchaseOrders[0];
    const onApprove = jest.fn();

    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <PurchaseOrderCard po={po} onApprove={onApprove} />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    const poText = root.findAll((node) => node.props && node.props.children === po.poNumber);
    expect(poText.length).toBeGreaterThan(0);

    const itemsText = root.findAll((node) => node.props && node.props.children === 'ITEMS');
    expect(itemsText.length).toBeGreaterThan(0);

    const approveBtn = root.findAll((node) => node.props && node.props.title === 'Approve Purchase Order');
    expect(approveBtn.length).toBeGreaterThan(0);
  });

  test('ExpiryClaimCard renders Zone 1 (Claim ID), Zone 2 (Metrics), Zone 3 (Approve Button)', () => {
    const claim = useDistributorStore.getState().expiryClaims[0];
    const onApprove = jest.fn();

    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <ExpiryClaimCard claim={claim} onApprove={onApprove} />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    const claimText = root.findAll((node) => node.props && node.props.children === claim.claimNumber);
    expect(claimText.length).toBeGreaterThan(0);

    const expDateText = root.findAll((node) => node.props && node.props.children === 'EXPIRY DATE');
    expect(expDateText.length).toBeGreaterThan(0);

    const approveBtn = root.findAll((node) => node.props && node.props.title === 'Approve Expiry Claim');
    expect(approveBtn.length).toBeGreaterThan(0);
  });

  test('DistributorConnectScreen mounts cleanly with top KPI summary strip and filter tabs', () => {
    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <DistributorConnectScreen navigation={mockNavigation} route={{ params: {} }} />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    // Header Title
    const headerTitle = root.findAll((node) => node.props && node.props.children === 'Distributor Connect');
    expect(headerTitle.length).toBeGreaterThan(0);

    // KPI Cards: "Pending POs" and "Pending Expiries"
    const kpiPo = root.findAll((node) => node.props && node.props.children === 'Pending POs');
    expect(kpiPo.length).toBeGreaterThan(0);

    const kpiExp = root.findAll((node) => node.props && node.props.children === 'Pending Expiries');
    expect(kpiExp.length).toBeGreaterThan(0);

    // Filter Tabs
    const distTab = root.findAll((node) => node.props && node.props.children === 'Distributors');
    expect(distTab.length).toBeGreaterThan(0);
  });

  test('CreatePOModal renders pinned header, SKU rows with QuantityStepperInput, and pinned footer', () => {
    const dist = useDistributorStore.getState().distributors[0];
    const onClose = jest.fn();
    const onSuccess = jest.fn();

    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <CreatePOModal
            visible={true}
            onClose={onClose}
            selectedDistributor={dist}
            onSuccess={onSuccess}
          />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    // Header title pinned at top
    const modalTitle = root.findAll((node) => node.props && node.props.children === 'Initiate Purchase Order');
    expect(modalTitle.length).toBeGreaterThan(0);

    // SKU top sub-row: brand name & unit TP
    const skuNameText = root.findAll((node) => node.props && node.props.children === 'Augmentin 625mg Tab 10s');
    expect(skuNameText.length).toBeGreaterThan(0);

    const unitTpText = root.findAll((node) => node.props && typeof node.props.children === 'string' && node.props.children.includes('Unit TP: Rs.'));
    expect(unitTpText.length).toBeGreaterThan(0);

    // Live Subtotal in bottom sub-row
    const subtotalText = root.findAll((node) => node.props && typeof node.props.children === 'string' && node.props.children.includes('Rs. 2,400'));
    expect(subtotalText.length).toBeGreaterThan(0);

    // Pinned footer total order TP
    const totalOrderText = root.findAll((node) => node.props && node.props.children === 'Total Order TP:');
    expect(totalOrderText.length).toBeGreaterThan(0);

    // Submit Purchase Order button
    const submitBtn = root.findAll((node) => node.props && node.props.title === 'Submit Purchase Order');
    expect(submitBtn.length).toBeGreaterThan(0);

    // Trigger submit
    ReactTestRenderer.act(() => {
      submitBtn[0].props.onPress();
    });

    expect(onSuccess).toHaveBeenCalled();
  });
});
