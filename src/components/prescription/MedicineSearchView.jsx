import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, TextInput, Keyboard } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText, AppBackButton } from '../global/index.js';
import { SearchIconSvg } from '../../assets/vectors/index.js';
import { HighlightedText } from './HighlightedText.jsx';

export const MedicineSearchView = ({
  addedMedicines = [],
  onClose,
  onSetViewState,
  onSelectMedicine,
  tabs = ['Generic', 'Therapeutic Segment', 'Brand'],
}) => {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(tabs[0] || 'Generic');

  // Exact Brand items matching OneRx
  const allMedicines = [
    {
      id: 'm1',
      brand: 'Merck Pharma',
      name: 'Glucophage',
      form: 'Tablet',
      generic: 'Metformin 500mg',
      use: 'Blood sugar control',
      segment: 'Endocrine / Diabetes',
      tp: 135,
      mrp: 160,
      points: 1000,
      availableColor: '#EA580C',
      availableBg: '#FFF3E8',
      activeScheme: '10+1 Bonus',
      isAvailable: true,
    },
    {
      id: 'm2',
      brand: 'MSD Pharma',
      name: 'Gluuvia',
      form: 'Tablet',
      generic: 'Sitagliptin 100mg',
      use: 'DPP-4 inhibitor',
      segment: 'Endocrine / Diabetes',
      tp: 450,
      mrp: 520,
      points: 750,
      availableColor: '#49C88F',
      availableBg: '#E6F8EF',
      activeScheme: '5% Rebate',
      isAvailable: true,
    },
    {
      id: 'm3',
      brand: 'Sanofi Aventis',
      name: 'Gluaryl',
      form: 'Tablet',
      generic: 'Glimepiride 2mg',
      use: 'Insulin stimulant',
      segment: 'Endocrine / Diabetes',
      tp: 180,
      mrp: 210,
      points: 1500,
      availableColor: '#49C88F',
      availableBg: '#E6F8EF',
      activeScheme: null,
      isAvailable: true,
    },
    {
      id: 'm4',
      brand: 'Boehringer Ingelheim',
      name: 'Gludiance',
      form: 'Tablet',
      generic: 'Empagliflozin 10mg',
      use: 'SGLT2 inhibitor',
      segment: 'Cardio-Renal',
      tp: 720,
      mrp: 840,
      points: 500,
      availableColor: '#49C88F',
      availableBg: '#E6F8EF',
      activeScheme: null,
      isAvailable: true,
    },
    {
      id: 'm5',
      brand: 'GSK Pakistan',
      name: 'Augmentin 625mg',
      form: 'Tablet',
      generic: 'Co-Amoxiclav 625mg',
      use: 'Broad-spectrum antibiotic',
      segment: 'Anti-Infective',
      tp: 240,
      mrp: 280,
      points: 800,
      availableColor: '#49C88F',
      availableBg: '#E6F8EF',
      activeScheme: '10+1 Free',
      isAvailable: true,
    },
  ];

  // Generic items matching OneRx
  const genericMedicines = [
    {
      id: 'g1',
      name: 'Metformin 500mg',
      type: 'Diabetes management',
      segment: 'Endocrine / Diabetes',
      brands: 4,
      mappedBrands: [
        { brand: 'Sanofi Aventis', name: 'Glucophage SR', tp: 135, mrp: 160, isAvailable: true, activeScheme: '10+1 Bonus' },
        { brand: 'USV Pharma', name: 'Glycomet GP', tp: 120, mrp: 145, isAvailable: true, activeScheme: '5% Trade Off' },
        { brand: 'Cipla Ltd', name: 'Obimet SR', tp: 110, mrp: 130, isAvailable: false, activeScheme: null },
      ],
    },
    {
      id: 'g2',
      name: 'Metoprolol 50mg',
      type: 'DPP-4 inhibitor',
      segment: 'Cardiovascular',
      brands: 3,
      mappedBrands: [
        { brand: 'AstraZeneca', name: 'Betaloc 50mg', tp: 220, mrp: 260, isAvailable: true, activeScheme: null },
        { brand: 'Getz Pharma', name: 'Mepressor 50mg', tp: 180, mrp: 215, isAvailable: true, activeScheme: '12+1 Free' },
      ],
    },
    {
      id: 'g3',
      name: 'Omeprazole 20mg Capsule',
      type: 'Proton pump inhibitor',
      segment: 'Gastroenterology',
      brands: 4,
      mappedBrands: [
        { brand: 'Getz Pharma', name: 'Risek 20mg', tp: 135, mrp: 160, isAvailable: true, activeScheme: '10+1 Bonus' },
        { brand: 'Ferozsons', name: 'Omega 20mg', tp: 120, mrp: 145, isAvailable: true, activeScheme: '5% Rebate' },
        { brand: 'Searle', name: 'Omee 20mg', tp: 110, mrp: 130, isAvailable: false, activeScheme: null },
      ],
    },
    {
      id: 'g4',
      name: 'Paracetamol + Caffeine',
      type: 'Analgesic / Antipyretic',
      segment: 'Pain Management',
      brands: 3,
      mappedBrands: [
        { brand: 'GSK Pakistan', name: 'Calpol Plus', tp: 80, mrp: 95, isAvailable: true, activeScheme: null },
        { brand: 'Reckitt', name: 'Disprin Extra', tp: 75, mrp: 90, isAvailable: true, activeScheme: '10+1 Free' },
      ],
    },
  ];

  // Therapeutic Segments list
  const therapeuticSegments = [
    { id: 'ts1', name: 'Endocrine / Diabetes', count: 18, topMolecules: 'Metformin, Glimepiride, Sitagliptin' },
    { id: 'ts2', name: 'Anti-Infective / Antibiotic', count: 24, topMolecules: 'Co-Amoxiclav, Ciprofloxacin, Azithromycin' },
    { id: 'ts3', name: 'Cardiovascular / Antihypertensive', count: 16, topMolecules: 'Metoprolol, Amlodipine, Losartan' },
    { id: 'ts4', name: 'Gastroenterology', count: 14, topMolecules: 'Omeprazole, Esomeprazole, Famotidine' },
    { id: 'ts5', name: 'Pain Management & NSAIDs', count: 20, topMolecules: 'Paracetamol + Caffeine, Ibuprofen, Diclofenac' },
  ];

  const filteredBrands = allMedicines.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.generic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGenerics = genericMedicines.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.segment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSegments = therapeuticSegments.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topMolecules.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item) => {
    Keyboard.dismiss();
    if (onSelectMedicine) {
      onSelectMedicine(item);
    } else {
      onClose();
    }
  };

  return (
    <View style={styles.viewContainer}>
      {/* Exact OneRx Header: LEFT Back Button, NO right-side cross X button */}
      <View style={styles.header}>
        <AppBackButton
          onPress={onClose}
          size={scale(36)}
          style={styles.backBtn}
        />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <AppText style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Select Medicine
          </AppText>
        </View>
      </View>

      {/* Pill Search Input matching OneRx */}
      <View
        style={[
          styles.searchInputContainer,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F0F2F5',
            borderColor: isDark ? '#2C2C2E' : '#ECEEF1',
          },
        ]}
      >
        <SearchIconSvg size={20} color={isDark ? '#FFFFFF' : '#020202'} />
        <TextInput
          style={[
            styles.searchInput,
            { color: isDark ? '#FFFFFF' : '#111827' },
          ]}
          placeholder="Search generic, segment or brand..."
          placeholderTextColor={isDark ? '#8A8A8E' : '#8E95A2'}
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
          >
            <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="9" stroke={isDark ? '#8A8A8E' : '#8E95A2'} strokeWidth="1.2" />
              <Path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke={isDark ? '#8A8A8E' : '#8E95A2'} strokeWidth="1.2" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>

      {/* Pill Capsule Tabs Switcher */}
      <View
        style={[
          styles.tabsTrack,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F0F2F5',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            borderWidth: isDark ? 1 : 0,
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              style={[
                styles.tabBtn,
                isActive && [
                  styles.tabBtnActive,
                  {
                    backgroundColor: isDark ? '#333336' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    borderWidth: isDark ? 1 : 0,
                  },
                ],
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <AppText
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? (isDark ? '#FFFFFF' : '#111827')
                      : (isDark ? '#8A8A8E' : '#8E95A2'),
                    fontFamily: isActive ? fontFamilies.primaryMedium : fontFamilies.primary,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {tab}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Medicine List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* GENERIC TAB */}
        {activeTab === 'Generic' &&
          filteredGenerics.map((gen) => (
            <View
              key={gen.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#121214' : '#FFFFFF',
                  borderColor: isDark ? '#232326' : '#ECEEF2',
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleSelect(gen)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardInfoCol}>
                    <View style={styles.nameRow}>
                      <HighlightedText
                        searchQuery={searchQuery}
                        text={gen.name}
                        style={[styles.medicineName, { color: isDark ? '#FFFFFF' : '#111827' }]}
                      />
                    </View>
                    <AppText style={[styles.medicineGeneric, { color: isDark ? '#8A8A8E' : '#71717A', marginTop: scale(4) }]}>
                      {gen.type} • {gen.segment}
                    </AppText>
                  </View>

                  <View
                    style={[
                      styles.chevronCircle,
                      {
                        backgroundColor: isDark ? '#262629' : '#F5F5F5',
                        borderWidth: 0,
                      },
                    ]}
                  >
                    <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M9 18L15 12L9 6"
                        stroke={isDark ? '#8A8A8E' : '#9CA3AF'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  onPress={() => onSetViewState('BRANDS', gen)}
                  activeOpacity={0.7}
                  style={[
                    styles.viewBrandsBtn,
                    {
                      backgroundColor: isDark ? '#272727' : '#F5F5F5',
                      borderWidth: 0,
                    },
                  ]}
                >
                  <AppText style={[styles.viewBrandsText, { color: isDark ? '#E4E4E7' : '#4B5563' }]}>
                    View {gen.brands} Mapped Brands
                  </AppText>
                  <Svg width={scale(12)} height={scale(12)} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M6 9l6 6 6-6"
                      stroke={isDark ? '#E4E4E7' : '#4B5563'}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelect(gen)}
                  activeOpacity={0.7}
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: isDark ? '#272727' : '#F5F5F5',
                      borderWidth: 0,
                    },
                  ]}
                >
                  <AppText style={[styles.statusBadgeText, { color: '#49C88F' }]}>
                    Select
                  </AppText>
                  <Svg width={scale(12)} height={scale(12)} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 18l6-6-6-6"
                      stroke="#49C88F"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        {/* THERAPEUTIC SEGMENT TAB */}
        {activeTab === 'Therapeutic Segment' &&
          filteredSegments.map((seg) => (
            <TouchableOpacity
              key={seg.id}
              activeOpacity={0.7}
              onPress={() => handleSelect(seg)}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#121214' : '#FFFFFF',
                  borderColor: isDark ? '#232326' : '#ECEEF2',
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardInfoCol}>
                  <HighlightedText
                    searchQuery={searchQuery}
                    text={seg.name}
                    style={[styles.medicineName, { color: isDark ? '#FFFFFF' : '#111827' }]}
                  />
                  <AppText style={[styles.medicineGeneric, { color: isDark ? '#8A8A8E' : '#71717A', marginTop: scale(4) }]}>
                    Key Molecules: {seg.topMolecules}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.chevronCircle,
                    {
                      backgroundColor: isDark ? '#262629' : '#F5F5F5',
                      borderWidth: 0,
                    },
                  ]}
                >
                  <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 18L15 12L9 6"
                      stroke={isDark ? '#8A8A8E' : '#9CA3AF'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View
                  style={[
                    styles.pointsBadge,
                    {
                      backgroundColor: isDark ? 'rgba(0, 155, 169, 0.15)' : '#D1F5F8',
                      borderColor: isDark ? 'rgba(0, 155, 169, 0.3)' : 'rgba(6, 182, 212, 0.25)',
                    },
                  ]}
                >
                  <AppText style={[styles.pointsText, { color: isDark ? '#5EEAD4' : '#0D7B8A' }]}>
                    {seg.count} REGISTERED SKUS
                  </AppText>
                </View>

                <View style={styles.statusBadge}>
                  <AppText style={[styles.statusBadgeText, { color: '#009BA9' }]}>
                    Browse Segment &gt;
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
          ))}

        {/* BRAND TAB */}
        {activeTab === 'Brand' &&
          filteredBrands.map((med) => (
            <View
              key={med.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#121214' : '#FFFFFF',
                  borderColor: isDark ? '#232326' : '#ECEEF2',
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleSelect(med)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardInfoCol}>
                    <AppText style={[styles.pharmaName, { color: isDark ? '#E0E0E0' : '#1F2937' }]}>
                      {med.brand}
                    </AppText>

                    <View style={styles.nameRow}>
                      <HighlightedText
                        searchQuery={searchQuery}
                        text={med.name}
                        style={[styles.medicineName, { color: isDark ? '#FFFFFF' : '#111827' }]}
                      />
                      <AppText style={[styles.medicineForm, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                        {' '}• {med.form}
                      </AppText>
                    </View>

                    <AppText
                      style={[
                        styles.medicineGeneric,
                        {
                          color: isDark ? '#8A8A8E' : '#71717A',
                          fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {med.generic} • TP: Rs. {med.tp} • MRP: Rs. {med.mrp}
                    </AppText>
                  </View>

                  <View
                    style={[
                      styles.chevronCircle,
                      {
                        backgroundColor: isDark ? '#262629' : '#F5F5F5',
                        borderWidth: 0,
                      },
                    ]}
                  >
                    <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M9 18L15 12L9 6"
                        stroke={isDark ? '#8A8A8E' : '#9CA3AF'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.cardFooter}>
                {med.activeScheme ? (
                  <View
                    style={[
                      styles.pointsBadge,
                      {
                        backgroundColor: isDark ? 'rgba(251, 107, 3, 0.15)' : '#FFF3E8',
                        borderColor: colors.brand?.accent || '#FB6B03',
                      },
                    ]}
                  >
                    <AppText style={[styles.pointsText, { color: colors.brand?.accent || '#FB6B03' }]}>
                      SCHEME: {med.activeScheme}
                    </AppText>
                  </View>
                ) : (
                  <View style={{ flex: 1 }} />
                )}

                <TouchableOpacity
                  onPress={() => onSetViewState('PHARMACIES')}
                  activeOpacity={0.7}
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: isDark ? '#272727' : '#F5F5F5',
                      borderWidth: 0,
                    },
                  ]}
                >
                  <AppText style={[styles.statusBadgeText, { color: '#49C88F' }]}>
                    In Stock
                  </AppText>
                  <Svg width={scale(12)} height={scale(12)} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M6 9l6 6 6-6"
                      stroke="#49C88F"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    marginBottom: verticalScale(16),
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: scaleFont(18),
    lineHeight: scaleFont(22),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '600',
  },
  searchInputContainer: {
    height: verticalScale(46),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    borderRadius: radii.pill,
    borderWidth: 1,
    marginBottom: verticalScale(12),
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
  tabsTrack: {
    height: verticalScale(38),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.pill,
    padding: scale(3),
    marginBottom: verticalScale(16),
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.pill,
  },
  tabBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: scaleFont(13),
  },
  listContent: {
    paddingBottom: verticalScale(48),
  },
  card: {
    borderRadius: scale(18),
    borderWidth: 1,
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
  pharmaName: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    marginBottom: scale(4),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  medicineName: {
    fontSize: scaleFont(18),
    lineHeight: scaleFont(22),
    fontFamily: fontFamilies.primaryBold,
  },
  medicineForm: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(18),
    fontFamily: fontFamilies.primary,
    fontWeight: '400',
  },
  medicineGeneric: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primary,
    marginTop: scale(4),
  },
  chevronCircle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(14),
  },
  pointsBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pointsText: {
    fontSize: scaleFont(10),
    lineHeight: scaleFont(12),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(5),
    borderRadius: radii.pill,
  },
  statusBadgeText: {
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    marginRight: scale(6),
  },
  viewBrandsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(5),
    borderRadius: radii.pill,
  },
  viewBrandsText: {
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    marginRight: scale(6),
  },
});

export default MedicineSearchView;
