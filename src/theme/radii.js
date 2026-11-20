import { moderateScale } from './responsive.js';

export const radii = {
  none: 0,
  xs: moderateScale(4),
  sm: moderateScale(6),
  md: moderateScale(10),
  lg: moderateScale(16),
  xl: moderateScale(20),
  input: moderateScale(28),     // Standard input field radius
  card: moderateScale(24),      // Standard content card radius
  sheet: moderateScale(32),     // Standard bottom sheet & top corner radius
  pill: 999,                    // Full capsule for buttons, avatar rings & tags
};
