import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  Animated,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import AppText from './AppText.jsx';
import AppBackButton from './AppBackButton.jsx';

/**
 * AppModal - Universal Bottom Sheet & Center Dialog
 * Features smooth Animated keyboard height tracking and safe area padding.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {string} [props.title]
 * @param {Object} [props.titleStyle]
 * @param {'bottomSheet' | 'centerDialog'} [props.type='bottomSheet']
 * @param {boolean} [props.showBackButton=false]
 * @param {boolean} [props.showCloseButton]
 * @param {boolean} [props.scrollable=false]
 * @param {Object} [props.style]
 * @param {React.ReactNode} props.children
 */
export const AppModal = ({
  visible,
  onClose,
  title,
  titleStyle,
  type = 'bottomSheet',
  children,
  style,
  scrollable = false,
  showBackButton = false,
  showCloseButton = !showBackButton,
  footer,
  footerStyle,
}) => {
  const { colors, radii, spacing, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const isBottomSheet = type === 'bottomSheet';

  // Keyboard height tracking
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedShift = useRef(new Animated.Value(0)).current;

  // Lock available height to guarantee header never gets clipped off-screen:
  // windowHeight - insets.top - verticalScale(16) - (Platform.OS === 'android' ? keyboardHeight : 0)
  const availableHeight = windowHeight - insets.top - verticalScale(16) - (Platform.OS === 'android' ? keyboardHeight : 0);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      animatedShift.setValue(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const height = e?.endCoordinates?.height || 0;
      setKeyboardHeight(height);
      const duration = Platform.OS === 'ios' ? (e?.duration || 250) : 200;
      Animated.timing(animatedShift, {
        toValue: Platform.OS === 'ios' ? height : 0,
        duration,
        useNativeDriver: false,
      }).start();
    };

    const onHide = (e) => {
      setKeyboardHeight(0);
      const duration = Platform.OS === 'ios' ? (e?.duration || 250) : 180;
      Animated.timing(animatedShift, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible, animatedShift]);

  const flattenedStyle = StyleSheet.flatten(style) || {};
  const basePaddingBottom = flattenedStyle.paddingBottom !== undefined
    ? flattenedStyle.paddingBottom
    : (spacing?.cardPadding || 16);
  const safePaddingBottom = isBottomSheet
    ? basePaddingBottom + Math.max(insets.bottom, 0)
    : basePaddingBottom;

  const handleClose = () => {
    Keyboard.dismiss();
    setKeyboardHeight(0);
    onClose?.();
  };

  const sheetCard = (
    <Animated.View
      style={[
        styles.modalSurface,
        isBottomSheet ? styles.sheetSurface : styles.dialogSurface,
        {
          width: '100%',
          backgroundColor: colors.surface?.card || (colors.isDark ? '#020202' : '#FFFFFF'),
          borderColor: colors.border?.card || 'rgba(255, 255, 255, 0.12)',
          borderTopLeftRadius: radii.sheet,
          borderTopRightRadius: radii.sheet,
          borderBottomLeftRadius: isBottomSheet ? 0 : radii.sheet,
          borderBottomRightRadius: isBottomSheet ? 0 : radii.sheet,
          overflow: 'hidden',
          padding: spacing?.cardPadding || 16,
        },
        shadows.card,
        style,
        isBottomSheet && {
          maxHeight: availableHeight,
          paddingBottom: keyboardHeight > 0 ? verticalScale(12) : safePaddingBottom,
        },
        !isBottomSheet && {
          transform: [
            {
              translateY: animatedShift.interpolate({
                inputRange: [0, 400],
                outputRange: [0, -100],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      {/* Drag Handle for Bottom Sheet */}
      {isBottomSheet && (
        <View style={styles.handleContainer}>
          <View
            style={[
              styles.handle,
              { backgroundColor: colors.border?.subtle || 'rgba(255, 255, 255, 0.15)' },
            ]}
          />
        </View>
      )}

      {/* Modal Header */}
      {title ? (
        <View style={[styles.header, { flexShrink: 0 }]}>
          {showBackButton ? (
            <View style={styles.headerTitleWithBack}>
              <AppBackButton
                onPress={handleClose}
                size={scale(36)}
                style={styles.backButton}
              />
              <AppText
                variant="titleLarge"
                colorType="primary"
                style={[styles.title, titleStyle]}
                numberOfLines={1}
              >
                {title}
              </AppText>
            </View>
          ) : (
            <AppText
              variant="headlineMedium"
              colorType="primary"
              style={[styles.title, titleStyle]}
            >
              {title}
            </AppText>
          )}

          {showCloseButton ? (
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeBtn}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6L18 18"
                  stroke={colors.text?.muted || '#787878'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[
            styles.scrollableContent,
            {
              paddingHorizontal: spacing?.screenHorizontal || scale(16),
              paddingTop: spacing?.sm || verticalScale(8),
              paddingBottom: keyboardHeight > 0
                ? verticalScale(12)
                : Math.max(insets.bottom, verticalScale(16)),
              gap: spacing?.md || verticalScale(14),
            },
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}

      {footer ? (
        <View style={[{ flexShrink: 0 }, footerStyle]}>
          {footer}
        </View>
      ) : null}
    </Animated.View>
  );

  const content = (
    <View
      style={[
        styles.overlay,
        {
          flex: 1,
          backgroundColor: colors.background?.overlay || 'rgba(0, 0, 0, 0.65)',
          justifyContent: isBottomSheet ? 'flex-end' : 'center',
          alignItems: isBottomSheet ? 'stretch' : 'center',
          paddingBottom: (isBottomSheet && Platform.OS === 'android') ? keyboardHeight : 0,
        },
      ]}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={handleClose}
      />

      {isBottomSheet && Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" style={{ width: '100%' }}>
          {sheetCard}
        </KeyboardAvoidingView>
      ) : (
        sheetCard
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottomSheet ? 'slide' : 'fade'}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidWrap: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  overlayBottom: {
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalSurface: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  sheetSurface: {
    width: '100%',
    maxHeight: '92%',
  },
  scrollableContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  dialogSurface: {
    width: '100%',
    maxWidth: 380,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerTitleWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    paddingRight: 2,
  },
  title: {
    flex: 1,
  },
  closeBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppModal;
