import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { AppText } from '../global/index.js';
import { ChevronLeftSvg } from '../../assets/vectors/PrescriptionIcons.jsx';

// Seed catalog keyed by molecule/generic keywords for realistic alternate/mapped resolution
const GENERIC_CATALOG = [
  {
    keywords: ['co-amoxiclav', 'coamox', 'amoxicillin', 'augmentin'],
    genericName: 'Co-Amoxiclav',
    genericId: 'gen_coamox_625',
    brands: [
      {
        brandId: 'b_curam_625',
        brand: 'Sandoz / Novartis',
        name: 'Curam 625mg',
        brandName: 'Curam 625mg',
        strength: '625mg',
        tp: 235,
        mrp: 275,
        isAvailable: true,
        activeScheme: '10+1 Free',
      },
      {
        brandId: 'b_clavet_625',
        brand: 'Getz Pharma Ltd',
        name: 'Clavet 625mg',
        brandName: 'Clavet 625mg',
        strength: '625mg',
        tp: 225,
        mrp: 265,
        isAvailable: true,
        activeScheme: '5% Trade Off',
      },
      {
        brandId: 'b_calamox_625',
        brand: 'Bosch Pharmaceuticals',
        name: 'Calamox 625mg',
        brandName: 'Calamox 625mg',
        strength: '625mg',
        tp: 215,
        mrp: 255,
        isAvailable: true,
        activeScheme: null,
      },
    ],
  },
  {
    keywords: ['paracetamol', 'para_caf', 'panadol', 'caffeine'],
    genericName: 'Paracetamol + Caffeine',
    genericId: 'gen_para_caf',
    brands: [
      {
        brandId: 'alt_disprin_extra',
        brand: 'Reckitt Benckiser',
        name: 'Disprin Extra',
        brandName: 'Disprin Extra',
        strength: '500mg/65mg',
        tp: 75,
        mrp: 90,
        isAvailable: true,
        activeScheme: '10+1 Bonus',
      },
      {
        brandId: 'alt_calpol_plus',
        brand: 'GSK Pakistan',
        name: 'Calpol Plus',
        brandName: 'Calpol Plus',
        strength: '500mg/65mg',
        tp: 80,
        mrp: 95,
        isAvailable: true,
        activeScheme: null,
      },
      {
        brandId: 'alt_febril_extra',
        brand: 'Martin Dow Ltd',
        name: 'Febril Extra',
        brandName: 'Febril Extra',
        strength: '500mg/65mg',
        tp: 70,
        mrp: 85,
        isAvailable: true,
        activeScheme: '5% Rebate',
      },
    ],
  },
  {
    keywords: ['omeprazole', 'risek', 'omega', 'omee'],
    genericName: 'Omeprazole 20mg Capsule',
    genericId: 'gen_omeprazole_20',
    brands: [
      {
        brandId: 'b_risek_20',
        brand: 'Getz Pharma Ltd',
        name: 'Risek 20mg',
        brandName: 'Risek 20mg',
        strength: '20mg',
        tp: 135,
        mrp: 160,
        isAvailable: true,
        activeScheme: '12+1 Bonus',
      },
      {
        brandId: 'b_omega_20',
        brand: 'Ferozsons Laboratories',
        name: 'Omega 20mg',
        brandName: 'Omega 20mg',
        strength: '20mg',
        tp: 120,
        mrp: 145,
        isAvailable: true,
        activeScheme: '5% Rebate',
      },
      {
        brandId: 'b_losec_20',
        brand: 'ICI / AstraZeneca',
        name: 'Losec 20mg',
        brandName: 'Losec 20mg',
        strength: '20mg',
        tp: 180,
        mrp: 210,
        isAvailable: true,
        activeScheme: null,
      },
      {
        brandId: 'b_omee_20',
        brand: 'Searle Company Ltd',
        name: 'Omee 20mg',
        brandName: 'Omee 20mg',
        strength: '20mg',
        tp: 110,
        mrp: 130,
        isAvailable: false,
        activeScheme: null,
      },
    ],
  },
  {
    keywords: ['metformin', 'glucophage', 'glycomet'],
    genericName: 'Metformin 500mg',
    genericId: 'gen_metformin_500',
    brands: [
      {
        brandId: 'b_glucophage_500',
        brand: 'Sanofi Aventis',
        name: 'Glucophage SR',
        brandName: 'Glucophage SR',
        strength: '500mg',
        tp: 135,
        mrp: 160,
        isAvailable: true,
        activeScheme: '10+1 Bonus',
      },
      {
        brandId: 'b_glycomet_500',
        brand: 'USV Pharma',
        name: 'Glycomet GP',
        brandName: 'Glycomet GP',
        strength: '500mg',
        tp: 120,
        mrp: 145,
        isAvailable: true,
        activeScheme: '5% Trade Off',
      },
      {
        brandId: 'b_obimet_500',
        brand: 'Cipla Ltd',
        name: 'Obimet SR',
        brandName: 'Obimet SR',
        strength: '500mg',
        tp: 110,
        mrp: 130,
        isAvailable: false,
        activeScheme: null,
      },
      {
        brandId: 'b_cetapin_500',
        brand: 'Sun Pharma',
        name: 'Cetapin XR',
        brandName: 'Cetapin XR',
        strength: '500mg',
        tp: 140,
        mrp: 170,
        isAvailable: true,
        activeScheme: null,
      },
    ],
  },
];

