import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// OneRetail base canvas dimensions (402x874)
export const BASE_WIDTH = 402;
export const BASE_HEIGHT = 874;

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isSmallDevice = SCREEN_WIDTH < 375;

/**
 * Calculate width percentage
 * @param {number} percentage - Percentage of screen width (0-100)
 */
export const wp = (percentage) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

/**
 * Calculate height percentage
 * @param {number} percentage - Percentage of screen height (0-100)
 */
export const hp = (percentage) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

/**
 * Scale dimension horizontally according to base width
 * @param {number} size - Size in pt
 */
export const scale = (size) => {
  const scaled = (SCREEN_WIDTH / BASE_WIDTH) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

/**
 * Scale dimension vertically according to base height
 * @param {number} size - Size in pt
 */
export const verticalScale = (size) => {
  const scaled = (SCREEN_HEIGHT / BASE_HEIGHT) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

/**
 * Moderately scale dimension (best for padding, margins, gaps)
 * @param {number} size - Size in pt
 * @param {number} factor - Damping factor (default 0.5)
 */
export const moderateScale = (size, factor = 0.5) => {
  const scaled = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

/**
 * Scale font size with moderate scaling and reasonable min/max caps
 * @param {number} size - Font size
 */
export const scaleFont = (size) => {
  const newSize = moderateScale(size, 0.4);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
