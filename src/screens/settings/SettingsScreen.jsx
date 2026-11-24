import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
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
  AppModal,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useStaffStore } from '../../store/useStaffStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import {
  resolveTierFromPoints,
  PHARMACY_TIERS_CONFIG,
} from '../../theme/tierThemes.js';
import {
  TransferArrowsIconSvg,
  SlidersIconSvg,
  HospitalIconSvg,
  UserOutlineIconSvg,
  ShieldCheckIcon,
  ChevronRightSvg,
} from '../../assets/vectors/index.js';

/**
 * SunIconSvg - High-contrast Sun SVG for Light mode
 */
const SunIconSvg = ({ size = 18, color = '#F59E0B' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * MoonIconSvg - Crisp Moon SVG for Dark mode
 */
const MoonIconSvg = ({ size = 18, color = '#6366F1' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * SystemIconSvg - Clean Monitor / Device SVG for System theme mode
 */
const SystemIconSvg = ({ size = 18, color = '#009BA9' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="3" width="20" height="14" rx="2.5" stroke={color} strokeWidth="1.8" />
    <Path d="M8 21h8M12 17v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const CONTACT_PREF_OPTIONS = [
  { id: 'all', title: 'All Verified Pharma Reps', subtitle: 'Pharma field rep in-person visits & digital notifications' },
  { id: 'distributors_only', title: 'Authorized Distributors Only', subtitle: 'Only linked authorized distributor reps & ordering logistics' },
  { id: 'admin_only', title: 'Admin Approved Only', subtitle: 'Strictly critical batch recalls and verified regulatory alerts only' },
];

/**
 * SettingsScreen - Platform Settings & Privacy Controls
 * Grouped Architecture modeled on OneRx SettingsScreen:
 * - Top Pharmacy Profile Hero Card (avatar thumbnail, name, territory, PII tier badge, chevron)
 * - Section 1: Inventory & Pharma Privacy (Reciprocal SKU toggle + warning strip, anonymized data sharing, contact prefs)
 * - Section 2: Pharmacy Operations & Team (Staff RBAC, Drug licenses, System integration mode)
 * - Section 3: Appearance & App Preferences (Light / Dark / System segmented pill selector)
 * - Sign Out Action: Full-width destructive button with confirmation alert
 */
export const SettingsScreen = ({ navigation }) => {
  const { colors, spacing, isDark, themeMode, setThemeMode } = useTheme();
  const pharmacy = usePharmacyStore();
  const setSkuVisibility = usePharmacyStore((s) => s.setSkuVisibility);
  const staffMembers = useStaffStore((s) => s.staffMembers) || [];
  const logout = useAuthStore((s) => s.logout);

  // Privacy toggles
  const [shareAnonymizedData, setShareAnonymizedData] = useState(true);
  const [contactPref, setContactPref] = useState('all');
  const [isContactPrefModalVisible, setContactPrefModalVisible] = useState(false);
  const [isIntegrationModalVisible, setIntegrationModalVisible] = useState(false);

  // Dynamic Tier calculations
  const piiScore = Number(pharmacy.piiScore || 842);
  const tierKey = useMemo(() => resolveTierFromPoints(piiScore), [piiScore]);
  const tierConfig = PHARMACY_TIERS_CONFIG[tierKey] || PHARMACY_TIERS_CONFIG.key_account;
  const tierLabel = tierConfig?.label || 'Key Account';

  const selectedContactPref = useMemo(
    () => CONTACT_PREF_OPTIONS.find((opt) => opt.id === contactPref) || CONTACT_PREF_OPTIONS[0],
    [contactPref]
  );

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

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of OneRetail? Your session will be safely ended.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            AppToast.show({
              title: 'Signed Out',
              message: 'Your session has been securely ended.',
              type: 'info',
            });
            await logout();
          },
        },
      ]
    );
  };

  const dividerStyle = [
    styles.rowDivider,
    {
      backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
    },
  ];

  return (
    <AppScreenContainer
      scrollable={true}
      withAmbientGlow={true}
      withBottomNavClearance={true}
      withHorizontalPadding={false}
    >
      {/* Top Header */}
      <View style={styles.headerContainer}>
        <AppHeader
          title="Settings & Privacy"
          onBack={() => (navigation.canGoBack() ? navigation.goBack() : null)}
          showBack={navigation.canGoBack()}
        />
      </View>

      {/* ── TOP HERO CARD: Pharmacy Profile ─────────────────────────────── */}
      <View style={styles.sectionWrap}>
        <GlassCard style={styles.heroCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PharmacyProfile')}
            style={styles.heroTouchableRow}
            accessibilityRole="button"
            accessibilityLabel="View pharmacy profile details"
          >
            {/* Avatar / Façade thumbnail */}
            <View style={styles.heroAvatarWrap}>
              {pharmacy.facadePhotoUri ? (
                <Image
                  source={{ uri: pharmacy.facadePhotoUri }}
                  style={styles.heroAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <MetricIconDisc variant="teal" size={48}>
                  <HospitalIconSvg size={24} color={isDark ? '#FFFFFF' : '#0F4761'} />
                </MetricIconDisc>
              )}
            </View>

            {/* Profile Info */}
            <View style={styles.heroInfoCol}>
              <AppText
                style={[
                  styles.heroPharmacyName,
                  typography?.bodyLarge,
                  {
                    color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                  },
                ]}
                numberOfLines={1}
              >
                {pharmacy.name || 'Al-Shifa Medicos'}
              </AppText>

              <AppText
                style={[
                  styles.heroTerritorySubtitle,
                  typography?.caption,
                  {
                    color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                    fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular',
                  },
                ]}
                numberOfLines={1}
              >
                {pharmacy.territory || 'North Nazimabad, Karachi'}
              </AppText>

              <View style={styles.heroBadgeRow}>
                <AppBadge
                  label={`${tierLabel} Tier • ${piiScore} PII`}
                  variant="brand"
                  size="sm"
                  isMono={true}
                />
              </View>
            </View>

            {/* Trailing Chevron */}
            <View style={styles.heroChevronWrap}>
              <ChevronRightSvg
                size={20}
                color={colors.text?.muted || (isDark ? '#94A3B8' : '#8E98A8')}
              />
            </View>
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* ── SECTION 1: Inventory & Pharma Privacy ───────────────────────── */}
      <View style={styles.sectionWrap}>
        <AppText
          style={[
            styles.sectionTitle,
            typography?.captionMedium,
            { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
          ]}
        >
          INVENTORY & PHARMA PRIVACY
        </AppText>

        <GlassCard style={styles.sectionCard}>
          {/* Row 1: Reciprocal SKU Visibility */}
          <View style={styles.settingRow}>
            <MetricIconDisc variant="purple" size={38} marginRight={10}>
              <TransferArrowsIconSvg size={20} color={isDark ? '#FFFFFF' : '#0F4761'} />
            </MetricIconDisc>

            <View style={styles.settingTextCol}>
              <View style={styles.titleWithBadge}>
                <AppText
                  style={[
                    styles.rowTitle,
                    {
                      color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                      fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    },
                  ]}
                >
                  Reciprocal SKU Visibility
                </AppText>
                <AppBadge
                  label={pharmacy.skuVisibilityEnabled ? 'Active' : 'Private'}
                  variant={pharmacy.skuVisibilityEnabled ? 'success' : 'muted'}
                  size="sm"
                />
              </View>
              <AppText
                style={[
                  styles.rowSubtitle,
                  typography?.caption,
                  { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                Allow peer pharmacies in your territory to view your brand availability.
              </AppText>
            </View>

            <AppSwitch
              value={pharmacy.skuVisibilityEnabled}
              onValueChange={handleToggleSkuVisibility}
            />
          </View>

          {/* Reciprocal Data Exchange Rule Notice Strip */}
          <View
            style={[
              styles.reciprocalWarningBox,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : 'rgba(0, 155, 169, 0.06)',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 155, 169, 0.16)',
              },
            ]}
          >
            <AppText
              style={[
                styles.reciprocalWarningTitle,
                typography?.captionMedium,
                { color: colors.brand?.primary || '#009BA9' },
              ]}
            >
              Reciprocal Data Exchange Rule:
            </AppText>
            <AppText
              style={[
                styles.reciprocalWarningText,
                typography?.caption,
                { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
              ]}
            >
              When OFF, other pharmacies cannot view your SKU stock, and you cannot view nearby pharmacies' SKU availability.
            </AppText>
          </View>

          <View style={dividerStyle} />

          {/* Row 2: Anonymized Sales Insights Sharing */}
          <View style={styles.settingRow}>
            <MetricIconDisc variant="blue" size={38} marginRight={10}>
              <SlidersIconSvg size={20} color={isDark ? '#FFFFFF' : '#0F4761'} />
            </MetricIconDisc>

            <View style={styles.settingTextCol}>
              <AppText
                style={[
                  styles.rowTitle,
                  {
                    color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                  },
                ]}
              >
                Anonymized Sales Insights
              </AppText>
              <AppText
                style={[
                  styles.rowSubtitle,
                  typography?.caption,
                  { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                Share aggregated territory demand trends to earn daily PII points and wallet cash.
              </AppText>
            </View>

            <AppSwitch
              value={shareAnonymizedData}
              onValueChange={setShareAnonymizedData}
            />
          </View>

          <View style={dividerStyle} />

          {/* Row 3: Pharma Contact Preferences */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setContactPrefModalVisible(true)}
            style={styles.settingRowTouchable}
            accessibilityRole="button"
            accessibilityLabel="Configure pharma contact preferences"
          >
            <View style={styles.settingTextCol}>
              <AppText
                style={[
                  styles.rowTitle,
                  {
                    color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                  },
                ]}
              >
                Pharma Contact Preferences
              </AppText>
              <AppText
                style={[
                  styles.rowSubtitle,
                  typography?.caption,
                  { color: colors.brand?.primary || '#009BA9' },
                ]}
              >
                {selectedContactPref.title}
              </AppText>
            </View>

            <ChevronRightSvg
              size={18}
              color={colors.text?.muted || (isDark ? '#94A3B8' : '#8E98A8')}
            />
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* ── SECTION 2: Pharmacy Operations & Team ──────────────────────── */}
      <View style={styles.sectionWrap}>
        <AppText
          style={[
            styles.sectionTitle,
            typography?.captionMedium,
            { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
          ]}
        >
          PHARMACY OPERATIONS & TEAM
        </AppText>

        <GlassCard style={styles.sectionCard}>
          {/* Row 1: Staff Profiles & RBAC */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('StaffList')}
            style={styles.settingRowTouchable}
            accessibilityRole="button"
            accessibilityLabel="Manage staff profiles and RBAC permissions"
          >
            <MetricIconDisc variant="teal" size={38} marginRight={10}>
              <UserOutlineIconSvg size={20} color={isDark ? '#FFFFFF' : '#0F4761'} />
            </MetricIconDisc>

            <View style={styles.settingTextCol}>
              <AppText
                style={[
                  styles.rowTitle,
                  {
                    color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                  },
                ]}
              >
                Staff Profiles & RBAC
              </AppText>
              <AppText
                style={[
                  styles.rowSubtitle,
                  typography?.caption,
                  { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                Configure logins, passwords, and 7 operational permissions
              </AppText>
            </View>

            <View style={styles.actionWithBadgeRow}>
              <AppBadge
                label={`${staffMembers.length || 3} Members`}
                variant="neutral"
                size="sm"
              />
              <ChevronRightSvg
                size={18}
                color={colors.text?.muted || (isDark ? '#94A3B8' : '#8E98A8')}
              />
            </View>
          </TouchableOpacity>

          <View style={dividerStyle} />

          {/* Row 2: Drug Licenses & Verification */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('PharmacyProfile')}
            style={styles.settingRowTouchable}
            accessibilityRole="button"
            accessibilityLabel="View drug licenses and regulatory verification"
          >
            <MetricIconDisc variant="green" size={38} marginRight={10}>
              <ShieldCheckIcon size={20} color={isDark ? '#FFFFFF' : '#059669'} />
            </MetricIconDisc>

            <View style={styles.settingTextCol}>
              <AppText
                style={[
                  styles.rowTitle,
                  {
                    color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                    fontFamilies: fontFamilies.primaryMedium || 'DMSans-Medium',
                  },
                ]}
              >
                Drug Licenses & Verification
              </AppText>
              <AppText
                style={[
                  styles.rowSubtitle,
                  typography?.caption,
                  { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                DSL Form 9, Narcotics Form 10 & Health Dept Certs
              </AppText>
            </View>

            <View style={styles.actionWithBadgeRow}>
              <AppBadge
                label={pharmacy.dsl?.number || pharmacy.dslNumber || 'DSL-KAR-2024'}
                variant="success"
                size="sm"
              />
              <ChevronRightSvg
                size={18}
                color={colors.text?.muted || (isDark ? '#94A3B8' : '#8E98A8')}
              />
            </View>
          </TouchableOpacity>

          <View style={dividerStyle} />

          {/* Row 3: System Integration Mode */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setIntegrationModalVisible(true)}
            style={styles.settingRowTouchable}
            accessibilityRole="button"
            accessibilityLabel="View system integration mode details"
          >
            <MetricIconDisc variant="orange" size={38} marginRight={10}>
              <SlidersIconSvg size={20} color={isDark ? '#FFFFFF' : '#FB6B03'} />
            </MetricIconDisc>

            <View style={styles.settingTextCol}>
              <AppText
                style={[
                  styles.rowTitle,
                  {
                    color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                  },
                ]}
              >
                System Integration Mode
              </AppText>
              <AppText
                style={[
                  styles.rowSubtitle,
                  typography?.caption,
                  { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                Operating in Standalone Phone QR Mode
              </AppText>
            </View>

            <View style={styles.actionWithBadgeRow}>
              <AppBadge
                label="Phone QR Mode"
                variant="brand"
                size="sm"
              />
              <ChevronRightSvg
                size={18}
                color={colors.text?.muted || (isDark ? '#94A3B8' : '#8E98A8')}
              />
            </View>
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* ── SECTION 3: Appearance & App Preferences ────────────────────── */}
      <View style={styles.sectionWrap}>
        <AppText
          style={[
            styles.sectionTitle,
            typography?.captionMedium,
            { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
          ]}
        >
          APPEARANCE & APP PREFERENCES
        </AppText>

        <GlassCard style={styles.sectionCard}>
          <AppText
            style={[
              styles.rowTitle,
              {
                color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
              },
            ]}
          >
            Theme Mode
          </AppText>
          <AppText
            style={[
              styles.rowSubtitle,
              typography?.caption,
              {
                color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                marginBottom: verticalScale(12),
              },
            ]}
          >
            Select Light, Dark, or System mode with contrast-safe tokens.
          </AppText>

          {/* 3-Option Segmented Pill Selector */}
          <View style={styles.themeSelectorContainer}>
            {[
              { id: 'light', label: 'Light', icon: SunIconSvg },
              { id: 'dark', label: 'Dark', icon: MoonIconSvg },
              { id: 'system', label: 'System', icon: SystemIconSvg },
            ].map((mode) => {
              const isActive = themeMode === mode.id;
              const IconComp = mode.icon;

              return (
                <TouchableOpacity
                  key={mode.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    setThemeMode(mode.id);
                    AppToast.show({
                      title: 'Theme Updated',
                      message: `Appearance switched to ${mode.label} mode.`,
                      type: 'info',
                    });
                  }}
                  style={[
                    styles.themeOptionBtn,
                    {
                      backgroundColor: isActive
                        ? isDark
                          ? 'rgba(0, 155, 169, 0.22)'
                          : 'rgba(0, 155, 169, 0.12)'
                        : isDark
                          ? 'rgba(255, 255, 255, 0.04)'
                          : 'rgba(0, 0, 0, 0.03)',
                      borderColor: isActive
                        ? colors.brand?.primary || '#009BA9'
                        : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.06)',
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${mode.label} theme`}
                >
                  <IconComp
                    size={18}
                    color={
                      isActive
                        ? colors.brand?.primary || '#009BA9'
                        : isDark
                          ? '#94A3B8'
                          : '#64748B'
                    }
                  />
                  <AppText
                    style={[
                      styles.themeOptionLabel,
                      {
                        color: isActive
                          ? colors.brand?.primary || '#009BA9'
                          : isDark
                            ? '#FFFFFF'
                            : '#020202',
                        fontFamily: isActive
                          ? fontFamilies.primaryMedium || 'DMSans-Medium'
                          : fontFamilies.primaryRegular || 'DMSans-Regular',
                      },
                    ]}
                  >
                    {mode.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>
      </View>

      {/* ── SIGN OUT ACTION ────────────────────────────────────────────── */}
      <View style={styles.signOutWrap}>
        <AppButton
          variant="danger"
          size="lg"
          title="Sign Out"
          onPress={handleSignOut}
        />
      </View>

      {/* ── Pharma Contact Preferences Bottom Sheet Modal ─────────────── */}
      <AppModal
        visible={isContactPrefModalVisible}
        onClose={() => setContactPrefModalVisible(false)}
        title="Pharma Contact Preferences"
        type="bottomSheet"
      >
        <View style={styles.modalContent}>
          <AppText
            style={[
              styles.modalSubtitle,
              typography?.caption,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
            ]}
          >
            Select how authorized pharmaceutical manufacturer representatives can communicate with your retail pharmacy.
          </AppText>

          {CONTACT_PREF_OPTIONS.map((option) => {
            const isSelected = contactPref === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.75}
                onPress={() => {
                  setContactPref(option.id);
                  setContactPrefModalVisible(false);
                  AppToast.show({
                    title: 'Preferences Updated',
                    message: `Pharma contact set to: ${option.title}`,
                    type: 'success',
                  });
                }}
                style={[
                  styles.radioCard,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(0, 155, 169, 0.16)'
                        : 'rgba(0, 155, 169, 0.08)'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                    borderColor: isSelected
                      ? colors.brand?.primary || '#009BA9'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                <View style={styles.radioTextCol}>
                  <AppText
                    style={[
                      styles.radioTitle,
                      {
                        color: isSelected
                          ? colors.brand?.primary || '#009BA9'
                          : isDark
                            ? '#FFFFFF'
                            : '#020202',
                        fontFamily: isSelected
                          ? fontFamilies.primaryMedium || 'DMSans-Medium'
                          : fontFamilies.primaryRegular || 'DMSans-Regular',
                      },
                    ]}
                  >
                    {option.title}
                  </AppText>
                  <AppText
                    style={[
                      styles.radioSubtitle,
                      typography?.caption,
                      { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                    ]}
                  >
                    {option.subtitle}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.radioIndicator,
                    {
                      borderColor: isSelected
                        ? colors.brand?.primary || '#009BA9'
                        : isDark
                          ? '#94A3B8'
                          : '#CBD5E1',
                    },
                  ]}
                >
                  {isSelected && (
                    <View
                      style={[
                        styles.radioIndicatorDot,
                        { backgroundColor: colors.brand?.primary || '#009BA9' },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </AppModal>

      {/* ── System Integration Info Bottom Sheet Modal ──────────────────── */}
      <AppModal
        visible={isIntegrationModalVisible}
        onClose={() => setIntegrationModalVisible(false)}
        title="System Integration Architecture"
        type="bottomSheet"
      >
        <View style={styles.modalContent}>
          <View
            style={[
              styles.integrationHeroBox,
              {
                backgroundColor: isDark
                  ? 'rgba(0, 155, 169, 0.12)'
                  : 'rgba(0, 155, 169, 0.08)',
                borderColor: isDark
                  ? 'rgba(0, 155, 169, 0.25)'
                  : 'rgba(0, 155, 169, 0.2)',
              },
            ]}
          >
            <AppText
              style={[
                styles.integrationHeroTitle,
                { color: colors.brand?.primary || '#009BA9' },
              ]}
            >
              Current: Standalone Phone QR Mode
            </AppText>
            <AppText
              style={[
                styles.integrationHeroText,
                typography?.caption,
                { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
              ]}
            >
              OneRetail is currently operating in ultra-fast camera scan mode. No desktop POS connection is needed to verify prescriptions and claim manufacturer discounts.
            </AppText>
          </View>

          <AppText
            style={[
              styles.integrationSectionHeading,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202') },
            ]}
          >
            Need POS / ERP Integration?
          </AppText>
          <AppText
            style={[
              styles.integrationSectionBody,
              typography?.caption,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
            ]}
          >
            If your pharmacy operates a desktop ERP or inventory management system (Candela, Pharmacy Plus, Alvozen Retail, or custom SQL databases), you can connect real-time stock sync via the OneRetail Desktop Connector plugin.
          </AppText>

          <AppButton
            variant="secondary"
            size="md"
            title="Close Architecture Info"
            onPress={() => setIntegrationModalVisible(false)}
            style={{ marginTop: verticalScale(16) }}
          />
        </View>
      </AppModal>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: scale(16),
  },
  sectionWrap: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(10),
  },
  heroCard: {
    width: '100%',
    borderRadius: radii.card,
  },
  heroTouchableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  heroAvatarWrap: {
    marginRight: scale(12),
  },
  heroAvatarImage: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
  },
  heroInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  heroPharmacyName: {
    fontSize: scaleFont(16),
    letterSpacing: -0.3,
  },
  heroTerritorySubtitle: {
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  heroChevronWrap: {
    marginLeft: scale(8),
  },
  sectionTitle: {
    fontSize: scaleFont(11),
    letterSpacing: 0.8,
    marginBottom: verticalScale(6),
    marginLeft: scale(2),
  },
  sectionCard: {
    width: '100%',
    borderRadius: radii.card,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  settingRowTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: verticalScale(4),
  },
  settingTextCol: {
    flex: 1,
    marginRight: scale(10),
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  rowTitle: {
    fontSize: scaleFont(14),
    letterSpacing: -0.2,
  },
  rowSubtitle: {
    fontSize: scaleFont(11.5),
    lineHeight: scaleFont(16),
    marginTop: verticalScale(2),
  },
  reciprocalWarningBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: scale(10),
    marginTop: verticalScale(10),
  },
  reciprocalWarningTitle: {
    fontSize: scaleFont(12),
    fontWeight: '700',
  },
  reciprocalWarningText: {
    fontSize: scaleFont(11.5),
    lineHeight: scaleFont(16),
    marginTop: verticalScale(2),
  },
  rowDivider: {
    height: 1,
    width: '100%',
    marginVertical: verticalScale(10),
  },
  actionWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(8),
    width: '100%',
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(38),
    borderRadius: radii.pill,
    borderWidth: 1,
    gap: scale(6),
  },
  themeOptionLabel: {
    fontSize: scaleFont(12.5),
  },
  signOutWrap: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(14),
    marginBottom: verticalScale(10),
  },
  modalContent: {
    paddingVertical: verticalScale(8),
  },
  modalSubtitle: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(17),
    marginBottom: verticalScale(12),
  },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(12),
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: verticalScale(8),
  },
  radioTextCol: {
    flex: 1,
    marginRight: scale(12),
  },
  radioTitle: {
    fontSize: scaleFont(13.5),
    letterSpacing: -0.2,
  },
  radioSubtitle: {
    fontSize: scaleFont(11),
    lineHeight: scaleFont(15),
    marginTop: verticalScale(2),
  },
  radioIndicator: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIndicatorDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },
  integrationHeroBox: {
    padding: scale(12),
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: verticalScale(12),
  },
  integrationHeroTitle: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  integrationHeroText: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(17),
  },
  integrationSectionHeading: {
    fontSize: scaleFont(13),
    fontWeight: '700',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4),
  },
  integrationSectionBody: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(17),
  },
});

export default SettingsScreen;
