import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppText,
  AppButton,
  AuthScreenContainer,
  RegistrationProgress,
  AppBackButton,
  AppToast,
} from '../../components/core/index.js';
import {
  LocationPickerModal,
  FacadeUploadCard,
  PharmacyMapAddressCard,
} from '../../components/onboarding/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * PharmacyLocationScreen - Step 4 of Onboarding
 * Modeled after OneRx ClinicInformationScreen & LocationPickerModal.
 * Interactive MapView with centered Marker, live Geocoding, Address input,
 * and storefront Facade photo card.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const PharmacyLocationScreen = ({ navigation, route }) => {
  const { colors, spacing } = useTheme();

  const [address, setAddress] = useState('Main Boulevard, Gulberg III, Lahore');
  const [coordinates, setCoordinates] = useState({ latitude: 31.5204, longitude: 74.3587 });
  const [facadePhoto, setFacadePhoto] = useState(null);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setLocation = usePharmacyStore((s) => s.setLocation);
  const setFacade = usePharmacyStore((s) => s.setFacadePhoto);
  const completeOnboarding = usePharmacyStore((s) => s.completeOnboarding);
  const setCredentials = useAuthStore((s) => s.setCredentials);

  const handleFinishOnboarding = async () => {
    if (!address.trim()) {
      AppToast.show({
        title: 'Address Required',
        message: 'Please provide the physical street address of your pharmacy.',
        type: 'error',
      });
      return;
    }

    if (!coordinates?.latitude || !coordinates?.longitude) {
      AppToast.show({
        title: 'Location Required',
        message: 'Please pin your pharmacy location on the map.',
        type: 'error',
      });
      return;
    }

    if (!facadePhoto) {
      AppToast.show({
        title: 'Storefront Photo Required',
        message: 'Please attach a photo of your pharmacy storefront Facade.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save location & Facade to pharmacy store
      if (setLocation) {
        setLocation({
          address: address.trim(),
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      }

      if (setFacade) {
        setFacade(facadePhoto);
      }

      if (completeOnboarding) {
        completeOnboarding();
      }

      // 2. Hydrate active authenticated admin session
      const userData = route?.params?.userData || {};
      const adminUser = {
        id: 'admin_' + Date.now(),
        username: userData.username || 'pharmacy_admin',
        name: userData.fullName || 'City Meds Pharmacy',
        role: 'PHARMACY_ADMIN',
        pharmacyId: 'pharmacy_alvozen_01',
      };

      if (setCredentials) {
        await setCredentials({
          user: adminUser,
          token: 'auth_token_' + Date.now(),
          refreshToken: 'refresh_token_' + Date.now(),
          role: 'PHARMACY_ADMIN',
        });
      }

      AppToast.show({
        title: 'Onboarding Complete',
        message: 'Welcome to OneRetail! Your pharmacy profile is active.',
        type: 'success',
      });

      if (navigation?.replace) {
        navigation.replace('MainTabs');
      } else if (navigation?.navigate) {
        navigation.navigate('MainTabs');
      }
    } catch (e) {
      AppToast.show({
        title: 'Error',
        message: e?.message || 'Failed to complete registration.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenContainer withHorizontalPadding={false} keyboardAvoiding={false}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(10) : 0}
      >
        {/* Progress Bar Header: Step 4 of 4 */}
        <RegistrationProgress currentStep={4} totalSteps={4} style={{ marginBottom: verticalScale(12) }} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: spacing?.screenHorizontal || scale(20),
              paddingBottom: verticalScale(110),
              gap: spacing?.md || verticalScale(16),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Title Section */}
          <View style={styles.headerContainer}>
            <View style={styles.backButtonWrapper}>
              <AppBackButton onPress={() => navigation.goBack()} />
            </View>
            <View style={styles.titleColumn}>
              <AppText
                variant="headlineMedium"
                style={[
                  styles.title,
                  {
                    color: colors.text.primary,
                    fontFamily: fontFamilies.primaryMedium,
                    fontSize: scaleFont(28),
                    lineHeight: scaleFont(34),
                  },
                ]}
              >
                Store Location & Facade
              </AppText>
              <AppText
                variant="bodyMedium"
                style={[
                  styles.subtitle,
                  {
                    color: colors.text.secondary,
                    fontFamily: fontFamilies.primaryRegular,
                    fontSize: scaleFont(14),
                    lineHeight: scaleFont(20),
                  },
                ]}
              >
                Provide your physical store address, map coordinates, and clear storefront photo.
              </AppText>
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.formSection}>
            {/* Card 1: Map View & Address Input */}
            <PharmacyMapAddressCard
              address={address}
              onAddressChange={setAddress}
              coordinates={coordinates}
              onCoordinatesChange={setCoordinates}
              onOpenFullMap={() => setIsMapModalVisible(true)}
            />

            {/* Card 2: Facade Upload Card */}
            <FacadeUploadCard photoUri={facadePhoto} onPhotoChange={setFacadePhoto} />
          </View>

          {/* Bottom Complete Registration Button */}
          <View style={styles.bottomSection}>
            <AppButton
              variant="primary"
              title="Complete Registration"
              loading={isSubmitting}
              onPress={handleFinishOnboarding}
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Full Google Map Location Picker Modal */}
      <LocationPickerModal
        visible={isMapModalVisible}
        onClose={() => setIsMapModalVisible(false)}
        selectedAddress={address}
        selectedCoordinates={coordinates}
        onAddLocation={({ address: newAddr, latitude, longitude }) => {
          if (newAddr) setAddress(newAddr);
          if (latitude && longitude) setCoordinates({ latitude, longitude });
        }}
      />
    </AuthScreenContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  backButtonWrapper: {
    marginLeft: scale(-12),
    marginRight: scale(10),
    marginTop: verticalScale(2),
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    letterSpacing: -0.5,
    marginBottom: verticalScale(6),
  },
  subtitle: {},
  formSection: {
    width: '100%',
    flexDirection: 'column',
    gap: verticalScale(16),
  },
  bottomSection: {
    width: '100%',
    paddingTop: verticalScale(10),
  },
});

export default PharmacyLocationScreen;
