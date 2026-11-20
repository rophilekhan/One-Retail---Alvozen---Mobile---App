import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { spacing } from '../../theme/spacing.js';
import {
  AppScreenContainer,
  AppBackButton,
  AppText,
  AppToast,
} from '../../components/core/index.js';
import {
  StaffMemberCard,
  ResetStaffPasswordModal,
} from '../../components/staff/index.js';
import { PlusCustomIcon, SearchIconSvg } from '../../assets/vectors/index.js';
import { useStaffStore } from '../../store/useStaffStore.js';

/**
 * StaffListScreen
 * Exact OneRx PAProfileListScreen port for OneRetail Staff Management
 * Matching OneRx visual identity with search pill, circular CTA, and glass cards.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const StaffListScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const staffList = useStaffStore((s) => s.staffList);
  const toggleStaffStatus = useStaffStore((s) => s.toggleStaffStatus);
  const updateStaff = useStaffStore((s) => s.updateStaff);

  const [searchQuery, setSearchQuery] = useState('');

  // Password Modal State
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedStaffForPassword, setSelectedStaffForPassword] = useState(null);

  // Filtered staff list
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return staffList;
    const q = searchQuery.toLowerCase().trim();
    return staffList.filter((staff) => {
      const name = staff.name ? staff.name.toLowerCase() : '';
      const username = staff.username ? staff.username.toLowerCase() : '';
      return name.includes(q) || username.includes(q);
    });
  }, [staffList, searchQuery]);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectStaff = useCallback(
    (staff) => {
      navigation.navigate('StaffForm', { staff });
    },
    [navigation],
  );

  const handleCreateStaff = useCallback(() => {
    navigation.navigate('StaffForm');
  }, [navigation]);

  const handleChangePassword = useCallback((staff) => {
    setSelectedStaffForPassword(staff);
    setPasswordModalVisible(true);
  }, []);

  const handleSavePassword = useCallback(
    (staffId, newPassword) => {
      updateStaff(staffId, { password: newPassword });
    },
    [updateStaff],
  );

  const handleToggleStatus = useCallback(
    (staffId, newStatus) => {
      toggleStaffStatus(staffId, newStatus);
      AppToast.show({
        title: 'Status Updated',
        message: `Staff member account has been ${newStatus ? 'activated' : 'deactivated'}.`,
        type: newStatus ? 'success' : 'info',
      });
    },
    [toggleStaffStatus],
  );

  // Search Bar & Plus Button Styling
  const searchBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF';
  const searchBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB';
  const plusBtnBg = isDark ? '#009BA9' : '#0E435C';

  return (
    <AppScreenContainer
      withAmbientGlow={true}
      withHorizontalPadding={false}
      scrollable={false}
      style={styles.screenRoot}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* ── 1. Top Header: "<  Staff Management" ─────────────── */}
      <View style={styles.headerRow}>
        <AppBackButton onPress={handleBack} />

        <AppText style={[styles.headerTitle, { color: colors.text?.primary || '#020202' }]}>
          Staff Management
        </AppText>
      </View>

      {/* ── 2. Search Bar + Plus Button Row ─────────────────── */}
      <View style={styles.searchRow}>
        {/* Pill Search Input */}
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: searchBg,
              borderColor: searchBorder,
            },
            !isDark && styles.pillShadow,
          ]}
        >
          <SearchIconSvg
            size={scale(18)}
            color={isDark ? colors.text?.secondary || '#ABABAB' : '#787878'}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Staff Profiles..."
            placeholderTextColor={isDark ? colors.text?.secondary || '#ABABAB' : '#9CA3AF'}
            style={[
              styles.textInput,
              { color: colors.text?.primary || '#020202' },
            ]}
          />
        </View>

        {/* Circular Plus Button */}
        <TouchableOpacity
          style={[styles.plusBtn, { backgroundColor: plusBtnBg }]}
          activeOpacity={0.8}
          onPress={handleCreateStaff}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add New Staff Member"
        >
          <PlusCustomIcon size={scale(22)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── 3. Staff Cards List ─────────────────────────────── */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StaffMemberCard
            staff={item}
            onPress={() => handleSelectStaff(item)}
            onChangePassword={() => handleChangePassword(item)}
            onToggleStatus={handleToggleStatus}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + verticalScale(36) },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText
              style={[
                styles.emptyText,
                { color: colors.text?.secondary || '#787878' },
              ]}
            >
              No staff profiles found.
            </AppText>
          </View>
        }
      />

      {/* ── 4. Change Password Modal ────────────────────────── */}
      <ResetStaffPasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        staffMember={selectedStaffForPassword}
        onSave={handleSavePassword}
      />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal || scale(20),
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(14),
  },
  headerTitle: {
    fontFamily: fontFamilies.primaryBold,
    fontSize: scaleFont(18),
    fontWeight: '700',
    marginLeft: scale(14),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal || scale(20),
    marginBottom: verticalScale(14),
  },
  searchInputContainer: {
    flex: 1,
    height: verticalScale(48),
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    marginRight: scale(10),
  },
  searchIcon: {
    marginRight: scale(10),
  },
  plusBtn: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.15,
    shadowRadius: scale(8),
    elevation: 3,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(14),
    padding: 0,
  },
  pillShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal || scale(20),
    paddingTop: verticalScale(4),
  },
  emptyContainer: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(15),
  },
});

export default StaffListScreen;
