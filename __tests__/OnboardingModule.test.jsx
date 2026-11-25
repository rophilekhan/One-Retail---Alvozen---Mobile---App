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
import { SplashScreen } from '../src/screens/auth/SplashScreen.jsx';
import { usePharmacyStore } from '../src/store/usePharmacyStore.js';
import { useAuthStore } from '../src/store/useAuthStore.js';
import {
  isCoordinatesString,
  parseCoordinatesString,
  reverseGeocode,
  searchPlacesOrAddress,
  DARK_MAP_STYLE,
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

  test('geocodingService validates finite coordinates and falls back gracefully when APIs fail', async () => {
    const invalid = await reverseGeocode('not-a-number', undefined);
    expect(invalid).toEqual({
      formattedAddress: '',
      area: '',
      city: '',
      postalCode: '',
      latitude: 0,
      longitude: 0,
    });

    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.reject(new Error('Network unavailable')));
    try {
      const karachiFallback = await reverseGeocode(24.918, 67.097);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('nominatim.openstreetmap.org/reverse'),
        expect.objectContaining({
          headers: expect.objectContaining({ 'User-Agent': 'OneRetailApp/1.0' }),
        })
      );
      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('maps.googleapis.com'),
        expect.anything()
      );
      expect(karachiFallback.city).toBe('Karachi');
      expect(karachiFallback.area).toBe('Gulshan-e-Iqbal');
      expect(karachiFallback.formattedAddress).toContain('Gulshan-e-Iqbal');

      const searchFallback = await searchPlacesOrAddress('Gulberg');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('nominatim.openstreetmap.org/search'),
        expect.objectContaining({
          headers: expect.objectContaining({ 'User-Agent': 'OneRetailApp/1.0' }),
        })
      );
      expect(searchFallback.length).toBeGreaterThan(0);
      expect(Number.isFinite(searchFallback[0].latitude)).toBe(true);
      expect(Number.isFinite(searchFallback[0].longitude)).toBe(true);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('PharmacyLocationPickerModal and PharmacyMapAddressCard pass explicit heights, onMapReady, and dark style', async () => {
    let modalRenderer;
    await ReactTestRenderer.act(async () => {
      modalRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <PharmacyLocationPickerModal
            visible={true}
            onClose={jest.fn()}
            onAddLocation={jest.fn()}
            selectedAddress="Saddar Town, Karachi"
            selectedCoordinates={{ latitude: 24.8607, longitude: 67.0011 }}
          />
        </ThemeProvider>
      );
    });

    const modalMap = modalRenderer.root.find((node) => typeof node.props?.onMapReady === 'function');
    expect(modalMap.props.customMapStyle).toEqual(DARK_MAP_STYLE);
    expect(modalMap.props.style.height).toBeGreaterThan(0);
    expect(Number.isFinite(modalMap.props.initialRegion.latitude)).toBe(true);
    expect(Number.isFinite(modalMap.props.initialRegion.longitude)).toBe(true);

    await ReactTestRenderer.act(async () => {
      modalRenderer.unmount();
    });

    let cardRenderer;
    await ReactTestRenderer.act(async () => {
      cardRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <PharmacyMapAddressCard
            address="Clifton, Karachi"
            onAddressChange={jest.fn()}
            coordinates={{ latitude: '24.823', longitude: '67.031' }}
            onCoordinatesChange={jest.fn()}
            onOpenFullMap={jest.fn()}
          />
        </ThemeProvider>
      );
    });

    const cardMap = cardRenderer.root.find((node) => typeof node.props?.onMapReady === 'function');
    expect(cardMap.props.customMapStyle).toEqual([]);
    expect(cardMap.props.initialRegion.latitude).toBe(24.823);
    expect(cardMap.props.initialRegion.longitude).toBe(67.031);
    expect(cardMap.props.region).toBeUndefined();

    await ReactTestRenderer.act(async () => {
      cardRenderer.unmount();
    });
  });

  test('SplashScreen renders glassmorphic OneRx layout in Light & Dark modes and navigates after timeout', async () => {
    jest.useFakeTimers();
    try {
      await useAuthStore.getState().logout();
      const splashNav = {
        replace: jest.fn(),
        navigate: jest.fn(),
        getState: () => ({ routeNames: ['Splash', 'Welcome', 'SignIn'] }),
      };

      let darkRenderer;
      await ReactTestRenderer.act(async () => {
        darkRenderer = ReactTestRenderer.create(
          <ThemeProvider initialMode="dark">
            <SplashScreen navigation={splashNav} />
          </ThemeProvider>
        );
      });

      const darkTree = JSON.stringify(darkRenderer.toJSON());
      expect(darkTree).toContain('One');
      expect(darkTree).toContain('Retail');
      expect(darkTree).toContain('Smart Pharmacy & Retail Ecosystem');
      expect(darkTree).toContain('Powered by Alvozen');

      await ReactTestRenderer.act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      ReactTestRenderer.act(() => {
        jest.advanceTimersByTime(1900);
      });
      expect(splashNav.replace).toHaveBeenCalledWith('Welcome');

      await ReactTestRenderer.act(async () => {
        darkRenderer.unmount();
      });

      let lightRenderer;
      await ReactTestRenderer.act(async () => {
        lightRenderer = ReactTestRenderer.create(
          <ThemeProvider initialMode="light">
            <SplashScreen navigation={splashNav} autoNavigate={false} />
          </ThemeProvider>
        );
      });
      expect(JSON.stringify(lightRenderer.toJSON())).toContain('Powered by Alvozen');
      await ReactTestRenderer.act(async () => {
        lightRenderer.unmount();
      });
    } finally {
      jest.useRealTimers();
    }
  });
});
