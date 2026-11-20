import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { verticalScale } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppInput,
  AppButton,
  AppHeader,
  GlassCard,
  AppToast,
  AppBadge,
} from '../../components/core/index.js';

/**
 * AccountSetupScreen - Pharmacy Registration Step 1
 * Gathers Phone, Email, Username and Password as required by ONERETAIL_PRD.md
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const AccountSetupScreen = ({ navigation }) => {
  const { spacing } = useTheme();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedPhone || !trimmedEmail || !trimmedUser || !trimmedPass) {
      AppToast.show({
        title: 'Missing Fields',
        message: 'Please complete all fields to proceed with pharmacy registration.',
        type: 'warning',
      });
      return;
    }

    if (trimmedPhone.length < 10) {
      AppToast.show({
        title: 'Invalid Phone Number',
        message: 'Please enter a valid 11-digit mobile number.',
        type: 'error',
      });
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      AppToast.show({
        title: 'Invalid Email',
        message: 'Please provide a valid email address.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      AppToast.show({
        title: 'OTP Dispatched',
        message: `Verification code sent to ${trimmedPhone} and ${trimmedEmail}.`,
        type: 'info',
      });
      navigation.navigate('OtpVerification', {
        phone: trimmedPhone,
        email: trimmedEmail,
        username: trimmedUser,
        password: trimmedPass,
      });
    }, 400);
  };

  return (
    <AppScreenContainer keyboardAvoiding={true} scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Pharmacy Registration" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.stepHeader}>
          <AppBadge label="Step 1 of 4" variant="brand" />
          <AppText variant="headlineMedium" colorType="primary" style={styles.title}>
            Account Setup
          </AppText>
          <AppText variant="bodyMedium" colorType="muted">
            Create your primary administrator credentials for OneRetail.
          </AppText>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.formContent}>
            <AppInput
              label="Mobile Phone Number"
              placeholder="e.g. 03001234567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
              iconTone="teal"
            />

            <AppInput
              label="Pharmacy Email Address"
              placeholder="e.g. contact@citymeds.pk"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              iconTone="purple"
            />

            <AppInput
              label="Choose Username"
              placeholder="e.g. city_meds_admin"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              iconTone="neutral"
            />

            <AppInput
              label="Create Password"
              placeholder="Minimum 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              iconTone="gold"
            />

            <View style={{ height: spacing.lg }} />

            <AppButton
              variant="primary"
              title="Continue to OTP"
              loading={isLoading}
              onPress={handleContinue}
            />
          </View>
        </GlassCard>
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
  card: {
    width: '100%',
  },
  formContent: {
    width: '100%',
  },
});

export default AccountSetupScreen;
