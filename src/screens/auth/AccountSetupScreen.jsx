import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppText,
  AppInput,
  AppButton,
  AppScreenContainer,
  RegistrationProgress,
  AppBackButton,
  AppToast,
} from '../../components/core/index.js';
import {
  UserOutlineIcon,
  MailOutlineIcon,
  PhoneOutlineIcon,
  LockOutlineIcon,
} from '../../assets/vectors/index.js';

/**
 * AccountSetupScreen - Step 1 of Onboarding
 * Port 1:1 from OneRx AccountSetupScreen
 * Captures Contact Name, Username, Email, Phone, Password.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const AccountSetupScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Contact name is required';
    if (!form.username.trim()) newErrors.username = 'Pharmacy username is required';
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = 'Valid phone number is required';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      AppToast.show({
        title: 'Incomplete Details',
        message: 'Please complete all fields to proceed.',
        type: 'error',
      });
      return;
    }

    setErrors({});
    Keyboard.dismiss();

    navigation.navigate('OtpVerification', {
      phone: form.phone,
      email: form.email,
      userData: form,
    });
  };

  return (
    <AppScreenContainer withAmbientGlow={true} keyboardAvoiding={false} withHorizontalPadding={false}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(10) : 0}
      >
        {/* Progress Bar Header: Step 1 of 4 */}
        <RegistrationProgress currentStep={1} totalSteps={4} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Title Section */}
          <View style={styles.headerContainer}>
            <View style={styles.backButtonWrapper}>
              <AppBackButton onPress={() => navigation.goBack()} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText
                variant="headlineLarge"
                style={[
                  styles.title,
                  {
                    color: colors.text?.primary,
                    marginBottom: verticalScale(10),
                    fontFamily: 'DMSans-Medium',
                    fontSize: scaleFont(36),
                    lineHeight: scaleFont(42),
                  },
                ]}
              >
                Let's set up your{'\n'}pharmacy access
              </AppText>
              <AppText
                variant="bodyLarge"
                style={[
                  styles.subtitle,
                  {
                    color: '#787878',
                    fontFamily: 'DMSans-Regular',
                    fontSize: scaleFont(14),
                    lineHeight: scaleFont(20),
                  },
                ]}
              >
                Add your phone number and email so we can create your secure OneRetail account.
              </AppText>
            </View>
          </View>

          {/* Form Inputs Section */}
          <View style={styles.formSection}>
            {/* 1. Full Name / Pharmacist */}
            <AppInput
              placeholder="Pharmacist / Contact Name"
              value={form.fullName}
              autoCapitalize="words"
              onChangeText={(v) => {
                setForm((prev) => ({ ...prev, fullName: v }));
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              iconLeft={<UserOutlineIcon size={scale(20)} color={colors.text?.primary} />}
              iconTone="teal"
              error={errors.fullName}
            />

            {/* 2. Pharmacy Username */}
            <AppInput
              placeholder="Pharmacy Username"
              value={form.username}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(v) => {
                const clean = v.replace(/[^a-zA-Z0-9_]/g, '');
                setForm((prev) => ({ ...prev, username: clean }));
                if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
              }}
              iconLeft={<UserOutlineIcon size={scale(20)} color={colors.text?.primary} />}
              iconTone="neutral"
              error={errors.username}
            />

            {/* 3. Email Address */}
            <AppInput
              placeholder="Pharmacy Email Address"
              value={form.email}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(v) => {
                setForm((prev) => ({ ...prev, email: v }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              iconLeft={<MailOutlineIcon size={scale(20)} color={colors.text?.primary} />}
              iconTone="purple"
              error={errors.email}
            />

            {/* 4. Phone Number */}
            <AppInput
              placeholder="Mobile Phone Number"
              value={form.phone}
              keyboardType="phone-pad"
              onChangeText={(v) => {
                setForm((prev) => ({ ...prev, phone: v }));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              iconLeft={<PhoneOutlineIcon size={scale(20)} color={colors.text?.primary} />}
              iconTone="teal"
              error={errors.phone}
            />

            {/* 5. Account Password */}
            <AppInput
              placeholder="Account Password"
              value={form.password}
              secureTextEntry={true}
              onChangeText={(v) => {
                setForm((prev) => ({ ...prev, password: v }));
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              iconLeft={<LockOutlineIcon size={scale(20)} color={colors.text?.primary} />}
              iconTone="gold"
              error={errors.password}
            />
          </View>

          {/* Bottom Action Button */}
          <View style={styles.bottomSection}>
            <AppButton
              variant="primary"
              title="Continue"
              onPress={handleNext}
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreenContainer>
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
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(32),
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
  },
  backButtonWrapper: {
    marginLeft: scale(-12),
    marginRight: scale(8),
    marginTop: verticalScale(4),
  },
  title: {
    letterSpacing: -1,
  },
  subtitle: {},
  formSection: {
    marginBottom: verticalScale(24),
  },
  bottomSection: {
    marginTop: 'auto',
    paddingTop: verticalScale(12),
  },
});

export default AccountSetupScreen;
