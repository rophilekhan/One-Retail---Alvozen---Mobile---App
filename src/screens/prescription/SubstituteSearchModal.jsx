import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  AppModal,
  AppText,
  AppInput,
  AppButton,
  AppBadge,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';

const DEMO_SUBSTITUTES_DATABASE = [
  // Analgesics & Antipyretics
  { id: 'sub_1', name: 'Calpol Plus Tab', generic: 'Paracetamol + Caffeine', segment: 'Analgesic', manufacturer: 'GSK', tp: 80, mrp: 95 },
  { id: 'sub_2', name: 'Disprin Extra Tab', generic: 'Paracetamol + Caffeine', segment: 'Analgesic', manufacturer: 'Reckitt', tp: 75, mrp: 90 },
  { id: 'sub_3', name: 'Febril Extra Tab', generic: 'Paracetamol + Caffeine', segment: 'Analgesic', manufacturer: 'Getz Pharma', tp: 70, mrp: 85 },
  { id: 'sub_4', name: 'Brufen 400mg Tab', generic: 'Ibuprofen', segment: 'Analgesic', manufacturer: 'Abbott', tp: 65, mrp: 78 },

  // Anti-Infective / Antibiotics
  { id: 'sub_5', name: 'Curam 625mg Tab', generic: 'Co-Amoxiclav', segment: 'Antibiotic', manufacturer: 'Sandoz / Novartis', tp: 235, mrp: 275 },
  { id: 'sub_6', name: 'Amoxil Plus 625mg', generic: 'Co-Amoxiclav', segment: 'Antibiotic', manufacturer: 'GSK', tp: 240, mrp: 280 },
  { id: 'sub_7', name: 'Klavox 625mg Tab', generic: 'Co-Amoxiclav', segment: 'Antibiotic', manufacturer: 'Bosch', tp: 215, mrp: 250 },

  // Gastrointestinal / Anti-Ulcerant
  { id: 'sub_8', name: 'Omega 20mg Cap', generic: 'Omeprazole', segment: 'Anti-Ulcerant', manufacturer: 'Ferozsons', tp: 120, mrp: 145 },
  { id: 'sub_9', name: 'Risek 20mg Cap', generic: 'Omeprazole', segment: 'Anti-Ulcerant', manufacturer: 'Getz Pharma', tp: 135, mrp: 160 },
  { id: 'sub_10', name: 'Nexum 40mg Tab', generic: 'Esomeprazole', segment: 'Anti-Ulcerant', manufacturer: 'Getz Pharma', tp: 180, mrp: 210 },
];

const SEGMENTS = ['All', 'Analgesic', 'Antibiotic', 'Anti-Ulcerant'];
const REASONS = ['Out of Stock', 'Patient Requested', 'Doctor Authorized', 'Price Preference'];

/**
 * SubstituteSearchModal - Search & Select Substitute Brand
 * Mandated by ONERETAIL_PRD.md:
 * - Search by Generic
 * - Filter by Therapeutic Segment
 * - Select substitute brand and capture reason
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Function} props.onSelectSubstitute
 * @param {string} props.initialGeneric
 */
export const SubstituteSearchModal = ({
  visible,
  onClose,
  onSelectSubstitute,
  initialGeneric = '',
}) => {
  const { colors, spacing, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState(initialGeneric);
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [selectedReason, setSelectedReason] = useState('Out of Stock');

  const filteredSubstitutes = useMemo(() => {
    return DEMO_SUBSTITUTES_DATABASE.filter((item) => {
      const matchSegment = selectedSegment === 'All' || item.segment === selectedSegment;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.generic.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q);
      return matchSegment && matchQuery;
    });
  }, [searchQuery, selectedSegment]);

  const handleSelect = (sub) => {
    onSelectSubstitute(sub, selectedReason);
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      type="bottomSheet"
      title="Search Substitute Brand"
      scrollable={true}
      onClose={onClose}
    >
      <View style={styles.modalContent}>
        <AppText variant="caption" colorType="muted" style={{ marginBottom: 8 }}>
          Substitute options based on Generic & Therapeutic Segment (DRAP guidelines)
        </AppText>

        {/* Search Input */}
        <AppInput
          placeholder="Search by Generic, Brand, or Manufacturer..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Therapeutic Segment Filter Chips */}
        <AppText variant="caption" colorType="muted" style={{ marginTop: 6, marginBottom: 4 }}>
          Therapeutic Segment:
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.segmentScroll}>
          {SEGMENTS.map((seg) => (
            <TouchableOpacity
              key={seg}
              onPress={() => setSelectedSegment(seg)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedSegment === seg
                      ? colors.brand?.primary
                      : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
            >
              <AppText
                variant="caption"
                colorType={selectedSegment === seg ? 'inverse' : 'primary'}
                style={{ fontWeight: selectedSegment === seg ? '600' : '400' }}
              >
                {seg}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Reason for Substitution */}
        <AppText variant="caption" colorType="muted" style={{ marginTop: 10, marginBottom: 4 }}>
          Substitution Reason:
        </AppText>
        <View style={styles.reasonRow}>
          {REASONS.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setSelectedReason(r)}
              style={[
                styles.reasonChip,
                {
                  borderColor: selectedReason === r ? colors.brand?.accent : colors.border?.subtle,
                  backgroundColor: selectedReason === r ? 'rgba(251, 107, 3, 0.1)' : 'transparent',
                },
              ]}
            >
              <AppText
                variant="caption"
                colorType={selectedReason === r ? 'accent' : 'muted'}
              >
                {r}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results List */}
        <AppText variant="bodySmallMedium" colorType="primary" style={{ marginTop: 12, marginBottom: 6 }}>
          Available Alternate Brands ({filteredSubstitutes.length})
        </AppText>

        {filteredSubstitutes.map((sub) => (
          <View
            key={sub.id}
            style={[
              styles.subResultCard,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: colors.border?.subtle,
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <AppText variant="bodyMediumMedium" colorType="primary">{sub.name}</AppText>
              <AppText variant="caption" colorType="muted">
                {sub.generic} • {sub.manufacturer}
              </AppText>
              <AppText variant="caption" colorType="brand" style={{ marginTop: 2 }}>
                TP: PKR {sub.tp} • MRP: PKR {sub.mrp}
              </AppText>
            </View>

            <AppButton
              variant="secondary"
              size="xs"
              title="Select"
              onPress={() => handleSelect(sub)}
            />
          </View>
        ))}

        <View style={{ height: verticalScale(16) }} />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: verticalScale(16),
  },
  segmentScroll: {
    flexDirection: 'row',
    marginBottom: verticalScale(6),
  },
  filterChip: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(14),
    marginRight: scale(6),
  },
  reasonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(6),
  },
  reasonChip: {
    borderWidth: 1,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: scale(8),
    marginRight: scale(6),
    marginBottom: verticalScale(6),
  },
  subResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(10),
    borderRadius: scale(10),
    borderWidth: 1,
    marginVertical: verticalScale(4),
  },
});

export default SubstituteSearchModal;