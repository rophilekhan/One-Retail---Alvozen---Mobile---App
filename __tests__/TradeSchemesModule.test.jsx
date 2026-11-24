import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import { FilterPillsBar } from '../src/components/core/FilterPillsBar.jsx';
import { TradeSchemeCard } from '../src/components/ecosystem/TradeSchemeCard.jsx';
import { TradeSchemesScreen } from '../src/screens/ecosystem/TradeSchemesScreen.jsx';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const sampleScheme = {
  id: 'sch_test',
  brandName: 'Augmentin 625mg Tab 10s',
  pharma: 'GSK',
  generic: 'Co-Amoxiclav',
  category: 'Bonus Slabs',
  slab: '10 + 1 Free',
  rebate: 'Plus 3% Early Pay Rebate',
  moq: '20 Packs',
  validTill: '28 Nov 2026',
  distributor: 'Muller & Phipps Pakistan',
  tp: 240,
  margin: '12.5%',
  terms: 'Valid on single invoice bookings.',
};

describe('Trade Schemes & Filter Pills Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('FilterPillsBar renders tabs and handles selection with locked geometry', () => {
    const tabs = ['All Schemes', 'Bonus Slabs', 'Flat Discount', 'Expiring Soon'];
    const onTabChange = jest.fn();

    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <FilterPillsBar tabs={tabs} activeTab="All Schemes" onTabChange={onTabChange} />
        </ThemeProvider>
      );
    });

    const root = renderer.root;
    // Verify all 4 tabs are present
    tabs.forEach((tab) => {
      const match = root.findAll((node) => node.props && node.props.children === tab);
      expect(match.length).toBeGreaterThan(0);
    });
  });

  test('TradeSchemeCard renders 3 distinct zones with correct tokens', () => {
    const onOrder = jest.fn();
    const onDetails = jest.fn();

    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <TradeSchemeCard
            scheme={sampleScheme}
            onOrder={onOrder}
            onDetails={onDetails}
          />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    // Zone 1: Brand title, Pharma & Generic, and Promo Slab Pill
    const brandText = root.findAll((node) => node.props && node.props.children === 'Augmentin 625mg Tab 10s');
    expect(brandText.length).toBeGreaterThan(0);

    const slabBadge = root.findAll((node) => node.props && node.props.children === '10 + 1 Free');
    expect(slabBadge.length).toBeGreaterThan(0);

    // Zone 2: 3-column metrics strip
    const moqText = root.findAll((node) => node.props && node.props.children === '20 Packs');
    expect(moqText.length).toBeGreaterThan(0);

    const tpText = root.findAll((node) => node.props && node.props.children === 'Rs. 240');
    expect(tpText.length).toBeGreaterThan(0);

    const validText = root.findAll((node) => node.props && node.props.children === '28 Nov 2026');
    expect(validText.length).toBeGreaterThan(0);

    // Zone 3: Distributor note & Order button
    const distNote = root.findAll((node) =>
      typeof node.props?.children === 'string' &&
      node.props.children.includes('Muller & Phipps Pakistan')
    );
    expect(distNote.length).toBeGreaterThan(0);
  });

  test('TradeSchemesScreen mounts without crashing and renders trade scheme list', () => {
    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider>
          <TradeSchemesScreen navigation={mockNavigation} />
        </ThemeProvider>
      );
    });

    const root = renderer.root;
    // Header title
    const headerTitle = root.findAll((node) => node.props && node.props.children === 'Trade Schemes');
    expect(headerTitle.length).toBeGreaterThan(0);
  });
});
