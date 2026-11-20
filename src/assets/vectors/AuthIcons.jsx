import React from 'react';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

/**
 * UserOutlineIcon - Person icon for Username / Phone input
 */
export const UserOutlineIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 19C5 15.6863 8.13401 13 12 13C15.866 13 19 15.6863 19 19"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * LockOutlineIcon - Padlock icon for Password input
 */
export const UsersOutlineIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.8" />
    <Path d="M3 18c0-3 2.5-5 6-5s6 2 6 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="16" cy="9" r="2.5" stroke={color} strokeWidth="1.8" />
    <Path d="M16 14c2.5 0 5 1.5 5 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

/**
 * ParentIcon - Exact vector from src/assets/images/parent icon.svg
 */
export const ParentIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21.0002C19.713 17.2691 16.7289 14.3152 12.995 14.0663L12 14C11.6446 14.0097 11.3134 14.0226 11.0008 14.0379C7.3 14.2193 4.28417 17.3058 4 21.0002"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.5 10L3.1099 8.82582L3.10988 8.8258C2.36996 8.20081 2 7.88832 2 7.5C2 7.11167 2.36996 6.79918 3.10988 6.17419L3.1099 6.17417L4.5 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.5 10L20.8901 8.82582L20.8903 8.82562C21.6301 8.20075 22 7.88828 22 7.5C22 7.11171 21.6301 6.79924 20.8903 6.17437L20.8901 6.17417L19.5 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * PhoneHandsetIcon - Exact vector from src/assets/images/phone icon.svg
 */
export const PhoneHandsetIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.90404 10.5413L7.54448 7.90088C8.08309 7.36227 8.26947 6.56642 8.05163 5.83652C7.88129 5.26577 7.68937 4.57964 7.5618 3.99292C7.44381 3.45027 6.96763 3 6.41231 3H4.90404C3.79339 3 2.8813 3.90384 3.00313 5.0078C3.92928 13.3996 10.5926 20.0629 18.9844 20.9891C20.0883 21.1109 20.9922 20.1988 20.9922 19.0881V17.5799C20.9922 17.0246 20.5401 16.569 19.9937 16.4696C19.391 16.36 18.7533 16.1804 18.2198 16.0103C17.4533 15.7659 16.6013 15.9377 16.0325 16.5065L13.4509 19.0881"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LockOutlineIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="10"
      width="16"
      height="11"
      rx="2.5"
      stroke={color}
      strokeWidth="1.3"
    />
    <Path
      d="M8 10V6.5C8 4.5 9.8 3 12 3C14.2 3 16 4.5 16 6.5V10"
      stroke={color}
      strokeWidth="1.3"
    />
    <Circle cx="12" cy="15.5" r="1.5" fill={color} />
  </Svg>
);

/**
 * EyeOffIcon - Password hidden visibility toggle
 */
