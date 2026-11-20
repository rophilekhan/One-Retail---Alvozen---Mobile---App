import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import {
  AppScreenContainer,
  AppBackButton,
  AppText,
  AppToast,
  PAToggleSwitch,
  FieldIconBadge,
  GlassSurface,
} from '../../components/core/index.js';
import { StaffPermissionsMatrix } from '../../components/staff/index.js';
import { useStaffStore, PERMISSIONS } from '../../store/useStaffStore.js';
import {
  UserOutlineIcon,
  IdCardOutlineIcon,
  LockOutlineIcon,
  DeleteBinIcon,
  EyeOffIcon,
  EyeOpenIcon,
} from '../../assets/vectors/index.js';

/**
 * StaffFormScreen
 * Exact OneRx PACreateProfileScreen & PAEditProfileScreen port for OneRetail Staff Management
 * Supports adding new staff profiles and editing existing ones with all 7 granular permissions.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const StaffFormScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const existingStaff = route?.params?.staff;
  const isEditing = Boolean(existingStaff);

  const addStaff = useStaffStore((s) => s.addStaff);
  const updateStaff = useStaffStore((s) => s.updateStaff);
  const deleteStaff = useStaffStore((s) => s.deleteStaff);

  const [name, setName] = useState(existingStaff?.name || '');
  const [username, setUsername] = useState(existingStaff?.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(
    existingStaff ? existingStaff.isActive !== false : true
  );
  const [avatarUrl] = useState(existingStaff?.avatarUrl || '');

  // Permissions state map
  const [permissions, setPermissions] = useState(() => {
    const initial = {
      [PERMISSIONS.SCAN_QR_DEVICE]: true,
      [PERMISSIONS.SCAN_QR_PLUGIN]: false,
      [PERMISSIONS.PO_INITIATOR]: false,
      [PERMISSIONS.PO_APPROVER]: false,
      [PERMISSIONS.EXPIRY_INITIATOR]: false,
      [PERMISSIONS.EXPIRY_APPROVER]: false,
      [PERMISSIONS.UPLOAD_CLOSING_DATA]: false,
    };

    if (isEditing && Array.isArray(existingStaff?.allowedPermissions)) {
      Object.keys(initial).forEach((k) => {
        initial[k] = existingStaff.allowedPermissions.includes(k);
      });
    }

    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTogglePermission = useCallback((key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleDelete = () => {
    Alert.alert(
      'Delete Staff Profile',
      `Are you sure you want to delete ${name || username}'s profile? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteStaff(existingStaff.id);
            AppToast.show({
              title: 'Profile Deleted',
              message: `${name || username}'s profile has been removed.`,
              type: 'success',
            });
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleSave = () => {
    const trimmedUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
    const trimmedName = name.trim() || trimmedUsername;

    if (!trimmedUsername) {
      AppToast.show({
        title: 'Username Required',
        message: 'Please provide a username for this staff profile.',
        type: 'warning',
      });
      return;
    }

    if (!isEditing && !password.trim()) {
      AppToast.show({
        title: 'Password Required',
        message: 'Please specify an initial password for login.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    const grantedKeys = Object.keys(permissions).filter((k) => permissions[k]);

    setTimeout(() => {
      setIsSubmitting(false);

      if (isEditing) {
        updateStaff(existingStaff.id, {
          name: trimmedName,
          username: trimmedUsername,
          isActive,
          allowedPermissions: grantedKeys,
          ...(password.trim() ? { password: password.trim() } : {}),
        });
        AppToast.show({
          title: 'Changes Saved',
          message: `${trimmedName}'s profile has been updated.`,
          type: 'success',
        });
      } else {
        addStaff({
          id: 'staff_' + Date.now(),
          name: trimmedName,
          username: trimmedUsername,
          role: 'STAFF',
          isActive,
          allowedPermissions: grantedKeys,
          createdAt: new Date().toISOString(),
        });
        AppToast.show({
          title: 'Profile Created',
          message: `${trimmedName} added with ${grantedKeys.length} permissions.`,
          type: 'success',
        });
      }

      navigation.goBack();
    }, 500);
  };

  // Glass card and input styling
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.50)';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.95)';
  const saveBtnBg = isDark ? '#009BA9' : '#009BA9';

  const getFieldConfig = (isFilled) => {
    if (isDark) {
      return isFilled
        ? {
            bg: '#000000',
            border: 'transparent',
            borderWidth: 0,
            text: '#FFFFFF',
            icon: '#FFFFFF',
            placeholder: '#7E8B9B',
            eye: '#9CA3AF',
            hasShadow: false,
          }
        : {
            bg: 'rgba(255, 255, 255, 0.05)',
            border: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
            text: '#FFFFFF',
            icon: '#FFFFFF',
            placeholder: '#7E8B9B',
            eye: '#7E8B9B',
            hasShadow: false,
          };
    }
    return {
      bg: '#FFFFFF',
      border: '#EDF2F7',
      borderWidth: 1,
      text: '#0F172A',
      icon: '#020202',
      placeholder: '#9CA3AF',
      eye: '#9CA3AF',
      hasShadow: true,
    };
  };

  const nameConfig = getFieldConfig(Boolean(name.trim()));
  const userConfig = getFieldConfig(Boolean(username.trim()));
  const passConfig = getFieldConfig(Boolean(password.length));

  return (
    <AppScreenContainer
      withAmbientGlow={true}
      withHorizontalPadding={false}
      scrollable={false}
      style={styles.screenRoot}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* ── 1. Top Header ────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <AppBackButton onPress={handleBack} />

        <AppText style={[styles.headerTitle, { color: colors.text?.primary || '#020202' }]}>
          {isEditing ? 'Edit Staff Profile' : 'Add Staff Member'}
        </AppText>

        {isEditing ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Delete staff profile"
          >
            <GlassSurface
              width={scale(44)}
              height={scale(44)}
              fillOpacity={isDark ? 0.05 : 0.15}
              sheenScale={0}
              blurAmount={0}
            >
              <DeleteBinIcon
                size={scale(19)}
                color={isDark ? '#FFFFFF' : '#020202'}
              />
            </GlassSurface>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerRightSpacer} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + verticalScale(28) },
        ]}
      >
        {/* ── 2. Top Profile Glass Card (Pill / Capsule) ──────── */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: cardBg,
              borderColor: cardBorder,
            },
          ]}
        >
          <View style={styles.profileLeftRow}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  { backgroundColor: colors.surface?.iconBg || 'rgba(0, 155, 169, 0.1)' },
                ]}
              >
                <AppText style={[styles.avatarFallbackText, { color: colors.brand?.primary || '#009BA9' }]}>
                  {(name || username || 'ST').substring(0, 2).toUpperCase()}
                </AppText>
              </View>
            )}

            <AppText style={[styles.staffNameText, { color: colors.text?.primary || '#020202' }]}>
              {name || username || 'New Staff Profile'}
            </AppText>
          </View>

          <View style={styles.activeRow}>
            <AppText style={[styles.activeLabel, { color: isDark ? '#D1D5DB' : colors.text?.secondary || '#787878' }]}>
              Active
            </AppText>
            <PAToggleSwitch value={isActive} onValueChange={setIsActive} />
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' },
          ]}
        />

        {/* ── 3. Profile Input Fields ─────────────────────────── */}
        <View style={styles.inputsSection}>
          {/* Full Name Pill */}
          <View
            style={[
              styles.inputPill,
              {
                backgroundColor: nameConfig.bg,
                borderColor: nameConfig.border,
                borderWidth: nameConfig.borderWidth,
              },
              nameConfig.hasShadow && styles.pillShadow,
            ]}
          >
            <FieldIconBadge type="name" isDark={isDark} size={40}>
              <UserOutlineIcon size={scale(19)} color={nameConfig.icon} />
            </FieldIconBadge>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor={nameConfig.placeholder}
              style={[styles.textInput, { color: nameConfig.text }]}
            />
          </View>

          {/* Username Pill */}
          <View
            style={[
              styles.inputPill,
              {
                backgroundColor: userConfig.bg,
                borderColor: userConfig.border,
                borderWidth: userConfig.borderWidth,
              },
              userConfig.hasShadow && styles.pillShadow,
            ]}
          >
            <FieldIconBadge type="username" isDark={isDark} size={40}>
              <IdCardOutlineIcon size={scale(19)} color={userConfig.icon} />
            </FieldIconBadge>

            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username (e.g. dispensary_1)"
              autoCapitalize="none"
              placeholderTextColor={userConfig.placeholder}
              style={[styles.textInput, { color: userConfig.text }]}
            />
          </View>

          {/* Password Pill */}
          <View
            style={[
              styles.inputPill,
              {
                backgroundColor: passConfig.bg,
                borderColor: passConfig.border,
                borderWidth: passConfig.borderWidth,
              },
              passConfig.hasShadow && styles.pillShadow,
            ]}
          >
            <FieldIconBadge type="password" isDark={isDark} size={40}>
              <LockOutlineIcon size={scale(19)} color={passConfig.icon} />
            </FieldIconBadge>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={isEditing ? 'New Password (leave blank to retain)' : 'Staff Password'}
              secureTextEntry={!showPassword}
              placeholderTextColor={passConfig.placeholder}
              style={[styles.textInput, { color: passConfig.text }]}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOpenIcon size={scale(18)} color={passConfig.eye} />
              ) : (
                <EyeOffIcon size={scale(18)} color={passConfig.eye} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' },
          ]}
        />

        {/* ── 4. Allowed Features / Permissions Matrix ────────── */}
        <View style={styles.sectionWrap}>
          <StaffPermissionsMatrix
            permissions={permissions}
            onToggle={handleTogglePermission}
            title="Staff Permissions"
          />
        </View>

        {/* ── 5. Action Buttons ───────────────────────────────── */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={isSubmitting}
            style={[styles.primaryBtn, { backgroundColor: saveBtnBg }]}
          >
            <AppText style={styles.primaryBtnText}>
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Add Staff Member'}
            </AppText>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleBack}
              style={[
                styles.secondaryBtn,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F5F5F5',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB',
                },
              ]}
            >
              <AppText
                style={[
                  styles.secondaryBtnText,
                  { color: isDark ? '#FFFFFF' : '#020202' },
                ]}
              >
                Back
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(14),
  },
  headerTitle: {
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    fontSize: scaleFont(19),
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: scale(44),
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    minHeight: verticalScale(68),
    borderRadius: scale(36),
    borderWidth: 1.5,
    marginBottom: verticalScale(4),
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: verticalScale(16),
  },
  profileLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(12),
  },
  avatarImage: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    marginRight: scale(12),
  },
  avatarFallback: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  avatarFallbackText: {
    fontFamily: fontFamilies.primaryBold,
    fontSize: scaleFont(16),
  },
  staffNameText: {
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    fontSize: scaleFont(16.5),
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeLabel: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(13.5),
    marginRight: scale(8),
  },
  inputsSection: {
    gap: verticalScale(12),
  },
  inputPill: {
    height: verticalScale(56),
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
  },
  pillShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(15),
    padding: 0,
  },
  eyeBtn: {
    padding: scale(6),
  },
  sectionWrap: {
    marginBottom: verticalScale(16),
  },
  buttonSection: {
    marginTop: verticalScale(16),
  },
  primaryBtn: {
    height: verticalScale(54),
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#009BA9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    fontSize: scaleFont(16),
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: verticalScale(54),
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  secondaryBtnText: {
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    fontSize: scaleFont(16),
  },
});

export default StaffFormScreen;
