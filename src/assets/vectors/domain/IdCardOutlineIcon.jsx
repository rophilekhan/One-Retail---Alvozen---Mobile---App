import React, { memo } from 'react';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

/**
 * IdCardOutlineIcon - Badge / Contact Card icon for Username input
 * Matching exact Figma screenshot for PA Username input field
 */
export const IdCardOutlineIcon = memo(({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth="1.8" />
    <Circle cx="9" cy="10" r="2.5" stroke={color} strokeWidth="1.6" />
    <Path
      d="M5.5 16.5C5.5 14.8 7 13.8 9 13.8C11 13.8 12.5 14.8 12.5 16.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path
      d="M15 9.5H18.5M15 13.5H18.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Svg>
));

export default IdCardOutlineIcon;

