import React from 'react';
import Svg, { Path } from 'react-native-svg';
import useVectorColor from './useVectorColor.js';

export const ShieldCheckIcon = ({ size = 24, color, ...props }) => {
  const resolvedColor = useVectorColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={resolvedColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 12l2 2 4-4" stroke={resolvedColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
};

export default ShieldCheckIcon;

