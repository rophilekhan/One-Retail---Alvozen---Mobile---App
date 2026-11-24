import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { SearchIconSvg } from '../../assets/vectors/PrescriptionIcons.jsx';

/**
 * AppSearchBar - Unified OneRetail Search Bar
 * Port of OneRx MedicineSearchView search input:
 * - Height: verticalScale(52)
 * - Border radius: radii.pill
 * - Explicit placeholderTextColor: #B4B6B8 in light / rgba(255,255,255,0.4) in dark
 * - Left search icon & right clear button
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {Function} props.onChangeText
 * @param {string} [props.placeholder='Search...']
 * @param {Function} [props.onClear]
 * @param {Function} [props.onSubmitEditing]
 * @param {Object} [props.style]
 * @param {Object} [props.inputStyle]
 */
export const AppSearchBar = ({
  value = '',
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onSubmitEditing,
  style,
  inputStyle,
  ...rest
}) => {
  const { isDark, colors } = useTheme();

  const handleClear = () => {
    if (onChangeText) onChangeText('');
    if (onClear) onClear();
  };

  const placeholderColor = isDark ? 'rgba(255, 255, 255, 0.4)' : '#B4B6B8';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        },
        !isDark && styles.lightShadow,
        style,
      ]}
    >
      <View style={styles.searchIconWrap}>
        <SearchIconSvg size={scale(20)} color={isDark ? '#009BA9' : '#0F4761'} />
      </View>

      <TextInput
        style={[
          styles.input,
          {
            color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
            fontFamily: fontFamilies.primary,
          },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />

      {value?.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearBtn}
          accessibilityLabel="Clear search text"
        >
          <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={placeholderColor} strokeWidth="1.2" />
            <Path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke={placeholderColor} strokeWidth="1.2" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: verticalScale(52),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    borderRadius: radii.pill,
    borderWidth: 1,
    marginVertical: verticalScale(6),
  },
  searchIconWrap: {
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: scaleFont(14),
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  clearBtn: {
    padding: scale(4),
  },
  lightShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
});

export default AppSearchBar;
