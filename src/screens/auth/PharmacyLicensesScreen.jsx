import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
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

/**
 * PharmacyLicensesScreen - Registration Step 3
 * Mandated by ONERETAIL_PRD.md:
 * - DSL Number, Expiry Date, DSL Picture
 * - Further License 1 Number, Expiry Date, Picture
 * - Further License 2 Number, Expiry Date, Picture
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const PharmacyLicensesScreen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const updateLicenses = usePharmacyStore((s) => s.updateLicenses);

  // DSL
  const [dslNumber, setDslNumber] = useState('');
  const [dslExpiry, setDslExpiry] = useState('');
  const [dslPicUploaded, setDslPicUploaded] = useState(false);

  // Further License 1
  const [license1, setLicense1] = useState('');
  const [license1Expiry, setLicense1Expiry] = useState('');
  const [license1PicUploaded, setLicense1PicUploaded] = useState(false);

  // Further License 2 (Optional)
  const [license2, setLicense2] = useState('');
  const [license2Expiry, setLicense2Expiry] = useState('');
  const [license2PicUploaded, setLicense2PicUploaded] = useState(false);

  const handleUploadDoc = (docType) => {
    if (docType === 'dsl') setDslPicUploaded(true);
    if (docType === 'lic1') setLicense1PicUploaded(true);
    if (docType === 'lic2') setLicense2PicUploaded(true);

    AppToast.show({
      title: 'Document Attached',
      message: 'License certificate photo uploaded successfully.',
      type: 'success',
    });
  };

  const handleContinue = () => {
    if (!dslNumber.trim() || !dslExpiry.trim()) {
      AppToast.show({
        title: 'DSL Required',
        message: 'Drug Sale License (DSL) number and expiry are mandatory.',
        type: 'warning',
      });
      return;
    }

    // Save to store
    updateLicenses({
      dslNumber: dslNumber.trim(),
      dslExpiryDate: dslExpiry.trim(),
      dslPictureUri: dslPicUploaded ? 'attached_dsl_doc.jpg' : null,
      furtherLicense1: license1.trim(),
      furtherLicense1ExpiryDate: license1Expiry.trim(),
      furtherLicense1PictureUri: license1PicUploaded ? 'attached_lic1_doc.jpg' : null,
      furtherLicense2: license2.trim(),
      furtherLicense2ExpiryDate: license2Expiry.trim(),
      furtherLicense2PictureUri: license2PicUploaded ? 'attached_lic2_doc.jpg' : null,
    });

    navigation.navigate('PharmacyLocation');
  };

  return (
    <AppScreenContainer keyboardAvoiding={true} scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Regulatory Licenses" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.stepHeader}>
          <AppBadge label="Step 3 of 4" variant="brand" />
          <AppText variant="headlineMedium" colorType="primary" style={styles.title}>
            Pharmacy Licenses
          </AppText>
          <AppText variant="bodyMedium" colorType="muted">
            Provide your Drug Sale License (DSL) and any further valid licenses.
          </AppText>
        </View>

        {/* 1. Drug Sale License (Mandatory) */}
        <GlassCard style={styles.licenseCard}>
          <View style={styles.cardHeader}>
            <AppText variant="titleMedium" colorType="primary">
              Drug Sale License (DSL) *
            </AppText>
            <AppBadge label="Mandatory" variant="accent" />
          </View>

          <AppInput
            label="DSL Number"
            placeholder="e.g. DSL-KHI-2024-8991"
            value={dslNumber}
            onChangeText={setDslNumber}
          />

          <AppInput
            label="DSL Expiry Date"
            placeholder="DD/MM/YYYY"
            value={dslExpiry}
            onChangeText={setDslExpiry}
          />

          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.7}
            onPress={() => handleUploadDoc('dsl')}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText variant="captionMedium" colorType={dslPicUploaded ? 'success' : 'brand'} style={{ marginTop: 6 }}>
              {dslPicUploaded ? '✓ DSL Photo Attached' : 'Upload DSL Certificate Photo'}
            </AppText>
          </TouchableOpacity>
        </GlassCard>

        {/* 2. Further License 1 */}
        <GlassCard style={styles.licenseCard}>
          <View style={styles.cardHeader}>
            <AppText variant="titleMedium" colorType="primary">
              Further License 1
            </AppText>
            <AppBadge label="Optional" variant="neutral" />
          </View>

          <AppInput
            label="License Number"
            placeholder="e.g. FL1-99824"
            value={license1}
            onChangeText={setLicense1}
          />

          <AppInput
            label="Expiry Date"
            placeholder="DD/MM/YYYY"
            value={license1Expiry}
            onChangeText={setLicense1Expiry}
          />

          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.7}
            onPress={() => handleUploadDoc('lic1')}
          >
            <AppText variant="captionMedium" colorType={license1PicUploaded ? 'success' : 'brand'}>
              {license1PicUploaded ? '✓ License 1 Photo Attached' : 'Attach License 1 Photo'}
            </AppText>
          </TouchableOpacity>
        </GlassCard>

        {/* 3. Further License 2 */}
        <GlassCard style={styles.licenseCard}>
          <View style={styles.cardHeader}>
            <AppText variant="titleMedium" colorType="primary">
              Further License 2
            </AppText>
            <AppBadge label="Optional" variant="neutral" />
          </View>

          <AppInput
            label="License Number"
            placeholder="e.g. FL2-44120"
            value={license2}
            onChangeText={setLicense2}
          />

          <AppInput
            label="Expiry Date"
            placeholder="DD/MM/YYYY"
            value={license2Expiry}
            onChangeText={setLicense2Expiry}
          />

          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.7}
            onPress={() => handleUploadDoc('lic2')}
          >
            <AppText variant="captionMedium" colorType={license2PicUploaded ? 'success' : 'brand'}>
              {license2PicUploaded ? '✓ License 2 Photo Attached' : 'Attach License 2 Photo'}
            </AppText>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ height: spacing.lg }} />

        <AppButton
          variant="primary"
          title="Continue to Location"
          onPress={handleContinue}
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
  licenseCard: {
    width: '100%',
    marginVertical: verticalScale(8),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  uploadBox: {
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 155, 169, 0.4)',
    borderRadius: scale(14),
    padding: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
});

export default PharmacyLicensesScreen;
