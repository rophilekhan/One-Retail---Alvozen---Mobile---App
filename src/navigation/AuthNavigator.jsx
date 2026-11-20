import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/auth/SplashScreen.jsx';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen.jsx';
import { SignInScreen } from '../screens/auth/SignInScreen.jsx';
import { AccountSetupScreen } from '../screens/auth/AccountSetupScreen.jsx';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen.jsx';
import { PharmacyLicensesScreen } from '../screens/auth/PharmacyLicensesScreen.jsx';
import { PharmacyLocationScreen } from '../screens/auth/PharmacyLocationScreen.jsx';

const Stack = createNativeStackNavigator();

/**
 * AuthNavigator - Multi-Step Authentication & Onboarding Stack
 * Grounded in OneRx / OneRetail onboarding architecture:
 * 1. Splash: Initial brand hydration & session detection
 * 2. Welcome: Aesthetic showcase with rotating aura & CTA
 * 3. SignIn: Pharmacy credentials login with stay-logged-in & slider
 * 4. AccountSetup: Phone, Email, Username, Password registration
 * 5. OtpVerification: 4-digit SMS/Email verification
 * 6. PharmacyLicenses: Mandatory DSL and Further Licenses 1 & 2
 * 7. PharmacyLocation: Physical Address, GPS Pin & Storefront Façade Photo
 */
export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="PharmacyLicenses" component={PharmacyLicensesScreen} />
      <Stack.Screen name="PharmacyLocation" component={PharmacyLocationScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;