import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import {
  HomeHeader,
  TerritoryAnalyticsCard,
  HomeOperationalActions,
  TopBrandsTerritoryCard,
  TerritoryBenchmarkingCard,
  RxTrendAreaChart,
  TerritoryShareDonutChart,
  TerritoryBenchmarkBarChart,
} from '../src/components/home/index.js';
import { HomeDashboardScreen, UploadClosingDataScreen } from '../src/screens/home/index.js';
import { PharmacyProfileScreen } from '../src/screens/profile/PharmacyProfileScreen.jsx';
import { ImpactWalletScreen } from '../src/screens/wallet/ImpactWalletScreen.jsx';
import { SettingsScreen } from '../src/screens/settings/SettingsScreen.jsx';
import { FloatingBottomBar } from '../src/components/core/index.js';
import { usePharmacyStore } from '../src/store/usePharmacyStore.js';

// Mock react-navigation hooks
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

describe('HomeDashboard Module - OneRx Architecture Match', () => {
  test('renders HomeDashboardScreen cleanly in Light Mode', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <HomeDashboardScreen navigation={{ navigate: jest.fn() }} />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders HomeDashboardScreen cleanly in Dark Mode', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <HomeDashboardScreen navigation={{ navigate: jest.fn() }} />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders HomeHeader with territory dropdown & notification bell', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <HomeHeader />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders TerritoryAnalyticsCard with periods & sparkline', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <TerritoryAnalyticsCard territoryName="PECHS / Tariq Road, Karachi" />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders HomeOperationalActions with Scan Rx and Retail Operations', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <HomeOperationalActions />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders TopBrandsTerritoryCard and TerritoryBenchmarkingCard', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <TopBrandsTerritoryCard territoryName="PECHS, Karachi" />
          <TerritoryBenchmarkingCard territoryName="PECHS Territory" />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders all 3 Native SVG Chart components cleanly across light and dark modes', async () => {
    const mockSparkline = [
      { day: 'Mon', count: 28 },
      { day: 'Tue', count: 32 },
      { day: 'Wed', count: 35 },
      { day: 'Thu', count: 30 },
      { day: 'Fri', count: 42 },
      { day: 'Sat', count: 34 },
      { day: 'Sun', count: 38 },
    ];
    const mockBrands = [
      { id: 'b1', name: 'Augmentin 625mg', generic: 'Co-Amoxiclav', sharePct: 24.5, rank: 1 },
      { id: 'b2', name: 'Panadol Extra', generic: 'Paracetamol + Caffeine', sharePct: 19.2, rank: 2 },
    ];

    for (const mode of ['light', 'dark']) {
      let renderer;
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <ThemeProvider initialMode={mode}>
            <RxTrendAreaChart data={mockSparkline} selectedIdx={4} onSelectDay={() => {}} />
            <TerritoryShareDonutChart brands={mockBrands} territoryName="PECHS, Karachi" />
            <TerritoryBenchmarkBarChart />
          </ThemeProvider>
        );
      });

      expect(renderer).toBeDefined();
      await ReactTestRenderer.act(async () => {
        renderer.unmount();
      });
    }
  });

  test('renders PharmacyProfileScreen and ImpactWalletScreen cleanly', async () => {
    const mockNav = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };
    usePharmacyStore.getState().resetPharmacy();
    usePharmacyStore.setState({
      name: { name: 'City Meds Pharmacy' },
      territory: { id: 'default', name: 'PECHS / Tariq Road, Karachi', isDefault: true },
      ownerUsername: { username: 'dr.shahzad_rx' },
      pharmacyCode: 'ALV-KHI-0142',
      address: 'Plot 42-B, Commercial Area, Block 6, PECHS, Karachi',
      locationPin: { latitude: 24.8615, longitude: 67.0734 },
      dsl: { number: '05-42-01992', expiryDate: '31 Dec 2027', imageUri: 'mock_dsl.jpg' },
    });

    for (const mode of ['light', 'dark']) {
      let renderer;
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <ThemeProvider initialMode={mode}>
            <PharmacyProfileScreen navigation={mockNav} />
            <ImpactWalletScreen navigation={mockNav} />
          </ThemeProvider>
        );
      });

      const treeText = JSON.stringify(renderer.toJSON());
      expect(treeText).toContain('City Meds Pharmacy');
      expect(treeText).toContain('PECHS / Tariq Road, Karachi');
      expect(treeText).toContain('Composite PII Score');
      expect(treeText).toContain('Regulatory Licenses');
      expect(treeText).toContain('Pharmacy Location');
      expect(treeText).toContain('24.86150, 67.07340');
      expect(treeText).toContain('View');

      const mapNodes = renderer.root.findAll(
        (node) => typeof node.props?.onMapReady === 'function' && node.props?.scrollEnabled === false
      );
      expect(mapNodes.length).toBeGreaterThan(0);
      expect(mapNodes[0].props.region).toBeUndefined();
      expect(Array.isArray(mapNodes[0].props.customMapStyle)).toBe(true);
      if (mode === 'light') {
        expect(mapNodes[0].props.customMapStyle).toEqual([]);
      } else {
        expect(mapNodes[0].props.customMapStyle.length).toBeGreaterThan(0);
      }

      await ReactTestRenderer.act(async () => {
        renderer.unmount();
      });
    }
  });

  test('renders FloatingBottomBar with 4 OneRx tabs and Center QR FAB', async () => {
    const onTabPress = jest.fn();
    const onFabPress = jest.fn();

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <FloatingBottomBar
            activeTab="Home"
            onTabPress={onTabPress}
            onFabPress={onFabPress}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders UploadClosingDataScreen and handles file upload with +25 PII points', async () => {
    const initialScore = usePharmacyStore.getState().piiScore;
    const initialHistoryLength = (usePharmacyStore.getState().closingUploadsHistory || []).length;
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <UploadClosingDataScreen navigation={mockNavigation} />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();

    // Trigger addClosingUploadRecord in store
    await ReactTestRenderer.act(async () => {
      usePharmacyStore.getState().addClosingUploadRecord({
        fileName: 'Test_Closing_Sales.xlsx',
        fileType: 'XLSX',
        skuCount: 150,
        period: 'Daily Closing',
        pointsEarned: 25,
      });
    });

    expect(usePharmacyStore.getState().piiScore).toBe(initialScore + 25);
    expect(usePharmacyStore.getState().closingUploadsHistory.length).toBe(initialHistoryLength + 1);

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders SettingsScreen cleanly in Light & Dark modes when pharmacy.territory is an object', async () => {
    const mockNav = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };
    usePharmacyStore.getState().resetPharmacy();
    usePharmacyStore.setState({
      territory: { id: 'default', name: 'PECHS / Tariq Road, Karachi', isDefault: true },
    });

    let lightRenderer;
    await ReactTestRenderer.act(async () => {
      lightRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <SettingsScreen navigation={mockNav} />
        </ThemeProvider>
      );
    });
    expect(JSON.stringify(lightRenderer.toJSON())).toContain('PECHS / Tariq Road, Karachi');
    await ReactTestRenderer.act(async () => {
      lightRenderer.unmount();
    });

    let darkRenderer;
    await ReactTestRenderer.act(async () => {
      darkRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <SettingsScreen navigation={mockNav} />
        </ThemeProvider>
      );
    });
    expect(JSON.stringify(darkRenderer.toJSON())).toContain('PECHS / Tariq Road, Karachi');
    await ReactTestRenderer.act(async () => {
      darkRenderer.unmount();
    });
  });
});
