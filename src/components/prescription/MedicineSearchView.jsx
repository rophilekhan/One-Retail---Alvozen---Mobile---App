import React, { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { useTheme } from '../../theme/index.js';
import { fontFamilies } from '../../theme/typography.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText } from '../global/index.js';
import {
  SearchIconSvg,
  CloseIconSvg,
  ClearCircleIconSvg,
  ChevronRightSvg,
  ChevronDown,
} from '../../assets/vectors/PrescriptionIcons.jsx';
import { HighlightedText } from './HighlightedText.jsx';
import { OptionPills } from './OptionPills.jsx';

const DEFAULT_GENERICS = [
  {
    id: 'g1',
    genericId: 'gen_metformin_500',
    genericName: 'Metformin 500mg',
    name: 'Metformin 500mg',
    type: 'Diabetes management',
    segment: 'Endocrine / Diabetes',
    brands: 4,
    tp: 135,
    mrp: 160,
    mappedBrands: [
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
  {
    id: 'g2',
    genericId: 'gen_omeprazole_20',
    genericName: 'Omeprazole 20mg Capsule',
    name: 'Omeprazole 20mg Capsule',
    type: 'Proton pump inhibitor',
    segment: 'Gastroenterology',
    brands: 4,
    tp: 135,
    mrp: 160,
    mappedBrands: [
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
    id: 'g3',
    genericId: 'gen_coamox_625',
    genericName: 'Co-Amoxiclav 625mg',
    name: 'Co-Amoxiclav 625mg',
    type: 'Broad-spectrum antibiotic',
    segment: 'Anti-Infective / Antibiotic',
    brands: 3,
    tp: 235,
    mrp: 275,
    mappedBrands: [
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
    ],
  },
  {
    id: 'g4',
    genericId: 'gen_para_caf',
    genericName: 'Paracetamol + Caffeine',
    name: 'Paracetamol + Caffeine',
    type: 'Analgesic / Antipyretic',
    segment: 'Pain Management & NSAIDs',
    brands: 3,
    tp: 75,
    mrp: 90,
    mappedBrands: [
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
    id: 'g5',
    genericId: 'gen_metoprolol_50',
    genericName: 'Metoprolol 50mg',
    name: 'Metoprolol 50mg',
    type: 'Cardiovascular / Beta blocker',
    segment: 'Cardiovascular / Antihypertensive',
    brands: 2,
    tp: 210,
    mrp: 245,
    mappedBrands: [
      {
        brandId: 'b_betaloc_50',
        brand: 'AstraZeneca',
        name: 'Betaloc 50mg',
        brandName: 'Betaloc 50mg',
        strength: '50mg',
        tp: 220,
        mrp: 260,
        isAvailable: true,
        activeScheme: null,
      },
      {
        brandId: 'b_mepressor_50',
        brand: 'Getz Pharma Ltd',
        name: 'Mepressor 50mg',
        brandName: 'Mepressor 50mg',
        strength: '50mg',
        tp: 180,
        mrp: 215,
        isAvailable: true,
        activeScheme: '12+1 Free',
      },
    ],
  },
];

const DEFAULT_SEGMENTS = [
  {
    id: 'ts1',
    genericId: 'seg_diabetes',
    genericName: 'Endocrine / Diabetes',
    name: 'Endocrine / Diabetes',
    type: 'Metformin • Sitagliptin • Glimepiride',
    topMolecules: 'Metformin, Sitagliptin, Glimepiride',
    brands: 18,
    tp: 135,
    mrp: 160,
    mappedBrands: [
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
        brandId: 'b_gluuvia_100',
        brand: 'MSD Pharma',
        name: 'Gluuvia 100mg',
        brandName: 'Gluuvia 100mg',
        strength: '100mg',
        tp: 450,
        mrp: 520,
        isAvailable: true,
        activeScheme: '5% Rebate',
      },
      {
        brandId: 'b_gluaryl_2',
        brand: 'Sanofi Aventis',
        name: 'Gluaryl 2mg',
        brandName: 'Gluaryl 2mg',
        strength: '2mg',
        tp: 180,
        mrp: 210,
        isAvailable: true,
        activeScheme: null,
      },
    ],
  },
  {
    id: 'ts2',
    genericId: 'seg_antibiotic',
    genericName: 'Anti-Infective / Antibiotic',
    name: 'Anti-Infective / Antibiotic',
    type: 'Co-Amoxiclav • Ciprofloxacin • Azithromycin',
    topMolecules: 'Co-Amoxiclav, Ciprofloxacin, Azithromycin',
    brands: 24,
    tp: 235,
    mrp: 275,
    mappedBrands: [
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
    ],
  },
  {
    id: 'ts3',
    genericId: 'seg_gastro',
    genericName: 'Gastroenterology',
    name: 'Gastroenterology',
    type: 'Omeprazole • Esomeprazole • Famotidine',
    topMolecules: 'Omeprazole, Esomeprazole, Famotidine',
    brands: 14,
    tp: 135,
    mrp: 160,
    mappedBrands: [
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
    ],
  },
  {
    id: 'ts4',
    genericId: 'seg_pain',
    genericName: 'Pain Management & NSAIDs',
    name: 'Pain Management & NSAIDs',
    type: 'Paracetamol + Caffeine • Ibuprofen • Diclofenac',
    topMolecules: 'Paracetamol + Caffeine, Ibuprofen, Diclofenac',
    brands: 20,
    tp: 75,
    mrp: 90,
    mappedBrands: [
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
    ],
  },
  {
    id: 'ts5',
    genericId: 'seg_cardio',
    genericName: 'Cardiovascular / Antihypertensive',
    name: 'Cardiovascular / Antihypertensive',
    type: 'Metoprolol • Amlodipine • Losartan',
    topMolecules: 'Metoprolol, Amlodipine, Losartan',
    brands: 16,
    tp: 210,
    mrp: 245,
    mappedBrands: [
      {
        brandId: 'b_betaloc_50',
        brand: 'AstraZeneca',
        name: 'Betaloc 50mg',
        brandName: 'Betaloc 50mg',
        strength: '50mg',
        tp: 220,
        mrp: 260,
        isAvailable: true,
        activeScheme: null,
      },
      {
        brandId: 'b_mepressor_50',
        brand: 'Getz Pharma Ltd',
        name: 'Mepressor 50mg',
        brandName: 'Mepressor 50mg',
        strength: '50mg',
        tp: 180,
        mrp: 215,
        isAvailable: true,
        activeScheme: '12+1 Free',
      },
    ],
  },
];

/**
 * MedicineSearchView - View 1 (Select Medicine / Substitution Search)
 * Exact 1:1 port of OneRx MedicineSearchView Figma design using strictly useTheme() tokens.
 *
 * @param {Object} props
 * @param {string} [props.title='Select Medicine']
 * @param {Array} [props.addedMedicines]
 * @param {Function} props.onClose
 * @param {Function} props.onSetViewState
 * @param {Function} [props.onSelectMedicine]
 * @param {string[]} [props.tabs]
 */
export const MedicineSearchView = ({
  title = 'Select Medicine',
  addedMedicines = [],
  onClose,
  onSetViewState,
  onSelectMedicine,
  tabs = ['Generic', 'Therapeutic Segment'],
}) => {
  const { colors, shadows, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(tabs[0] || 'Generic');

  const queryLower = searchQuery.toLowerCase().trim();

  const visibleItems = useMemo(() => {
    const source = activeTab === 'Therapeutic Segment' ? DEFAULT_SEGMENTS : DEFAULT_GENERICS;
    if (!queryLower) return source;
    return source.filter(
      (item) =>
        item.name.toLowerCase().includes(queryLower) ||
        (item.type || '').toLowerCase().includes(queryLower) ||
        (item.segment || '').toLowerCase().includes(queryLower) ||
        (item.topMolecules || '').toLowerCase().includes(queryLower)
    );
  }, [activeTab, queryLower]);

  const handleSelectItem = (item) => {
    Keyboard.dismiss();
    const chosenBrand = item.mappedBrands?.[0] || item;
    if (onSelectMedicine) {
      onSelectMedicine(chosenBrand, item);
    } else {
      onClose?.();
    }
  };

  return (
    <View style={styles.viewContainer}>
      {/* Exact OneRx Header: Left Title + Right X Close Icon Button */}
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </AppText>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Close search"
        >
          <CloseIconSvg size={24} color={colors.text.primary} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {/* Rounded Pill Search Bar with Magnifying Glass & Circular X Clear Button */}
      <View
        style={[
          styles.searchInputContainer,
          {
            backgroundColor: colors.surface.inputSecondary,
            borderColor: colors.border.subtle,
          },
        ]}
      >
        <SearchIconSvg size={20} color={colors.text.primary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search medicines..."
          placeholderTextColor={colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear search query"
          >
            <ClearCircleIconSvg size={18} color={colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Segmented OptionPills: Generic | Therapeutic Segment */}
      <OptionPills
        options={tabs}
        selected={activeTab}
        onSelect={setActiveTab}
        style={styles.optionPillsWrap}
      />

      {/* Medicine List */}
      <ScrollView
        style={styles.flexList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {visibleItems.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface.card,
                borderColor: colors.border.card,
              },
              isDark ? shadows.dark.card : shadows.light.card,
            ]}
          >
            {/* Top Row: Medicine/Generic Name + Subtitle + Right Chevron Circle */}
            <TouchableOpacity
              onPress={() => handleSelectItem(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardInfoCol}>
                  <View style={styles.nameRow}>
                    <HighlightedText
                      searchQuery={searchQuery}
                      medicineName={item.name}
                      highlightColor={colors.brand.accent}
                      style={[styles.medicineName, { color: colors.text.primary }]}
                    />
                  </View>
                  <AppText
                    style={[styles.medicineGeneric, { color: colors.text.secondary }]}
                    numberOfLines={1}
                  >
                    {item.type}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.chevronCircle,
                    { backgroundColor: colors.surface.durationTabBg },
                  ]}
                >
                  <ChevronRightSvg size={16} color={colors.text.muted} strokeWidth={1.6} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Bottom Row: View Brands v (Left) & Available v (Right) */}
            <View style={styles.cardFooter}>
              <TouchableOpacity
                onPress={() => onSetViewState?.('BRANDS', item)}
                activeOpacity={0.7}
                style={[
                  styles.viewBrandsBtn,
                  { backgroundColor: colors.surface.durationTabBg },
                ]}
              >
                <AppText style={[styles.viewBrandsText, { color: colors.text.primary }]}>
                  View Brands
                </AppText>
                <ChevronDown size={12} color={colors.text.primary} strokeWidth={2.2} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onSetViewState?.('PHARMACIES', item)}
                activeOpacity={0.7}
                style={[
                  styles.statusBadge,
                  { backgroundColor: colors.status.accentBg },
                ]}
              >
                <AppText style={[styles.statusBadgeText, { color: colors.brand.accent }]}>
                  Available
                </AppText>
                <ChevronDown size={12} color={colors.brand.accent} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {visibleItems.length === 0 && (
          <View style={styles.emptyWrap}>
            <AppText style={[styles.emptyText, { color: colors.text.muted }]}>
              No matching medicines found.
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    flexShrink: 0,
  },
  title: {
    fontSize: scaleFont(18),
    lineHeight: scaleFont(22),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  searchInputContainer: {
    height: verticalScale(46),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    borderRadius: radii.pill,
    borderWidth: 1,
    marginBottom: verticalScale(12),
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: scale(10),
    paddingVertical: 0,
    fontSize: scaleFont(14),
    fontFamily: fontFamilies.primary,
  },
  clearBtn: {
    padding: scale(4),
  },
  optionPillsWrap: {
    marginBottom: verticalScale(16),
    flexShrink: 0,
  },
  flexList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: verticalScale(24),
  },
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: scale(16),
    marginBottom: verticalScale(12),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfoCol: {
    flex: 1,
    marginRight: scale(12),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  medicineName: {
    fontSize: scaleFont(17),
    lineHeight: scaleFont(22),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
  },
  medicineGeneric: {
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(17),
    fontFamily: fontFamilies.primary,
    marginTop: spacing.xxs,
  },
  chevronCircle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  viewBrandsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: radii.pill,
  },
  viewBrandsText: {
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    marginRight: scale(6),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: radii.pill,
  },
  statusBadgeText: {
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    marginRight: scale(6),
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: verticalScale(40),
  },
  emptyText: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(14),
  },
});

export default MedicineSearchView;