/**
 * Resolves a non-empty list of alternate/mapped brands sharing genericName/genericId.
 */
export const resolveBrandsForMedicine = (medicine = {}) => {
  const genericName = medicine?.genericName || medicine?.generic || '';
  const genericId = medicine?.genericId || null;

  const enrichBrand = (item, idx) => ({
    ...item,
    brandId:
      item.brandId ||
      item.id ||
      `alt_${idx}_${(item.brandName || item.name || 'sku').toLowerCase().replace(/\s+/g, '_')}`,
    brand: item.brand || item.manufacturer || 'Authorized Manufacturer',
    name: item.name || item.brandName || 'Standard Brand',
    brandName: item.brandName || item.name || 'Standard Brand',
    genericName: item.genericName || genericName,
    genericId: item.genericId || genericId,
    strength: item.strength ?? medicine?.strength ?? '',
    tp: Number(item.tp) || Number(medicine?.tp) || 120,
    mrp: Number(item.mrp) || Number(medicine?.mrp) || 145,
    isAvailable: item.isAvailable !== false && item.stock !== 'Out of Stock',
  });

  if (Array.isArray(medicine?.mappedBrands) && medicine.mappedBrands.length > 0) {
    return medicine.mappedBrands.map(enrichBrand);
  }
  if (Array.isArray(medicine?.alternateBrands) && medicine.alternateBrands.length > 0) {
    return medicine.alternateBrands.map(enrichBrand);
  }

  const lookupHaystack = `${genericId || ''} ${genericName} ${medicine?.brandName || ''} ${medicine?.name || ''}`.toLowerCase();
  const matchedEntry = GENERIC_CATALOG.find((entry) =>
    entry.keywords.some((kw) => lookupHaystack.includes(kw))
  );

  if (matchedEntry) {
    return matchedEntry.brands.map((b, idx) =>
      enrichBrand(
        {
          ...b,
          genericName: genericName || matchedEntry.genericName,
          genericId: genericId || matchedEntry.genericId,
        },
        idx
      )
    );
  }

  const moleculeLabel = (genericName || medicine?.name || medicine?.brandName || 'Metformin').trim();
  const shortToken = moleculeLabel.split(/[\s+/]+/)[0] || 'Standard';
  const strength = medicine?.strength || '';
  const baseTp = Number(medicine?.tp) || 135;
  const baseMrp = Number(medicine?.mrp) || 160;

  return [
    {
      brandId: `${genericId || 'gen'}_alt_1`,
      brand: 'Getz Pharma Ltd',
      name: `${shortToken} Plus`,
      brandName: `${shortToken} Plus`,
      genericName: genericName || moleculeLabel,
      genericId,
      strength,
      tp: baseTp,
      mrp: baseMrp,
      isAvailable: true,
      activeScheme: '10+1 Bonus',
    },
    {
      brandId: `${genericId || 'gen'}_alt_2`,
      brand: 'Sami Pharmaceuticals',
      name: `${shortToken} XR`,
      brandName: `${shortToken} XR`,
      genericName: genericName || moleculeLabel,
      genericId,
      strength,
      tp: Math.max(baseTp - 15, 50),
      mrp: Math.max(baseMrp - 15, 65),
      isAvailable: true,
      activeScheme: '5% Trade Off',
    },
    {
      brandId: `${genericId || 'gen'}_alt_3`,
      brand: 'Searle Company Ltd',
      name: `${shortToken} Forte`,
      brandName: `${shortToken} Forte`,
      genericName: genericName || moleculeLabel,
      genericId,
      strength,
      tp: baseTp + 10,
      mrp: baseMrp + 15,
      isAvailable: true,
      activeScheme: null,
    },
  ];
};

/**
 * MedicineBrandsView - View 4 (Available / Alternate & Generic-Mapped Brands)
 * Exact 1:1 port of OneRx MedicineBrandsView with Left < back chevron and bottom Close pill.
 *
 * @param {Object} props
 * @param {Object} props.medicine
 * @param {Function} props.onClose
 * @param {Function} [props.onBack]
 * @param {Function} [props.onSetViewState]
 * @param {Function} [props.onSelectBrand]
 */
