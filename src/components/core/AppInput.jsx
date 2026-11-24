import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Path,
} from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import AppText from './AppText.jsx';

/**
 * AppInput - OneRetail Standard Text Input Atom
 * Features gradient background, spherical icon badge, separated label,
 * and high-contrast light/dark placeholder & icon tinting.
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.placeholder]
 * @param {string} [props.placeholderTextColor]
 * @param {string} [props.value]
 * @param {Function} [props.onChangeText]
 * @param {string} [props.helperText]
 * @param {string} [props.error]
 * @param {React.ReactNode} [props.iconLeft]
 * @param {React.ReactNode} [props.iconRight]
 * @param {'teal' | 'purple' | 'neutral' | 'gold'} [props.iconTone='teal']
 * @param {boolean} [props.iconBg=true]
 * @param {Array<string>} [props.iconBgGradientColors]
 * @param {string} [props.iconBgColor]
 * @param {number} [props.iconBgSize]
 * @param {boolean} [props.secureTextEntry=false]
 * @param {boolean} [props.multiline=false]
 * @param {boolean} [props.editable=true]
 * @param {Object} [props.wrapperStyle]
 * @param {Object} [props.style]
 * @param {Object} [props.inputStyle]
 * @param {Function} [props.onFocus]
 * @param {Function} [props.onBlur]
 */