export const EyeOffIcon = ({ size = 24, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3L21 21"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.5 10.677C9.9723 11.2047 9.67568 11.9202 9.67568 12.6663C9.67568 14.1944 10.9152 15.4339 12.4433 15.4339C13.1894 15.4339 13.9049 15.1373 14.4326 14.6096"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M7.362 7.5C4.38 9.1 2.5 12 2.5 12C2.5 12 6 18.5 12 18.5C14.07 18.5 15.93 17.7 17.5 16.6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M10 5.6C10.64 5.4 11.31 5.3 12 5.3C18 5.3 21.5 12 21.5 12C21.5 12 20.37 13.8 18.5 15.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * EyeOpenIcon - Password visible toggle
 */
export const EyeOpenIcon = ({ size = 24, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2.5 12C2.5 12 6 5.5 12 5.5C18 5.5 21.5 12 21.5 12C21.5 12 18 18.5 12 18.5C6 18.5 2.5 12 2.5 12Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="12"
      cy="12"
      r="3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * CheckmarkCircleIcon - Solid green circle with white checkmark
 */
export const CheckmarkCircleIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill="#10B981" />
    <Path
      d="M7 12L10.5 15.5L17 8.5"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * CheckboxIcon - Square checkbox matching Figma
 */
export const CheckboxIcon = ({ checked = false, size = 18, color = '#020202', borderColor = '#c4c4c4' }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Rect
      x="1"
      y="1"
      width="16"
      height="16"
      rx="4"
      stroke={checked ? color : borderColor}
      strokeWidth="1.5"
      fill={checked ? color : 'transparent'}
    />
    {checked && (
      <Path
        d="M4.5 9L7.5 12L13.5 5.5"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </Svg>
);

/**
 * MailOutlineIcon - Envelope icon for Email input
 */
export const MailOutlineIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 7l9 6 9-6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * PhoneOutlineIcon - Telephone receiver icon for Phone input
 */
export const PhoneOutlineIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * CalendarOutlineIcon
 */
export const CalendarOutlineIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * ChevronRightIcon
 */
export const ChevronRightIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * VenusIcon (Female Symbol)
 */
export const VenusIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="9" r="5" stroke={color} strokeWidth="1.8" />
    <Path d="M12 14v7M9 18h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

/**
 * MarsIcon (Male Symbol)
 */
export const MarsIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="14" r="5" stroke={color} strokeWidth="1.8" />
    <Path d="M13.5 10.5L19 5M15 5h4v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * BadgeCheckOutlineIcon
 */
export const TickCustomIcon = ({ size = 24, color = "#020202" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11.5143 2.09327C11.8265 1.96891 12.1735 1.96891 12.4857 2.09327C13.4921 2.49406 13.6887 4.03744 14.8762 4.12336C15.7124 4.18386 16.533 3.48677 17.3721 3.69574C17.7105 3.78003 18.0028 3.99579 18.186 4.29657C18.7472 5.21824 18.0229 6.57292 18.9383 7.33768C19.5743 7.86877 20.6251 7.80004 21.178 8.4511C21.4108 8.72534 21.5252 9.08303 21.4953 9.4437C21.4068 10.5166 20.0389 11.1876 20.3395 12.3439C20.5475 13.1443 21.4253 13.707 21.4953 14.5563C21.5252 14.917 21.4108 15.2747 21.178 15.5489C20.4832 16.3669 18.9808 16.0975 18.5476 17.2062C18.2434 17.9844 18.634 18.9677 18.186 19.7034C18.0028 20.0042 17.7105 20.22 17.3721 20.3043C16.3302 20.5637 15.2727 19.4445 14.2701 20.0758C13.5543 20.5264 13.2978 21.5835 12.4857 21.9067C12.1735 22.0311 11.8265 22.0311 11.5143 21.9067C10.7022 21.5835 10.4457 20.5264 9.72989 20.0758C8.73971 19.4524 7.65213 20.5593 6.62791 20.3043C6.28947 20.22 5.9972 20.0042 5.81405 19.7034C5.25286 18.7818 5.97704 17.427 5.0617 16.6623C4.42582 16.1312 3.37494 16.2 2.82204 15.5489C2.58921 15.2747 2.47484 14.917 2.50465 14.5563C2.57485 13.707 3.4524 13.1443 3.6605 12.3439C3.95808 11.1997 2.59204 10.5009 2.50465 9.4437C2.47484 9.08303 2.58921 8.72534 2.82204 8.4511C3.51676 7.63284 5.01899 7.90253 5.45238 6.79383C5.75662 6.0156 5.36608 5.03227 5.81405 4.29657C5.9972 3.99579 6.28947 3.78003 6.62791 3.69574C7.46705 3.48677 8.28757 4.18387 9.12378 4.12336C10.3113 4.03746 10.5079 2.49406 11.5143 2.09327Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path
      d="M9 13.3333C9 13.3333 9.875 13.3333 10.75 15C10.75 15 13.5294 10.8333 16 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BadgeCheckOutlineIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l3.09 2.26L18.8 3.4l1.1 3.73 3.56 1.48-1.52 3.54 1.52 3.54-3.56 1.48-1.1 3.73-3.71-.86L12 22l-3.09-2.26-3.71.86-1.1-3.73-3.56-1.48 1.52-3.54-1.52-3.54 3.56-1.48 1.1-3.73 3.71.86L12 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * DocumentSearchIcon
 */
export const DocumentSearchIcon = ({ size = 48 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Rect x="8" y="6" width="28" height="36" rx="4" fill="#CFF4F8" />
    <Path d="M14 16h10M14 24h16M14 32h8" stroke="#8DE1E8" strokeWidth="3" strokeLinecap="round" />
    <Circle cx="34" cy="34" r="8" fill="#E0F7FA" stroke="#009BA9" strokeWidth="2.5" />
    <Path d="M40 40l4 4" stroke="#009BA9" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

/**
 * CloseIcon (for Modals)
 */
export const CloseIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Practice Speciality Icons
 */
export const NeurologistIcon = ({ isDark, size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M12 17C12 14.2386 14.2386 12 17 12H23C25.7614 12 28 14.2386 28 17V19L19 28H17C14.2386 28 12 25.7614 12 23V17Z" fill="#A1DFE4" />
    <Path d="M28 23V24C28 26.209 26.209 28 24 28H23L28 23Z" fill="#A1DFE4" />
  </Svg>
);

export const OrthopedicIcon = ({ isDark, size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Circle cx="16" cy="24" r="5" fill="#A1DFE4" />
    <Rect x="15" y="11" width="14" height="7" rx="3" fill="#009BA9" />
    <Rect x="22" y="11" width="7" height="14" rx="3" fill="#009BA9" />
  </Svg>
);

export const CardiologistIcon = ({ isDark, size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Rect x="12" y="12" width="16" height="16" rx="5" fill="#009BA9" />
    <Rect x="20" y="15.5" width="6" height="6" rx="1.5" fill={isDark ? "#020202" : "#ffffff"} transform="rotate(45 20 20)" />
  </Svg>
);

export const CustomIcon = ({ isDark, size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Circle cx="15" cy="20" r="5" fill="#A1DFE4" />
    <Path d="M19 13L24.5 18.5C25.3 19.3 25.3 20.7 24.5 21.5L19 27" stroke="#009BA9" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Qualifications Flow Icons
 */
export const FolderPlusIcon = ({ size = 64, isDark }) => (
  <Svg width={size} height={size * (70 / 90)} viewBox="2 13 90 70" fill="none">
    <Path d="M10.7373 75.3061V18.5078C10.7373 16.2987 12.5282 14.5078 14.7373 14.5078H34.6496C35.3387 14.5078 36.0161 14.6858 36.6161 15.0246L47.6816 21.2717C48.2817 21.6105 48.959 21.7885 49.6481 21.7885H72.9917C75.2008 21.7885 76.9917 23.5794 76.9917 25.7885V75.3061C76.9917 77.5152 75.2008 79.3061 72.9917 79.3061H14.7373C12.5282 79.3061 10.7373 77.5152 10.7373 75.3061Z" fill="url(#paint0_linear_55_12445)" />
    <Rect x="18.0175" y="27.6133" width="50.9649" height="29.1228" rx="4" fill="url(#paint1_linear_55_12445)" />
    <Path d="M3.04528 40.3363C2.49522 36.706 5.30578 33.4375 8.97757 33.4375H78.0224C81.6942 33.4375 84.5048 36.706 83.9547 40.3363L78.4922 76.389C78.0478 79.3221 75.5265 81.4901 72.5599 81.4901H14.4401C11.4735 81.4901 8.95221 79.3221 8.5078 76.389L3.04528 40.3363Z" fill="url(#paint2_linear_55_12445)" />

    <Circle cx="81" cy="59" r="10" fill="#0F4761" stroke={isDark ? "#0F4761" : "#0F4761"} strokeWidth="1.5" />
    <Path d="M81.0011 55.1113V62.8902" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M84.8902 59.002H77.1113" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

    <Defs>
      <LinearGradient id="paint0_linear_55_12445" x1="18.419" y1="37.4477" x2="77.6052" y2="54.0002" gradientUnits="userSpaceOnUse">
        <Stop offset="0.257623" stopColor="#93DEE5" />
        <Stop offset="1" stopColor="#7ED5DD" />
      </LinearGradient>
      <LinearGradient id="paint1_linear_55_12445" x1="40.5877" y1="26.8852" x2="42.8117" y2="56.404" gradientUnits="userSpaceOnUse">
        <Stop stopColor="white" />
        <Stop offset="0.500826" stopColor="#A8E8EE" />
      </LinearGradient>
      <LinearGradient id="paint2_linear_55_12445" x1="2" y1="57.5822" x2="85" y2="57.5822" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#D2FBFF" />
        <Stop offset="1" stopColor="#A8E8EE" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export const CertificateOutlineIcon = ({ size = 24, color = '#020202' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.8" />
    <Path d="M9 16V21L12 19L15 21V16" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
  </Svg>
);

export const BuildingOutlineIcon = ({ size = 24, color = '#020202' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5a2 2 0 014 0v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12h.01M15 12h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const DeleteBinIcon = ({ size = 24, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * MapPinIcon - Standard location pin for inputs
 */
export const MapPinIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
  </Svg>
);

/**
 * TargetPinIcon - Map target for location picker
 */
export const TargetPinIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <Path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * DollarCircleIcon - Consultation fee
 */
export const DollarCircleIcon = ({ size = 20, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.3" />
    <Path d="M12 8v8" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14.5 9.5a2.5 2.5 0 00-5 0c0 1.5 5 1.5 5 3a2.5 2.5 0 01-5 0" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * CopyIcon - Apply to other days
 */
export const CopyIcon = ({ size = 16, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * ChevronDownIcon - View Summary
 */
export const ChevronDownIcon = ({ size = 16, color = '#787878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * CheckmarkSmallIcon - Check for selected day
 */
export const CheckmarkSmallIcon = ({ size = 12, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * CustomMapMarkerIcon - Orange map pin
 */
export const CustomMapMarkerIcon = ({ size = 48, color = '#F26B22' }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path d="M24 10C17.372 10 12 15.372 12 22c0 8.5 12 21 12 21s12-12.5 12-21c0-6.628-5.372-12-12-12z" fill={color} />
    <Circle cx="24" cy="22" r="4.5" fill="#ffffff" />
  </Svg>
);

/**
 * TargetMapIcon - Circular map target floating button
 */
export const TargetMapIcon = ({ size = 48 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill="#ffffff" />
    <Circle cx="24" cy="24" r="23" stroke="#e0e0e0" strokeWidth="1" />
    <Path d="M24 16v4M24 28v4M16 24h4M28 24h4" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="24" cy="24" r="5" stroke="#000000" strokeWidth="2" />
    <Circle cx="24" cy="24" r="2" fill="#000000" />
  </Svg>
);

/**
 * TrianglePointerIcon - Downward pointing triangle for active day
 */
export const TrianglePointerIcon = ({ width = 16, height = 8, color = '#009BA9' }) => (
  <Svg width={width} height={height} viewBox="0 0 16 8" fill="none">
    <Path d="M8 8L0 0H16L8 8Z" fill={color} />
  </Svg>
);

/**
 * ClinicCardIcon - Building icon for existing clinic card
 */
export const ClinicCardIcon = ({ size = 48, color = '#020202', bgColor = '#F5F2F9' }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Rect x="0" y="0" width={size} height={size} rx="12" fill={bgColor} />
    <Path d="M24 14l-8 6v14h16V20l-8-6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 34V26h8v8M24 20v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * EditPencilIcon - Edit action for cards
 */
export const EditPencilIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5, style }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
    <Path
      d="M11.7294 3.23527C12.3504 2.56246 12.6609 2.22606 12.9908 2.02984C13.7869 1.55636 14.7672 1.54164 15.5766 1.991C15.9121 2.17723 16.2321 2.50416 16.8721 3.15803C17.5122 3.8119 17.8323 4.13883 18.0146 4.4815C18.4545 5.30833 18.4401 6.30972 17.9766 7.12298C17.7845 7.46003 17.4551 7.77721 16.7966 8.41156L8.96014 15.9593C7.71204 17.1615 7.08797 17.7626 6.30802 18.0671C5.52807 18.3718 4.67064 18.3494 2.95577 18.3046L2.72245 18.2985C2.20039 18.2848 1.93936 18.278 1.78763 18.1057C1.63589 17.9336 1.6566 17.6676 1.69804 17.1359L1.72054 16.8471C1.83714 15.3503 1.89544 14.602 2.18773 13.9292C2.48 13.2565 2.98417 12.7103 3.99249 11.6178L11.7294 3.23527Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.668 4.16406L15.8346 8.33073"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.668 18.3359H18.3346"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);



export const QualificationCustomIcon = ({ size = 24, color = "#020202" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18.5 17.838C19.5305 17.6867 20.2627 17.3941 20.8284 16.8284C22 15.6569 22 13.7712 22 10C22 6.22876 22 4.34315 20.8284 3.17157C19.6569 2 17.7712 2 14 2H10C6.22876 2 4.34315 2 3.17157 3.17157C2 4.34315 2 6.22876 2 10C2 13.7712 2 15.6569 3.17157 16.8284C3.97975 17.6366 5.1277 17.8873 7 17.965" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M17 7H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14.5 14.5C14.5 15.8807 13.3807 17 12 17C10.6193 17 9.5 15.8807 9.5 14.5C9.5 13.1193 10.6193 12 12 12C13.3807 12 14.5 13.1193 14.5 14.5Z" stroke={color} strokeWidth="1.5" />
    <Path d="M9.5 14.5C9.5 18.5659 11.2222 20.8706 12 22L13.5 19L15.25 20L17 21C16.2653 20.2888 15.5058 18.0471 15.5058 18.0471" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const InstitutionCustomIcon = ({ size = 24, color = "#020202" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 7.5L15.3992 4.24542C13.7542 3.08181 12.9318 2.5 12 2.5C11.0682 2.5 10.2458 3.08181 8.60083 4.24542L4 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 6.5V21.5H6V6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19.7889 12.3944L18 11.5V21.5C19.8856 21.5 20.8284 21.5 21.4142 20.9142C22 20.3284 22 19.3856 22 17.5V15.9721C22 14.7693 22 14.1679 21.7013 13.6846C21.4026 13.2013 20.8647 12.9323 19.7889 12.3944Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4.21114 12.3944L6 11.5V21.5C4.11438 21.5 3.17157 21.5 2.58579 20.9142C2 20.3284 2 19.3856 2 17.5V15.9721C2 14.7693 2 14.1679 2.2987 13.6846C2.5974 13.2013 3.13531 12.9323 4.21114 12.3944Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 21.5V17.5C10 16.3954 10.8954 15.5 12 15.5C13.1046 15.5 14 16.3954 14 17.5V21.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const DatePickerCustomIcon = ({ size = 24, color = "#020202" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 2V5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 2V5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.5 9.08984H20.5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12.0043 12.5C12.6668 12.5002 13.2043 13.0374 13.2043 13.7C13.2041 14.3624 12.6667 14.8998 12.0043 14.9H11.9949C11.3323 14.9 10.7951 14.3626 10.7949 13.7C10.7949 13.0373 11.3322 12.5 11.9949 12.5H12.0043Z" fill={color} />
    <Path d="M8.30312 12.5C8.96567 12.5002 9.50312 13.0374 9.50312 13.7C9.50291 14.3624 8.96554 14.8998 8.30312 14.9H8.29375C7.63114 14.9 7.09396 14.3626 7.09375 13.7C7.09375 13.0373 7.63101 12.5 8.29375 12.5H8.30312Z" fill={color} />
    <Path d="M8.30312 16.1992C8.96567 16.1994 9.50312 16.7366 9.50312 17.3992C9.50291 18.0616 8.96554 18.599 8.30312 18.5992H8.29375C7.63114 18.5992 7.09396 18.0618 7.09375 17.3992C7.09375 16.7365 7.63101 16.1992 8.29375 16.1992H8.30312Z" fill={color} />
  </Svg>
);

export const HospitalCustomIcon = ({ size = 24, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 22H22" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 2H7C4 2 3 3.79 3 6V22H21V6C21 3.79 20 2 17 2Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14.0602 15H9.93022C9.42022 15 8.99023 15.42 8.99023 15.94V22H14.9902V15.94C15.0002 15.42 14.5802 15 14.0602 15Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 6V11" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9.5 8.5H14.5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const MedicalCertificateIcon = ({ size = 56 }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <Path d="M6 13.8307C6 12.292 6.59117 10.812 7.65133 9.69681L11.2928 5.8661C12.4255 4.67457 13.9975 4 15.6415 4H36.3286C39.6423 4 42.3286 6.68629 42.3286 10V44.0642C42.3286 47.3779 39.6423 50.0642 36.3286 50.0642H12C8.68629 50.0642 6 47.3779 6 44.0642V13.8307Z" fill="url(#paint0_linear_55_12165)" />
    <Rect x="10.1797" y="28.041" width="8.36221" height="2.09055" rx="1.04528" fill="url(#paint1_linear_55_12165)" />
    <Circle cx="13.8382" cy="20.2014" r="3.65846" fill="url(#paint2_linear_55_12165)" />
    <Path d="M6 11.434L13.0668 4.36719V11.434H6Z" fill="url(#paint3_linear_55_12165)" />
    <Path d="M47.3709 52.2165L41.8382 47.545C41.0959 46.9182 41.0029 45.8075 41.6297 45.0653C42.2565 44.3234 43.3657 44.2304 44.1078 44.8569L49.6405 49.5285C50.3827 50.1553 50.4764 51.2651 49.8497 52.0073C49.223 52.7495 48.1131 52.8431 47.3709 52.2165Z" fill="url(#paint4_linear_55_12165)" />
    <Circle cx="33.5962" cy="37.6958" r="13.0337" transform="rotate(10.1761 33.5962 37.6958)" fill="url(#paint5_linear_55_12165)" />
    <Circle cx="33.5964" cy="37.6959" r="7.11356" transform="rotate(10.1761 33.5964 37.6959)" fill="url(#paint6_linear_55_12165)" />
    <Defs>
      <LinearGradient id="paint0_linear_55_12165" x1="22.7244" y1="23.3376" x2="48.8563" y2="62.0128" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#D2FBFF" />
        <Stop offset="1" stopColor="#A8E8EE" />
      </LinearGradient>
      <LinearGradient id="paint1_linear_55_12165" x1="11.1492" y1="28.8108" x2="14.7267" y2="32.8128" gradientUnits="userSpaceOnUse">
        <Stop offset="0.257623" stopColor="#54C1CB" />
        <Stop offset="1" stopColor="#7ED5DD" />
      </LinearGradient>
      <LinearGradient id="paint2_linear_55_12165" x1="11.028" y1="19.2372" x2="17.5644" y2="21.0652" gradientUnits="userSpaceOnUse">
        <Stop offset="0.257623" stopColor="#54C1CB" />
        <Stop offset="1" stopColor="#7ED5DD" />
      </LinearGradient>
      <LinearGradient id="paint3_linear_55_12165" x1="6.81934" y1="6.9693" x2="13.1322" y2="8.73482" gradientUnits="userSpaceOnUse">
        <Stop offset="0.257623" stopColor="#54C1CB" />
        <Stop offset="1" stopColor="#7ED5DD" />
      </LinearGradient>
      <LinearGradient id="paint4_linear_55_12165" x1="43.7843" y1="48.6544" x2="46.1871" y2="46.285" gradientUnits="userSpaceOnUse">
        <Stop offset="0.257623" stopColor="#54C1CB" />
        <Stop offset="1" stopColor="#7ED5DD" />
      </LinearGradient>
      <LinearGradient id="paint5_linear_55_12165" x1="23.5849" y1="34.2606" x2="46.8713" y2="40.7731" gradientUnits="userSpaceOnUse">
        <Stop offset="0.257623" stopColor="#93DEE5" />
        <Stop offset="1" stopColor="#7ED5DD" />
      </LinearGradient>
      <LinearGradient id="paint6_linear_55_12165" x1="33.6513" y1="36.5549" x2="40.4989" y2="50.6193" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#D2FBFF" />
        <Stop offset="1" stopColor="#A8E8EE" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export const LocationCrosshairCustomIcon = ({ size = 24, color = '#ABABAB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.5137 12C20.5137 16.6944 16.7081 20.5 12.0137 20.5C7.31925 20.5 3.51367 16.6944 3.51367 12C3.51367 7.30558 7.31925 3.5 12.0137 3.5C16.7081 3.5 20.5137 7.30558 20.5137 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22.5 12H20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.5 12H1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 1.5V3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 20.5V22.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 12C15 13.6569 13.6568 15 12 15C10.3431 15 8.99994 13.6569 8.99994 12C8.99994 10.3431 10.3431 9 12 9C13.6568 9 15 10.3431 15 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PlusCustomIcon = ({ size = 24, color = '#0F4756', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);


export const CountryGlobeIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.5 12H21.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CnicIdCardIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6.5C3 5.39543 3.89543 4.5 5 4.5H19C20.1046 4.5 21 5.39543 21 6.5V17.5C21 18.6046 20.1046 19.5 19 19.5H5C3.89543 19.5 3 18.6046 3 17.5V6.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M6 14C6 12.8954 6.89543 12 8 12H9C10.1046 12 11 12.8954 11 14V14.5H6V14Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 9H18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M14 12.5H18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M14 15.5H17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const IdCardOutlineIcon = CnicIdCardIcon;

/**
 * CameraCustomIcon - Clean camera vector for image upload dropzones
 */
export const CameraCustomIcon = ({ size = 20, color = '#009BA9', strokeWidth = 1.6 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 8H7L9 5H15L17 8H20C21.1 8 22 8.9 22 10V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V10C2 8.9 2.9 8 4 8Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="14.5" r="3.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/**
 * UploadCloudCustomIcon - Clean document upload cloud vector
 */
export const UploadCloudCustomIcon = ({ size = 20, color = '#009BA9', strokeWidth = 1.6 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 16.24C2.79 15.42 2 14.04 2 12.5C2 10.16 3.79 8.24 6.1 8.03C6.62 5.17 9.13 3 12.16 3C15.65 3 18.52 5.67 18.79 9.12C20.67 9.69 22 11.44 22 13.5C22 15.98 20 18 17.5 18H16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 12V21M8.5 15.5L12 12L15.5 15.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * FirstVisitIcon - Exact vector from src/assets/images/first visit icon.svg
 */
export const FirstVisitIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.5201 6.22967C18.812 7.89634 17.5003 9 17.5003 9C17.5003 9 15.8968 8.437 15.6049 6.77033C15.313 5.10366 16.6247 4 16.6247 4C16.6247 4 18.2282 4.56301 18.5201 6.22967Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.927 13.5887C19.5821 14.7178 17.9368 14.0892 17.9368 14.0892C17.9368 14.0892 17.6365 12.3314 18.9814 11.2023C20.3262 10.0732 21.9715 10.7019 21.9715 10.7019C21.9715 10.7019 22.2718 12.4596 20.927 13.5887Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.7335 19.8262C15.2335 19.2506 15 17.6366 15 17.6366C15 17.6366 16.2665 16.5982 17.7665 17.1738C19.2665 17.7494 19.5 19.3634 19.5 19.3634C19.5 19.3634 18.2335 20.4018 16.7335 19.8262Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 17.6366C16.4051 16.4358 18.0006 14.0564 18.0006 11.7273C18.0006 10.7628 17.8457 9.84221 17.5644 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.47987 6.22967C5.18799 7.89634 6.49968 9 6.49968 9C6.49968 9 8.10325 8.437 8.39513 6.77033C8.68701 5.10366 7.37532 4 7.37532 4C7.37532 4 5.77175 4.56301 5.47987 6.22967Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.07316 13.5887C4.41804 14.7178 6.06328 14.0892 6.06328 14.0892C6.06328 14.0892 6.36364 12.3314 5.01876 11.2023C3.67387 10.0732 2.02863 10.7019 2.02863 10.7019C2.02863 10.7019 1.72828 12.4596 3.07316 13.5887Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.26651 19.8262C8.76651 19.2506 9 17.6366 9 17.6366C9 17.6366 7.73349 16.5982 6.23349 17.1738C4.73349 17.7494 4.5 19.3634 4.5 19.3634C4.5 19.3634 5.76651 20.4018 7.26651 19.8262Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.99957 17.6366C7.59446 16.4358 5.99902 14.0564 5.99902 11.7273C5.99902 10.7628 6.1539 9.84221 6.43516 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 10L12 9.5V14.5M12 14.5H13M12 14.5H11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * FollowUpVisitIcon - Exact vector from src/assets/images/FollowUp icon.svg
 */
export const FollowUpVisitIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 9C4.55228 9 5 8.55228 5 8C5 7.44772 4.55228 7 4 7C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 17C4.55228 17 5 16.5523 5 16C5 15.4477 4.55228 15 4 15C3.44772 15 3 15.4477 3 16C3 16.5523 3.44772 17 4 17Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M4 21V3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path
      d="M9.91421 9.41421L9.35355 8.85355C9.29393 8.79393 9.26412 8.76412 9.23778 8.73311C9.10232 8.5736 9.02031 8.37561 9.00331 8.16703C9 8.12647 9 8.08432 9 8C9 7.91568 9 7.87353 9.00331 7.83297C9.02031 7.62439 9.10232 7.4264 9.23778 7.26689C9.26412 7.23588 9.29393 7.20607 9.35355 7.14645L9.91421 6.58579C10.2032 6.29676 10.3478 6.15224 10.5315 6.07612C10.7153 6 10.9197 6 11.3284 6H17C17.9428 6 18.4142 6 18.7071 6.29289C19 6.58579 19 7.05719 19 8C19 8.94281 19 9.41421 18.7071 9.70711C18.4142 10 17.9428 10 17 10H11.3284C10.9197 10 10.7153 10 10.5315 9.92388C10.3478 9.84776 10.2032 9.70324 9.91421 9.41421Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.91421 17.4142L9.35355 16.8536C9.29393 16.7939 9.26412 16.7641 9.23778 16.7331C9.10232 16.5736 9.02031 16.3756 9.00331 16.167C9 16.1265 9 16.0843 9 16C9 15.9157 9 15.8735 9.00331 15.833C9.02031 15.6244 9.10232 15.4264 9.23778 15.2669C9.26412 15.2359 9.29393 15.2061 9.35355 15.1464L9.91421 14.5858C10.2032 14.2968 10.3478 14.1522 10.5315 14.0761C10.7153 14 10.9197 14 11.3284 14H19C19.9428 14 20.4142 14 20.7071 14.2929C21 14.5858 21 15.0572 21 16C21 16.9428 21 17.4142 20.7071 17.7071C20.4142 18 19.9428 18 19 18H11.3284C10.9197 18 10.7153 18 10.5315 17.9239C10.3478 17.8478 10.2032 17.7032 9.91421 17.4142Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * DatePickerIcon - Exact vector from src/assets/images/date picker icon.svg
 */
export const DatePickerIcon = ({ size = 20, color = '#787878', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 2V5" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 2V5" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.5 9.08984H20.5" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.0043 12.5C12.6668 12.5002 13.2043 13.0374 13.2043 13.7C13.2041 14.3624 12.6667 14.8998 12.0043 14.9H11.9949C11.3323 14.9 10.7951 14.3626 10.7949 13.7C10.7949 13.0373 11.3322 12.5 11.9949 12.5H12.0043Z"
      fill={color}
    />
    <Path
      d="M8.30312 12.5C8.96567 12.5002 9.50312 13.0374 9.50312 13.7C9.50291 14.3624 8.96554 14.8998 8.30312 14.9H8.29375C7.63114 14.9 7.09396 14.3626 7.09375 13.7C7.09375 13.0373 7.63101 12.5 8.29375 12.5H8.30312Z"
      fill={color}
    />
    <Path
      d="M8.30312 16.1992C8.96567 16.1994 9.50312 16.7366 9.50312 17.3992C9.50291 18.0616 8.96554 18.599 8.30312 18.5992H8.29375C7.63114 18.5992 7.09396 18.0618 7.09375 17.3992C7.09375 16.7365 7.63101 16.1992 8.29375 16.1992H8.30312Z"
      fill={color}
    />
  </Svg>
);

/**
 * HelpQuestionIcon - Question mark (?) circle icon for Custom Visit Reason
 * Matching Figma screenshot media_1793696756762_14883cbc.jpg
 */
export const HelpQuestionIcon = ({ size = 20, color = '#787878', strokeWidth = 1.6 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M9.5 9.5C9.7 8.3 10.7 7.5 12 7.5C13.4 7.5 14.5 8.5 14.5 9.8C14.5 11.2 13.2 11.8 12.3 12.5C12 12.7 12 13.2 12 13.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="16.5" r="0.75" fill={color} />
  </Svg>
);
