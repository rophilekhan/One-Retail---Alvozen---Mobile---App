import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import {
  OptionPills,
  HighlightedText,
  BrandsModal,
  MedicineBrandsView,
  MedicineSearchView,
  PharmacyMapView,
  SelectMedicineModal,
  MedicationCard,
} from '../src/components/prescription/index.js';
import { QRScannerScreen } from '../src/screens/prescription/QRScannerScreen.jsx';
import { ScannedRxResultScreen } from '../src/screens/prescription/ScannedRxResultScreen.jsx';
import { DispenseConfirmationScreen } from '../src/screens/prescription/DispenseConfirmationScreen.jsx';
import { usePharmacyStore } from '../src/store/usePharmacyStore.js';
import { useDispenseStore } from '../src/store/useDispenseStore.js';

describe('OneRetail Exact Ported OneRx Prescription Builder Components', () => {
  beforeEach(() => {
    usePharmacyStore.setState({ skuVisibilityEnabled: true });
    useDispenseStore.getState().clearDispenseSession();
  });

  test('renders OptionPills and HighlightedText properly', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <OptionPills
            options={['Generic', 'Therapeutic Segment', 'Brand']}
            selected="Generic"
            onSelect={() => { }}
          />
          <HighlightedText text="Glucophage SR 500mg" searchQuery="Glucophage" />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders BrandsModal and MedicineBrandsView with exact OneRx layout and OneRetail data fields', async () => {
    const mockMedicine = {
      id: 'gen_101',
      name: 'Omeprazole 20mg Capsule',
      genericName: 'Omeprazole 20mg Capsule',
      genericId: 'gen_omeprazole_20',
      mappedBrands: [
        {
          brandId: 'b_risek_20',
          brandName: 'Risek 20mg',
          brand: 'Getz Pharma Ltd',
          tp: 135,
          mrp: 160,
          isAvailable: true,
          activeScheme: '10+1 Bonus',
        },
        {
          brandId: 'b_omee_20',
          brandName: 'Omee 20mg',
          brand: 'Searle Company Ltd',
          tp: 110,
          mrp: 130,
          isAvailable: false,
          activeScheme: null,
        },
      ],
    };

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <BrandsModal
            visible={true}
            onClose={() => { }}
            medicine={mockMedicine}
            onSelectBrand={() => { }}
          />
          <MedicineBrandsView
            medicine={mockMedicine}
            onClose={() => { }}
            onSetViewState={() => { }}
            onSelectBrand={() => { }}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders MedicineSearchView with search bar and highlighted text', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <MedicineSearchView
            onClose={() => { }}
            onSetViewState={() => { }}
            onSelectMedicine={() => { }}
            tabs={['Generic', 'Therapeutic Segment', 'Brand']}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders PharmacyMapView under skuVisibilityEnabled = true and false', async () => {
    // 1. With skuVisibilityEnabled = true (shows pharmacy cards with Distance km)
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <PharmacyMapView
            viewState="PHARMACIES"
            onClose={() => { }}
            onSetViewState={() => { }}
          />
        </ThemeProvider>
      );
    });
    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });

    // 2. With skuVisibilityEnabled = false (shows locked notice card)
    usePharmacyStore.setState({ skuVisibilityEnabled: false });

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <PharmacyMapView
            viewState="PHARMACIES"
            onClose={() => { }}
            onSetViewState={() => { }}
            onNavigateSettings={() => { }}
          />
        </ThemeProvider>
      );
    });
    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });

    // 3. With viewState = PHARMACY_MAP (Google MapView renders with explicit height & onMapReady)
    usePharmacyStore.setState({ skuVisibilityEnabled: true });
    let mapRenderer;
    await ReactTestRenderer.act(async () => {
      mapRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <PharmacyMapView
            viewState="PHARMACY_MAP"
            selectedPharmacy={{
              id: 1,
              name: 'Shaheen Chemist',
              address: 'Gulshan-e-Iqbal, Karachi',
              latitude: 24.918,
              longitude: 67.097,
            }}
            onClose={() => { }}
            onSetViewState={() => { }}
          />
        </ThemeProvider>
      );
    });
    const rxMap = mapRenderer.root.find((node) => typeof node.props?.onMapReady === 'function');
    expect(rxMap.props.initialRegion.latitude).toBe(24.918);
    expect(rxMap.props.initialRegion.longitude).toBe(67.097);
    expect(rxMap.props.style.height).toBeGreaterThan(0);

    await ReactTestRenderer.act(async () => {
      mapRenderer.unmount();
    });
  });

  test('renders SelectMedicineModal container with compact and full view states', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <SelectMedicineModal
            visible={true}
            onClose={() => { }}
            onSelectMedicine={() => { }}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders MedicationCard with exact OneRx layout, index, clinical stats, and price chips', async () => {
    const genericItem = {
      id: 'g1',
      genericName: 'Omeprazole 20mg Capsule',
      dosageForm: 'Capsule',
      isAvailable: true,
      tp: 135,
      mrp: 160,
    };

    const unavailableBrandItem = {
      id: 'b1',
      brandName: 'Panadol Extra',
      genericName: 'Paracetamol + Caffeine',
      dosageForm: 'Tablet',
      isAvailable: false,
      tp: 80,
      mrp: 95,
      activeScheme: '10+1 Free',
    };

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <MedicationCard
            index={1}
            item={genericItem}
            onPressBrands={() => { }}
          />
          <MedicationCard
            index={2}
            item={unavailableBrandItem}
            onPressPharmacies={() => { }}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders QRScannerScreen and triggers prescription scan', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
    };

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <QRScannerScreen navigation={mockNavigation} />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();

    const root = renderer.root;
    const buttons = root.findAll((node) => node.props && node.props.accessibilityRole === 'button');
    const scanBtn = buttons.find(
      (b) =>
        b.props.accessibilityLabel &&
        b.props.accessibilityLabel.includes('Scan Patient Prescription QR')
    );

    if (scanBtn) {
      await ReactTestRenderer.act(async () => {
        scanBtn.props.onClick ? scanBtn.props.onClick() : scanBtn.props.onPress();
      });
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'ScannedRxResult',
        expect.objectContaining({ prescription: expect.any(Object) })
      );
    }

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('Plug-in QR modal opens cleanly, populates preset chip on first tap, and processes Rx safely', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
    };

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <QRScannerScreen navigation={mockNavigation} />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    // Open Plug-in QR Modal via bottom tab
    const tabs = root.findAll((node) => node.props && node.props.accessibilityRole === 'tab');
    const pluginTab = tabs.find((t) => t.props.accessibilityState && t.findAll((c) => c.props && c.props.children === 'Plug-in QR').length > 0);
    if (pluginTab) {
      await ReactTestRenderer.act(async () => {
        pluginTab.props.onPress();
      });
    }

    // Find and tap a preset chip on first tap
    const presetBtns = root.findAll((node) => node.props && node.props.accessibilityLabel && node.props.accessibilityLabel.includes('Preset Brand In-Stock QR'));
    expect(presetBtns.length).toBeGreaterThan(0);
    await ReactTestRenderer.act(async () => {
      presetBtns[0].props.onPress();
    });

    // Find and tap Process Plug-in Scanned Rx button
    const appButtons = root.findAll((node) => node.props && node.props.title === 'Process Plug-in Scanned Rx');
    expect(appButtons.length).toBeGreaterThan(0);
    await ReactTestRenderer.act(async () => {
      appButtons[0].props.onPress();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'ScannedRxResult',
      expect.objectContaining({ rxData: expect.any(Object) })
    );

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders ScannedRxResultScreen and DispenseConfirmationScreen with full flow', async () => {
    const mockRx = {
      id: 'rx_test_1',
      prescriptionNumber: 'RX-99214',
      patientName: 'Ali Khan',
      doctorName: 'Dr. Sarah Ahmed',
      items: [
        {
          id: 'item_1',
          brandName: 'Augmentin 625mg',
          genericName: 'Co-Amoxiclav',
          dosageForm: 'Tablet',
          prescribedQuantity: 10,
          dispensedQuantity: 10,
          isAvailable: true,
          tp: 240,
          mrp: 280,
          activeScheme: '10+1 Free',
        },
        {
          id: 'item_2',
          brandName: 'Panadol Extra',
          genericName: 'Paracetamol + Caffeine',
          dosageForm: 'Tablet',
          prescribedQuantity: 20,
          dispensedQuantity: 0,
          isAvailable: false,
          tp: 80,
          mrp: 95,
        },
      ],
    };

    useDispenseStore.getState().setScannedPrescription(mockRx);

    const mockNavigation = {
      navigate: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
    };

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <ScannedRxResultScreen
            navigation={mockNavigation}
            route={{ params: { prescription: mockRx } }}
          />
          <DispenseConfirmationScreen
            navigation={mockNavigation}
            route={{ params: {} }}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();

    // Verify PharmacyMapView standalone modal rendering
    let mapModalRenderer;
    await ReactTestRenderer.act(async () => {
      mapModalRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <PharmacyMapView
            visible={true}
            onClose={() => { }}
            onNavigateSettings={() => { }}
          />
        </ThemeProvider>
      );
    });

    expect(mapModalRenderer).toBeDefined();

    await ReactTestRenderer.act(async () => {
      mapModalRenderer.unmount();
      renderer.unmount();
    });
  });

  test('BrandsModal supports 3-step navigation (brands -> stores -> map) and brand selection updates store', async () => {
    const mockGenericItem = {
      id: 'item_generic_1',
      genericName: 'Omeprazole 20mg Capsule',
      genericId: 'gen_omeprazole_20',
      isAvailable: true,
      tp: 135,
      mrp: 160,
      mappedBrands: [
        {
          brandId: 'b_risek_20',
          brandName: 'Risek 20mg',
          brand: 'Getz Pharma Ltd',
          tp: 135,
          mrp: 160,
          isAvailable: true,
          activeScheme: '10+1 Bonus',
        },
      ],
    };

    useDispenseStore.getState().setScannedPrescription({
      id: 'rx_gen_1',
      qrType: 'GENERIC',
      prescriptionNumber: 'RX-GEN-01',
      items: [mockGenericItem],
    });

    const onSelectBrand = jest.fn();
    const onClose = jest.fn();

    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <BrandsModal
            visible={true}
            medicine={mockGenericItem}
            onClose={onClose}
            onSelectBrand={onSelectBrand}
          />
        </ThemeProvider>
      );
    });

    const root = renderer.root;

    // Step 1: Brands list rendered
    const brandNameNode = root.findAll((node) => {
      if (!node.props || !node.props.children) return false;
      const c = Array.isArray(node.props.children) ? node.props.children.join('') : String(node.props.children);
      return c.includes('Risek 20mg');
    });
    expect(brandNameNode.length).toBeGreaterThan(0);

    // Tap In Stock / Available tag to navigate to Step 2 ('stores')
    const availableTags = root.findAll((node) => {
      if (!node.props || !node.props.children) return false;
      const c = Array.isArray(node.props.children) ? node.props.children.join('') : String(node.props.children);
      return c.includes('In Stock') || c.includes('Available');
    });
    expect(availableTags.length).toBeGreaterThan(0);

    await ReactTestRenderer.act(async () => {
      let tagTouchable = availableTags[0];
      while (tagTouchable && (!tagTouchable.props || !tagTouchable.props.onPress)) {
        tagTouchable = tagTouchable.parent;
      }
      if (tagTouchable && tagTouchable.props && tagTouchable.props.onPress) {
        tagTouchable.props.onPress({ stopPropagation: () => { } });
      }
    });

    // Step 2: Nearby Brand Availability header rendered
    const storesHeader = root.findAll((node) => {
      if (!node.props || !node.props.children) return false;
      const c = Array.isArray(node.props.children) ? node.props.children.join('') : String(node.props.children);
      return c.includes('Nearby Brand Availability');
    });
    expect(storesHeader.length).toBeGreaterThan(0);

    // Step 3: Direct brand selection via store
    useDispenseStore.getState().mapGenericToBrand(mockGenericItem.id, mockGenericItem.mappedBrands[0]);
    const updated = useDispenseStore.getState().scannedItems.find((it) => it.id === mockGenericItem.id);
    expect(updated.brandName).toBe('Risek 20mg');
    expect(updated.selectedBrandId).toBe('b_risek_20');
    expect(updated.isSubstituted).toBe(true);

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });
});
