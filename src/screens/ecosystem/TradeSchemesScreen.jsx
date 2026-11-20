import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  AppInput,
  MetricIconDisc,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';

const DEMO_SCHEMES = [
  {
    id: 'sch_1',
    brandName: 'Augmentin 625mg Tab 10s',
    pharma: 'GSK',
    category: 'Antibiotic',
    slab: '10 + 1 Free',
    rebate: 'Plus 3% Early Pay Rebate',
    moq: '20 Packs',
    validTill: '28 Nov 2026',
    distributor: 'Muller & Phipps Pakistan',
    tp: 240,
  },
  {
    id: 'sch_2',
    brandName: 'Risek 20mg Cap 14s',
    pharma: 'Getz Pharma',
    category: 'Gastro',
    slab: '12 + 2 Bonus',
    rebate: 'Free Territory POS Display',
    moq: '12 Packs',
    validTill: '30 Nov 2026',
    distributor: 'Ali Gohar & Co',
    tp: 135,
  },
  {
    id: 'sch_3',
    brandName: 'Brufen 400mg Tab 30s',
    pharma: 'Abbott',
    category: 'Analgesic',
    slab: '20 + 3 Free',
    rebate: '5% Direct Distributor Credit',
    moq: '20 Packs',
    validTill: '05 Dec 2026',
    distributor: 'Premier Distributors',
    tp: 65,
  },
  {
    id: 'sch_4',
    brandName: 'Lipiget 20mg Tab 10s',
    pharma: 'Getz Pharma',
    category: 'Cardio',
    slab: '10 + 1 Free',
    rebate: 'Accredited CME Points',
    moq: '10 Packs',
    validTill: '15 Dec 2026',
    distributor: 'Ali Gohar & Co',
    tp: 210,
  },
  {
    id: 'sch_5',
    brandName: 'Panadol Extra Tab 100s',
    pharma: 'GSK',
    category: 'Analgesic',
    slab: '5 + 1 Bonus Box',
    rebate: 'Fast-Moving Seasonal Allocation',
    moq: '5 Boxes',
    validTill: '25 Nov 2026',
    distributor: 'Muller & Phipps Pakistan',
    tp: 720,
  },
];

const CATEGORIES = ['All', 'Antibiotic', 'Gastro', 'Analgesic', 'Cardio'];
const PHARMAS = ['All', 'GSK', 'Getz Pharma', 'Abbott'];

/**
 * TradeSchemesScreen - Manufacturer Discount Slabs & Bonus Deals
 * Mandated by ONERETAIL_PRD.md:
 * - Trade discount slabs, active bonus units, booking windows, and MOQ
 * - Filter by category and manufacturer
 * - Direct booking linkage with Distributor Connect
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const TradeSchemesScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPharma, setSelectedPharma] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = useMemo(() => {
    return DEMO_SCHEMES.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchPharma = selectedPharma === 'All' || item.pharma === selectedPharma;
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        item.brandName.toLowerCase().includes(q) ||
        item.pharma.toLowerCase().includes(q) ||
        item.distributor.toLowerCase().includes(q);
      return matchCat && matchPharma && matchQ;
    });
  }, [selectedCategory, selectedPharma, searchQuery]);

  const handleBookScheme = (scheme) => {
    AppToast.show({
      title: 'Scheme Selected',
      message: `${scheme.slab} booked for ${scheme.brandName}. Routing to Distributor Connect...`,
      type: 'success',
    });
    navigation.navigate('DistributorConnect', { bookedScheme: scheme });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true} withBottomNavClearance={true}>
      <AppHeader
        title="Trade Schemes"
        onBack={() => navigation.goBack()}
        showBack={true}
        rightElement={<AppBadge label={`${filteredSchemes.length} Active`} variant="brand" />}
      />

      {/* Search Input */}
      <AppInput
        placeholder="Search trade schemes, brands, pharma..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedCategory === cat
                    ? colors.brand?.primary
                    : isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          >
            <AppText
              variant="caption"
              colorType={selectedCategory === cat ? 'inverse' : 'primary'}
              style={{ fontWeight: selectedCategory === cat ? '700' : '400' }}
            >
              {cat}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Schemes List */}
      {filteredSchemes.map((scheme) => (
        <GlassCard key={scheme.id} style={styles.schemeCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <AppBadge label={scheme.pharma} variant="brand" size="sm" style={{ marginBottom: 4 }} />
              <AppText variant="titleMedium" colorType="primary">
                {scheme.brandName}
              </AppText>
              <AppText variant="caption" colorType="muted">
                Distributor: {scheme.distributor}
              </AppText>
            </View>

            <View style={styles.slabBadgeWrap}>
              <AppBadge label={scheme.slab} variant="accent" />
            </View>
          </View>

          {/* Scheme Details Block */}
          <View
            style={[
              styles.schemeDetailsBox,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)',
                borderColor: colors.border?.subtle,
              },
            ]}
          >
            <View style={styles.detailRow}>
              <AppText variant="caption" colorType="muted">Rebate / Bonus:</AppText>
              <AppText variant="caption" colorType="brand">{scheme.rebate}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" colorType="muted">Minimum Order (MOQ):</AppText>
              <AppText variant="caption" colorType="primary">{scheme.moq}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" colorType="muted">Booking Window:</AppText>
              <AppText variant="caption" colorType="muted">Valid till {scheme.validTill}</AppText>
            </View>
          </View>

          <View style={{ height: verticalScale(10) }} />

          <AppButton
            variant="secondary"
            size="sm"
            title="Book Scheme with Distributor"
            onPress={() => handleBookScheme(scheme)}
          />
        </GlassCard>
      ))}

      <View style={{ height: verticalScale(20) }} />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  filterScroll: {
    flexDirection: 'row',
    marginVertical: verticalScale(6),
  },
  filterChip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: scale(14),
    marginRight: scale(6),
  },
  schemeCard: {
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
  slabBadgeWrap: {
    alignItems: 'flex-end',
  },
  schemeDetailsBox: {
    borderRadius: scale(10),
    borderWidth: 1,
    padding: scale(10),
    marginTop: verticalScale(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
});

export default TradeSchemesScreen;