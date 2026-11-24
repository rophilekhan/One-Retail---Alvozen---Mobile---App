import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Linking,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {
  AppText,
  GlassCard,
  AppButton,
  AppInput,
  AppToast,
  AppBackButton,
  MetricIconDisc,
  AppModal,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { useDevicePermission } from '../../hooks/useDevicePermission.js';
import { useStaffPermission } from '../../hooks/useStaffPermission.js';
import { useDispenseStore, parseScannedQRPayload } from '../../store/useDispenseStore.js';
import { PERMISSIONS } from '../../store/useStaffStore.js';
import { triggerSafeHaptic } from '../../utils/haptics.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * QRReticleCorners - 4 rounded corner brackets for camera viewfinder
 */
const QRReticleCorners = ({ size = scale(240), color = '#009BA9' }) => {
  const cornerLength = scale(34);
  const strokeWidth = scale(3);
  const radius = scale(20);

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={StyleSheet.absoluteFillObject}
    >
      {/* Top Left */}
      <Path
        d={`M${strokeWidth / 2} ${cornerLength} V${radius} Q${strokeWidth / 2} ${strokeWidth / 2} ${radius} ${strokeWidth / 2} H${cornerLength}`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Top Right */}
      <Path
        d={`M${size - cornerLength} ${strokeWidth / 2} H${size - radius} Q${size - strokeWidth / 2} ${strokeWidth / 2} ${size - strokeWidth / 2} ${radius} V${cornerLength}`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bottom Right */}
      <Path
        d={`M${size - strokeWidth / 2} ${size - cornerLength} V${size - radius} Q${size - strokeWidth / 2} ${size - strokeWidth / 2} ${size - radius} ${size - strokeWidth / 2} H${size - cornerLength}`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bottom Left */}
      <Path
        d={`M${cornerLength} ${size - strokeWidth / 2} H${radius} Q${strokeWidth / 2} ${size - strokeWidth / 2} ${strokeWidth / 2} ${size - radius} V${size - cornerLength}`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

/**
 * Lightning Bolt Torch Icon
 */
const TorchIcon = ({ active, color = '#FFFFFF' }) => (
  <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill={active ? color : 'none'}>
    <Path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Barcode Scanner Plug-in Icon
 */
const BarcodeScanIcon = ({ color = '#FFFFFF' }) => (
  <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 5v4M3 15v4M21 5v4M21 15v4M7 8v8M11 8v8M14 8v8M17 8v8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Camera View Mode Icon
 */
const CameraModeIcon = ({ color = '#FFFFFF' }) => (
  <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

/**
 * QRScannerScreen - Centered Live VisionCamera + Reticle & Cross-Device Permission Flow
 * 100% Mathematically and Visually Centered Layout
 */
export const QRScannerScreen = ({ navigation }) => {
  const { colors, isDark, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  let isFocused = true;
  try {
    isFocused = useIsFocused();
  } catch (e) {
    isFocused = true;
  }

  // Generic cross-device native OS permission hook
  const { status, requestPermission, openSettings } = useDevicePermission('camera', true);

  // Staff permission guard for device vs plugin
  const canScanPlugin = useStaffPermission(PERMISSIONS.SCAN_QR_PLUGIN).isGranted;

  const { height: windowHeight } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [scanMode, setScanMode] = useState('DEVICE'); // 'DEVICE' | 'PLUGIN'
  const [plugInModalVisible, setPlugInModalVisible] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pluginPayload, setPluginPayload] = useState('');
  const setScannedPrescription = useDispenseStore((s) => s.setScannedPrescription);

  // Live Keyboard Height Tracking inside Plug-in Modal
  useEffect(() => {
    if (!plugInModalVisible) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const h = e?.endCoordinates?.height || 0;
      setKeyboardHeight(h);
    };

    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [plugInModalVisible]);

  // Vision Camera Device
  let device = null;
  try {
    device = useCameraDevice('back');
  } catch (e) {
    device = null;
  }

  // Exact 100% Centered Box Dimension: Math.min(SCREEN_WIDTH * 0.68, scale(260))
  const SCAN_BOX_SIZE = Math.min(SCREEN_WIDTH * 0.68, scale(260));

  // Reticle pulse and smooth scan laser animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Smooth scan laser animation loop strictly from 12 to (SCAN_BOX_SIZE - 12)
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanLineAnim]);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, SCAN_BOX_SIZE - 12],
  });

  const primaryAccent = colors.brand?.primary || '#009BA9';

  const handleTriggerPrescriptionScan = useCallback(
    (payloadText = '', scanType = '') => {
      if (isProcessing) return;
      setIsProcessing(true);

      // Safe cross-device haptic feedback
      triggerSafeHaptic(50);

      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 120, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start();

      const isGenericScan =
        (typeof payloadText === 'string' && payloadText.toUpperCase().includes('GEN')) ||
        scanType === 'GENERIC';
      const isUnavailableScan =
        (typeof payloadText === 'string' && payloadText.toUpperCase().includes('UNAVAIL')) ||
        scanType === 'UNAVAILABLE';

      const rxData = parseScannedQRPayload(payloadText, scanType);
      setScannedPrescription(rxData);

      setPlugInModalVisible(false);

      AppToast.show({
        title: 'Prescription Recognized',
        message: `${rxData.prescriptionNumber || rxData.rxId} loaded for ${rxData.patientName}`,
        type: 'success',
      });

      navigation.navigate('ScannedRxResult', {
        rxData,
        prescription: rxData,
        autoOpenGeneric: isGenericScan,
        autoOpenUnavailable: isUnavailableScan,
      });

      setTimeout(() => {
        setIsProcessing(false);
      }, 600);
    },
    [isProcessing, navigation, pulseAnim, setScannedPrescription]
  );

  /**
   * Safe "Process Plug-in Scanned Rx" Handler:
   * 1. Trim input string; if empty, show warning toast and return safely.
   * 2. Parse payload safely through parseScannedQRPayload(rawInput) in useDispenseStore.js.
   * 3. Call triggerSafeHaptic(50) safely.
   * 4. Close Plug-in QR modal (setPlugInModalVisible(false)) BEFORE navigating.
   * 5. Show success toast and navigate to ScannedRxResult passing { rxData }.
   */
  const handleProcessPluginRx = useCallback(
    (overridePayload) => {
      const rawInput = (typeof overridePayload === 'string' ? overridePayload : pluginPayload || '').trim();

      if (!rawInput) {
        AppToast.show({
          type: 'warning',
          title: 'Empty QR Code',
          message: 'Scan with your plug-in device or select a sample QR preset first.',
        });
        return;
      }

      // Dismiss keyboard immediately on first-tap action
      Keyboard.dismiss();
      setKeyboardHeight(0);

      if (isProcessing) return;
      setIsProcessing(true);

      const isGenericScan =
        rawInput.toUpperCase().includes('GEN') ||
        rawInput.toUpperCase().includes('OME');
      const isUnavailableScan =
        rawInput.toUpperCase().includes('UNAVAIL') ||
        rawInput.toUpperCase().includes('PANA');

      const rxData = parseScannedQRPayload(rawInput);
      setScannedPrescription(rxData);

      // Safe cross-device haptic feedback
      triggerSafeHaptic(50);

      // Close modal before navigating so no overlay remains stuck
      setPlugInModalVisible(false);
      setScanMode('DEVICE');

      AppToast.show({
        type: 'success',
        title: 'Prescription Processed',
        message: `${rxData.prescriptionNumber || rxData.rxId} loaded for ${rxData.patientName}`,
      });

      navigation.navigate('ScannedRxResult', {
        rxData,
        prescription: rxData,
        autoOpenGeneric: isGenericScan,
        autoOpenUnavailable: isUnavailableScan,
      });

      setTimeout(() => {
        setIsProcessing(false);
      }, 600);
    },
    [isProcessing, navigation, pluginPayload, setScannedPrescription]
  );

  // Vision Camera barcode/QR scanner callback
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !isProcessing) {
        const val = codes[0]?.value || 'ALVOZEN-RX://99214';
        handleTriggerPrescriptionScan(val);
      }
    },
  });

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background?.canvas || '#000000' }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── 1. Full-Screen Live Camera (Edge-to-Edge) ── */}
      {scanMode === 'DEVICE' ? (
        status === 'granted' && device ? (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused && status === 'granted' && !isProcessing}
            codeScanner={codeScanner}
            torch={torchOn ? 'on' : 'off'}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.cameraFallbackCanvas]} />
        )
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.pluginModeCanvas]} />
      )}

      {/* ── 2. Three-Zone Centered Overlay (Edge-to-Edge) ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Zone 1: Top Bar */}
        <View
          style={[
            styles.topBar,
            {
              paddingTop: insets.top + spacing.sm,
              paddingHorizontal: spacing.screenHorizontal,
            },
          ]}
          pointerEvents="box-none"
        >
          {/* Left: Circular Glass Back Button */}
          <AppBackButton onBack={() => navigation.goBack()} />

          {/* Center: Title */}
          <View style={styles.centerTitleWrap}>
            <AppText
              variant="titleMedium"
              style={[
                styles.topTitleText,
                { fontFamily: fontFamilies.primaryMedium, color: '#FFFFFF' },
              ]}
            >
              Scan Prescription
            </AppText>
          </View>

          {/* Right: Circular Glass Torch Button + Plug-in Scanner Mode Button */}
          <View style={styles.rightActionRow}>
            {scanMode === 'DEVICE' && status === 'granted' && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTorchOn((prev) => !prev)}
                style={[
                  styles.glassCircleBtn,
                  torchOn && { backgroundColor: primaryAccent, borderColor: primaryAccent },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Toggle Torch"
              >
                <TorchIcon active={torchOn} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {canScanPlugin && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setScanMode('PLUGIN');
                  setPlugInModalVisible(true);
                }}
                style={[
                  styles.glassCircleBtn,
                  scanMode === 'PLUGIN' && { backgroundColor: primaryAccent, borderColor: primaryAccent },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Toggle Scanner Mode"
              >
                {scanMode === 'DEVICE' ? (
                  <BarcodeScanIcon color="#FFFFFF" />
                ) : (
                  <CameraModeIcon color="#FFFFFF" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Zone 2: Dead-Center Content Frame */}
        <View style={styles.centerZone} pointerEvents="box-none">
          {scanMode === 'PLUGIN' ? (
            /* Plug-in / Desktop POS Scanner Card */
            <GlassCard style={styles.pluginCard}>
              <View style={styles.pluginCardHeader}>
                <View style={[styles.statusDot, { backgroundColor: colors.status?.success || '#00C853' }]} />
                <AppText variant="titleMedium" colorType="primary" style={{ marginLeft: scale(8) }}>
                  Desktop POS Plug-in Connected
                </AppText>
              </View>
              <AppText variant="caption" colorType="muted" style={{ marginVertical: verticalScale(8) }}>
                Desktop 2D Barcode scanner linked via OneRetail Local Bridge (COM3 / WebHook).
                Scan using your hardware handheld scanner or enter payload below.
              </AppText>

              <AppInput
                label="Scanned QR Payload String"
                placeholder="Scan barcode or type code..."
                value={pluginPayload}
                onChangeText={setPluginPayload}
                autoFocus={true}
                returnKeyType="done"
                blurOnSubmit={false}
                onSubmitEditing={() => handleProcessPluginRx()}
              />

              {/* 3 Quick 1-Tap Sample Preset Chips */}
              <View style={styles.pluginPresetsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPluginPayload('SAMPLE_BRAND_AVAIL')}
                  style={[
                    styles.pluginPresetPill,
                    { borderColor: isDark ? 'rgba(0, 155, 169, 0.4)' : 'rgba(0, 155, 169, 0.25)' },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Preset Brand In-Stock QR"
                >
                  <AppText style={[styles.pluginPresetText, { color: primaryAccent }]}>
                    Brand In-Stock QR
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPluginPayload('SAMPLE_UNAVAIL')}
                  style={[
                    styles.pluginPresetPill,
                    { borderColor: isDark ? 'rgba(0, 155, 169, 0.4)' : 'rgba(0, 155, 169, 0.25)' },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Preset Brand Unavailable QR"
                >
                  <AppText style={[styles.pluginPresetText, { color: primaryAccent }]}>
                    Brand Unavailable QR
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPluginPayload('SAMPLE_GENERIC_ID')}
                  style={[
                    styles.pluginPresetPill,
                    { borderColor: isDark ? 'rgba(0, 155, 169, 0.4)' : 'rgba(0, 155, 169, 0.25)' },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Preset Generic-ID QR"
                >
                  <AppText style={[styles.pluginPresetText, { color: primaryAccent }]}>
                    Generic-ID QR
                  </AppText>
                </TouchableOpacity>
              </View>

              <View style={{ height: spacing?.md || verticalScale(16) }} />
              <AppButton
                variant="primary"
                title="Process Plug-in Scanned Rx"
                onPress={() => handleProcessPluginRx()}
              />
            </GlassCard>
          ) : status !== 'granted' ? (
            /* Dead-Center Permission Card */
            <GlassCard style={styles.permissionCard}>
              <MetricIconDisc size={56} isDark={isDark} variant="teal">
                <Svg width={scale(26)} height={scale(26)} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    stroke={primaryAccent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="12" cy="13" r="4" stroke={primaryAccent} strokeWidth="2" />
                </Svg>
              </MetricIconDisc>

              <AppText variant="titleMedium" colorType="primary" style={styles.permTitle}>
                Camera Access Required
              </AppText>

              <AppText variant="bodySmall" colorType="muted" style={styles.permDesc}>
                {status === 'blocked'
                  ? 'Camera access is permanently disabled in Phone Settings. Please open Settings and allow Camera to scan prescriptions.'
                  : 'OneRetail needs camera access to scan prescription QR codes. Tap below to allow camera permission.'}
              </AppText>

              <AppButton
                variant="primary"
                title={status === 'blocked' ? 'Open Phone Settings' : 'Allow Camera Access'}
                onPress={() => {
                  if (status === 'blocked') {
                    openSettings();
                  } else {
                    requestPermission();
                  }
                }}
                style={styles.permBtn}
              />
            </GlassCard>
          ) : (
            /* Dead-Center Scan Reticle Frame */
            <View style={styles.reticleWrapper} pointerEvents="none">
              <Animated.View
                style={[
                  styles.reticleBox,
                  {
                    width: SCAN_BOX_SIZE,
                    height: SCAN_BOX_SIZE,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                {/* 4 Rounded Corner Brackets */}
                <QRReticleCorners size={SCAN_BOX_SIZE} color={primaryAccent} />

                {/* Animated Horizontal Scan Laser */}
                <Animated.View
                  style={[
                    styles.scanLaser,
                    {
                      width: SCAN_BOX_SIZE - 24,
                      backgroundColor: primaryAccent,
                      shadowColor: primaryAccent,
                      transform: [{ translateY }],
                    },
                  ]}
                />
              </Animated.View>

              {/* Directly below the box: Centered Glass Instruction Pill */}
              <View
                style={[
                  styles.instructionPill,
                  {
                    marginTop: spacing.lg,
                    paddingHorizontal: spacing.xl,
                  },
                ]}
              >
                <AppText style={styles.instructionPillText}>
                  Place Brand or Generic QR code inside the frame
                </AppText>
              </View>
            </View>
          )}
        </View>

        {/* Zone 3: Bottom Centered Controls */}
        <View
          style={[
            styles.bottomZone,
            {
              paddingBottom: Math.max(insets.bottom, 20) + spacing.md,
            },
          ]}
          pointerEvents="box-none"
        >
          {/* Centered Glass Mode Switcher Pill */}
          <View style={styles.modeSwitcherContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setScanMode('DEVICE')}
              style={[
                styles.modeTabBtn,
                scanMode === 'DEVICE' && { backgroundColor: primaryAccent },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: scanMode === 'DEVICE' }}
            >
              <AppText
                style={[
                  styles.modeTabText,
                  { color: scanMode === 'DEVICE' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#CBD5E1') },
                ]}
              >
                Camera Scan
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setScanMode('PLUGIN');
                setPlugInModalVisible(true);
              }}
              style={[
                styles.modeTabBtn,
                scanMode === 'PLUGIN' && { backgroundColor: primaryAccent },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: scanMode === 'PLUGIN' }}
            >
              <AppText
                style={[
                  styles.modeTabText,
                  { color: scanMode === 'PLUGIN' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#CBD5E1') },
                ]}
              >
                Plug-in QR
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Test Sample QR Pill Actions for Dev/Emulators */}
          <View style={styles.samplePillsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Scan Patient Prescription QR"
              onPress={() => handleTriggerPrescriptionScan('SAMPLE_BRAND_AVAIL', 'BRAND')}
              style={styles.samplePillBtn}
            >
              <AppText style={styles.samplePillText}>Test Brand QR</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleTriggerPrescriptionScan('SAMPLE_GENERIC_ID', 'GENERIC')}
              style={styles.samplePillBtn}
            >
              <AppText style={styles.samplePillText}>Test Generic-ID</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleTriggerPrescriptionScan('SAMPLE_UNAVAIL', 'UNAVAILABLE')}
              style={styles.samplePillBtn}
            >
              <AppText style={styles.samplePillText}>Test Out-of-Stock</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 3. Dedicated Plug-in QR Bottom Sheet Modal ── */}
      <AppModal
        visible={plugInModalVisible}
        onClose={() => {
          Keyboard.dismiss();
          setKeyboardHeight(0);
          setPlugInModalVisible(false);
          setScanMode('DEVICE');
        }}
        title="Plug-in QR Scanner"
        type="bottomSheet"
        showBackButton={true}
        showCloseButton={false}
        scrollable={false}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.pluginModalScrollContent,
            {
              paddingBottom: keyboardHeight > 0
                ? verticalScale(12)
                : Math.max(insets.bottom, verticalScale(20)),
              gap: spacing?.md || verticalScale(14),
            },
          ]}
        >
          <View style={styles.pluginCardHeader}>
            <View style={[styles.statusDot, { backgroundColor: colors.status?.success || '#00C853' }]} />
            <AppText variant="titleMedium" colorType="primary" style={{ marginLeft: scale(8) }}>
              Desktop POS Plug-in Connected
            </AppText>
          </View>
          <AppText variant="caption" colorType="muted" style={{ marginVertical: verticalScale(4) }}>
            Desktop 2D Barcode scanner linked via OneRetail Local Bridge (COM3 / WebHook).
            Scan using your hardware handheld scanner or select a preset below.
          </AppText>

          {/* 3 Quick 1-Tap Sample Preset Chips */}
          <View style={styles.pluginPresetsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPluginPayload('SAMPLE_BRAND_AVAIL')}
              style={[
                styles.pluginPresetPill,
                { borderColor: isDark ? 'rgba(0, 155, 169, 0.4)' : 'rgba(0, 155, 169, 0.25)' },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Preset Brand In-Stock QR"
            >
              <AppText style={[styles.pluginPresetText, { color: primaryAccent }]}>
                Brand In-Stock QR
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPluginPayload('SAMPLE_UNAVAIL')}
              style={[
                styles.pluginPresetPill,
                { borderColor: isDark ? 'rgba(0, 155, 169, 0.4)' : 'rgba(0, 155, 169, 0.25)' },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Preset Brand Unavailable QR"
            >
              <AppText style={[styles.pluginPresetText, { color: primaryAccent }]}>
                Brand Unavailable QR
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPluginPayload('SAMPLE_GENERIC_ID')}
              style={[
                styles.pluginPresetPill,
                { borderColor: isDark ? 'rgba(0, 155, 169, 0.4)' : 'rgba(0, 155, 169, 0.25)' },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Preset Generic-ID QR"
            >
              <AppText style={[styles.pluginPresetText, { color: primaryAccent }]}>
                Generic-ID QR
              </AppText>
            </TouchableOpacity>
          </View>

          <AppInput
            label="Scanned QR Payload String"
            placeholder="Scan barcode or type code..."
            value={pluginPayload}
            onChangeText={setPluginPayload}
            autoFocus={plugInModalVisible}
            returnKeyType="done"
            blurOnSubmit={false}
            onSubmitEditing={() => handleProcessPluginRx()}
          />

          <AppButton
            variant="primary"
            title="Process Plug-in Scanned Rx"
            onPress={() => handleProcessPluginRx()}
          />
        </ScrollView>
      </AppModal>
    </View>
  );
};

const styles = StyleSheet.create({
  pluginModalScrollContent: {
    flexGrow: 1,
  },
  rootContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cameraFallbackCanvas: {
    backgroundColor: '#090B0E',
  },
  pluginModeCanvas: {
    backgroundColor: '#080C10',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 10,
  },
  centerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitleText: {
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  rightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  glassCircleBtn: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.20)',
    borderWidth: 1,
  },
  centerZone: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  reticleBox: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scanLaser: {
    position: 'absolute',
    top: 0,
    height: 2.5,
    borderRadius: 1.5,
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  instructionPill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderRadius: scale(999),
    paddingVertical: verticalScale(8),
  },
  instructionPillText: {
    color: '#FFFFFF',
    fontSize: scaleFont(12.5),
    textAlign: 'center',
  },
  permissionCard: {
    width: '86%',
    alignSelf: 'center',
    alignItems: 'center',
    padding: scale(22),
  },
  permTitle: {
    textAlign: 'center',
    marginTop: verticalScale(14),
    letterSpacing: -0.2,
  },
  permDesc: {
    textAlign: 'center',
    marginTop: verticalScale(8),
    lineHeight: scaleFont(17),
  },
  permBtn: {
    width: '100%',
    marginTop: verticalScale(18),
  },
  pluginCard: {
    width: '88%',
    alignSelf: 'center',
    padding: scale(18),
  },
  pluginCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  bottomZone: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderRadius: scale(999),
    padding: scale(4),
    marginBottom: verticalScale(12),
  },
  modeTabBtn: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(8),
    borderRadius: scale(999),
  },
  modeTabText: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  samplePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  samplePillBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(14),
  },
  samplePillText: {
    color: '#CBD5E1',
    fontSize: scaleFont(11),
  },
  pluginPresetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(6),
    marginTop: verticalScale(10),
  },
  pluginPresetPill: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0, 155, 169, 0.12)',
    borderWidth: 1,
  },
  pluginPresetText: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
  },
});

export default QRScannerScreen;
