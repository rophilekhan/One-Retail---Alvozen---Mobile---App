import { moderateScale, scale, verticalScale } from './responsive.js';

export const spacing = {
  none: 0,
  xxs: moderateScale(2),
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  huge: moderateScale(40),
  massive: moderateScale(48),
  epic: moderateScale(64),

  // OneRetail specific layout presets
  screenHorizontal: scale(20),
  screenTop: verticalScale(16),
  screenBottom: verticalScale(24),
  cardPadding: moderateScale(16),
  inputPaddingHorizontal: scale(16),
  inputPaddingVertical: verticalScale(12),
  buttonHeight: verticalScale(56),
  buttonHeightSm: verticalScale(40),
  buttonHeightXs: verticalScale(28),
  inputHeight: verticalScale(64),
  inputHeightLg: verticalScale(72),
  otpBoxSize: scale(64),
  bottomNavHeight: verticalScale(64),
  bottomNavClearance: verticalScale(100),
};
