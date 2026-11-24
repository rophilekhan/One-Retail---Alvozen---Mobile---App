import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import useVectorColor from '../useVectorColor.js';

/**
 * RewardsStarIcon - Circular badge with a five-pointed star
 * Matches exact Figma Rewards Notification Icon
 */
export const RewardsStarIcon = ({ size = 20, color }) => {
  const resolvedColor = useVectorColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6.5l1.6 3.2 3.6.5-2.6 2.5.6 3.5-3.2-1.7-3.2 1.7.6-3.5-2.6-2.5 3.6-.5L12 6.5z"
        stroke={resolvedColor}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

/**
 * ResearchZoneIcon - Document with magnifying glass
 * Matches exact Figma Research Zone Notification Icon
 */
export const ResearchZoneIcon = ({ size = 20, color }) => {
  const resolvedColor = useVectorColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h6"
        stroke={resolvedColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2v6h6"
        stroke={resolvedColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2l6 6"
        stroke={resolvedColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="16.5" cy="16.5" r="3.5" stroke={resolvedColor} strokeWidth="1.6" />
      <Path
        d="M19 19l3 3"
        stroke={resolvedColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
};

/**
 * CalendarNotificationIcon - Calendar grid icon
 * Matches exact Figma Appointment Notification Icon
 */
export const CalendarNotificationIcon = ({ size = 20, color }) => {
  const resolvedColor = useVectorColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2v3M16 2v3M3.5 9h17M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
        stroke={resolvedColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="13" r="1" fill={resolvedColor} />
      <Circle cx="12" cy="13" r="1" fill={resolvedColor} />
      <Circle cx="16" cy="13" r="1" fill={resolvedColor} />
      <Circle cx="8" cy="17" r="1" fill={resolvedColor} />
      <Circle cx="12" cy="17" r="1" fill={resolvedColor} />
    </Svg>
  );
};

/**
 * DoubleCheckIcon - Double checkmark for "Mark as all read"
 */
export const DoubleCheckIcon = ({ size = 16, color = '#009BA9' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M3.5 10.5l3.5 3.5L14.5 6.5M7.5 10.5l3.5 3.5L18.5 6.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * ApproveCheckIcon - Single clean checkmark for "Approve" button
 */
export const ApproveCheckIcon = ({ size = 14, color }) => {
  const resolvedColor = useVectorColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M3 8.5l3.5 3.5L13 4.5"
        stroke={resolvedColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

