import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppHeader,
  AppText,
} from '../../components/core/index.js';
import {
  PharmacyIdentityCard,
  PiiScoreBreakdownCard,
  PharmacyLicensesCard,
  PharmacyLocationCard,
  EditProfileModal,
  LicensePreviewModal,
  LicenseUpdateModal,
  buildPharmacyProfileModel,
} from '../../components/profile/index.js';
import { PharmacyLocationPickerModal } from '../../components/onboarding/PharmacyLocationPickerModal.jsx';
import { usePharmacyStore, PII_TIERS } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * PharmacyProfileScreen - Thin Declarative Stack Profile View
 * Renders 4 clean vertical GlassCards inside a ScrollView with single safe-area bottom clearance.
 */
export const PharmacyProfileScreen = ({ navigation }) => {
  const { colors, isDark, radii, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const pharmacy = usePharmacyStore();
  const setLocation = usePharmacyStore((s) => s.setLocation);
  const user = useAuthStore((s) => s.user);

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [licenseModalVisible, setLicenseModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [previewLicense, setPreviewLicense] = useState(null);

  const profile = useMemo(
    () => buildPharmacyProfileModel(pharmacy, user),
    [pharmacy, user]
  );

  const piiScore = Number.isFinite(Number(pharmacy?.piiPoints ?? pharmacy?.piiScore))
    ? Number(pharmacy?.piiPoints ?? pharmacy?.piiScore)
    : 842;
  const piiTier = pharmacy?.piiTierKey || pharmacy?.piiTier || PII_TIERS.KEY_ACCOUNT;

  const handleEditLicenses = () => {
    const routeNames = navigation?.getState?.()?.routeNames;
    if (Array.isArray(routeNames) && routeNames.includes('PharmacyLicenses')) {
      navigation.navigate('PharmacyLicenses');
      return;
    }
    setLicenseModalVisible(true);
  };

  const editBtnTextColor = isDark ? colors.text.primary : colors.brand.primaryDark;
  const scrollBottomPad =
    Math.max(insets?.bottom ?? 0, verticalScale(16)) + verticalScale(16);

  return (
    <AppScreenContainer
      scrollable={false}
      withAmbientGlow={true}
      withHorizontalPadding={false}
      contentContainerStyle={styles.screenContainerContent}
    >
      <View style={{ paddingHorizontal: spacing.screenHorizontal }}>
        <AppHeader
          title="Pharmacy Profile"
          showBack={true}
          onBack={() =>
            typeof navigation?.canGoBack === 'function'
              ? navigation.canGoBack() && navigation?.goBack?.()
              : navigation?.goBack?.()
          }
          rightElement={
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setEditProfileVisible(true)}
              style={[
                styles.editProfilePill,
                {
                  backgroundColor: colors.glass.secondary,
                  borderColor: colors.border.subtle,
                  borderRadius: radii.pill,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Edit Profile"
            >
              <AppText
                style={[styles.editProfileText, { color: editBtnTextColor }]}
                numberOfLines={1}
              >
                Edit Profile
              </AppText>
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenHorizontal,
          paddingTop: spacing.sm,
          paddingBottom: scrollBottomPad,
          gap: spacing.md,
        }}
      >
        <PharmacyIdentityCard
          pharmacyName={profile.pharmacyName}
          territoryLabel={profile.territoryLabel}
          isIntegrated={profile.isIntegrated}
          ownerUsername={profile.ownerUsername}
          pharmacyCode={profile.pharmacyCode}
          facadePhotoUri={pharmacy?.facadePhotoUri}
        />

        <PiiScoreBreakdownCard
          score={piiScore}
          tier={piiTier}
          drivers={pharmacy?.piiDrivers}
        />

        <PharmacyLicensesCard
          licenses={profile.licenses}
          onPressUpdate={handleEditLicenses}
          onPreviewLicense={setPreviewLicense}
        />

        <PharmacyLocationCard
          addressText={profile.addressText}
          latitude={profile.latitude}
          longitude={profile.longitude}
          onPressChangePin={() => setLocationModalVisible(true)}
        />
      </ScrollView>

      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        initialName={profile.pharmacyName}
        initialUsername={profile.ownerUsername}
        initialIntegrated={profile.isIntegrated}
      />

      <LicenseUpdateModal
        visible={licenseModalVisible}
        onClose={() => setLicenseModalVisible(false)}
        licenses={profile.licenses}
      />

      <LicensePreviewModal
        license={previewLicense}
        onClose={() => setPreviewLicense(null)}
      />

      <PharmacyLocationPickerModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        selectedAddress={profile.addressText}
        selectedCoordinates={{
          latitude: profile.latitude,
          longitude: profile.longitude,
        }}
        onAddLocation={(loc) => {
          setLocation({
            address: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude,
          });
          setLocationModalVisible(false);
        }}
      />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  screenContainerContent: {
    paddingBottom: 0,
  },
  editProfilePill: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    borderWidth: 1,
  },
  editProfileText: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
  },
});

export default PharmacyProfileScreen;
