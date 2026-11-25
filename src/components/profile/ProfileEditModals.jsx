import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppModal,
  AppText,
  AppInput,
  AppButton,
  AppToast,
} from '../core/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';

/**
 * EditProfileModal - Bottom sheet modal to update Pharmacy Identity & Integration Mode.
 */
export const EditProfileModal = ({
  visible,
  onClose,
  initialName,
  initialUsername,
  initialIntegrated,
}) => {
  const { colors, radii, spacing } = useTheme();
  const setPharmacyProfile = usePharmacyStore((s) => s.setPharmacyProfile);

  const [name, setName] = useState(initialName || '');
  const [ownerUsername, setOwnerUsername] = useState(initialUsername || '');
  const [isIntegrated, setIsIntegrated] = useState(Boolean(initialIntegrated));

  useEffect(() => {
    if (visible) {
      setName(initialName || '');
      setOwnerUsername(initialUsername || '');
      setIsIntegrated(Boolean(initialIntegrated));
    }
  }, [visible, initialName, initialUsername, initialIntegrated]);

  const handleSave = () => {
    const cleanName = name.trim();
    const cleanUser = ownerUsername.replace(/^@+/, '').trim();
    if (!cleanName) {
      AppToast.show({
        title: 'Pharmacy Name Required',
        message: 'Please enter a valid pharmacy name.',
        type: 'error',
      });
      return;
    }
    setPharmacyProfile({
      name: cleanName,
      ownerUsername: cleanUser || 'dr.shahzad_rx',
      isSystemIntegrated: isIntegrated,
    });
    AppToast.show({
      title: 'Profile Updated',
      message: 'Pharmacy profile details have been saved.',
      type: 'success',
    });
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Edit Pharmacy Profile"
      type="bottomSheet"
      scrollable
    >
      <View style={[styles.formWrap, { gap: spacing.md }]}>
        <AppInput
          label="Pharmacy Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pharmacy name"
        />

        <AppInput
          label="Owner / Admin Username"
          value={ownerUsername}
          onChangeText={setOwnerUsername}
          placeholder="e.g. dr.shahzad_rx"
          autoCapitalize="none"
        />

        <View>
          <AppText
            style={[styles.modeLabel, { color: colors.text.secondary, marginBottom: spacing.xs }]}
          >
            POS &amp; QR Operation Mode
          </AppText>
          <View style={[styles.modeRow, { gap: spacing.sm }]}>
            {[
              { key: false, label: 'Phone QR Mode' },
              { key: true, label: 'ERP Integrated' },
            ].map((option) => {
              const active = isIntegrated === option.key;
              return (
                <TouchableOpacity
                  key={option.label}
                  activeOpacity={0.75}
                  onPress={() => setIsIntegrated(option.key)}
                  style={[
                    styles.modePill,
                    {
                      borderRadius: radii.pill,
                      borderColor: active
                        ? colors.brand.primary
                        : colors.border.subtle,
                      backgroundColor: active
                        ? colors.glass.secondary
                        : colors.surface.inputSecondary,
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.modeText,
                      {
                        color: active ? colors.brand.primary : colors.text.secondary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {option.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <AppButton title="Save Changes" variant="primary" onPress={handleSave} />
      </View>
    </AppModal>
  );
};

/**
 * LicensePreviewModal - Displays uploaded regulatory license document photo & metadata.
 */
export const LicensePreviewModal = ({ license, onClose }) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <AppModal
      visible={Boolean(license)}
      onClose={onClose}
      title={license?.title || 'License Document'}
      type="centerDialog"
    >
      <View style={[styles.previewWrap, { gap: spacing.sm }]}>
        {license?.imageUri ? (
          <Image
            source={{ uri: license.imageUri }}
            style={[
              styles.previewImage,
              {
                borderRadius: radii.lg,
                backgroundColor: colors.surface.inputSecondary,
                borderColor: colors.border.subtle,
              },
            ]}
            resizeMode="contain"
          />
        ) : null}

        <View style={styles.previewMeta}>
          <AppText isMono style={[styles.previewNumber, { color: colors.text.primary }]}>
            {license?.number || 'Not Assigned'}
          </AppText>
          <AppText isMono style={[styles.previewExpiry, { color: colors.text.tertiary }]}>
            {license?.expiryDate ? `Expiry: ${license.expiryDate}` : 'No expiry date on file'}
          </AppText>
        </View>
      </View>
    </AppModal>
  );
};

/**
 * LicenseUpdateModal - Fallback sheet to update DSL and Further Licenses when in authenticated stack.
 */
export const LicenseUpdateModal = ({ visible, onClose, licenses }) => {
  const { spacing } = useTheme();
  const updateLicenses = usePharmacyStore((s) => s.updateLicenses);

  const [dslNum, setDslNum] = useState('');
  const [dslExp, setDslExp] = useState('');
  const [fl1Num, setFl1Num] = useState('');
  const [fl1Exp, setFl1Exp] = useState('');
  const [fl2Num, setFl2Num] = useState('');
  const [fl2Exp, setFl2Exp] = useState('');

  useEffect(() => {
    if (visible && Array.isArray(licenses)) {
      setDslNum(licenses[0]?.number || '');
      setDslExp(licenses[0]?.expiryDate || '');
      setFl1Num(licenses[1]?.number || '');
      setFl1Exp(licenses[1]?.expiryDate || '');
      setFl2Num(licenses[2]?.number || '');
      setFl2Exp(licenses[2]?.expiryDate || '');
    }
  }, [visible, licenses]);

  const handleSaveLicenses = () => {
    updateLicenses({
      dslNumber: dslNum.trim(),
      dslExpiryDate: dslExp.trim(),
      furtherLicense1Number: fl1Num.trim(),
      furtherLicense1ExpiryDate: fl1Exp.trim(),
      furtherLicense2Number: fl2Num.trim(),
      furtherLicense2ExpiryDate: fl2Exp.trim(),
    });
    AppToast.show({
      title: 'Licenses Updated',
      message: 'Regulatory license records saved successfully.',
      type: 'success',
    });
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Update Regulatory Licenses"
      type="bottomSheet"
      scrollable
    >
      <View style={[styles.formWrap, { gap: spacing.sm }]}>
        <AppInput
          label="Drug Sale License (DSL) Number"
          value={dslNum}
          onChangeText={setDslNum}
          placeholder="05-42-01992"
        />
        <AppInput
          label="DSL Expiry Date"
          value={dslExp}
          onChangeText={setDslExp}
          placeholder="31 Dec 2027"
        />
        <AppInput
          label="Further License 1 Number"
          value={fl1Num}
          onChangeText={setFl1Num}
          placeholder="FL1-8841-KHI"
        />
        <AppInput
          label="Further License 1 Expiry Date"
          value={fl1Exp}
          onChangeText={setFl1Exp}
          placeholder="15 Oct 2026"
        />
        <AppInput
          label="Further License 2 Number"
          value={fl2Num}
          onChangeText={setFl2Num}
          placeholder="Optional narcotic/special license"
        />
        <AppInput
          label="Further License 2 Expiry Date"
          value={fl2Exp}
          onChangeText={setFl2Exp}
          placeholder="28 Feb 2027"
        />
        <View style={{ marginTop: spacing.xs }}>
          <AppButton title="Save Licenses" variant="primary" onPress={handleSaveLicenses} />
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  formWrap: {
    width: '100%',
    paddingBottom: verticalScale(8),
  },
  modeLabel: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(12),
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderWidth: 1,
  },
  modeText: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(12),
  },
  previewWrap: {
    width: '100%',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: verticalScale(220),
    borderWidth: 1,
  },
  previewMeta: {
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  previewNumber: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(14),
    fontVariant: ['tabular-nums'],
  },
  previewExpiry: {
    fontFamily: fontFamilies.monoRegular,
    fontSize: scaleFont(12),
    fontVariant: ['tabular-nums'],
    marginTop: verticalScale(2),
  },
});
