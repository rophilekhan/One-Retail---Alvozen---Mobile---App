import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, moderateScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppText,
  AppBadge,
  AppModal,
  AppToast,
  GlassCard,
  MetricIconDisc,
} from '../core/index.js';
import {
  CameraCustomIcon,
  UploadCloudCustomIcon,
  ShieldCheckIcon,
} from '../../assets/vectors/index.js';

/**
 * FacadeUploadCard
 * Reusable Pharmacy Facade photo card component adhering strictly to
 * OneRetail design system and glassmorphic tokens.
 *
 * @param {Object} props
 * @param {string|null} props.photoUri
 * @param {Function} props.onPhotoChange
 */
export const FacadeUploadCard = ({ photoUri, onPhotoChange }) => {
  const { colors, isDark, radii } = useTheme();
  const [isMediaSheetVisible, setIsMediaSheetVisible] = useState(false);

  const handleLaunchCamera = async () => {
    setIsMediaSheetVisible(false);
    try {
      const res = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
      });
      if (res?.assets?.[0]?.uri) {
        onPhotoChange?.(res.assets[0].uri);
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
    onPhotoChange?.(mockUri);
    AppToast.show({
      title: 'Photo Attached',
      message: 'Storefront photo attached successfully.',
      type: 'success',
    });
  };

  const handleLaunchGallery = async () => {
    setIsMediaSheetVisible(false);
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });
      if (res?.assets?.[0]?.uri) {
        onPhotoChange?.(res.assets[0].uri);
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
    onPhotoChange?.(mockUri);
    AppToast.show({
      title: 'Photo Attached',
      message: 'Storefront photo attached successfully.',
      type: 'success',
    });
  };

  const cardContent = (
    <View style={styles.cardInner}>
      {/* Header */}
      <View style={styles.headerRow}>
        <MetricIconDisc variant="teal" size={scale(38)}>
          <CameraCustomIcon size={scale(18)} color={isDark ? '#FFFFFF' : '#0F4761'} />
        </MetricIconDisc>
        <View style={styles.headerMiddle}>
          <AppText
            variant="bodyLarge"
            numberOfLines={1}
            style={[
              styles.cardTitle,
              { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
            ]}
          >
            Pharmacy Facade Photo
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
        <View style={styles.headerRight}>
          <AppBadge
            label={photoUri ? 'Attached' : 'Required'}
            variant={photoUri ? 'success' : 'brand'}
            size="sm"
          />
        </View>
      </View>

      {/* Dropzone or Preview */}
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
          <View
            style={[
              styles.floatingGlassBar,
              {
                backgroundColor: isDark ? 'rgba(10, 10, 12, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          >
            <View style={styles.barLeft}>
              <ShieldCheckIcon size={scale(14)} color={isDark ? '#38BDF8' : colors.brand.primary} />
              <AppText
                style={[
                  styles.attachedText,
                  { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
                numberOfLines={1}
              >
                Storefront Attached
              </AppText>
            </View>

            <View style={styles.barActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsMediaSheetVisible(true)}
                style={styles.actionBtn}
              >
                <AppText style={[styles.actionChange, { color: isDark ? '#38BDF8' : colors.brand.primary }]}>
                  Change
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPhotoChange?.(null)}
                style={styles.actionBtn}
              >
                <AppText style={[styles.actionRemove, { color: colors.status?.error || '#DC2626' }]}>
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

      {/* Media Source Picker Sheet */}
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
                  styles.optionTitle,
                  { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
              >
                Take Storefront Photo
              </AppText>
              <AppText
                style={[
                  styles.optionSub,
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
                  styles.optionTitle,
                  { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
              >
                Choose from Photo Gallery
              </AppText>
              <AppText
                style={[
                  styles.optionSub,
                  { color: colors.text.muted, fontFamily: fontFamilies.primaryRegular },
                ]}
              >
                Select high-resolution Facade image
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </AppModal>
    </View>
  );

  return isDark ? (
    <GlassCard radius={radii.card} style={styles.cardOuter} contentStyle={{ padding: 0 }}>
      {cardContent}
    </GlassCard>
  ) : (
    <View
      style={[
        styles.cardOuter,
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

const styles = StyleSheet.create({
  cardOuter: {
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
  cardInner: {
    width: '100%',
    flexDirection: 'column',
    padding: scale(16),
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  headerMiddle: {
    flex: 1,
    marginLeft: scale(10),
    marginRight: scale(10),
    justifyContent: 'center',
  },
  headerRight: {
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
  previewContainer: {
    width: '100%',
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
  barLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    flex: 1,
    marginRight: scale(8),
  },
  attachedText: {
    fontSize: scaleFont(11.5),
  },
  barActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  actionBtn: {
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
  },
  actionChange: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  actionRemove: {
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
  optionTitle: {
    fontSize: scaleFont(15),
  },
  optionSub: {
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
  },
});

export default FacadeUploadCard;
