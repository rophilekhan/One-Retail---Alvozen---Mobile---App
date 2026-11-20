import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  MetricIconDisc,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';

const DEMO_ENGAGEMENT_MODULES = [
  {
    id: 'eng_1',
    title: 'Hypertension Management Guidelines 2026',
    sponsor: 'Searle Pakistan',
    duration: '3 Mins',
    piiReward: 30,
    cashReward: 500,
    completed: false,
    description: 'Review updated blood pressure target guidelines and clinical dosing protocols.',
  },
  {
    id: 'eng_2',
    title: 'Winter Pediatric Antibiotic Stewardship Survey',
    sponsor: 'GSK Pakistan',
    duration: '2 Mins',
    piiReward: 25,
    cashReward: 400,
    completed: false,
    description: 'Participate in a 4-question market pulse survey regarding seasonal suspension demand.',
  },
  {
    id: 'eng_3',
    title: 'Diabetes Foot-Care Pharmacist Counseling',
    sponsor: 'Getz Pharma',
    duration: '5 Mins',
    piiReward: 50,
    cashReward: 800,
    completed: false,
    description: 'Patient advisory techniques for high-risk diabetic neuropathy presentations.',
  },
];

/**
 * EngageScreen - Digital Pharma Engagement Activities
 * Mandated by ONERETAIL_PRD.md:
 * - Earns PII points & financial incentives
 * - Educational brand modules, clinical updates, and micro-surveys
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const EngageScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const [modules, setModules] = useState(DEMO_ENGAGEMENT_MODULES);
  const { updatePii, piiScore, walletBalance } = usePharmacyStore();

  const handleCompleteModule = (mod) => {
    setModules((prev) =>
      prev.map((m) => (m.id === mod.id ? { ...m, completed: true } : m))
    );

    // Update store points & wallet balance
    updatePii({
      score: (piiScore || 842) + mod.piiReward,
      walletBalance: (walletBalance || 48500) + mod.cashReward,
    });

    AppToast.show({
      title: 'Activity Completed',
      message: `Earned +${mod.piiReward} PII Points & PKR ${mod.cashReward} wallet reward!`,
      type: 'success',
    });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true} withBottomNavClearance={true}>
      <AppHeader title="Pharma Engage" onBack={() => navigation.goBack()} showBack={true} />

      {/* Hero Banner */}
      <GlassCard style={styles.heroCard}>
        <View style={styles.heroRow}>
          <MetricIconDisc variant="gold" size={48} marginRight={12}>
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </MetricIconDisc>

          <View style={{ flex: 1 }}>
            <AppText variant="titleMedium" colorType="primary">Digital Pharma Engagement</AppText>
            <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
              Earn points for your Pharmacy Impact Index and cash rewards credited to your wallet.
            </AppText>
          </View>
        </View>
      </GlassCard>

      <AppText variant="titleMedium" colorType="primary" style={styles.sectionTitle}>
        Active Opportunities ({modules.filter((m) => !m.completed).length})
      </AppText>

      {modules.map((mod) => (
        <GlassCard key={mod.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <AppBadge label={mod.sponsor} variant="brand" size="sm" style={{ marginBottom: 4 }} />
              <AppText variant="titleMedium" colorType="primary">{mod.title}</AppText>
              <AppText variant="caption" colorType="muted" style={{ marginTop: 4 }}>
                {mod.description}
              </AppText>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <AppBadge label={`+${mod.piiReward} PII`} variant="accent" />
              <AppText variant="caption" colorType="brand" style={{ marginTop: 4, fontWeight: '700' }}>
                PKR {mod.cashReward}
              </AppText>
            </View>
          </View>

          <View style={[styles.cardFooter, { borderTopColor: colors.border?.subtle }]}>
            <AppText variant="caption" colorType="muted">
              Estimated Duration: {mod.duration}
            </AppText>

            {mod.completed ? (
              <AppBadge label="Completed & Credited" variant="success" />
            ) : (
              <AppButton
                variant="primary"
                size="xs"
                title="Start Activity"
                onPress={() => handleCompleteModule(mod)}
              />
            )}
          </View>
        </GlassCard>
      ))}

      <View style={{ height: verticalScale(20) }} />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    marginVertical: verticalScale(6),
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
  },
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: verticalScale(10),
    paddingTop: verticalScale(8),
  },
});

export default EngageScreen;