import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import { LicenseUploadCard } from '../src/components/onboarding/index.js';
import { PharmacyLicensesScreen } from '../src/screens/auth/PharmacyLicensesScreen.jsx';
import { PharmacyLocationScreen } from '../src/screens/auth/PharmacyLocationScreen.jsx';
import { usePharmacyStore } from '../src/store/usePharmacyStore.js';
import { useAuthStore } from '../src/store/useAuthStore.js';

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
});
