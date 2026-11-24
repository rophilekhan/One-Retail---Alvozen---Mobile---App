import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import {
  ImpactHeroSection,
  ImpactStatCard,
  EarningsSummaryCard,
  EarningTransactionCard,
  PointTransactionCard,
  FilterTabs,
  SelectWithdrawMethodModal,
  WithdrawAccountDetailsModal,
  WithdrawBankTransferModal,
  EnterOTPModal,
  EnterWithdrawalAmountModal,
  ReviewConfirmWithdrawalModal,
  TierLevelUpModal,
  ImpactScoreModal,
  PiiActivitiesCard,
} from '../src/components/wallet/index.js';
import { PiiScoreBreakdownCard } from '../src/components/profile/index.js';
import {
  getPharmacyTierTheme,
  resolveTierFromPoints,
  normalizePharmacyTier,
  PHARMACY_TIER_KEYS,
} from '../src/theme/tierThemes.js';

describe('OneRetail Wallet & Impact Index Module', () => {
  test('tierThemes resolves all 4 tiers with dynamic tokens across light and dark modes', () => {
    const keys = [
      PHARMACY_TIER_KEYS.GENERAL_TRADE,
      PHARMACY_TIER_KEYS.ESTABLISHED,
      PHARMACY_TIER_KEYS.KEY_ACCOUNT,
      PHARMACY_TIER_KEYS.FLAGSHIP,
    ];

    keys.forEach((key) => {
      const darkTheme = getPharmacyTierTheme(key, true);
      const lightTheme = getPharmacyTierTheme(key, false);

      expect(darkTheme.key).toBe(key);
      expect(lightTheme.key).toBe(key);
      expect(darkTheme.accentColor).toBeDefined();
      expect(lightTheme.accentColor).toBeDefined();
      expect(darkTheme.arcGradient).toBeDefined();
      expect(darkTheme.glowColors.length).toBeGreaterThanOrEqual(2);
      expect(darkTheme.perks.length).toBeGreaterThan(0);
      expect(typeof darkTheme.IconComponent).toBe('function');
    });

    // Test tier resolution from points
    expect(resolveTierFromPoints(150)).toBe(PHARMACY_TIER_KEYS.GENERAL_TRADE);
    expect(resolveTierFromPoints(350)).toBe(PHARMACY_TIER_KEYS.ESTABLISHED);
    expect(resolveTierFromPoints(750)).toBe(PHARMACY_TIER_KEYS.KEY_ACCOUNT);
    expect(resolveTierFromPoints(1200)).toBe(PHARMACY_TIER_KEYS.FLAGSHIP);

    // Test OneRx legacy key normalization
    expect(normalizePharmacyTier('emerging')).toBe(PHARMACY_TIER_KEYS.GENERAL_TRADE);
    expect(normalizePharmacyTier('senior')).toBe(PHARMACY_TIER_KEYS.KEY_ACCOUNT);
    expect(normalizePharmacyTier('distinguished')).toBe(PHARMACY_TIER_KEYS.FLAGSHIP);
  });

  test('renders ImpactHeroSection across OneRetail 4 tiers without error', async () => {
    const tiers = ['general_trade', 'established', 'key_account', 'flagship'];

    for (const tier of tiers) {
      let renderer;
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <ThemeProvider initialMode="dark">
            <ImpactHeroSection tier={tier} score={580} />
          </ThemeProvider>
        );
      });
      expect(renderer).toBeDefined();
      await ReactTestRenderer.act(async () => {
        renderer.unmount();
      });
    }
  }, 30000);

  test('renders ImpactStatCard, EarningsSummaryCard, and transaction cards', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <ImpactStatCard
            title="POINTS EARNED"
            amount="12,450"
            suffix="pts"
            icon="points"
            onPress={() => {}}
          />
          <ImpactStatCard
            title="TOTAL EARNINGS"
            amount="48,500"
            suffix="PKR"
            icon="earnings"
            onPress={() => {}}
          />
          <EarningsSummaryCard
            balance="48,500"
            availableBalance="48,500"
            pendingBalance="12,000"
            paidBalance="125,000"
          />
          <EarningTransactionCard
            type="bank"
            title="Bank Transfer"
            status="Paid"
            date="14 Nov"
            amount="15,000 Rs"
          />
          <PointTransactionCard
            badges={['QR Rx Scan', 'RX-101']}
            description="Prescription scan"
            timestamp="Today, 2:00 PM"
            points={40}
            currencyValue="20 Rs"
          />
          <FilterTabs
            tabs={['All', 'Prescriptions', 'Data Sharing']}
            activeTab="All"
            onTabChange={() => {}}
          />
          <PiiActivitiesCard piiScore={780} tier="key_account" />
          <PiiScoreBreakdownCard score={780} tier="key_account" />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }, 30000);

  test('renders all withdrawal and scoring modals correctly', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <SelectWithdrawMethodModal visible={false} onClose={() => {}} />
          <WithdrawAccountDetailsModal visible={false} onClose={() => {}} />
          <WithdrawBankTransferModal visible={false} onClose={() => {}} />
          <EnterOTPModal visible={false} onClose={() => {}} />
          <EnterWithdrawalAmountModal visible={false} onClose={() => {}} />
          <ReviewConfirmWithdrawalModal visible={false} onClose={() => {}} />
          <ImpactScoreModal visible={false} onClose={() => {}} tier="key_account" score={620} />
          <TierLevelUpModal visible={false} onClose={() => {}} tier="flagship" />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }, 30000);

  it('renders TierLevelUpModal with visible=true across all 4 tiers without gradient element errors', async () => {
    const tiers = ['general_trade', 'established', 'key_account', 'flagship'];
    for (const tier of tiers) {
      for (const mode of ['light', 'dark']) {
        let renderer;
        await ReactTestRenderer.act(async () => {
          renderer = ReactTestRenderer.create(
            <ThemeProvider initialMode={mode}>
              <TierLevelUpModal visible={true} onClose={() => {}} tier={tier} />
            </ThemeProvider>
          );
        });
        expect(renderer).toBeDefined();
        await ReactTestRenderer.act(async () => {
          renderer.unmount();
        });
      }
    }
  }, 30000);
});
