import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  AppBadge,
  AppButton,
  AppToast,
  FilterPillsBar,
  AppSearchBar,
  GlassCard,
  MetricIconDisc,
} from '../../components/core/index.js';
import { DocumentCopyIcon, ClockIcon } from '../../assets/vectors/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, moderateScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { PERMISSIONS, hasPermission } from '../../store/useStaffStore.js';
import { useDistributorStore } from '../../store/useDistributorStore.js';
import {
  DistributorCard,
  PurchaseOrderCard,
  ExpiryClaimCard,
  CreatePOModal,
  CreateExpiryClaimModal,
} from '../../components/distributor/index.js';

const TABS = ['Distributors', 'Purchase Orders', 'Expiry Claims'];

/**
 * EmptyBoxIcon - Box SVG Icon for Zero-Item State
 */
const EmptyBoxIcon = ({ color, size = 32 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * DistributorConnectScreen - Interactive Pharma Distributor Ordering & Expiry Workflow
 *
 * Implements strict OneRx architecture:
 * - Wrap in <AppScreenContainer scrollable={false} withBottomNavClearance={true}>
 * - Top KPI Summary Strip with 2 side-by-side stat cards (Pending POs & Pending Expiry Claims)
 * - Search Bar & Fixed-Height Filter Tabs (Distributors | Purchase Orders | Expiry Claims)
 * - Single clean FlatList (zero nested ScrollViews)
 * - Functional CreatePOModal & CreateExpiryClaimModal with left-side back button
 * - Direct linkage with TradeSchemesScreen bookedScheme navigation payload
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} [props.route]
 */
export const DistributorConnectScreen = ({ navigation, route }) => {
  const { colors, isDark, spacing, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    distributors,
    purchaseOrders,
    expiryClaims,
    approvePurchaseOrder,
    approveExpiryClaim,
  } = useDistributorStore();

  const [activeTab, setActiveTab] = useState('Distributors');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [createPoVisible, setCreatePoVisible] = useState(false);
  const [createExpiryVisible, setCreateExpiryVisible] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Auto-handle bookedScheme payload passed from TradeSchemesScreen
  useEffect(() => {
    const scheme = route?.params?.bookedScheme;
    if (scheme) {
      setSelectedScheme(scheme);
      const matched = distributors.find(
        (d) =>
          d.name.toLowerCase().includes(scheme.distributor.toLowerCase()) ||
          scheme.distributor.toLowerCase().includes(d.shortName?.toLowerCase() || '')
      );
      setSelectedDistributor(matched || distributors[0]);
      setActiveTab('Distributors');
      setCreatePoVisible(true);
    }
  }, [route?.params?.bookedScheme, distributors]);

  // KPI Calculations
  const pendingPOCount = useMemo(() => {
    return purchaseOrders.filter((p) => p.status === 'PENDING_APPROVAL' || p.status === 'Pending Approval').length;
  }, [purchaseOrders]);

  const pendingExpiryCount = useMemo(() => {
    return expiryClaims.filter((c) => c.status === 'PENDING_APPROVAL' || c.status === 'Ready for Return Authorization').length;
  }, [expiryClaims]);

  // Handlers for initiating modals
  const handleInitiatePO = useCallback((distributor) => {
    setSelectedDistributor(distributor);
    setSelectedScheme(null);
    setCreatePoVisible(true);
  }, []);

  const handleExpiryClaim = useCallback((distributor) => {
    setSelectedDistributor(distributor);
    setCreateExpiryVisible(true);
  }, []);

  // Handlers for approvals with RBAC permission check
  const handleApprovePo = useCallback(
    (poId) => {
      if (!hasPermission(PERMISSIONS.PO_APPROVER)) {
        AppToast.show({
          title: 'Permission Denied',
          message: 'Only authorized PO Approvers can sign and submit orders.',
          type: 'warning',
        });
        return;
      }
      approvePurchaseOrder(poId);
    },
    [approvePurchaseOrder]
  );

  const handleApproveExpiry = useCallback(
    (claimId) => {
      if (!hasPermission(PERMISSIONS.EXPIRY_APPROVER)) {
        AppToast.show({
          title: 'Permission Denied',
          message: 'Only authorized Expiry Approvers can approve credit note claims.',
          type: 'warning',
        });
        return;
      }
      approveExpiryClaim(claimId);
    },
    [approveExpiryClaim]
  );

  // Filtered dataset according to active tab and search query
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (activeTab === 'Distributors') {
      return distributors.filter((item) => {
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.territory.toLowerCase().includes(q) ||
          item.contactPerson.toLowerCase().includes(q)
        );
      });
    }

    if (activeTab === 'Purchase Orders') {
      return purchaseOrders.filter((item) => {
        if (!q) return true;
        return (
          item.poNumber.toLowerCase().includes(q) ||
          item.distributorName.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
        );
      });
    }

    if (activeTab === 'Expiry Claims') {
      return expiryClaims.filter((item) => {
        if (!q) return true;
        return (
          item.claimNumber.toLowerCase().includes(q) ||
          item.skuName.toLowerCase().includes(q) ||
          item.batchNo.toLowerCase().includes(q) ||
          item.distributorName.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
        );
      });
    }

    return [];
  }, [activeTab, searchQuery, distributors, purchaseOrders, expiryClaims]);

  // Key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Render Item Callback
  const renderItem = useCallback(
    ({ item }) => {
      if (activeTab === 'Distributors') {
        return (
          <DistributorCard
            distributor={item}
            onInitiatePO={handleInitiatePO}
            onExpiryClaim={handleExpiryClaim}
          />
        );
      }

      if (activeTab === 'Purchase Orders') {
        return (
          <PurchaseOrderCard
            po={item}
            onApprove={handleApprovePo}
          />
        );
      }

      if (activeTab === 'Expiry Claims') {
        return (
          <ExpiryClaimCard
            claim={item}
            onApprove={handleApproveExpiry}
          />
        );
      }

      return null;
    },
    [activeTab, handleInitiatePO, handleExpiryClaim, handleApprovePo, handleApproveExpiry]
  );

  // Empty State Component
  const renderEmptyComponent = useMemo(
    () => (
      <GlassCard
        style={[
          styles.emptyCard,
          {
            padding: spacing?.cardPadding || scale(20),
            borderRadius: radii?.card || scale(20),
          },
        ]}
      >
        <MetricIconDisc size={56} isDark={isDark} variant="neutral">
          <EmptyBoxIcon
            color={colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B')}
            size={28}
          />
        </MetricIconDisc>

        <AppText
          style={[
            styles.emptyTitle,
            typography?.titleMedium,
            {
              color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
              fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
            },
          ]}
        >
          No Records Found
        </AppText>

        <AppText
          style={[
            styles.emptySubtitle,
            typography?.bodySmall,
            {
              color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
              fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular',
            },
          ]}
        >
          {searchQuery
            ? `No records match "${searchQuery}".`
            : `No ${activeTab.toLowerCase()} available at this time.`}
        </AppText>

        {searchQuery ? (
          <AppButton
            variant="secondary"
            size="sm"
            title="Clear Search"
            onPress={() => setSearchQuery('')}
            style={styles.resetBtn}
          />
        ) : null}
      </GlassCard>
    ),
    [colors, isDark, spacing, radii, typography, fontFamilies, searchQuery, activeTab]
  );

  return (
    <AppScreenContainer
      scrollable={false}
      withAmbientGlow={true}
      withBottomNavClearance={false}
      withHorizontalPadding={false}
      contentContainerStyle={{ paddingBottom: 0 }}
    >
      {/* ── Fixed Header Area ────────────────────────────────────────── */}
      <View style={[styles.headerContainer, { paddingHorizontal: spacing?.screenHorizontal || scale(20) }]}>
        <AppHeader
          title="Distributor Connect"
          onBack={() => navigation.goBack()}
          showBack={true}
          rightElement={
            <AppBadge
              label={`${distributors.length} Distributors`}
              variant="brand"
              isMono={true}
            />
          }
        />
      </View>

      {/* ── Top KPI Summary Strip (2 Side-by-Side Stat Cards) ────────── */}
      <View
        style={[
          styles.kpiContainer,
          {
            paddingHorizontal: spacing?.screenHorizontal || scale(20),
            gap: spacing?.sm || scale(10),
            marginBottom: verticalScale(12),
          },
        ]}
      >
        {/* KPI 1: Pending POs */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('Purchase Orders')}
          style={styles.kpiTouchable}
          accessibilityRole="button"
          accessibilityLabel={`Pending POs: ${pendingPOCount}`}
        >
          {isDark ? (
            <GlassCard noPadding style={styles.kpiCard}>
              <View style={styles.kpiTileContent}>
                <View style={styles.kpiTopRow}>
                  <MetricIconDisc size={34} variant="teal">
                    <DocumentCopyIcon size={18} color="#FFFFFF" />
                  </MetricIconDisc>
                  <AppBadge label="Pending" variant="accent" size="sm" isMono={true} />
                </View>
                <AppText
                  style={[
                    styles.kpiCountText,
                    {
                      color: colors.brand?.primary || '#009BA9',
                      fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                    },
                  ]}
                >
                  {pendingPOCount}
                </AppText>
                <AppText
                  numberOfLines={1}
                  style={[
                    styles.kpiTitleText,
                    {
                      color: colors.text?.secondary || '#94A3B8',
                      fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    },
                  ]}
                >
                  Pending POs
                </AppText>
              </View>
            </GlassCard>
          ) : (
            <View
              style={[
                styles.kpiCard,
                styles.kpiLightCard,
                { borderColor: colors.border?.card || '#F0F0F0' },
                shadows?.light?.card || shadows?.card,
              ]}
            >
              <View style={styles.kpiTileContent}>
                <View style={styles.kpiTopRow}>
                  <MetricIconDisc size={34} variant="teal">
                    <DocumentCopyIcon size={18} color={colors.brand?.primaryDark || '#0F4761'} />
                  </MetricIconDisc>
                  <AppBadge label="Pending" variant="accent" size="sm" isMono={true} />
                </View>
                <AppText
                  style={[
                    styles.kpiCountText,
                    {
                      color: colors.brand?.primary || '#009BA9',
                      fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                    },
                  ]}
                >
                  {pendingPOCount}
                </AppText>
                <AppText
                  numberOfLines={1}
                  style={[
                    styles.kpiTitleText,
                    {
                      color: colors.text?.secondary || '#64748B',
                      fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    },
                  ]}
                >
                  Pending POs
                </AppText>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* KPI 2: Pending Expiry Claims */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('Expiry Claims')}
          style={styles.kpiTouchable}
          accessibilityRole="button"
          accessibilityLabel={`Expiry Claims: ${pendingExpiryCount}`}
        >
          {isDark ? (
            <GlassCard noPadding style={styles.kpiCard}>
              <View style={styles.kpiTileContent}>
                <View style={styles.kpiTopRow}>
                  <MetricIconDisc size={34} variant="gold">
                    <ClockIcon size={18} color="#FFFFFF" />
                  </MetricIconDisc>
                  <AppBadge label="Action Req" variant="brand" size="sm" isMono={true} />
                </View>
                <AppText
                  style={[
                    styles.kpiCountText,
                    {
                      color: colors.brand?.accent || '#FB6B03',
                      fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                    },
                  ]}
                >
                  {pendingExpiryCount}
                </AppText>
                <AppText
                  numberOfLines={1}
                  style={[
                    styles.kpiTitleText,
                    {
                      color: colors.text?.secondary || '#94A3B8',
                      fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    },
                  ]}
                >
                  Pending Expiries
                </AppText>
              </View>
            </GlassCard>
          ) : (
            <View
              style={[
                styles.kpiCard,
                styles.kpiLightCard,
                { borderColor: colors.border?.card || '#F0F0F0' },
                shadows?.light?.card || shadows?.card,
              ]}
            >
              <View style={styles.kpiTileContent}>
                <View style={styles.kpiTopRow}>
                  <MetricIconDisc size={34} variant="gold">
                    <ClockIcon size={18} color={colors.brand?.primaryDark || '#0F4761'} />
                  </MetricIconDisc>
                  <AppBadge label="Action Req" variant="brand" size="sm" isMono={true} />
                </View>
                <AppText
                  style={[
                    styles.kpiCountText,
                    {
                      color: colors.brand?.accent || '#FB6B03',
                      fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                    },
                  ]}
                >
                  {pendingExpiryCount}
                </AppText>
                <AppText
                  numberOfLines={1}
                  style={[
                    styles.kpiTitleText,
                    {
                      color: colors.text?.secondary || '#64748B',
                      fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    },
                  ]}
                >
                  Pending Expiries
                </AppText>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <View style={[styles.searchContainer, { paddingHorizontal: spacing?.screenHorizontal || scale(20) }]}>
        <AppSearchBar
          placeholder="Search distributor, PO# or claim..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ── Fixed-Height Filter Tabs (Distributors | POs | Expiries) ─── */}
      <FilterPillsBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.tabBar}
      />

      {/* ── Single FlatList (Clean Zero-Clutter Architecture) ────────── */}
      <FlatList
        data={filteredData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing?.screenHorizontal || scale(20),
            paddingTop: spacing?.sm || verticalScale(8),
            paddingBottom: Math.max(insets?.bottom ?? 0, verticalScale(16)) + verticalScale(12),
            gap: spacing?.md || verticalScale(12),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={renderEmptyComponent}
        style={styles.list}
      />

      {/* ── Draft & Submit PO Modal ──────────────────────────────────── */}
      <CreatePOModal
        visible={createPoVisible}
        onClose={() => {
          setCreatePoVisible(false);
          setSelectedScheme(null);
        }}
        selectedDistributor={selectedDistributor}
        initialScheme={selectedScheme}
      />

      {/* ── Log Near-Expiry Claim Modal ──────────────────────────────── */}
      <CreateExpiryClaimModal
        visible={createExpiryVisible}
        onClose={() => setCreateExpiryVisible(false)}
        selectedDistributor={selectedDistributor}
      />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  kpiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  kpiTouchable: {
    flex: 1,
  },
  kpiCard: {
    width: '100%',
    borderRadius: radii?.card || scale(18),
  },
  kpiLightCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },
  kpiTileContent: {
    padding: moderateScale(14),
    flexDirection: 'column',
  },
  kpiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  kpiCountText: {
    fontSize: scaleFont(24),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(2),
  },
  kpiTitleText: {
    fontSize: scaleFont(12),
  },
  searchContainer: {
    width: '100%',
    marginBottom: verticalScale(10),
  },
  tabBar: {
    marginBottom: verticalScale(10),
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(32),
    marginTop: verticalScale(20),
  },
  emptyTitle: {
    fontSize: scaleFont(16),
    marginTop: verticalScale(14),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: scaleFont(13),
    marginTop: verticalScale(6),
    textAlign: 'center',
    lineHeight: scaleFont(18),
    paddingHorizontal: scale(16),
  },
  resetBtn: {
    minWidth: scale(130),
    marginTop: verticalScale(16),
  },
});

export default DistributorConnectScreen;
