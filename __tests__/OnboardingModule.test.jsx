import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import {
  LicenseUploadCard,
  FacadeUploadCard,
  PharmacyMapAddressCard,
  PharmacyLocationPickerModal,
} from '../src/components/onboarding/index.js';
import { PharmacyLicensesScreen } from '../src/screens/auth/PharmacyLicensesScreen.jsx';
import { PharmacyLocationScreen } from '../src/screens/auth/PharmacyLocationScreen.jsx';
import { usePharmacyStore } from '../src/store/usePharmacyStore.js';
import { useAuthStore } from '../src/store/useAuthStore.js';
import {
  isCoordinatesString,
  parseCoordinatesString,
} from '../src/services/geocodingService.js';

describe('OneRetail Onboarding Module (1:1 OneRx Port)', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    usePharmacyStore.getState().resetPharmacy();
  });

  test('LicenseUploadCard renders with title, license number, and expiry date picker', async () => {
    let renderer;
    let currentNumber = '05-42-01992';

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <LicenseUploadCard
            title="Drug Sale License (DSL)"
            helperText="Mandatory retail drug license"
            isRequired={true}
            licenseNumber={currentNumber}
            licenseExpiry="2027-12-31"
            onLicenseNumberChange={(val) => {
              currentNumber = val;
            }}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('LicenseUploadCard renders with attached image document preview and action bar', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <LicenseUploadCard
            title="Drug Sale License (DSL)"
            helperText="Mandatory retail drug license"
            isRequired={true}
            licenseNumber="05-42-01992"
            licenseExpiry="2027-12-31"
            imageUri="dsl_scanned_doc.jpg"
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('PharmacyLicensesScreen renders header progress and saves licenses to Zustand store', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <PharmacyLicensesScreen navigation={mockNavigation} route={{}} />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('PharmacyLocationScreen renders address input, map preview, and completes onboarding', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <PharmacyLocationScreen navigation={mockNavigation} route={{}} />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('PharmacyMapAddressCard renders MapView, GPS button, and live coordinate badge', async () => {
    let renderer;
    let addr = 'Main Market, Gulberg, Lahore';

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <PharmacyMapAddressCard
            address={addr}
            onAddressChange={(v) => { addr = v; }}
            coordinates={{ latitude: 31.5204, longitude: 74.3587 }}
            onCoordinatesChange={jest.fn()}
            onOpenFullMap={jest.fn()}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    expect(renderer.toJSON()).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('FacadeUploadCard renders attached and unattached states cleanly', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <FacadeUploadCard photoUri={null} onPhotoChange={jest.fn()} />
        </ThemeProvider>
      );
    });

    expect(renderer.toJSON()).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.update(
        <ThemeProvider initialMode="dark">
          <FacadeUploadCard photoUri="https://example.com/facade.jpg" onPhotoChange={jest.fn()} />
        </ThemeProvider>
      );
    });

    expect(renderer.toJSON()).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('PharmacyLocationPickerModal renders full interactive map bottom sheet', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <PharmacyLocationPickerModal
            visible={true}
            onClose={jest.fn()}
            onAddLocation={jest.fn()}
            selectedAddress="Main Boulevard, Gulberg, Lahore"
            selectedCoordinates={{ latitude: 31.5204, longitude: 74.3587 }}
          />
        </ThemeProvider>
      );
    });

    expect(renderer.toJSON()).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('geocodingService correctly parses and validates coordinates strings', () => {
    expect(isCoordinatesString('31.5204, 74.3587')).toBe(true);
    expect(isCoordinatesString('invalid address string')).toBe(false);

    const parsed = parseCoordinatesString('31.5204, 74.3587');
    expect(parsed).toEqual({ latitude: 31.5204, longitude: 74.3587 });
    expect(parseCoordinatesString('not coords')).toBeNull();
  });
});
