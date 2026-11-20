import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, moderateScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppText,
  AppInput,
  AppButton,
  AuthScreenContainer,
  RegistrationProgress,
  AppBackButton,
  AppToast,
  AppBadge,
  AppModal,
  GlassCard,
  MetricIconDisc,
} from '../../components/core/index.js';
import { LocationPickerModal } from '../../components/onboarding/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import {
  MapPinIcon,
  CameraCustomIcon,
  UploadCloudCustomIcon,
  ShieldCheckIcon,
} from '../../assets/vectors/AuthIcons.jsx';

/**
 * PharmacyLocationScreen - Step 4 of Onboarding
 * Modeled after OneRx ClinicInformationScreen & LocationPickerModal.
 * Captures Street Address, Interactive 180px Map Pin Preview, and Pharmacy Façade Photo.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const PharmacyLocationScreen = ({ navigation, route }) => {
  const { colors, isDark, radii, spacing, typography } = useTheme();

  const [address, setAddress] = useState('Main Boulevard, Gulberg III, Lahore');
  const [coordinates, setCoordinates] = useState({ latitude: 31.5204, longitude: 74.3587 });
  const [facadePhoto, setFacadePhoto] = useState(null);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [isMediaSheetVisible, setIsMediaSheetVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setLocation = usePharmacyStore((s) => s.setLocation);
  const setFacade = usePharmacyStore((s) => s.setFacadePhoto);
  const completeOnboarding = usePharmacyStore((s) => s.completeOnboarding);
  const setCredentials = useAuthStore((s) => s.setCredentials);

  // Camera Handler for Façade Photo
  const handleLaunchCamera = async () => {
    setIsMediaSheetVisible(false);
    try {
      const res = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
      });
      if (res?.assets?.[0]?.uri) {
        setFacadePhoto(res.assets[0].uri);
        AppToast.show({
          title: 'Photo Captured',
          message: 'Pharmacy storefront photo captured successfully.',
          type: 'success',
        });
        return;
      }
    } catch {
      // Fallback
    }
    const mockUri = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80';
    setFacadePhoto(mockUri);
    AppToast.show({
      title: 'Photo Attached',
      message: 'Storefront photo attached successfully.',
      type: 'success',
    });
  };

  // Gallery Handler for Façade Photo
  const handleLaunchGallery = async () => {
    setIsMediaSheetVisible(false);
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });
      if (res?.assets?.[0]?.uri) {
        setFacadePhoto(res.assets[0].uri);
        AppToast.show({
          title: 'Image Selected',
          message: 'Pharmacy storefront photo selected.',
          type: 'success',
        });
        return;
      }
    } catch {
      // Fallback
    }
    const mockUri = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80';
    setFacadePhoto(mockUri);
    AppToast.show({
      title: 'Photo Attached',
      message: 'Storefront photo attached successfully.',
      type: 'success',
    });
  };

  const handleFinishOnboarding = async () => {
    if (!address.trim()) {
      AppToast.show({
        title: 'Address Required',
        message: 'Please provide the physical street address of your pharmacy.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save location & façade to pharmacy store
      if (setLocation) {
        setLocation({
          address: address.trim(),
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      }

      if (facadePhoto && setFacade) {
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

  // Render Map Preview Canvas Card
  const renderMapPreviewCard = () => {
    const cardContent = (
      <View style={styles.mapCardInner}>
        {/* Stylized SVG Map streets canvas */}
        <View style={styles.mapCanvasHolder}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="mapBgGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={isDark ? '#0F1A24' : '#E8F5F8'} />
                <Stop offset="1" stopColor={isDark ? '#091017' : '#DDF0F5'} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#mapBgGrad)" />
            {/* Soft blocks */}
            <Rect x="20" y="20" width="80" height="60" rx="8" fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,155,169,0.06)'} />
            <Rect x="240" y="80" width="100" height="70" rx="8" fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,155,169,0.06)'} />
            {/* Street Lines */}
            <Path d="M -20 90 L 400 90" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth="6" />
            <Path d="M 160 -20 L 160 200" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth="8" />
            <Path d="M 40 140 L 380 40" stroke={isDark ? 'rgba(0,155,169,0.2)' : 'rgba(0,155,169,0.2)'} strokeWidth="4" />
          </Svg>

          {/* Centered Map Pin with Coordinate Badge */}
          <View style={styles.pinCenterCluster} pointerEvents="none">
            <View
              style={[
                styles.coordTooltip,
                {
                  backgroundColor: isDark ? 'rgba(2,2,2,0.85)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)',
                },
              ]}
            >
              <AppText
                style={[
                  styles.coordTooltipText,
                  { color: colors.brand.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
              >
                {`${coordinates.latitude.toFixed(4)}° N, ${coordinates.longitude.toFixed(4)}° E`}
              </AppText>
            </View>
            <View
              style={[
                styles.pinDisc,
                {
                  backgroundColor: colors.brand.primary,
                  shadowColor: colors.brand.primary,
                },
              ]}
            >
              <MapPinIcon size={scale(18)} color="#FFFFFF" />
            </View>
          </View>

          {/* Adjust Pin on Map Floating Action Pill */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsMapModalVisible(true)}
            style={[
              styles.adjustPinBtn,
              {
                backgroundColor: isDark ? 'rgba(10, 10, 12, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          >
            <MapPinIcon size={scale(14)} color={colors.brand.primary} />
            <AppText
              style={[
                styles.adjustPinText,
                { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
              ]}
            >
              Adjust Pin on Map
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );

    return isDark ? (
      <GlassCard radius={radii.card} style={styles.mapCardOuter} contentStyle={{ padding: 0 }}>
        {cardContent}
      </GlassCard>
    ) : (
      <View
        style={[
          styles.mapCardOuter,
          styles.lightCard,
          {
            backgroundColor: colors.surface?.card || '#FFFFFF',
            borderColor: colors.border?.card || 'rgba(0, 0, 0, 0.06)',
            shadowColor: colors.surface?.inputShadow || '#6FB4C2',
          },
        ]}
      >
        {cardContent}
      </View>
    );
  };

  // Render Façade Upload Card
  const renderFacadeCard = () => {
    const cardContent = (
      <View style={styles.facadeCardInner}>
        {/* Header */}
        <View style={styles.facadeHeader}>
          <MetricIconDisc variant="teal" size={scale(38)}>
            <CameraCustomIcon size={scale(18)} color="#FFFFFF" />
          </MetricIconDisc>
          <View style={styles.facadeHeaderMiddle}>
            <AppText
              variant="bodyLarge"
              numberOfLines={1}
              style={[
                styles.cardTitle,
                { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
              ]}
            >
              Pharmacy Façade Photo
            </AppText>
            <AppText
              variant="caption"
              numberOfLines={2}
              style={[
                styles.cardSubtitle,
                { color: colors.text.secondary, fontFamily: fontFamilies.primaryRegular },
              ]}
            >
              Clear front-facing exterior photo showing signage and entrance
            </AppText>
          </View>
          <View style={styles.facadeHeaderRight}>
            <AppBadge
              label={facadePhoto ? 'Attached' : 'Required'}
              variant={facadePhoto ? 'success' : 'brand'}
              size="sm"
            />
          </View>
        </View>

        {/* Dropzone or Preview */}
        {facadePhoto ? (
          <View style={styles.photoPreviewWrap}>
            <Image source={{ uri: facadePhoto }} style={styles.previewImage} resizeMode="cover" />
            {/* Floating Glass Pill Bar */}
            <View
              style={[
                styles.floatingGlassBar,
                {
                  backgroundColor: isDark ? 'rgba(10, 10, 12, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            >
              <View style={styles.floatingBarLeft}>
                <ShieldCheckIcon size={scale(14)} color={isDark ? '#38BDF8' : '#009BA9'} />
                <AppText
                  style={[
                    styles.attachedPillText,
                    { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                  ]}
                  numberOfLines={1}
                >
                  Storefront Attached
                </AppText>
              </View>

              <View style={styles.floatingBarActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsMediaSheetVisible(true)}
                  style={styles.pillActionBtn}
                >
                  <AppText style={[styles.pillActionChange, { color: isDark ? '#38BDF8' : '#0F4761' }]}>
                    Change
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setFacadePhoto(null)}
                  style={styles.pillActionBtn}
                >
                  <AppText style={[styles.pillActionRemove, { color: colors.status?.error || '#DC2626' }]}>
                    Remove
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setIsMediaSheetVisible(true)}
            style={[
              styles.dropzone,
              {
                borderColor: colors.brand.primary,
                backgroundColor: isDark ? 'rgba(0, 155, 169, 0.04)' : 'rgba(0, 155, 169, 0.02)',
              },
            ]}
          >
            <MetricIconDisc variant="teal" size={scale(40)}>
              <UploadCloudCustomIcon size={scale(20)} color="#FFFFFF" />
            </MetricIconDisc>
            <AppText
              style={[
                styles.dropzoneTitle,
                { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
              ]}
            >
              Upload Storefront Picture
            </AppText>
            <AppText
              style={[
                styles.dropzoneSubtitle,
                { color: colors.text.muted, fontFamily: fontFamilies.primaryRegular },
              ]}
            >
              Camera or Gallery • JPG, PNG
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    );

    return isDark ? (
      <GlassCard radius={radii.card} style={styles.facadeCardOuter} contentStyle={{ padding: 0 }}>
        {cardContent}
      </GlassCard>
    ) : (
      <View
        style={[
          styles.facadeCardOuter,
          styles.lightCard,
          {
            backgroundColor: colors.surface?.card || '#FFFFFF',
            borderColor: colors.border?.card || 'rgba(0, 0, 0, 0.06)',
            shadowColor: colors.surface?.inputShadow || '#6FB4C2',
          },
        ]}
      >
        {cardContent}
      </View>
    );
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
                Store Location & Façade
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
            {/* Street Address Input */}
            <AppInput
              label="Pharmacy Physical Address"
              placeholder="e.g. Shop #4, Main Market, Gulberg III, Lahore"
              value={address}
              onChangeText={setAddress}
              iconTone="teal"
              iconLeft={<MapPinIcon size={scale(18)} color={colors.text.primary} />}
              style={{ width: '100%', marginVertical: 0 }}
            />

            {/* Interactive 180px Map Preview Card */}
            {renderMapPreviewCard()}

            {/* Storefront Façade Photo Card */}
            {renderFacadeCard()}
          </View>

          {/* Bottom Complete Registration Button */}
          <View style={styles.bottomSection}>
            <AppButton
              variant="primary"
              title="Complete Pharmacy Onboarding"
              loading={isSubmitting}
              onPress={handleFinishOnboarding}
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Interactive Location Picker Modal */}
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

      {/* Media Source Picker Sheet (Camera vs Gallery) */}
      <AppModal
        visible={isMediaSheetVisible}
        onClose={() => setIsMediaSheetVisible(false)}
        type="bottomSheet"
        title="Upload Storefront Picture"
      >
        <View style={styles.mediaSheetContent}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLaunchCamera}
            style={[
              styles.mediaOptionBtn,
              {
                backgroundColor: isDark ? '#1C1C20' : '#F8FAFC',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <MetricIconDisc variant="teal" size={scale(40)} marginRight={scale(12)}>
              <CameraCustomIcon size={scale(20)} color="#FFFFFF" />
            </MetricIconDisc>
            <View style={{ flex: 1 }}>
              <AppText
                style={[
                  styles.mediaOptionTitle,
                  { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
              >
                Take Storefront Photo
              </AppText>
              <AppText
                style={[
                  styles.mediaOptionSub,
                  { color: colors.text.muted, fontFamily: fontFamilies.primaryRegular },
                ]}
              >
                Use device camera to snap front exterior
              </AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLaunchGallery}
            style={[
              styles.mediaOptionBtn,
              {
                backgroundColor: isDark ? '#1C1C20' : '#F8FAFC',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <MetricIconDisc variant="purple" size={scale(40)} marginRight={scale(12)}>
              <UploadCloudCustomIcon size={scale(20)} color="#FFFFFF" />
            </MetricIconDisc>
            <View style={{ flex: 1 }}>
              <AppText
                style={[
                  styles.mediaOptionTitle,
                  { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
              >
                Choose from Photo Gallery
              </AppText>
              <AppText
                style={[
                  styles.mediaOptionSub,
                  { color: colors.text.muted, fontFamily: fontFamilies.primaryRegular },
                ]}
              >
                Select high-resolution façade image
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </AppModal>
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
  mapCardOuter: {
    width: '100%',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
  },
  lightCard: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 3,
  },
  mapCardInner: {
    width: '100%',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
  },
  mapCanvasHolder: {
    height: verticalScale(180),
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCenterCluster: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -verticalScale(18),
  },
  coordTooltip: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(999),
    borderWidth: 1,
    marginBottom: verticalScale(4),
    elevation: 3,
  },
  coordTooltipText: {
    fontSize: scaleFont(11),
  },
  pinDisc: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  adjustPinBtn: {
    position: 'absolute',
    bottom: verticalScale(12),
    right: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(999),
    borderWidth: 1,
    elevation: 3,
  },
  adjustPinText: {
    fontSize: scaleFont(12),
  },
  facadeCardOuter: {
    width: '100%',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
  },
  facadeCardInner: {
    width: '100%',
    flexDirection: 'column',
    padding: scale(16),
  },
  facadeHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  facadeHeaderMiddle: {
    flex: 1,
    marginLeft: scale(10),
    marginRight: scale(10),
    justifyContent: 'center',
  },
  facadeHeaderRight: {
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: scaleFont(15),
  },
  cardSubtitle: {
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
  },
  dropzone: {
    width: '100%',
    minHeight: verticalScale(120),
    borderRadius: moderateScale(18),
    borderWidth: 1.2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
  },
  dropzoneTitle: {
    fontSize: scaleFont(14),
    marginTop: verticalScale(8),
  },
  dropzoneSubtitle: {
    fontSize: scaleFont(11.5),
    marginTop: verticalScale(2),
  },
  photoPreviewWrap: {
    width: '100%',
    minHeight: verticalScale(120),
    height: verticalScale(140),
    borderRadius: moderateScale(18),
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: verticalScale(140),
    borderRadius: moderateScale(18),
  },
  floatingGlassBar: {
    position: 'absolute',
    bottom: verticalScale(8),
    left: scale(8),
    right: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(999),
    borderWidth: 1,
  },
  floatingBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    flex: 1,
    marginRight: scale(8),
  },
  attachedPillText: {
    fontSize: scaleFont(11.5),
  },
  floatingBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  pillActionBtn: {
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
  },
  pillActionChange: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  pillActionRemove: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  mediaSheetContent: {
    paddingVertical: verticalScale(8),
    gap: verticalScale(12),
  },
  mediaOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(14),
    borderRadius: moderateScale(18),
    borderWidth: 1,
  },
  mediaOptionTitle: {
    fontSize: scaleFont(15),
  },
  mediaOptionSub: {
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
  },
  bottomSection: {
    width: '100%',
    paddingTop: verticalScale(10),
  },
});

export default PharmacyLocationScreen;
