import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { scale } from '../../theme/responsive.js';

/**
 * Logout / Exit Door Icon matching Figma screenshots
 * (Door frame on left, exit arrow pointing right)
 */
export const LogoutIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    {/* Door frame on the left with rounded corners */}
    <Path
      d="M13 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20H13"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Exit arrow pointing to the right */}
    <Path
      d="M11 12H21"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 8L21 12L17 16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Research Preferences - 3-tier Sliders / Adjustments Icon matching Figma
 */
export const SlidersIconSvg = ({ size = 20, color = '#009BA9' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    {/* Top slider: line + knob on right */}
    <Path d="M3 6H13M17 6H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="15" cy="6" r="2" stroke={color} strokeWidth="1.8" />

    {/* Middle slider: line + knob on left */}
    <Path d="M3 12H7M11 12H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="9" cy="12" r="2" stroke={color} strokeWidth="1.8" />

    {/* Bottom slider: line + knob on right */}
    <Path d="M3 18H15M19 18H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="17" cy="18" r="2" stroke={color} strokeWidth="1.8" />
  </Svg>
);

/**
 * Privacy & Data Sharing - Bidirectional Transfer Arrows matching Figma
 * (Top arrow pointing left, bottom arrow pointing right)
 */
export const TransferArrowsIconSvg = ({ size = 20, color = '#8B5CF6' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    {/* Top arrow pointing LEFT */}
    <Path
      d="M8 5L4 9L8 13"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 9H20"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Bottom arrow pointing RIGHT */}
    <Path
      d="M16 11L20 15L16 19"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 15H4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Clinics - Hospital Icon
 */
export const HospitalIconSvg = ({ size = 20, color = '#009BA9' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 22H22"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 2H7C4 2 3 3.79 3 6V22H21V6C21 3.79 20 2 17 2Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.06 15H9.93C9.42 15 8.99 15.42 8.99 15.94V22H14.99V15.94C15 15.42 14.58 15 14.06 15Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 6V11"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 8.5H14.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Institution / Building Icon
 */
export const InstitutionIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7.5L15.3992 4.24542C13.7542 3.08181 12.9318 2.5 12 2.5C11.0682 2.5 10.2458 3.08181 8.60083 4.24542L4 7.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 6.5V21.5H6V6.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9.5" r="2" stroke={color} strokeWidth="1.6" />
    <Path
      d="M19.79 12.39L18 11.5V21.5C19.89 21.5 20.83 21.5 21.41 20.91C22 20.33 22 19.39 22 17.5V15.97C22 14.77 22 14.17 21.7 13.68C21.4 13.2 20.86 12.93 19.79 12.39Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.21 12.39L6 11.5V21.5C4.11 21.5 3.17 21.5 2.59 20.91C2 20.33 2 19.39 2 17.5V15.97C2 14.77 2 14.17 2.3 13.68C2.6 13.2 3.14 12.93 4.21 12.39Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 21.5V17.5C10 16.4 10.9 15.5 12 15.5C13.1 15.5 14 16.4 14 17.5V21.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Chevron Right
 */
export const ChevronRightSvg = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Search Icon
 */
export const SearchIconSvg = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
    <Path
      d="M20 20L16 16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Close X Icon
 */
export const CloseIconSvg = ({ size = 20, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─────────────────────────────────────────────────────────────
// Therapeutic Area Vector Icons
// ─────────────────────────────────────────────────────────────

/**
 * Neurology - Exact vector from src/assets/images/Neurology icon.svg
 */
export const BrainIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 22 20" fill="none">
    <Path
      d="M15.748 4.87652C16.0682 4.79393 16.404 4.75 16.75 4.75C18.9591 4.75 20.75 6.54086 20.75 8.75C20.75 10.9591 18.9591 12.75 16.75 12.75C16.3951 12.75 16.0509 12.7038 15.7233 12.617M15.748 4.87652C15.7493 4.83451 15.75 4.79233 15.75 4.75C15.75 2.54086 13.9591 0.75 11.75 0.75C9.8324 0.75 8.22994 2.09939 7.84041 3.90043M15.748 4.87652C15.7269 5.55763 15.5354 6.19584 15.2149 6.75M15.7233 12.617C15.7409 12.4972 15.75 12.3747 15.75 12.25C15.75 11.0405 14.8911 10.0316 13.75 9.8M15.7233 12.617C15.5457 13.8237 14.506 14.75 13.25 14.75H12.75C10.5409 14.75 8.75 16.5409 8.75 18.75M10.2149 5.75C9.6998 4.85965 8.8515 4.18625 7.84041 3.90043C7.49377 3.80243 7.12801 3.75 6.75 3.75C4.54086 3.75 2.75 5.54086 2.75 7.75C2.75 8.1386 2.80542 8.5143 2.90878 8.8695C2.99921 9.1803 3.12632 9.4755 3.28513 9.75M2.90878 8.8695C1.6614 9.2332 0.75 10.3852 0.75 11.75C0.75 13.4069 2.09315 14.75 3.75 14.75C5.05622 14.75 6.16746 13.9152 6.57929 12.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Cardiology - Heart with Pulse / ECG Line
 */
export const HeartEcgIconSvg = ({ size = 20, color = '#009BA9' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.5 11H7L8.5 7.5L11.5 15L13 11H16.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Infectious Disease - Microbe / Cell with Dots
 */
export const MicrobeIconSvg = ({ size = 20, color = '#009BA9' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="7.5" stroke={color} strokeWidth="1.6" />
    <Circle cx="12" cy="12" r="2" fill={color} />
    <Circle cx="9.5" cy="8.5" r="1.3" fill={color} />
    <Circle cx="15" cy="9.5" r="1.3" fill={color} />
    <Circle cx="10" cy="15" r="1.3" fill={color} />
    <Circle cx="14.5" cy="14.5" r="1.3" fill={color} />
    <Path
      d="M12 4.5V2M12 22V19.5M4.5 12H2M22 12H19.5M6.7 6.7L4.9 4.9M19.1 19.1L17.3 17.3M6.7 17.3L4.9 19.1M19.1 4.9L17.3 6.7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Diabetes - Exact vector from src/assets/images/Diabetes icon.svg
 */
export const DropletSparkIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5.5 15.5C3.28795 14.6166 2 12.4328 2 10.1746C2 7.24571 4.31698 4.35135 5.94326 2.68056C6.82649 1.77315 8.17351 1.77315 9.05674 2.68056C9.54874 3.18602 9.96485 3.80348 10.5 4.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M8 14.9263C8 11.3698 10.9489 7.85521 13.0187 5.82639C14.1428 4.72454 15.8572 4.72454 16.9813 5.82639C19.0511 7.85521 22 11.3698 22 14.9263C22 18.4134 19.3492 22 15 22C10.6508 22 8 18.4134 8 14.9263Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.5 15.5C18.5 17.7091 17 18.5 15.5 18.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Pain Management - Exact vector from src/assets/images/Pain icon.svg
 */
export const JointPainIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5.00195 2C7.69328 2.31359 13.8995 3.89572 16.6429 7.74552C16.9786 8.21643 17.332 8.54976 17.9114 8.69637C18.6362 8.87638 19.236 9.36245 19.4538 10.0961C19.6857 10.8944 20.1139 11.7364 19.9779 12.5901C19.9258 12.9169 19.7658 13.218 19.4458 13.82L15.0989 22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.00195 12C5.00195 13.7264 8.16634 14.5959 12.0019 13.7264C11.4157 14.0677 10.4147 14.6835 9.31724 15.9511C8.75826 16.5968 8.51971 17.4954 8.48079 18.4026C8.42877 19.615 8.24891 20.9338 7.62695 22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.00195 7C5.00195 7 6.96092 7.28919 8.50195 8.5C9.50195 9.28571 11.4186 9.80952 12.0019 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.3804 3.50391C17.3804 3.50391 17.4453 2.11667 17.2471 1.0004"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 6.64062C20 6.64062 21.3694 6.39317 22.5477 6.57627"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 4.77734C19 4.77734 20.3983 3.44252 21.6781 2.56701"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Respiratory - Exact vector from src/assets/images/Respiratory icon.svg
 */
export const LungsIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.97769 11C8.38875 11.2063 8.71501 11.5615 8.97397 11.9954M8.97397 11.9954C9.97037 13.665 9.97025 16.5 9.97025 16.5C9.97025 20 8.18605 21 5.98512 21C4.98884 21 2 20.5 2 16C2 9.5 5.48698 5 8.47583 5C10.8669 5 9.97174 10 8.97397 11.9954Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.0216 11C15.6104 11.2063 15.2841 11.5615 15.0251 11.9954M15.0251 11.9954C14.0286 13.665 14.0287 16.5 14.0287 16.5C14.0287 20 15.8132 21 18.0144 21C19.0108 21 22 20.5 22 16C22 9.5 18.5126 5 15.5234 5C13.132 5 14.0301 10 15.0251 11.9954Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 7L12 5.66667M12 5.66667L10 7M12 5.66667V3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Dermatology - Exact vector from src/assets/images/Dermaotlogy icon.svg
 */
export const DermatologyIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 10.8866C2 5.97866 5.97969 2 10.8889 2C15.7981 2 19.7778 5.97866 19.7778 10.8866C19.7778 11.4663 19.7778 11.7562 19.802 11.9187C19.8598 12.3072 20.0411 12.6414 20.2194 12.9873L22 16.4407L20.6006 17.1402C20.195 17.3429 19.9923 17.4443 19.851 17.6314C19.7098 17.8182 19.6701 18.0292 19.5906 18.4506L19.5904 18.4519L19.5826 18.4931L19.5826 18.4933C19.4004 19.4607 19.1993 20.5286 18.6329 21.2024C18.4329 21.4403 18.1853 21.6336 17.9059 21.7699C17.4447 21.9948 16.8777 21.9948 15.7437 21.9948"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.9645 18.5355L6.96447 18.5355M6.96447 18.5355L4 21.5M6.96447 18.5355C7.8693 19.4404 9.1193 20 10.5 20C13.2614 20 15.5 17.7614 15.5 15C15.5 12.2386 13.2614 10 10.5 10C7.7386 10 5.5 12.2386 5.5 15C5.5 16.3807 6.05965 17.6307 6.96447 18.5355Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Gastroenterology - Exact vector from src/assets/images/Gastroenterology Icon.svg
 */
export const StomachIconSvg = ({ size = 20, color = '#020202' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.48456 2C9.72844 3.49019 10.4411 4.57432 12.475 3.87202C16.6773 2.42099 19.9986 6.8491 19.9986 10.8C19.9986 14.7765 17.353 18 14.0895 18H13.0247C10.492 18 8.27592 19.6321 7.45312 22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.0058 2V2.77557C6.0058 6.57844 11.4279 9.38737 9.63736 13.1999C8.92582 14.715 4.89483 17.2931 4 22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 7C14.9576 7.29708 15.7109 8.04937 16 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Getz Pharma Teal Stylized Logo
 */
export const GetzLogoSvg = ({ size = 32 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 36 36" fill="none">
    <Rect width="36" height="36" rx="18" fill="#E6F7F9" />
    <Path
      d="M18 9C13.03 9 9 13.03 9 18C9 22.97 13.03 27 18 27C21.6 27 24.67 24.89 26.06 21.8H18V18.2H27C27 13.03 22.97 9 18 9Z"
      fill="#009BA9"
    />
    <Path
      d="M18 13.5C15.51 13.5 13.5 15.51 13.5 18C13.5 20.49 15.51 22.5 18 22.5C19.8 22.5 21.34 21.45 22.03 19.9H18V18.1H22.5C22.5 15.51 20.49 13.5 18 13.5Z"
      fill="#FFFFFF"
    />
  </Svg>
);

/**
 * Hilton Pharma Red Badge Logo
 */
export const HiltonLogoSvg = ({ size = 32 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 36 36" fill="none">
    <Circle cx="18" cy="18" r="17" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
    <Path
      d="M13 14V22M13 18H17M17 14V22"
      stroke="#1E293B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="22" cy="16" r="1.2" fill="#DC2626" />
    <Path
      d="M20 22V17"
      stroke="#DC2626"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Martin Dow Logo
 */
export const MartinDowLogoSvg = ({ size = 32 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 36 36" fill="none">
    <Circle cx="18" cy="18" r="17" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1" />
    <Circle cx="14" cy="15" r="1.5" fill="#BE123C" />
    <Circle cx="17" cy="13.5" r="1.8" fill="#E11D48" />
    <Circle cx="20.5" cy="14" r="1.5" fill="#F43F5E" />
    <Circle cx="23" cy="16" r="1.3" fill="#FB7185" />
    <Path
      d="M12 21.5C15 22.5 21 22.5 24 21.5"
      stroke="#881337"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

// ─────────────────────────────────────────────────────────────
// Doctor Profile Form Icons
// ─────────────────────────────────────────────────────────────

/**
 * User Silhouette Icon
 */
export const UserOutlineIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 19C5 15.6863 8.13401 13 12 13C15.866 13 19 15.6863 19 19" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Mail Envelope Icon
 */
export const MailOutlineIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth="1.6" />
    <Path d="M3 7L12 13L21 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Phone Receiver Icon
 */
export const PhoneOutlineIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.41 9.51C8.3 9.62 8.24 9.76 8.24 9.92C8.24 10.01 8.26 10.1 8.28 10.19C8.31 10.28 8.35 10.36 8.38 10.43C8.71 11.05 9.16 11.73 9.73 12.46C10.31 13.19 10.95 13.91 11.66 14.62C12.38 15.33 13.1 15.98 13.83 16.56C14.56 17.13 15.24 17.58 15.87 17.91C15.94 17.94 16.02 17.97 16.11 18C16.2 18.03 16.29 18.04 16.39 18.04C16.56 18.04 16.7 17.98 16.82 17.86L17.56 17.12C17.81 16.87 18.05 16.68 18.28 16.55C18.51 16.41 18.74 16.34 18.98 16.34C19.17 16.34 19.37 16.38 19.59 16.48C19.81 16.57 20.04 16.71 20.29 16.89L21.6 18.84C21.85 19.04 21.97 19.29 21.97 18.33Z"
      stroke={color}
      strokeWidth="1.6"
      strokeMiterlimit="10"
    />
  </Svg>
);

/**
 * Calendar Icon
 */
export const CalendarIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="15" rx="3" stroke={color} strokeWidth="1.6" />
    <Path d="M3 11H21" stroke={color} strokeWidth="1.6" />
    <Path d="M8 3V7M16 3V7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Circle cx="8" cy="15" r="1" fill={color} />
    <Circle cx="12" cy="15" r="1" fill={color} />
    <Circle cx="16" cy="15" r="1" fill={color} />
  </Svg>
);

/**
 * Male Symbol ♂ Icon
 */
export const MarsIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="14" r="5" stroke={color} strokeWidth="1.8" />
    <Path d="M19 5L13.5 10.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 5H19V9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Female Symbol ♀ Icon
 */
export const VenusIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="9" r="5" stroke={color} strokeWidth="1.8" />
    <Path d="M12 14V21M9 18H15" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Padlock Icon
 */
export const LockIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="10" width="16" height="11" rx="3" stroke={color} strokeWidth="1.6" />
    <Path d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Circle cx="12" cy="15" r="1.5" fill={color} />
  </Svg>
);

/**
 * Stethoscope Icon
 */
export const StethoscopeIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 4H5C4.45 4 4 4.45 4 5V8.5C4 11.54 6.46 14 9.5 14C12.54 14 15 11.54 15 8.5V5C15 4.45 14.55 4 14 4H12"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M19 16V17C19 19.21 17.21 21 15 21C12.79 21 11 19.21 11 17V14" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="19" cy="14" r="2" stroke={color} strokeWidth="1.6" />
    <Path d="M7 3V5M12 3V5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

/**
 * Qualification / Diploma Badge Icon
 */
export const QualificationIconSvg = ({ size = 18, color = '#787878' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.5 17.84C19.53 17.69 20.26 17.39 20.83 16.83C22 15.66 22 13.77 22 10C22 6.23 22 4.34 20.83 3.17C19.66 2 17.77 2 14 2H10C6.23 2 4.34 2 3.17 3.17C2 4.34 2 6.23 2 10C2 13.77 2 15.66 3.17 16.83C3.98 17.64 5.13 17.89 7 17.97"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path d="M17 7H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="14.5" r="2.5" stroke={color} strokeWidth="1.6" />
    <Path d="M9.5 14.5C9.5 18.57 11.22 20.87 12 22L13.5 19L15.25 20L17 21C16.27 20.29 15.51 18.05 15.51 18.05" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * PointsWarningGraphicSvg - Exact graphic from Figma screenshot media_1793708443323_aff46344.png
 * Warning triangle with orange halo and teal star badge
 */
export const PointsWarningGraphicSvg = ({ size = 96 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 100 100" fill="none">
    {/* Background Teal Star Circle (Top-Left) */}
    <Circle cx="44" cy="40" r="22" stroke="#009BA9" strokeWidth="2.5" fill="none" opacity="0.6" />
    <Path
      d="M44 32V48M36 40H52"
      stroke="#009BA9"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Main Outer Orange Ring */}
    <Circle cx="50" cy="48" r="28" stroke="#F97316" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.85" />

    {/* Center Orange Warning Triangle */}
    <Path
      d="M50 32C51.2 32 52.3 32.7 52.9 33.7L62.4 50.3C63 51.4 63 52.7 62.4 53.8C61.8 54.8 60.7 55.5 59.5 55.5H40.5C39.3 55.5 38.2 54.8 37.6 53.8C37 52.7 37 51.4 37.6 50.3L47.1 33.7C47.7 32.7 48.8 32 50 32Z"
      fill="#F97316"
    />
    {/* Exclamation point inside triangle */}
    <Path
      d="M50 40V46"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle cx="50" cy="50.5" r="1.5" fill="#FFFFFF" />

    {/* Bottom-Right Teal Badge with Four-Point Star */}
    <Circle cx="68" cy="64" r="12" fill="#009BA9" stroke="#FFFFFF" strokeWidth="2" />
    <Path
      d="M68 57L69.3 62.7L75 64L69.3 65.3L68 71L66.7 65.3L61 64L66.7 62.7L68 57Z"
      fill="#FFFFFF"
    />
  </Svg>
);



