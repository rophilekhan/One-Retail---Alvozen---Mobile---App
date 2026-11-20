import React, { useRef, useState } from 'react';
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import AppText from './AppText.jsx';

/**
 * AppSlider - Interactive Swipe to Action Component
 * Matches Figma OneRx "Swipe to Sign in" control
 *
 * @param {Object} props
 * @param {string} [props.title='Swipe to Proceed']
 * @param {Function} props.onSuccess
 * @param {boolean} [props.disabled=false]
 * @param {Object} [props.style]
 */
export const AppSlider = ({
  title = 'Swipe to Proceed',
  onSuccess,
  disabled = false,
  style,
}) => {
  const { colors, radii, isDark } = useTheme();
  const [trackWidth, setTrackWidth] = useState(320);
  const thumbWidth = 55;
  const thumbHeight = 38;
  const maxDrag = Math.max(trackWidth - thumbWidth - 12, 0);

  const pan = useRef(new Animated.Value(0)).current;

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const maxDragRef = useRef(maxDrag);
  maxDragRef.current = maxDrag;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= maxDragRef.current) {
          pan.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = maxDragRef.current * 0.7;
        if (gestureState.dx >= threshold) {
          Animated.timing(pan, {
            toValue: maxDragRef.current,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            if (onSuccessRef.current) onSuccessRef.current();
            setTimeout(() => {
              Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }, 800);
          });
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const trackBg = isDark ? colors.brand.primary : colors.brand.primaryDark;
  const labelColor = 'rgba(255, 255, 255, 0.75)';
  const chevronColor = isDark ? colors.brand.primary : colors.brand.primaryDark;
  const thumbBg = isDark ? '#000000' : '#ffffff';

  return (
    <View
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      style={[
        styles.track,
        {
          borderRadius: radii.pill,
          backgroundColor: trackBg,
          borderColor: 'transparent',
        },
        style,
      ]}
    >
      <AppText
        variant="bodyLarge"
        style={[styles.label, { color: labelColor }]}
      >
        {title}
      </AppText>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.thumb,
          {
            width: thumbWidth,
            height: thumbHeight,
            borderRadius: thumbHeight / 2,
            backgroundColor: thumbBg,
            transform: [{ translateX: pan }],
          },
        ]}
      >
        <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 7L11 12L6 17"
            stroke={chevronColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M13 7L18 12L13 17"
            stroke={chevronColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 55,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 4,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
  },
  label: {
    alignSelf: 'center',
    letterSpacing: -0.3,
  },
  thumb: {
    position: 'absolute',
    left: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default AppSlider;