export const AppInput = ({
  label,
  placeholder,
  placeholderTextColor,
  value,
  onChangeText,
  helperText,
  error,
  iconLeft,
  iconRight,
  iconTone = 'teal',
  iconBg = true,
  iconBgGradientColors,
  iconBgColor,
  iconBgSize,
  secureTextEntry = false,
  multiline = false,
  editable = true,
  wrapperStyle,
  style,
  inputStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { colors, radii, spacing, typography, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const isFilled = value !== undefined && value !== null && String(value).length > 0;
  const radius = multiline ? (radii?.lg || scale(16)) : (radii?.input || scale(28));
  const size = iconBgSize ?? scale(36);

  // Surface fill colors from theme
  const fillColors = isDark
    ? (isFilled ? ['#060708', '#020203'] : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.025)'])
    : (isFilled ? ['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.92)'] : ['rgba(255,255,255,0.96)', 'rgba(255,255,255,0.92)']);

  const getBorderColor = () => {
    if (error) return colors.status?.error || '#FF4B4B';
    if (isFocused) return colors.border?.focused || (isDark ? '#FFFFFF' : (colors.brand?.primary || '#009BA9'));
    return isFilled
      ? (isDark ? 'rgba(255, 255, 255, 0.16)' : '#E2E8F0')
      : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#EDF0F1');
  };

  const shadowStyle = isDark
    ? null
    : {
        shadowColor: colors.surface?.inputShadow || '#6FB4C2',
        shadowOffset: { width: 0, height: verticalScale(3) },
        shadowOpacity: isFilled ? 0.14 : 0.08,
        shadowRadius: scale(8),
        elevation: 2,
      };

  const iconBgSharedStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing?.sm || scale(8),
    borderWidth: 0,
    overflow: 'hidden',
  };

  const renderIconLeft = () => {
    if (!iconLeft) return null;

    const defaultGlyphColor = isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761');
    const glyph = React.isValidElement(iconLeft)
      ? React.cloneElement(iconLeft, {
          size: iconLeft.props?.size || Math.round(size * 0.5),
          color: (iconLeft.props?.color && iconLeft.props.color !== '#FFFFFF' && iconLeft.props.color !== '#ffffff' && iconLeft.props.color !== '#fff')
            ? iconLeft.props.color
            : defaultGlyphColor,
        })
      : iconLeft;

    if (!iconBg) {
      return <View style={styles.iconLeft}>{glyph}</View>;
    }

    if (isDark) {
      let toneArray;
      if (iconTone === 'purple') toneArray = isFilled ? ['#4F4A6E', '#0B0912'] : ['#3A3B46', '#121316'];
      else if (iconTone === 'gold') toneArray = isFilled ? ['#543A1F', '#180E05'] : ['#3E3220', '#140D05'];
      else if (iconTone === 'neutral') toneArray = isFilled ? ['#3E4146', '#050506'] : ['#3A3B46', '#121316'];
      else toneArray = isFilled ? ['#1e2c2e98', '#000000ff'] : ['#4e5d6b7c', '#16171dff'];

      const [hi, lo] = iconBgGradientColors || toneArray;
      const key = `${iconTone}-${isFilled ? 'f' : 'e'}`;
      const d = size;
      const c = d / 2;

      return (
        <View style={[styles.iconLeft, iconBgSharedStyle]}>
          <Svg
            width={d}
            height={d}
            style={{ position: 'absolute', left: 0, top: 0 }}
            pointerEvents="none"
          >
            <Defs>
              <SvgLinearGradient id={`sphere-${key}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={hi} stopOpacity="1" />
                <Stop offset="100%" stopColor={lo} stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <Circle cx={c} cy={c} r={c} fill={`url(#sphere-${key})`} />
          </Svg>
          {glyph}
        </View>
      );
    }

    // Light Mode
    let lightToneColor;
    if (iconTone === 'purple') lightToneColor = '#EEE4F8';
    else if (iconTone === 'gold') lightToneColor = '#FFEED9';
    else if (iconTone === 'neutral') lightToneColor = '#E8EEF1';
    else lightToneColor = '#DAF3F7';

    return (
      <LinearGradient
        colors={[iconBgColor || lightToneColor, '#FFFFFF']}
        locations={[0, 0.8]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.iconLeft, iconBgSharedStyle]}
      >
        {glyph}
      </LinearGradient>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <AppText
          style={[
            styles.label,
            {
              color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761'),
              marginBottom: spacing?.xs || verticalScale(4),
              fontSize: scaleFont(13),
              fontFamily: fontFamilies.primaryMedium,
            },
          ]}
        >
          {label}
        </AppText>
      ) : null}

      <View style={[{ borderRadius: radius }, shadowStyle]}>
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: getBorderColor(),
              borderRadius: radius,
              paddingHorizontal: scale(12),
              ...(multiline
                ? {
                    minHeight: verticalScale(96),
                    alignItems: 'flex-start',
                    paddingVertical: spacing?.md || verticalScale(12),
                  }
                : {
                    height: verticalScale(58),
                    alignItems: 'center',
                  }),
            },
            wrapperStyle,
          ]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={fillColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {renderIconLeft()}

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={
              placeholderTextColor ||
              rest.placeholderTextColor ||
              (isDark ? 'rgba(255, 255, 255, 0.42)' : '#8E99A4')
            }
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            multiline={multiline}
            editable={editable}
            onFocus={(e) => {
              setIsFocused(true);
              if (typeof onFocus === 'function') onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (typeof onBlur === 'function') onBlur(e);
            }}
            style={[
              styles.textInput,
              {
                color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761'),
                fontFamily: fontFamilies.primary,
                fontSize: scaleFont(14),
                includeFontPadding: false,
                paddingVertical: 0,
                ...(multiline
                  ? {
                      minHeight: verticalScale(68),
                      textAlignVertical: 'top',
                      paddingTop: 0,
                      paddingBottom: 0,
                    }
                  : {
                      height: '100%',
                      textAlignVertical: 'center',
                    }),
                backgroundColor: 'transparent',
              },
              inputStyle,
            ]}
            {...rest}
          />

          {secureTextEntry ? (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.iconRight}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? (
                <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.7)' : (colors.brand?.primaryDark || '#0F4761')}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.7)' : (colors.brand?.primaryDark || '#0F4761')}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              ) : (
                <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.7)' : (colors.brand?.primaryDark || '#0F4761')}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </TouchableOpacity>
          ) : iconRight ? (
            <View style={styles.iconRight}>
              {React.isValidElement(iconRight)
                ? React.cloneElement(iconRight, {
                    color: iconRight.props?.color || (isDark ? '#FFFFFF' : (colors.brand?.primaryDark || colors.text?.secondary || '#64748B')),
                  })
                : iconRight}
            </View>
          ) : null}
        </View>
      </View>

      {error ? (
        <AppText variant="caption" colorType="error" style={styles.helperText}>
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" colorType="muted" style={styles.helperText}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: verticalScale(4),
  },
  label: {
    marginLeft: scale(4),
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    overflow: 'hidden',
  },
  textInput: {
    flex: 1,
  },
  iconLeft: {},
  iconRight: {
    marginLeft: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    marginTop: verticalScale(4),
    marginLeft: scale(8),
  },
});

export default AppInput;