export const MedicineBrandsView = ({
  medicine = {},
  onClose,
  onBack,
  onSetViewState,
  onSelectBrand,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const brands = useMemo(() => resolveBrandsForMedicine(medicine), [medicine]);

  const headerTitle =
    medicine?.genericName || medicine?.name || medicine?.brandName || 'Metformin 500mg';
  const headerSubtitle =
    medicine?.type || medicine?.use || medicine?.genericId || 'Diabetes management';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onSetViewState) {
      onSetViewState('SEARCH');
    } else {
      onClose?.();
    }
  };

  const renderBrandCard = ({ item }) => {
    const isAvail = item.isAvailable !== false && item.stock !== 'Out of Stock';
    const brandTitle = item.brandName || item.name;
    const companyName = item.brand || item.manufacturer || 'Authorized Manufacturer';
    const tp = item.tp || 0;
    const mrp = item.mrp || 0;
    const scheme = item.activeScheme;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectBrand?.(item, medicine)}
        style={[
          styles.brandCard,
          {
            backgroundColor: colors.surface.durationTabBg,
            borderColor: colors.border.brandCard,
          },
        ]}
      >
        {/* Top Subtitle Row: Manufacturer + Price/Scheme/Stock Metadata */}
        <View style={styles.cardTopRow}>
          <AppText
            style={[styles.brandCompany, { color: colors.text.brandCompany }]}
            numberOfLines={1}
          >
            {companyName}
          </AppText>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={(e) => {
              e?.stopPropagation?.();
              onSetViewState?.('PHARMACIES', item);
            }}
            style={[
              styles.stockPill,
              {
                backgroundColor: isAvail ? colors.status.availableBg : colors.status.errorBg,
                borderColor: isAvail ? colors.status.available : colors.status.error,
              },
            ]}
          >
            <AppText
              style={[
                styles.stockPillText,
                { color: isAvail ? colors.status.available : colors.status.error },
              ]}
            >
              {isAvail ? 'In Stock' : 'Out of Stock'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Main Bold Brand Title */}
        <AppText style={[styles.brandName, { color: colors.text.primary }]}>
          {brandTitle} {item.strength ? `• ${item.strength}` : ''}
        </AppText>

        {/* Bottom Metadata: TP & MRP in DMMono-Medium + Active Scheme Pill */}
        <View style={styles.cardBottomRow}>
          <AppText
            style={[styles.priceText, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {`TP: Rs. ${tp} • MRP: Rs. ${mrp}`}
          </AppText>

          {scheme ? (
            <View
              style={[
                styles.schemeBadge,
                {
                  backgroundColor: colors.status.accentBg,
                  borderColor: colors.brand.accent,
                },
              ]}
            >
              <AppText style={[styles.schemeBadgeText, { color: colors.brand.accent }]}>
                {scheme}
              </AppText>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.viewContainer}>
      {/* Exact OneRx Header: Left < back chevron + Medicine Title + Subtitle */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftSvg size={20} color={colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <AppText style={[styles.headerTitle, { color: colors.text.primary }]} numberOfLines={1}>
            {headerTitle}
          </AppText>
          <AppText
            style={[styles.headerSubtitle, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {headerSubtitle}
          </AppText>
        </View>
      </View>

      <FlatList
        style={styles.flexList}
        data={brands}
        renderItem={renderBrandCard}
        keyExtractor={(item, idx) =>
          String(item.brandId || item.id || `${item.brandName || item.name}-${idx}`)
        }
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.listContent}
      />

      {/* Exact OneRx Full-Width Rounded Pill Close Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
        <TouchableOpacity
          style={[
            styles.footerCloseBtn,
            {
              borderColor: colors.border.modalCloseBtn,
              backgroundColor: colors.surface.modalCloseBtnBg,
              marginBottom: insets.bottom > 0 ? spacing.xs : spacing.sm,
            },
          ]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <AppText style={[styles.closeBtnText, { color: colors.text.modalCloseBtn }]}>
            Close
          </AppText>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    flexShrink: 0,
  },
  backBtn: {
    paddingRight: spacing.xs,
    paddingVertical: verticalScale(2),
    marginTop: verticalScale(2),
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLarge,
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    marginTop: spacing.xxs,
  },
  flexList: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: verticalScale(24),
    gap: spacing.sm,
  },
  brandCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxs,
  },
  brandCompany: {
    ...typography.caption,
    flex: 1,
    marginRight: spacing.sm,
  },
  stockPill: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: radii.pill,
    borderWidth: 1,
    flexShrink: 0,
  },
  stockPillText: {
    ...typography.badge,
    fontWeight: '600',
  },
  brandName: {
    ...typography.bodyLarge,
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  priceText: {
    ...typography.monoClinical,
    fontFamily: fontFamilies.monoMedium,
    flexShrink: 1,
  },
  schemeBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: radii.pill,
    borderWidth: 1,
    marginLeft: spacing.sm,
  },
  schemeBadgeText: {
    ...typography.monoBadge,
  },
  bottomBarContainer: {
    width: '100%',
    paddingTop: spacing.xs,
    flexShrink: 0,
  },
  footerCloseBtn: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  closeBtnText: {
    ...typography.bodyLarge,
  },
});

export default MedicineBrandsView;
