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
import { LicenseUploadCard } from '../../components/onboarding/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';

/**
 * PharmacyLicensesScreen - Step 3 of Onboarding
 * Modeled after OneRx QualificationsScreen & ClinicInformationScreen 1:1.
 * Captures mandatory DSL + optional Further Licenses 1 & 2.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const PharmacyLicensesScreen = ({ navigation, route }) => {
  const { colors, spacing, typography } = useTheme();

  const [dsl, setDsl] = useState({
    licenseNumber: '',
    expiryDate: '2027-12-31',
    documentUri: null,
    status: 'Verified',
  });

  const [further1, setFurther1] = useState({
    licenseNumber: '',
    expiryDate: '',
    documentUri: null,
    status: 'Pending',
  });

  const [further2, setFurther2] = useState({
    licenseNumber: '',
    expiryDate: '',
    documentUri: null,
    status: 'Pending',
  });

  const setLicenses = usePharmacyStore((s) => s.setLicenses || s.updateLicenses);

  const handleNext = () => {
    if (!dsl.licenseNumber.trim()) {
      AppToast.show({
        title: 'DSL Required',
        message: 'Drug Sale License (DSL) number is mandatory to operate a retail pharmacy.',
        type: 'error',
      });
      return;
    }

    // Persist licenses to Zustand store
    if (setLicenses) {
      setLicenses({
        dsl: {
          number: dsl.licenseNumber.trim(),
          expiryDate: dsl.expiryDate,
          imageUri: dsl.documentUri,
        },
        furtherLicense1: further1.licenseNumber.trim()
          ? {
              number: further1.licenseNumber.trim(),
              expiryDate: further1.expiryDate,
              imageUri: further1.documentUri,
            }
          : null,
        furtherLicense2: further2.licenseNumber.trim()
          ? {
              number: further2.licenseNumber.trim(),
              expiryDate: further2.expiryDate,
              imageUri: further2.documentUri,
            }
          : null,
        dslNumber: dsl.licenseNumber.trim(),
        dslExpiryDate: dsl.expiryDate,
        dslPictureUri: dsl.documentUri,
        furtherLicense1Number: further1.licenseNumber.trim() || '',
        furtherLicense1ExpiryDate: further1.expiryDate || '',
        furtherLicense1PictureUri: further1.documentUri,
        furtherLicense2Number: further2.licenseNumber.trim() || '',
        furtherLicense2ExpiryDate: further2.expiryDate || '',
        furtherLicense2PictureUri: further2.documentUri,
      });
    }

    AppToast.show({
      title: 'Licenses Saved',
      message: 'Drug Sale License details recorded successfully.',
      type: 'success',
    });

    navigation.navigate('PharmacyLocation', {
      userData: route?.params?.userData,
    });
  };

  return (
    <AuthScreenContainer withHorizontalPadding={false} keyboardAvoiding={false}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(10) : 0}
      >
        {/* Progress Bar Header: Step 3 of 4 */}
        <RegistrationProgress currentStep={3} totalSteps={4} style={{ marginBottom: verticalScale(12) }} />

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
                Drug Licenses
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
                Enter regulatory drug sale license details and upload document photos for verification.
              </AppText>
            </View>
          </View>

          {/* Licenses Cards Section */}
          <View style={styles.cardsSection}>
            {/* 1. Mandatory Drug Sale License (DSL) */}
            <LicenseUploadCard
              title="Drug Sale License (DSL)"
              helperText="Mandatory retail drug license issued by Health Dept."
              isRequired={true}
              collapsible={false}
              defaultExpanded={true}
              licenseNumber={dsl.licenseNumber}
              licenseExpiry={dsl.expiryDate}
              imageUri={dsl.documentUri}
              onLicenseNumberChange={(val) => setDsl((p) => ({ ...p, licenseNumber: val }))}
              onLicenseExpiryChange={(val) => setDsl((p) => ({ ...p, expiryDate: val }))}
              onUploadDoc={(uri) => setDsl((p) => ({ ...p, documentUri: uri, status: 'Verified' }))}
              onRemoveDoc={() => setDsl((p) => ({ ...p, documentUri: null, status: 'Pending' }))}
            />

            {/* 2. Further License 1 (Biologicals) */}
            <LicenseUploadCard
              title="Further License 1"
              helperText="Biologicals / Cold Chain / Schedule G authorization."
              isRequired={false}
              collapsible={true}
              defaultExpanded={false}
              licenseNumber={further1.licenseNumber}
              licenseExpiry={further1.expiryDate}
              imageUri={further1.documentUri}
              onLicenseNumberChange={(val) => setFurther1((p) => ({ ...p, licenseNumber: val }))}
              onLicenseExpiryChange={(val) => setFurther1((p) => ({ ...p, expiryDate: val }))}
              onUploadDoc={(uri) => setFurther1((p) => ({ ...p, documentUri: uri, status: 'Verified' }))}
              onRemoveDoc={() => setFurther1((p) => ({ ...p, documentUri: null, status: 'Pending' }))}
            />

            {/* 3. Further License 2 (Narcotics/Controlled) */}
            <LicenseUploadCard
              title="Further License 2"
              helperText="Narcotics / Controlled drugs / Veterinary authorization."
              isRequired={false}
              collapsible={true}
              defaultExpanded={false}
              licenseNumber={further2.licenseNumber}
              licenseExpiry={further2.expiryDate}
              imageUri={further2.documentUri}
              onLicenseNumberChange={(val) => setFurther2((p) => ({ ...p, licenseNumber: val }))}
              onLicenseExpiryChange={(val) => setFurther2((p) => ({ ...p, expiryDate: val }))}
              onUploadDoc={(uri) => setFurther2((p) => ({ ...p, documentUri: uri, status: 'Verified' }))}
              onRemoveDoc={() => setFurther2((p) => ({ ...p, documentUri: null, status: 'Pending' }))}
            />
          </View>

          {/* Full-width Bottom Action Button */}
          <View style={styles.bottomSection}>
            <AppButton
              variant="primary"
              title="Save & Continue"
              onPress={handleNext}
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  cardsSection: {
    width: '100%',
    flexDirection: 'column',
    gap: verticalScale(16),
  },
  bottomSection: {
    width: '100%',
    paddingTop: verticalScale(10),
  },
});

export default PharmacyLicensesScreen;
