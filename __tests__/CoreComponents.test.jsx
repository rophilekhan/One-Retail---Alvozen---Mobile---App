import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import {
  AppScreenContainer,
  AuthScreenContainer,
  AppCard,
  GlassCard,
  GlassSurface,
  AppButton,
  AppInput,
  AppText,
  AppHeader,
  AppBackButton,
  AppModal,
  AppBadge,
  AppSlider,
  RegistrationProgress,
  MetricIconDisc,
  AppSwitch,
  AppCheckbox,
  AppToast,
  FloatingBottomBar,
  AppWelcomeBadge,
} from '../src/components/core/index.js';

describe('OneRetail Exact Theme & Core UI Kit', () => {
  test('renders all ported core components in ThemeProvider without crashing', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <AppScreenContainer>
            <AppHeader title="Test Title" />
            <AppWelcomeBadge text="WELCOME TO ONERETAIL" />
            <RegistrationProgress currentStep={2} totalSteps={5} />
            <AppCard>
              <AppText variant="headlineMedium">Card Content</AppText>
            </AppCard>
            <GlassCard>
              <AppText variant="bodyLarge">Glass Card Content</AppText>
            </GlassCard>
            <GlassSurface width={100} height={40}>
              <AppText>Glass Surface</AppText>
            </GlassSurface>
            <AppInput label="Username" placeholder="Enter username" value="testuser" />
            <AppButton title="Primary Button" variant="primary" />
            <AppButton title="Secondary Button" variant="secondary" />
            <AppButton title="Teal Button" variant="teal" />
            <AppBadge label="Verified" variant="brand" />
            <AppSlider title="Swipe to Proceed" onSuccess={() => {}} />
            <MetricIconDisc variant="default" />
            <AppSwitch value={true} onValueChange={() => {}} />
            <AppCheckbox checked={true} label="Accept Terms" onChange={() => {}} />
            <AppBackButton onPress={() => {}} />
            <FloatingBottomBar activeTab="Home" onTabPress={() => {}} />
            <AppModal visible={false} onClose={() => {}} title="Modal" />
            <AppToast />
          </AppScreenContainer>
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }, 30000);

  test('renders AuthScreenContainer with multi-radial mesh gradient', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <AuthScreenContainer>
            <AppText>Auth Screen Content</AppText>
          </AuthScreenContainer>
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }, 30000);
});
