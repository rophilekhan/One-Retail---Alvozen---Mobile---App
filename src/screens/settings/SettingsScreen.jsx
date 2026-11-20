import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppSwitch,
  AppButton,
  MetricIconDisc,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import {
  TransferArrowsIconSvg,
  SlidersIconSvg,
  HospitalIconSvg,
  UserOutlineIconSvg,
  LogoutIconSvg,
  ChevronRightSvg,
} from '../../assets/vectors/index.js';

/**
 * SettingsScreen - Platform Settings & Privacy Controls
 * Mandated by ONERETAIL_PRD.md:
 * - Reciprocal SKU visibility toggle with clear explanation
 * - Pharmacy controls who can contact them and what data is visible to pharma
 * - Theme switcher (Light, Dark, System)
 * - Navigation links to Pharmacy Profile & Staff Management
 * - Sign Out action
 * Features exact OneRx vector icons (Zero emoji/text placeholders).
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const SettingsScreen = ({ navigation }) => {
  const { colors, spacing, isDark, themeMode, setThemeMode } = useTheme();
  const pharmacy = usePharmacyStore();
  const setSkuVisibility = usePharmacyStore((s) => s.setSkuVisibility);
  const logout = useAuthStore((s) => s.logout);

  // Pharma privacy controls
  const [allowPharmaContact, setAllowPharmaContact] = useState(true);
  const [shareAnonymizedData, setShareAnonymizedData] = useState(true);
  const [showInDirectory, setShowInDirectory] = useState(true);

  const handleToggleSkuVisibility = (val) => {
    setSkuVisibility(val);
    AppToast.show({
      title: val ? 'SKU Visibility Active' : 'SKU Visibility Disabled',
      message: val
        ? 'Nearby pharmacies can view your brand stock. You can now also view peer stocks.'
        : 'Reciprocal rule active: Your SKU data is private, and you cannot view peer pharmacy stocks.',
      type: val ? 'success' : 'warning',
    });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true} withBottomNavClearance={true}>
      <AppHeader title="Settings & Privacy" onBack={() => navigation.goBack()} showBack={true} />

      {/* 1. Core PRD Feature: Reciprocal SKU Visibility */}
      <GlassCard style={styles.card}>
        <View style={styles.settingRow}>
          <MetricIconDisc variant="purple" size={38} marginRight={10}>
            <TransferArrowsIconSvg size={20} color="#FFFFFF" />
          </MetricIconDisc>

          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={styles.titleWithBadge}>
              <AppText variant="titleMedium" colorType="primary">
                Reciprocal SKU Visibility
              </AppText>
              <AppBadge
                label={pharmacy.skuVisibilityEnabled ? 'Active' : 'Private'}
                variant={pharmacy.skuVisibilityEnabled ? 'success' : 'muted'}
                size="sm"
              />
            </View>
            <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
              Allow peer pharmacies in your territory to view your brand availability.
            </AppText>
          </View>
          <AppSwitch
            value={pharmacy.skuVisibilityEnabled}
            onValueChange={handleToggleSkuVisibility}
          />
        </View>

        {/* PRD Reciprocal Rule Notice */}
        <View
          style={[
            styles.reciprocalWarningBox,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: colors.border?.subtle,
            },
          ]}
        >
          <AppText variant="caption" colorType="brand" style={{ fontWeight: '600' }}>
            Reciprocal Data Exchange Rule:
          </AppText>
          <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
            If turned OFF, other pharmacies cannot view your SKU stock, AND you also cannot view the stock availability of other pharmacies during prescription scanning.
          </AppText>
        </View>
      </GlassCard>

      {/* 2. PRD Feature: Pharma Contact & Data Visibility Controls */}
      <GlassCard style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <MetricIconDisc variant="teal" size={38} marginRight={10}>
            <SlidersIconSvg size={20} color="#FFFFFF" />
          </MetricIconDisc>
          <View style={{ flex: 1 }}>
            <AppText variant="titleMedium" colorType="primary">
              Pharma Visibility & Contact
            </AppText>
            <AppText variant="caption" colorType="muted">
              Control manufacturer outreach & sales sharing
            </AppText>
          </View>
        </View>

        {/* Field Rep Outreach */}
        <View style={[styles.subSettingRow, { borderBottomColor: colors.border?.subtle }]}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">
              Allow Pharma Field Rep Inquiries
            </AppText>
            <AppText variant="caption" colorType="muted">
              Enable pharmaceutical medical reps to contact pharmacy for verified trade inquiries.
            </AppText>
          </View>
          <AppSwitch value={allowPharmaContact} onValueChange={setAllowPharmaContact} />
        </View>

        {/* Anonymized Data Sharing */}
        <View style={[styles.subSettingRow, { borderBottomColor: colors.border?.subtle }]}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">
              Anonymized Sales Insights Sharing
            </AppText>
            <AppText variant="caption" colorType="muted">
              Share aggregated territory demand trends to earn daily PII points and wallet cash.
            </AppText>
          </View>
          <AppSwitch value={shareAnonymizedData} onValueChange={setShareAnonymizedData} />
        </View>

        {/* Territory Directory */}
        <View style={styles.subSettingRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">
              Territory Directory Listing
            </AppText>
            <AppText variant="caption" colorType="muted">
              Display pharmacy name and location in the regional pharmacy trade registry.
            </AppText>
          </View>
          <AppSwitch value={showInDirectory} onValueChange={setShowInDirectory} />
        </View>
      </GlassCard>

      {/* 3. Appearance & Theme Switcher */}
      <GlassCard style={styles.card}>
        <AppText variant="titleMedium" colorType="primary">
          Theme & Display
        </AppText>
        <AppText variant="caption" colorType="muted" style={{ marginBottom: 10 }}>
          Glassmorphic Light or Dark mode with contrast protection
        </AppText>

        <View style={styles.themeSelectorRow}>
          {[
            { id: 'dark', label: 'Dark Mode' },
            { id: 'light', label: 'Light Mode' },
            { id: 'system', label: 'System Default' },
          ].map((mode) => (
            <TouchableOpacity
              key={mode.id}
              onPress={() => setThemeMode(mode.id)}
              style={[
                styles.themeBtn,
                {
                  backgroundColor:
                    themeMode === mode.id
                      ? colors.brand?.primary
                      : isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
            >
              <AppText
                variant="caption"
                colorType={themeMode === mode.id ? 'inverse' : 'primary'}
                style={{ fontWeight: themeMode === mode.id ? '700' : '400' }}
              >
                {mode.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </GlassCard>

      {/* 4. Navigation Shortcuts */}
      <GlassCard style={styles.card}>
        <AppText variant="titleMedium" colorType="primary" style={{ marginBottom: 6 }}>
          Management & Credentials
        </AppText>

        <TouchableOpacity
          style={[styles.linkRow, { borderBottomColor: colors.border?.subtle }]}
          onPress={() => navigation.navigate('PharmacyProfile')}
        >
          <HospitalIconSvg size={20} color={colors.brand?.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">
              Pharmacy Profile & Regulatory Licenses
            </AppText>
            <AppText variant="caption" colorType="muted">
              DSL, Further Licenses 1 & 2, Façade photo, GPS pin & PII
            </AppText>
          </View>
          <ChevronRightSvg size={16} color={colors.text?.muted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('StaffList')}
        >
          <UserOutlineIconSvg size={20} color={colors.brand?.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">
              Staff Hierarchy & RBAC Permissions
            </AppText>
            <AppText variant="caption" colorType="muted">
              Configure logins, passwords, and 7 operational permissions
            </AppText>
          </View>
          <ChevronRightSvg size={16} color={colors.text?.muted} />
        </TouchableOpacity>
      </GlassCard>

      {/* 5. Sign Out */}
      <GlassCard style={styles.card}>
        <AppButton
          variant="danger"
          size="md"
          title="Sign Out of OneRetail"
          onPress={() => {
            AppToast.show({
              title: 'Signed Out',
              message: 'Your session has been securely ended.',
              type: 'info',
            });
            logout();
          }}
        />
      </GlassCard>

      <View style={{ height: verticalScale(20) }} />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reciprocalWarningBox: {
    borderRadius: scale(10),
    borderWidth: 1,
    padding: scale(10),
    marginTop: verticalScale(10),
  },
  subSettingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeBtn: {
    flex: 1,
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    borderRadius: scale(8),
    marginHorizontal: scale(2),
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
  },
});

export default SettingsScreen;
