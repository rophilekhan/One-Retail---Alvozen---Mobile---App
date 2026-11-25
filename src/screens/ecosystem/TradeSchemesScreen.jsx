import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  AppBadge,
  FilterPillsBar,
  AppSearchBar,
  AppToast,
  AppModal,
  AppButton,
  GlassCard,
  MetricIconDisc,
} from '../../components/core/index.js';
import { TradeSchemeCard } from '../../components/ecosystem/TradeSchemeCard.jsx';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';

/**
 * Filter Categories for Trade Schemes
 */
const SCHEME_FILTERS = ['All Schemes', 'Bonus Slabs', 'Flat Discount', 'Expiring Soon'];

/**
 * Comprehensive Pakistani Pharma Trade Schemes Dataset
 */
const DEMO_SCHEMES = [
  {
    id: 'sch_1',
    brandName: 'Augmentin 625mg Tab 10s',
    pharma: 'GSK',
    generic: 'Co-Amoxiclav',
    category: 'Bonus Slabs',
    slab: '10 + 1 Free',
    rebate: 'Plus 3% Early Pay Rebate',
    moq: '20 Packs',
    validTill: '28 Nov 2026',
    distributor: 'Muller & Phipps Pakistan',
    tp: 240,
    isExpiringSoon: true,
    margin: '12.5%',
    terms: 'Valid on single invoice bookings. Deliveries dispatched within 24-48 hours across territory.',
  },
  {
    id: 'sch_2',
    brandName: 'Risek 20mg Cap 14s',
    pharma: 'Getz Pharma',
    generic: 'Omeprazole',
    category: 'Bonus Slabs',
    slab: '12 + 2 Bonus',
    rebate: 'Free Territory POS Display',
    moq: '12 Packs',
    validTill: '30 Nov 2026',
    distributor: 'Ali Gohar & Co',
    tp: 135,
    isExpiringSoon: false,
    margin: '16.7%',
    terms: 'Free merchandising counter pack included for Gold and Diamond tier verified retail pharmacies.',
  },
  {
    id: 'sch_3',
    brandName: 'Brufen 400mg Tab 30s',
    pharma: 'Abbott',
    generic: 'Ibuprofen',
    category: 'Flat Discount',
    slab: '15% Off TP',
    rebate: '5% Direct Distributor Credit',
    moq: '20 Packs',
    validTill: '05 Dec 2026',
    distributor: 'Premier Distributors',
    tp: 65,
    isExpiringSoon: false,
    margin: '18.0%',
    terms: 'Direct credit note will be issued with distributor invoice upon digital confirmation.',
  },
  {
    id: 'sch_4',
    brandName: 'Lipiget 20mg Tab 10s',
    pharma: 'Getz Pharma',
    generic: 'Atorvastatin',
    category: 'Bonus Slabs',
    slab: '10 + 1 Free',
    rebate: 'Accredited CME Points',
    moq: '10 Packs',
    validTill: '15 Dec 2026',
    distributor: 'Ali Gohar & Co',
    tp: 210,
    isExpiringSoon: false,
    margin: '10.0%',
    terms: 'Standard credit cycle applies for verified DRAP licensed retail accounts in territory.',
  },
  {
    id: 'sch_5',
    brandName: 'Panadol Extra Tab 100s',
    pharma: 'GSK',
    generic: 'Paracetamol + Caffeine',
    category: 'Expiring Soon',
    slab: '5 + 1 Bonus Box',
    rebate: 'Fast-Moving Seasonal Allocation',
    moq: '5 Boxes',
    validTill: '25 Nov 2026',
    distributor: 'Muller & Phipps Pakistan',
    tp: 720,
    isExpiringSoon: true,
    margin: '20.0%',
    terms: 'Limited territory quota allocation. First-come, first-served booking window.',
  },
  {
    id: 'sch_6',
    brandName: 'Cravit 500mg Tab 5s',
    pharma: 'Sami Pharmaceuticals',
    generic: 'Levofloxacin',
    category: 'Flat Discount',
    slab: '12% Flat Off',
    rebate: '2.5% Additional Cash Rebate',
    moq: '15 Packs',
    validTill: '27 Nov 2026',
    distributor: 'Muller & Phipps Pakistan',
    tp: 310,
    isExpiringSoon: true,
    margin: '14.5%',
    terms: 'Minimum 15 packs booking required to unlock distributor credit note.',
  },
];

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
 * TradeSchemesScreen - Manufacturer Discount Slabs & Bonus Deals
 *
 * Implements strict OneRx architecture:
 * - Wrap in <AppScreenContainer scrollable={false} withBottomNavClearance={true}>
 * - Fixed header + search input + horizontal locked FilterPillsBar
 * - Single clean FlatList (never nested in a ScrollView)
 * - Clean TradeSchemeCard with 3-zone vertical hierarchy
 * - Polished empty state card with "Reset Filters" action
 * - Scheme Detail summary bottom sheet (AppModal) with direct booking linkage to DistributorConnect
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const TradeSchemesScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('All Schemes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Filter schemes by active tab and search query
  const filteredSchemes = useMemo(() => {
    return DEMO_SCHEMES.filter((item) => {
      // 1. Tab category filter
      let matchTab = true;
      if (activeTab === 'Bonus Slabs') {
        matchTab =
          item.category === 'Bonus Slabs' ||
          item.slab.includes('+') ||
          item.slab.toLowerCase().includes('free') ||
          item.slab.toLowerCase().includes('bonus');
      } else if (activeTab === 'Flat Discount') {
        matchTab =
          item.category === 'Flat Discount' ||
          item.slab.includes('%') ||
          item.rebate.includes('%');
      } else if (activeTab === 'Expiring Soon') {
        matchTab = item.isExpiringSoon === true || item.category === 'Expiring Soon';
      }

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        item.brandName.toLowerCase().includes(q) ||
        item.pharma.toLowerCase().includes(q) ||
        item.generic.toLowerCase().includes(q) ||
        item.distributor.toLowerCase().includes(q) ||
        item.slab.toLowerCase().includes(q) ||
        item.rebate.toLowerCase().includes(q);

      return matchTab && matchQ;
    });
  }, [activeTab, searchQuery]);

  const handleBookScheme = useCallback(
    (scheme) => {
      setSelectedScheme(null);
      AppToast.show({
        title: 'Scheme Selected',
        message: `${scheme.slab} booked for ${scheme.brandName}. Routing to Distributor Connect...`,
        type: 'success',
      });
      navigation.navigate('DistributorConnect', { bookedScheme: scheme });
    },
    [navigation]
  );

  const handleOpenDetails = useCallback((scheme) => {
    setSelectedScheme(scheme);
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveTab('All Schemes');
    setSearchQuery('');
  }, []);

  // Render individual Scheme Card
  const renderItem = useCallback(
    ({ item }) => (
      <TradeSchemeCard
        scheme={item}
        onOrder={handleBookScheme}
        onDetails={handleOpenDetails}
      />
    ),
    [handleBookScheme, handleOpenDetails]
  );

  // Key extractor
  const keyExtractor = useCallback((item) => item.id, []);

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
          No Schemes Found
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
            ? `No trade schemes matching "${searchQuery}".`
            : 'No active promotional slabs available in this category.'}
        </AppText>

        <AppButton
          variant="secondary"
          size="sm"
          title="Reset Filters"
          onPress={handleResetFilters}
          style={styles.resetBtn}
        />
      </GlassCard>
    ),
    [colors, isDark, spacing, searchQuery, handleResetFilters]
  );

  return (
    <AppScreenContainer
      scrollable={false}
      withAmbientGlow={true}
      withBottomNavClearance={true}
      withHorizontalPadding={false}
      contentContainerStyle={{ paddingBottom: 0 }}
    >
      {/* ── Fixed Header Area ────────────────────────────────────────── */}
      <View style={[styles.headerContainer, { paddingHorizontal: spacing?.screenHorizontal || scale(20) }]}>
        <AppHeader
          title="Trade Schemes"
          onBack={() => navigation.goBack()}
          showBack={true}
          rightElement={
            <AppBadge
              label={`${filteredSchemes.length} Active`}
              variant="brand"
              isMono={true}
            />
          }
        />
      </View>

      {/* ── Search Input ────────────────────────────────────────────── */}
      <View style={[styles.searchContainer, { paddingHorizontal: spacing?.screenHorizontal || scale(20) }]}>
        <AppSearchBar
          placeholder="Search trade schemes, brands, pharma..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ── Locked Filter Pills Bar (Modeled on FilterTabs.jsx) ────── */}
      <FilterPillsBar
        tabs={SCHEME_FILTERS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.filterBar}
      />

      {/* ── Single FlatList (Clean Zero-Clutter Architecture) ────────── */}
      <FlatList
        data={filteredSchemes}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing?.screenHorizontal || scale(20),
            paddingTop: spacing?.sm || verticalScale(8),
            paddingBottom: (insets?.bottom ?? 0) + verticalScale(84),
            gap: spacing?.md || verticalScale(12),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={renderEmptyComponent}
        style={styles.list}
      />

      {/* ── Scheme Detail Summary Bottom Sheet ──────────────────────── */}
      <AppModal
        visible={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        type="bottomSheet"
        title="Scheme Details"
        showBackButton={true}
      >
        {selectedScheme ? (
          <View style={styles.modalContent}>
            {/* Modal Zone 1: Brand & Slab Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalBrandInfo}>
                <AppText
                  style={[
                    styles.modalBrandTitle,
                    typography?.titleMedium,
                    {
                      color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                      fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {selectedScheme.brandName}
                </AppText>
                <AppText
                  style={[
                    styles.modalBrandSub,
                    typography?.caption,
                    {
                      color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                      fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular',
                    },
                  ]}
                >
                  {selectedScheme.pharma} • {selectedScheme.generic}
                </AppText>
              </View>

              <AppBadge
                label={selectedScheme.slab}
                variant={selectedScheme.slab?.includes('%') ? 'accent' : 'brand'}
                isMono={true}
                size="md"
              />
            </View>

            {/* Modal Zone 2: Structured Metric Breakdown Box */}
            <View
              style={[
                styles.modalDetailsBox,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.04)'
                    : (colors.background?.secondary || '#F8FAFC'),
                  borderColor: colors.border?.card || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                },
              ]}
            >
              <View style={styles.modalRow}>
                <AppText
                  style={[
                    styles.modalRowLabel,
                    { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                  ]}
                >
                  Minimum Order (MOQ)
                </AppText>
                <AppText
                  style={[
                    styles.modalRowValue,
                    { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202') },
                  ]}
                >
                  {selectedScheme.moq}
                </AppText>
              </View>

              <View style={styles.modalRowDivider} />

              <View style={styles.modalRow}>
                <AppText
                  style={[
                    styles.modalRowLabel,
                    { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                  ]}
                >
                  Unit Trade Price (TP)
                </AppText>
                <AppText
                  style={[
                    styles.modalRowValue,
                    { color: colors.brand?.primary || '#009BA9' },
                  ]}
                >
                  {typeof selectedScheme.tp === 'number' ? `Rs. ${selectedScheme.tp}` : selectedScheme.tp}
                </AppText>
              </View>

              <View style={styles.modalRowDivider} />

              <View style={styles.modalRow}>
                <AppText
                  style={[
                    styles.modalRowLabel,
                    { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                  ]}
                >
                  Bonus / Extra Rebate
                </AppText>
                <AppText
                  style={[
                    styles.modalRowValue,
                    { color: isDark ? '#38D6E5' : (colors.brand?.primaryDark || '#0F4761') },
                  ]}
                >
                  {selectedScheme.rebate}
                </AppText>
              </View>

              <View style={styles.modalRowDivider} />

              <View style={styles.modalRow}>
                <AppText
                  style={[
                    styles.modalRowLabel,
                    { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                  ]}
                >
                  Projected Retail Margin
                </AppText>
                <AppText
                  style={[
                    styles.modalRowValue,
                    { color: colors.brand?.accent || '#FB6B03' },
                  ]}
                >
                  {selectedScheme.margin || '15.0%'}
                </AppText>
              </View>

              <View style={styles.modalRowDivider} />

              <View style={styles.modalRow}>
                <AppText
                  style={[
                    styles.modalRowLabel,
                    { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                  ]}
                >
                  Booking Validity
                </AppText>
                <AppText
                  style={[
                    styles.modalRowValue,
                    { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202') },
                  ]}
                >
                  Valid till {selectedScheme.validTill}
                </AppText>
              </View>

              <View style={styles.modalRowDivider} />

              <View style={styles.modalRow}>
                <AppText
                  style={[
                    styles.modalRowLabel,
                    { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                  ]}
                >
                  Authorized Distributor
                </AppText>
                <AppText
                  style={[
                    styles.modalRowValue,
                    {
                      color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                      fontFamily: fontFamilies.primaryMedium,
                    },
                  ]}
                >
                  {selectedScheme.distributor}
                </AppText>
              </View>
            </View>

            {/* Modal Zone 3: Booking Terms Note */}
            <View style={styles.modalTermsBox}>
              <AppText
                style={[
                  styles.modalTermsLabel,
                  { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                Terms & Conditions:
              </AppText>
              <AppText
                style={[
                  styles.modalTermsText,
                  { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                {selectedScheme.terms || 'Standard pharmaceutical distributor trade discount terms apply.'}
              </AppText>
            </View>

            {/* Modal Zone 4: Full-width Booking Button */}
            <AppButton
              variant="primary"
              title="Book Scheme with Distributor"
              onPress={() => handleBookScheme(selectedScheme)}
              style={styles.modalBookBtn}
            />
          </View>
        ) : null}
      </AppModal>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  searchContainer: {
    width: '100%',
    marginBottom: verticalScale(10),
  },
  filterBar: {
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
  modalContent: {
    width: '100%',
    flexDirection: 'column',
    paddingTop: verticalScale(4),
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(14),
  },
  modalBrandInfo: {
    flex: 1,
    marginRight: scale(12),
  },
  modalBrandTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  modalBrandSub: {
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
  },
  modalDetailsBox: {
    borderRadius: scale(14),
    borderWidth: 1,
    padding: scale(14),
    gap: verticalScale(8),
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalRowDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  modalRowLabel: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.primaryRegular,
  },
  modalRowValue: {
    fontSize: scaleFont(12.5),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  modalTermsBox: {
    marginTop: verticalScale(12),
    paddingHorizontal: scale(4),
  },
  modalTermsLabel: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  modalTermsText: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryRegular,
    lineHeight: scaleFont(16),
  },
  modalBookBtn: {
    marginTop: verticalScale(18),
    width: '100%',
  },
});

export default TradeSchemesScreen;
