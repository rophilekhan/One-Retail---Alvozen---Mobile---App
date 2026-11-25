import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import AppText from './AppText.jsx';

/**
 * QuantityStepperInput - Reusable [-] / Editable Number / [+] Stepper
 *
 * Implements strict numeric synchronization:
 * - [-] strictly decrements by step (default 1), min floor (default 1)
 * - [+] strictly increments by step (default 1), max ceiling (default 9999)
 * - Center <TextInput /> allows instant manual digit entry with DMMono-Medium styling
 * - Auto sanitizes non-digits, recalculates immediately, and safely falls back on blur
 *
 * @param {Object} props
 * @param {number} props.value - Current numeric quantity
 * @param {Function} props.onChange - Callback with clean numeric quantity
 * @param {number} [props.min=1] - Minimum value (default 1)
 * @param {number} [props.max=9999] - Maximum value (default 9999)
 * @param {number} [props.step=1] - Increment/decrement delta (default 1)
 * @param {boolean} [props.disabled=false] - Disable interaction
 * @param {Object} [props.style] - Container style override
 */
export const QuantityStepperInput = ({
  value = 1,
  onChange,
  min = 1,
  max = 9999,
  step = 1,
  disabled = false,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const safeNumericValue = Number(value) || min;
  const [inputText, setInputText] = useState(String(safeNumericValue));

  useEffect(() => {
    const num = Number(value);
    if (!isNaN(num)) {
      setInputText(String(num));
    }
  }, [value]);

  const currentQty = parseInt(inputText, 10) || safeNumericValue;

  const handleDecrement = useCallback(() => {
    if (disabled || currentQty <= min) return;
    const next = Math.max(min, currentQty - step);
    setInputText(String(next));
    onChange?.(next);
  }, [disabled, currentQty, min, step, onChange]);

  const handleIncrement = useCallback(() => {
    if (disabled || currentQty >= max) return;
    const next = Math.min(max, currentQty + step);
    setInputText(String(next));
    onChange?.(next);
  }, [disabled, currentQty, max, step, onChange]);

  const handleChangeText = useCallback(
    (text) => {
      const clean = text.replace(/[^0-9]/g, '');
      setInputText(clean);

      if (clean.length > 0) {
        const num = parseInt(clean, 10);
        if (!isNaN(num)) {
          const clamped = Math.min(max, Math.max(min, num));
          onChange?.(clamped);
        }
      }
    },
    [max, min, onChange]
  );

  const handleBlur = useCallback(() => {
    const num = parseInt(inputText, 10);
    if (isNaN(num) || num < min) {
      setInputText(String(min));
      onChange?.(min);
    } else if (num > max) {
      setInputText(String(max));
      onChange?.(max);
    } else {
      setInputText(String(num));
      onChange?.(num);
    }
  }, [inputText, min, max, onChange]);

  const isMinDisabled = disabled || currentQty <= min;
  const isMaxDisabled = disabled || currentQty >= max;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.05)'
            : (colors.surface?.input || '#F8FAFC'),
          borderColor: colors.border?.default || (isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'),
        },
        style,
      ]}
    >
      {/* Decrement [-] Button */}
      <TouchableOpacity
        onPress={handleDecrement}
        disabled={isMinDisabled}
        activeOpacity={0.7}
        style={[
          styles.stepperBtn,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
            opacity: isMinDisabled ? 0.35 : 1,
          },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <AppText
          style={[
            styles.stepperSign,
            { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761') },
          ]}
        >
          −
        </AppText>
      </TouchableOpacity>

      {/* Center Editable Number <TextInput /> */}
      <TextInput
        value={inputText}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        keyboardType="number-pad"
        selectTextOnFocus={true}
        editable={!disabled}
        maxLength={5}
        style={[
          styles.numberInput,
          {
            color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761'),
            fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
            fontVariant: ['tabular-nums'],
          },
        ]}
        accessibilityLabel="Quantity input"
      />

      {/* Increment [+] Button */}
      <TouchableOpacity
        onPress={handleIncrement}
        disabled={isMaxDisabled}
        activeOpacity={0.7}
        style={[
          styles.stepperBtn,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
            opacity: isMaxDisabled ? 0.35 : 1,
          },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <AppText
          style={[
            styles.stepperSign,
            { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761') },
          ]}
        >
          +
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: scale(124),
    height: verticalScale(40),
    borderRadius: radii.input || scale(10),
    borderWidth: 1,
    paddingHorizontal: scale(2),
  },
  stepperBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperSign: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    lineHeight: scaleFont(20),
  },
  numberInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: scaleFont(14),
    fontWeight: '500',
    fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
    fontVariant: ['tabular-nums'],
    paddingVertical: 0,
    includeFontPadding: false,
    marginHorizontal: scale(2),
  },
});

export default QuantityStepperInput;
