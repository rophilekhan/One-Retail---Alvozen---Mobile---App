import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText, AppBadge, AppToast } from '../core/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { TierGemIcon } from '../../assets/vectors/ImpactIcons.jsx';

const AVAILABLE_TERRITORIES = [
  { id: 't_pechs', name: 'PECHS / Tariq Road, Karachi', city: 'Karachi' },
  { id: 't_clifton', name: 'Clifton / Defense, Karachi', city: 'Karachi' },
  { id: 't_gulshan', name: 'Gulshan-e-Iqbal, Karachi', city: 'Karachi' },
  { id: 't_saddar', name: 'Saddar Town, Karachi', city: 'Karachi' },
  { id: 't_nazimabad', name: 'North Nazimabad, Karachi', city: 'Karachi' },
];

/**
 * HomeHeader
 * Exact match to OneRx DashboardHeader.jsx:
 * - Location Section with Territory switcher in-place modal
 * - User Avatar with online indicator & 3D Glassmorphism notification bell
 * - PII Tier pill & Staff shortcut badges
 */
export const HomeHeader = () => {
  const { isDark, colors } = useTheme();
  const navigation = useNavigation();

  const user = useAuthStore((s) => s.user);
  const pharmacy = usePharmacyStore();
  const rawTerritory = pharmacy.territory || AVAILABLE_TERRITORIES[0];
  const territory =
    typeof rawTerritory === 'string'
      ? { ...AVAILABLE_TERRITORIES[0], name: rawTerritory }
      : {
          ...AVAILABLE_TERRITORIES[0],
          ...rawTerritory,
          name: rawTerritory?.name || AVAILABLE_TERRITORIES[0].name,
        };
  const piiTier = pharmacy.piiTier || 'Key Account';
  const pharmacyName = pharmacy.name || user?.name || 'City Meds Pharmacy';

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: verticalScale(50),
    left: scale(16),
  });
  const locationSectionRef = useRef(null);

  const bellSize = scale(42);
  const bellRadius = bellSize / 2;

  const handleToggleDropdown = () => {
    if (isDropdownOpen) {
      setDropdownOpen(false);
      return;
    }
    if (locationSectionRef.current?.measureInWindow) {
      locationSectionRef.current.measureInWindow((x, y) => {
        setDropdownPos({
          top: Math.max(verticalScale(30), y - verticalScale(6)),
          left: Math.max(scale(14), x - scale(6)),
        });
        setDropdownOpen(true);
      });
    } else {
      setDropdownOpen(true);
    }
  };

  const handleProfilePress = () => {
    try {
      navigation.navigate('PharmacyProfile');
    } catch {
      navigation.navigate('StaffList');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Account Session',
      'Would you like to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await useAuthStore.getState().logout();
              AppToast.show({
                title: 'Logged Out',
                message: 'You have been successfully logged out.',
                type: 'info',
              });
            } catch (err) {
              console.warn('Logout error:', err.message);
            }
          },
        },
      ]
    );
  };

  const handleNotificationPress = () => {
    try {
      navigation.navigate('Notifications');
    } catch {
      AppToast.show({
        title: 'Notifications',
        message: 'No new critical alerts. All prescription syncs up to date.',
        type: 'info',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Row: Location & Actions */}
      <View style={styles.topRow}>
        {/* Left: Territory Location (Interactive for switching territory) */}
        <TouchableOpacity
          ref={locationSectionRef}
          style={styles.locationSection}
          activeOpacity={0.7}
          onPress={handleToggleDropdown}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Change territory: ${territory.name}`}
        >
          <Svg width={scale(18)} height={scale(22)} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 21C12 21 4 14.214 4 9.5C4 5.358 7.582 2 12 2C16.418 2 20 5.358 20 9.5C20 14.214 12 21 12 21Z"
              stroke={isDark ? '#FFFFFF' : '#020202'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 12C13.3807 12 14.5 10.8807 14.5 9.5C14.5 8.11929 13.3807 7 12 7C10.6193 7 9.5 8.11929 9.5 9.5C9.5 10.8807 10.6193 12 12 12Z"
              stroke={isDark ? '#FFFFFF' : '#020202'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <View style={styles.locationTextWrapper}>
            <View style={styles.clinicTitleRow}>
              <AppText
                style={[
                  styles.clinicName,
                  { color: isDark ? '#FFFFFF' : '#020202' },
                ]}
                numberOfLines={1}
              >
                {pharmacyName}
              </AppText>
              <Svg width={scale(10)} height={scale(6)} viewBox="0 0 10 6" fill="none" style={styles.clinicChevron}>
                <Path
                  d={isDropdownOpen ? 'M1 5L5 1L9 5' : 'M1 1L5 5L9 1'}
                  stroke={isDark ? '#ABABAB' : '#787878'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.syncRow}>
              <AppText
                style={[
                  styles.syncText,
                  { color: isDark ? '#ABABAB' : '#787878' },
                ]}
                numberOfLines={1}
              >
                {territory.name} •
              </AppText>
              <Svg width={scale(13)} height={scale(13)} viewBox="0 0 24 24" fill="none" style={{ marginLeft: scale(3) }}>
                <Path
                  d="M4 12C4 16.4183 7.58172 20 12 20C14.7358 20 17.1517 18.6234 18.6 16.5M20 12C20 7.58172 16.4183 4 12 4C9.26418 4 6.84826 5.37657 5.4 7.5M18.6 16.5V20M18.6 16.5H15M5.4 7.5V4M5.4 7.5H9"
                  stroke={isDark ? '#ABABAB' : '#787878'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <AppText
                style={[
                  styles.syncText,
                  { color: isDark ? '#ABABAB' : '#787878', marginLeft: scale(4) },
                ]}
              >
                Synced 2m ago
              </AppText>
            </View>
          </View>
        </TouchableOpacity>

        {/* Right: Staff Avatar & 3D Glassmorphism Notification Bell */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.profileWrapper}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Pharmacy Profile & Staff"
            onPress={handleProfilePress}
            onLongPress={handleLogout}
          >
            <Image
              source={require('../../assets/images/dr_shahzad.png')}
              style={[
                styles.profilePic,
                {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#FFFFFF',
                },
              ]}
            />
            {/* Status Dot: 8x8 #009BA9 */}
            <View
              style={[
                styles.onlineDot,
                {
                  backgroundColor: '#009BA9',
                  borderColor: isDark ? '#020202' : '#FFFFFF',
                },
              ]}
            />
          </TouchableOpacity>

          {/* 3D Glassmorphism Notification Button (Exact 48x48 from OneRx Figma) */}
          <TouchableOpacity
            style={[
              styles.bellWrapper,
              {
                width: bellSize,
                height: bellSize,
                borderRadius: bellRadius,
                shadowColor: isDark ? '#b3b3b317' : '#8db9ceff',
                shadowOffset: { width: 0, height: verticalScale(4) },
                shadowOpacity: isDark ? 0.35 : 0.08,
                shadowRadius: scale(10),
                elevation: 4,
              },
            ]}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={handleNotificationPress}
          >
            {/* 1. Backdrop Blur */}
            <BlurView
              style={StyleSheet.absoluteFillObject}
              blurType={isDark ? 'dark' : 'light'}
              blurAmount={16}
              overlayColor="transparent"
              reducedTransparencyFallbackColor={
                isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.16)'
              }
            />

            {/* 2. Frosted Base Tint */}
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  borderRadius: bellRadius,
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.16)',
                },
              ]}
            />

            {/* 3. Surface Sheen, Water Rim & Bell Vector */}
            <Svg
              width={bellSize}
              height={bellSize}
              viewBox="0 0 48 48"
              fill="none"
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            >
              <Defs>
                <LinearGradient id="bellSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop
                    offset="0%"
                    stopColor="#FFFFFF"
                    stopOpacity={isDark ? 0.22 : 0.48}
                  />
                  <Stop
                    offset="45%"
                    stopColor="#FFFFFF"
                    stopOpacity={isDark ? 0.05 : 0.12}
                  />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                </LinearGradient>

                <LinearGradient id="bellWaterBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop
                    offset="0%"
                    stopColor="#FFFFFF"
                    stopOpacity={isDark ? 0.45 : 0.90}
                  />
                  <Stop
                    offset="30%"
                    stopColor="#FFFFFF"
                    stopOpacity={isDark ? 0.15 : 0.50}
                  />
                  <Stop
                    offset="70%"
                    stopColor="#FFFFFF"
                    stopOpacity={isDark ? 0.08 : 0.25}
                  />
                  <Stop
                    offset="100%"
                    stopColor="#FFFFFF"
                    stopOpacity={isDark ? 0.30 : 0.70}
                  />
                </LinearGradient>
              </Defs>

              <Rect
                x="0"
                y="0"
                width="48"
                height="48"
                rx="24"
                ry="24"
                fill="url(#bellSheen)"
              />

              <Rect
                x="0.5"
                y="0.5"
                width="47"
                height="47"
                rx="23.5"
                ry="23.5"
                stroke="url(#bellWaterBorder)"
                strokeWidth="1"
                fill="none"
              />

              {/* Exact Bell Dome */}
              <Path
                d="M14.5299 26.7696C14.3173 28.1636 15.268 29.1312 16.4321 29.6134C20.8948 31.4622 27.1052 31.4622 31.5679 29.6134C32.732 29.1312 33.6827 28.1636 33.4701 26.7696C33.3394 25.9129 32.6932 25.1995 32.2144 24.5029C31.5873 23.5793 31.525 22.5718 31.5249 21.5C31.5249 17.3579 28.1559 14 24 14C19.8441 14 16.4751 17.3579 16.4751 21.5C16.475 22.5718 16.4127 23.5793 15.7856 24.5029C15.3068 25.1995 14.6606 25.9129 14.5299 26.7696Z"
                fill="none"
                stroke={isDark ? '#FFFFFF' : '#020202'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Bell Clapper Arc */}
              <Path
                d="M20 31C20.4585 32.7252 22.0755 34 24 34C25.9245 34 27.5415 32.7252 28 31"
                fill="none"
                stroke={isDark ? '#FFFFFF' : '#020202'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Orange Notification Unread Dot */}
              <Circle
                cx="30"
                cy="17"
                r="4"
                fill="#FB6B03"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Badges Strip: Territory Badge + PII Tier Badge + Staff Shortcut */}
      <View style={styles.badgesRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleDropdown}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Assigned Territory: ${territory.name}`}
          style={{ marginRight: scale(8) }}
        >
          <AppBadge label="Alvozen Admin Assigned Territory" variant="brand" size="sm" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PharmacyProfile')}
          style={styles.tierPill}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Pharmacy Tier: ${piiTier}`}
        >
          <TierGemIcon tier={piiTier} size={18} isApex={false} style={{ marginRight: scale(4) }} />
          <AppBadge label={piiTier} variant="accent" size="sm" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('StaffList')}
          style={{ marginLeft: scale(8) }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Staff Hierarchy"
        >
          <AppBadge label="Staff Access" variant="neutral" size="sm" />
        </TouchableOpacity>
      </View>

      {/* In-Place Territory Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="none"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setDropdownOpen(false)}
        >
          <View
            style={[
              styles.inPlaceDropdownCard,
              {
                position: 'absolute',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: scale(310),
                backgroundColor: isDark ? '#16191D' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={{ maxHeight: verticalScale(265) }}
              contentContainerStyle={styles.dropdownScrollContent}
            >
              {AVAILABLE_TERRITORIES.map((item, index) => {
                const isSelected = territory?.id === item.id || territory?.name === item.name;

                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[
                      styles.clinicDropdownItem,
                      isSelected && [
                        styles.clinicDropdownItemActive,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : '#F3F4F6',
                        },
                      ],
                    ]}
                    onPress={() => {
                      pharmacy.setTerritory(item);
                      setDropdownOpen(false);
                      AppToast.show({
                        title: 'Territory Switched',
                        message: `Switched to ${item.name}`,
                        type: 'success',
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.clinicRowContent}>
                      {isSelected && (
                        <View style={styles.pinIconBox}>
                          <Svg width={scale(16)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M12 21C12 21 4 14.214 4 9.5C4 5.358 7.582 2 12 2C16.418 2 20 5.358 20 9.5C20 14.214 12 21 12 21Z"
                              stroke={isDark ? '#FFFFFF' : '#020202'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <Path
                              d="M12 12C13.3807 12 14.5 10.8807 14.5 9.5C14.5 8.11929 13.3807 7 12 7C10.6193 7 9.5 8.11929 9.5 9.5C9.5 10.8807 10.6193 12 12 12Z"
                              stroke={isDark ? '#FFFFFF' : '#020202'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                        </View>
                      )}

                      <View style={[styles.clinicTextCol, !isSelected && { paddingLeft: scale(4) }]}>
                        <AppText
                          style={[
                            styles.dropdownClinicName,
                            {
                              color: isDark ? '#FFFFFF' : '#020202',
                              fontWeight: isSelected ? '600' : '500',
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </AppText>
                        <AppText
                          style={[
                            styles.dropdownClinicCity,
                            { color: isDark ? '#ABABAB' : '#787878' },
                          ]}
                          numberOfLines={1}
                        >
                          {item.city} • Active Retail Territory
                        </AppText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(12),
  },
  locationTextWrapper: {
    marginLeft: scale(8),
    flex: 1,
  },
  clinicTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(1),
  },
  clinicChevron: {
    marginLeft: scale(6),
    marginTop: verticalScale(2),
  },
  clinicName: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: scaleFont(16),
    lineHeight: verticalScale(22),
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: scaleFont(12.5),
    lineHeight: verticalScale(16),
    letterSpacing: -0.4,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  profileWrapper: {
    position: 'relative',
  },
  profilePic: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    borderWidth: 1.5,
  },
  onlineDot: {
    position: 'absolute',
    top: scale(2),
    right: scale(3),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    borderWidth: 1.5,
  },
  bellWrapper: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(2),
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inPlaceDropdownCard: {
    borderRadius: scale(22),
    borderWidth: 1,
    padding: scale(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.15,
    shadowRadius: scale(20),
    elevation: 12,
  },
  dropdownScrollContent: {
    paddingVertical: verticalScale(2),
  },
  clinicDropdownItem: {
    borderRadius: scale(16),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(9),
    marginVertical: verticalScale(2),
  },
  clinicDropdownItemActive: {},
  clinicRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIconBox: {
    marginRight: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicTextCol: {
    flex: 1,
  },
  dropdownClinicName: {
    fontFamily: 'DMSans-Medium',
    fontSize: scaleFont(14),
    lineHeight: verticalScale(19),
    letterSpacing: -0.2,
  },
  dropdownClinicCity: {
    fontFamily: 'DMSans-Regular',
    fontSize: scaleFont(12),
    lineHeight: verticalScale(16),
    marginTop: verticalScale(1),
  },
});

export default HomeHeader;
