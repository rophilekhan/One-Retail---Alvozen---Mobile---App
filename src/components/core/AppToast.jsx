import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import AppText from './AppText.jsx';

let globalToastRef = null;
let pendingToast = null;
let lastToastTime = 0;
let lastToastSignature = '';

/**
 * AppToast - Universal Floating Top Toast
 * Translucent glassmorphic pill overlapping all screens and dialogs.
 * High elevation (99999) ensuring visibility above native navigation stack fragments.
 */
export const AppToast = () => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [toastConfig, setToastConfig] = useState(null);

  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const handleDismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastConfig(null);
    });
  }, [translateY, opacity]);

  const triggerShowToast = useCallback((options) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    let title = '';
    let message = '';
    let type = 'info'; // 'success' | 'error' | 'warning' | 'info'
    let duration = 3800;

    if (typeof options === 'string') {
      message = options;
      const lower = options.toLowerCase();
      if (
        lower.includes('error') ||
        lower.includes('fail') ||
        lower.includes('wrong') ||
        lower.includes('invalid') ||
        lower.includes('locked')
      ) {
        type = 'error';
      } else if (lower.includes('success') || lower.includes('saved') || lower.includes('done')) {
        type = 'success';
      }
    } else if (typeof options === 'object' && options !== null) {
      title = options.title || '';
      message = options.message || '';
      if (!message && title) {
        message = title;
        title = '';
      }
      type = options.type || 'info';
      duration = options.duration || (message.length > 60 ? 5000 : 3800);
    }

    setToastConfig({
      id: Date.now(),
      title,
      message,
      type,
      duration,
    });
  }, []);

  useEffect(() => {
    globalToastRef = {
      show: triggerShowToast,
      hide: handleDismiss,
    };

    if (pendingToast) {
      triggerShowToast(pendingToast);
      pendingToast = null;
    }

    return () => {
      globalToastRef = null;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [triggerShowToast, handleDismiss]);

  useEffect(() => {
    if (!toastConfig) return;

    translateY.setValue(-80);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, toastConfig.duration || 3800);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toastConfig, handleDismiss, translateY, opacity]);

  if (!toastConfig) return null;

  const { type, title, message } = toastConfig;
  const hasTitle = Boolean(title && title.trim().length > 0);

  // Dynamic theme palette per toast type with high-opacity opaque-glass in Dark Mode
  const getThemePalette = () => {
    switch (type) {
      case 'success':
        return isDark
          ? {
              containerBg: '#12171E',
              containerBorder: '#10B981',
              badgeBg: '#10B981',
              titleColor: '#FFFFFF',
              textColor: '#D9D9D9',
              closeColor: '#6EE7B7',
            }
          : {
              containerBg: 'rgba(235, 252, 243, 0.98)',
              containerBorder: '#A7F3D0',
              badgeBg: '#10B981',
              titleColor: '#065F46',
              textColor: '#047857',
              closeColor: '#059669',
            };
      case 'error':
        return isDark
          ? {
              containerBg: '#12171E',
              containerBorder: '#EF4444',
              badgeBg: '#EF4444',
              titleColor: '#FFFFFF',
              textColor: '#D9D9D9',
              closeColor: '#F87171',
            }
          : {
              containerBg: 'rgba(254, 242, 242, 0.98)',
              containerBorder: '#FECACA',
              badgeBg: '#EF4444',
              titleColor: '#991B1B',
              textColor: '#7F1D1D',
              closeColor: '#DC2626',
            };
      case 'warning':
        return isDark
          ? {
              containerBg: '#12171E',
              containerBorder: '#F59E0B',
              badgeBg: '#F59E0B',
              titleColor: '#FFFFFF',
              textColor: '#D9D9D9',
              closeColor: '#FBBF24',
            }
          : {
              containerBg: 'rgba(254, 252, 232, 0.98)',
              containerBorder: '#FDE68A',
              badgeBg: '#F59E0B',
              titleColor: '#92400E',
              textColor: '#78350F',
              closeColor: '#D97706',
            };
      case 'info':
      default:
        return isDark
          ? {
              containerBg: '#12171E',
              containerBorder: '#009BA9',
              badgeBg: '#009BA9',
              titleColor: '#FFFFFF',
              textColor: '#D9D9D9',
              closeColor: '#67E8F9',
            }
          : {
              containerBg: 'rgba(235, 250, 252, 0.98)',
              containerBorder: '#A5F3FC',
              badgeBg: '#009BA9',
              titleColor: '#0E7490',
              textColor: '#155E75',
              closeColor: '#0891B2',
            };
    }
  };

  const themePalette = getThemePalette();
  const topOffset = Math.max(insets?.top || 0, verticalScale(24)) + verticalScale(12);

  const renderIcon = () => {
    const iconSize = scale(18);
    switch (type) {
      case 'success':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17L4 12"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'error':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6L18 18"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'warning':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.55 21H20.45A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'info':
      default:
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 16V12M12 8H12.01M22 12A10 10 0 112 12A10 10 0 0122 12Z"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.overlayRoot,
        { top: topOffset },
      ]}
    >
      <Animated.View
        style={[
          styles.toastWrapper,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={handleDismiss}
          style={[
            styles.toastContainer,
            {
              backgroundColor: themePalette.containerBg,
              borderColor: themePalette.containerBorder,
            },
          ]}
        >
          {/* Left Squircle Badge */}
          <View style={[styles.iconBadge, { backgroundColor: themePalette.badgeBg }]}>
            {renderIcon()}
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            {hasTitle ? (
              <>
                <AppText
                  variant="bodyMediumMedium"
                  style={[styles.toastTitle, { color: themePalette.titleColor }]}
                  numberOfLines={1}
                >
                  {title}
                </AppText>
                <AppText
                  variant="caption"
                  style={{ color: themePalette.textColor }}
                  numberOfLines={4}
                >
                  {message}
                </AppText>
              </>
            ) : (
              <AppText
                variant="bodyMedium"
                style={{ color: themePalette.textColor }}
                numberOfLines={4}
              >
                {message}
              </AppText>
            )}
          </View>

          {/* Close Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDismiss}
            hitSlop={{ top: scale(10), bottom: scale(10), left: scale(10), right: scale(10) }}
            style={styles.closeButton}
          >
            <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6L18 18"
                stroke={themePalette.closeColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

AppToast.show = (options) => {
  if (!options) return;

  const now = Date.now();
  const signature =
    typeof options === 'string'
      ? options
      : `${options.title || ''}::${options.message || ''}::${options.type || ''}`;

  if (now - lastToastTime < 800 && signature === lastToastSignature) {
    return;
  }
  lastToastTime = now;
  lastToastSignature = signature;

  if (globalToastRef) {
    globalToastRef.show(options);
  } else {
    pendingToast = options;
  }
};

AppToast.hide = () => {
  if (globalToastRef) {
    globalToastRef.hide();
  }
};

const styles = StyleSheet.create({
  overlayRoot: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99999,
    elevation: 99999,
  },
  toastWrapper: {
    width: '92%',
    maxWidth: scale(380),
    zIndex: 99999,
    elevation: 99999,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    borderRadius: scale(18),
    borderWidth: 1.2,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  iconBadge: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: scale(8),
  },
  toastTitle: {
    marginBottom: verticalScale(2),
  },
  closeButton: {
    padding: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppToast;
