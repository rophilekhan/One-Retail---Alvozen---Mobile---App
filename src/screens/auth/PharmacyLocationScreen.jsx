import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppInput,
  AppButton,
  AppHeader,
  GlassCard,
  AppBadge,
  AppToast,
} from '../../components/core/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { resetToMain } from '../../navigation/navigationService.js';

/**
 * PharmacyLocationScreen - Registration Step 4
 * Mandated by ONERETAIL_PRD.md:
 * - Pharmacy Address + Location Pin
 * - Pharmacy Façade Photo
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const PharmacyLocationScreen = ({ navigation }) => {
  const { colors, spacing } = useTheme();

  const [pharmacyName, setPharmacyName] = useState('');
  const [address, setAddress] = useState('');
  const [locationPin, setLocationPin] = useState({ latitude: 24.8607, longitude: 67.0011, detected: false });
  const [facadePhotoAttached, setFacadePhotoAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setPharmacyProfile = usePharmacyStore((s) => s.setPharmacyProfile);
  const setCredentials = useAuthStore((s) => s.setCredentials);

  const handleDetectLocation = () => {
    setLocationPin({
      latitude: 24.8607 + (Math.random() - 0.5) * 0.01,
      longitude: 67.0011 + (Math.random() - 0.5) * 0.01,
      detected: true,
    });
    AppToast.show({
      title: 'GPS Pin Dropped',
      message: 'Coordinates detected: 24.8607° N, 67.0011° E',
      type: 'success',
    });
  };

  const handleUploadFacade = () => {
    setFacadePhotoAttached(true);
    AppToast.show({
      title: 'Photo Attached',
      message: 'Pharmacy shopfront façade photo captured.',
      type: 'success',
    });
  };

  const handleCompleteRegistration = async () => {
    if (!pharmacyName.trim() || !address.trim()) {
      AppToast.show({
        title: 'Missing Address',
        message: 'Please provide Pharmacy Name and full street address.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Update pharmacy profile store
      setPharmacyProfile({
        name: pharmacyName.trim(),
        address: address.trim(),
        locationPin,
        facadePhotoUri: facadePhotoAttached ? 'facade_photo.jpg' : null,
      });

      // 2. Commit authenticated session
      await setCredentials({
        user: {
          id: 'admin_user_' + Date.now(),
          username: pharmacyName.trim().toLowerCase().replace(/\s+/g, '_'),
          name: pharmacyName.trim(),
          role: 'ADMIN',
          pharmacyId: 'pharma_store_' + Date.now(),
        },
        token: 'active_session_token_' + Date.now(),
        refreshToken: 'active_refresh_' + Date.now(),
        role: 'ADMIN',
      });

      AppToast.show({
        title: 'Registration Complete',
        message: 'Welcome to OneRetail! Your pharmacy is fully registered.',
        type: 'success',
      });

      resetToMain();
    } catch (e) {
      AppToast.show({
        title: 'Registration Error',
        message: e.message || 'Could not complete registration.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreenContainer keyboardAvoiding={true} scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Location & Façade" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.stepHeader}>
          <AppBadge label="Step 4 of 4" variant="brand" />
          <AppText variant="headlineMedium" colorType="primary" style={styles.title}>
            Address & Storefront
          </AppText>
          <AppText variant="bodyMedium" colorType="muted">
            Pin your physical pharmacy location and upload your storefront façade photo.
          </AppText>
        </View>

        <GlassCard style={styles.sectionCard}>
          <AppText variant="titleMedium" colorType="primary" style={{ marginBottom: verticalScale(8) }}>
            Store Details
          </AppText>

          <AppInput
            label="Registered Pharmacy Name"
            placeholder="e.g. Care Plus Pharmacy"
            value={pharmacyName}
            onChangeText={setPharmacyName}
          />

          <AppInput
            label="Complete Physical Address"
            placeholder="Shop #, Street, Block, Area, City"
            value={address}
            onChangeText={setAddress}
            multiline={true}
          />
        </GlassCard>

        {/* GPS Location Pin */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <AppText variant="titleMedium" colorType="primary">
              GPS Location Pin
            </AppText>
            <AppBadge label={locationPin.detected ? 'Pinned' : 'Required'} variant={locationPin.detected ? 'success' : 'accent'} />
          </View>

          <AppText variant="caption" colorType="muted" style={{ marginBottom: verticalScale(12) }}>
            Allows nearby customers and delivery partners to map your pharmacy.
          </AppText>

          <TouchableOpacity
            style={styles.pinButton}
            activeOpacity={0.7}
            onPress={handleDetectLocation}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx="12" cy="10" r="3" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText variant="bodyMediumMedium" colorType="brand" style={{ marginLeft: scale(10) }}>
              {locationPin.detected ? 'Update GPS Pin Coordinates' : 'Detect Current Location Pin'}
            </AppText>
          </TouchableOpacity>
        </GlassCard>

        {/* Storefront Façade Photo */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <AppText variant="titleMedium" colorType="primary">
              Storefront Façade Photo
            </AppText>
            <AppBadge label={facadePhotoAttached ? 'Attached' : 'Required'} variant={facadePhotoAttached ? 'success' : 'brand'} />
          </View>

          <TouchableOpacity
            style={styles.facadeUploadBox}
            activeOpacity={0.7}
            onPress={handleUploadFacade}
          >
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx="12" cy="13" r="4" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText variant="bodyMediumMedium" colorType={facadePhotoAttached ? 'success' : 'primary'} style={{ marginTop: 8 }}>
              {facadePhotoAttached ? '✓ Storefront Façade Photo Attached' : 'Capture or Upload Pharmacy Façade Photo'}
            </AppText>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ height: spacing.xl }} />

        <AppButton
          variant="primary"
          title="Complete Registration"
          loading={isSubmitting}
          onPress={handleCompleteRegistration}
        />
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: verticalScale(12),
  },
  stepHeader: {
    marginBottom: verticalScale(16),
  },
  title: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
  },
  sectionCard: {
    width: '100%',
    marginVertical: verticalScale(8),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(4),
  },
  pinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(0, 155, 169, 0.35)',
    backgroundColor: 'rgba(0, 155, 169, 0.08)',
  },
  facadeUploadBox: {
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 155, 169, 0.45)',
    borderRadius: scale(16),
    paddingVertical: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
});

export default PharmacyLocationScreen;
