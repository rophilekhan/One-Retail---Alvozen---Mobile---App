import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { scale } from '../../theme/responsive.js';

export const BloodGlucoseIcon = ({ color, size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path d="M5 7.37225C13 3.24278 11.5 10.0046 19 7.37228" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M5 9C5 6.19108 5 4.78661 5.67412 3.77772C5.96596 3.34096 6.34096 2.96596 6.77772 2.67412C7.78661 2 9.19108 2 12 2C14.8089 2 16.2134 2 17.2223 2.67412C17.659 2.96596 18.034 3.34096 18.3259 3.77772C19 4.78661 19 6.19108 19 9V11C19 13.8089 19 15.2134 18.3259 16.2223C18.034 16.659 17.659 17.034 17.2223 17.3259C16.2134 18 14.8089 18 12 18C9.19108 18 7.78661 18 6.77772 17.3259C6.34096 17.034 5.96596 16.659 5.67412 16.2223C5 15.2134 5 13.8089 5 11V9Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M12.0142 10L10.5736 11.4876C9.79995 12.3003 9.8133 13.6088 10.587 14.4077C11.3739 15.2066 12.6411 15.1928 13.4148 14.3939C14.2017 13.5812 14.1884 12.2727 13.4148 11.4738L12.0142 10Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M8 22C10.2091 22 12 20.2091 12 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BodyTemperatureIcon = ({ color, size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22C14.7614 22 17 19.7614 17 17C17 15.3644 16.2147 13.9122 15.0005 13V5.00049C15.0005 4.06815 15.0005 3.60198 14.8481 3.23428C14.6451 2.74451 14.256 2.35537 13.7662 2.15239C13.3985 2 12.9323 2 12 2C11.0677 2 10.6015 2 10.2338 2.15239C9.74402 2.35537 9.35488 2.74451 9.1519 3.23428C8.99951 3.60198 8.99951 4.06815 8.99951 5.00049V13C7.78534 13.9122 7 15.3644 7 17C7 19.7614 9.23858 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M12 15C10.8954 15 10 15.8954 10 17C10 18.1046 10.8954 19 12 19C13.1046 19 14 18.1046 14 17C14 15.8954 13.1046 15 12 15ZM12 15V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HeartRateIcon = ({ color, size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C12 21 4 14.364 4 9.5C4 6.462 6.462 4 9.5 4C11.16 4 12 5 12 5C12 5 12.84 4 14.5 4C17.538 4 20 6.462 20 9.5C20 14.364 12 21 12 21Z" stroke={color} strokeWidth="1.5" />
    <Path d="M7 11.5L9 11.5L10.5 8L13.5 15L15 11.5L17 11.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BmiIcon = ({ color, size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path d="M15 5C15 6.65685 13.2418 8.5 12 8.5C10.7582 8.5 9 6.65685 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5Z" stroke={color} strokeWidth="1.5" />
    <Path d="M16.0416 9C17.5646 10.3353 18.5515 12.5969 17.6653 14.7052C17.4743 15.1594 17.0362 15.4539 16.5515 15.4539C16.0586 15.4539 15.2491 15.296 15.0918 15.9374L13.9946 20.4123C13.7658 21.3454 12.9435 22 12.0002 22C11.0568 22 10.2345 21.3454 10.0057 20.4123L8.90845 15.9374C8.75116 15.296 7.94161 15.4539 7.44874 15.4539C6.96402 15.4539 6.52594 15.1594 6.335 14.7052C5.44879 12.5969 6.4357 10.3353 7.95869 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const BloodPressureIcon = ({ color, size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 9 12 2.5 12 2.5C12 2.5 4.5 9 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" stroke={color} strokeWidth="1.5" />
    <Path d="M7 13L9.5 13L11 9L13.5 17L15 13L17 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AllergiesIcon = ({ color, size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 20 20" fill="none">
    <Path d="M8.33333 10.4167C7.8731 9.8611 7.1269 9.8611 6.66667 10.4167C6.20643 10.9723 5.46023 10.9723 5 10.4167" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.2617 15C13.4912 14.4142 13.1501 13.8546 12.4999 13.75C11.8496 13.6454 11.5085 13.0857 11.738 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9.99984 18.3334C14.6022 18.3334 18.3332 14.6024 18.3332 10C18.3332 5.39765 14.6022 1.66669 9.99984 1.66669C5.39746 1.66669 1.6665 5.39765 1.6665 10C1.6665 14.6024 5.39746 18.3334 9.99984 18.3334Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12.5002 8.33333C13.4206 8.33333 14.1668 7.58714 14.1668 6.66667C14.1668 5.74619 13.4206 5 12.5002 5C11.5797 5 10.8335 5.74619 10.8335 6.66667C10.8335 7.58714 11.5797 8.33333 12.5002 8.33333Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7.604 14.1666H7.49984M7.70817 14.1666C7.70817 14.2817 7.6149 14.375 7.49984 14.375C7.38478 14.375 7.2915 14.2817 7.2915 14.1666C7.2915 14.0516 7.38478 13.9583 7.49984 13.9583C7.6149 13.9583 7.70817 14.0516 7.70817 14.1666Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15.9375 10.8333H15.8333M16.0417 10.8333C16.0417 10.9484 15.9484 11.0417 15.8333 11.0417C15.7182 11.0417 15.625 10.9484 15.625 10.8333C15.625 10.7182 15.7182 10.625 15.8333 10.625C15.9484 10.625 16.0417 10.7182 16.0417 10.8333Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6.771 6.66665H6.66683M6.87516 6.66665C6.87516 6.7817 6.78189 6.87498 6.66683 6.87498C6.55177 6.87498 6.4585 6.7817 6.4585 6.66665C6.4585 6.55159 6.55177 6.45831 6.66683 6.45831C6.78189 6.45831 6.87516 6.55159 6.87516 6.66665Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ChevronDown = ({ color, size = 12, strokeWidth = 1.8 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PinIcon = ({ color }) => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none" style={{ marginRight: scale(4) }}>
    <Path d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 8.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ClockIcon = ({ color, size = 16, strokeWidth = 1.0, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 16 16" fill="none" style={style}>
    <Path
      d="M10.6667 8H8V4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.6666 7.99998C14.6666 11.6818 11.6818 14.6666 7.99992 14.6666C4.31802 14.6666 1.33325 11.6818 1.33325 7.99998C1.33325 4.31808 4.31802 1.33331 7.99992 1.33331"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.565 2.78025C12.6811 2.88278 12.7941 2.98901 12.9037 3.09865C13.0133 3.20829 13.1194 3.32133 13.2219 3.43751M10 1.33331C10.3214 1.42835 10.6365 1.55087 10.9423 1.69774M14.2917 5.03636C14.4431 5.34873 14.5693 5.67107 14.6667 5.99998"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CalendarIcon = ({ color, size = 16, strokeWidth = 1.0, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 16 16" fill="none" style={style}>
    <Path
      d="M5.33325 1.33331V3.33331"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.6667 1.33331V3.33331"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.33325 6.05988H13.6666"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 5.66665V11.3333C14 13.3333 13 14.6666 10.6667 14.6666H5.33333C3 14.6666 2 13.3333 2 11.3333V5.66665C2 3.66665 3 2.33331 5.33333 2.33331H10.6667C13 2.33331 14 3.66665 14 5.66665Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.00278 8.33331C8.44448 8.33346 8.80278 8.69158 8.80278 9.13331C8.80264 9.57493 8.4444 9.93316 8.00278 9.93331H7.99653C7.55479 9.93331 7.19667 9.57502 7.19653 9.13331C7.19653 8.69149 7.55471 8.33331 7.99653 8.33331H8.00278Z"
      fill={color}
    />
    <Path
      d="M5.5355 8.33331C5.9772 8.33346 6.3355 8.69158 6.3355 9.13331C6.33536 9.57493 5.97711 9.93316 5.5355 9.93331H5.52925C5.08751 9.93331 4.72939 9.57502 4.72925 9.13331C4.72925 8.69149 5.08742 8.33331 5.52925 8.33331H5.5355Z"
      fill={color}
    />
    <Path
      d="M5.5355 10.7995C5.9772 10.7996 6.3355 11.1578 6.3355 11.5995C6.33536 12.0411 5.97711 12.3993 5.5355 12.3995H5.52925C5.08751 12.3995 4.72939 12.0412 4.72925 11.5995C4.72925 11.1577 5.08742 10.7995 5.52925 10.7995H5.5355Z"
      fill={color}
    />
  </Svg>
);

export const DosageIcon = ({ color, size = 16, strokeWidth = 1.0, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 16 16" fill="none" style={style}>
    <Path
      d="M8.00008 14.6667C8.73648 14.6667 9.33341 14.0697 9.33341 13.3333C9.33341 12.5969 8.73648 12 8.00008 12C7.26368 12 6.66675 12.5969 6.66675 13.3333C6.66675 14.0697 7.26368 14.6667 8.00008 14.6667Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.99992 1.33331C5.97487 1.33331 4.33325 2.97493 4.33325 4.99998C4.33325 6.67838 5.46092 8.09331 6.99992 8.52865L7.99992 9.99998L8.99992 8.52865C10.5389 8.09331 11.6666 6.67838 11.6666 4.99998C11.6666 2.97493 10.025 1.33331 7.99992 1.33331Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 3.33331V4.99998L9 5.66665"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.33333 13.3333H14M6.66667 13.3333H2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RegimenTimelineIcon = DosageIcon;

export const PillIcon = ({ color, size = 14, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M10.5 20.5L3.5 13.5C2.11929 12.1193 2.11929 9.88071 3.5 8.5L8.5 3.5C9.88071 2.11929 12.1193 2.11929 13.5 3.5L20.5 10.5C21.8807 11.8807 21.8807 14.1193 20.5 15.5L15.5 20.5C14.1193 21.8807 11.8807 21.8807 10.5 20.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M8.5 8.5L15.5 15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const EditIcon = ({ color, size = 18, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 20 20" fill="none" style={style}>
    <Path
      d="M11.7294 3.23527C12.3504 2.56246 12.6609 2.22606 12.9908 2.02984C13.7869 1.55636 14.7672 1.54164 15.5766 1.991C15.9121 2.17723 16.2321 2.50416 16.8721 3.15803C17.5122 3.8119 17.8323 4.13883 18.0146 4.4815C18.4545 5.30833 18.4401 6.30972 17.9766 7.12298C17.7845 7.46003 17.4551 7.77721 16.7966 8.41156L8.96014 15.9593C7.71204 17.1615 7.08797 17.7626 6.30802 18.0671C5.52807 18.3718 4.67064 18.3494 2.95577 18.3046L2.72245 18.2985C2.20039 18.2848 1.93936 18.278 1.78763 18.1057C1.63589 17.9336 1.6566 17.6676 1.69804 17.1359L1.72054 16.8471C1.83714 15.3503 1.89544 14.602 2.18773 13.9292C2.48 13.2565 2.98417 12.7103 3.99249 11.6178L11.7294 3.23527Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.668 4.16406L15.8346 8.33073"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.668 18.3359H18.3346"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const AddImageIcon = ({ color = '#0F4761', size = 20, strokeWidth = 1.5, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M11.5085 2.9903C7.02567 2.9903 4.78428 2.9903 3.39164 4.38238C1.99902 5.77447 1.99902 8.015 1.99902 12.4961C1.99902 16.9771 1.99902 19.2176 3.39164 20.6098C4.78428 22.0018 7.02567 22.0018 11.5085 22.0018C15.9912 22.0018 18.2326 22.0018 19.6253 20.6098C21.0179 19.2176 21.0179 16.9771 21.0179 12.4961V11.9958"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M4.99902 20.9898C9.209 16.2385 13.9402 9.93728 20.999 14.6632"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M17.9958 1.99829V5.98473M17.9958 5.98473V10.0064M17.9958 5.98473L22.0014 5.97728M17.9958 5.98473L13.9902 5.99217"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CheckmarkBadgeIcon = ({ size = 48, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 48 48" fill="none" style={style}>
    <Path
      d="M32.8899 38.9235C34.4727 38.9235 36.7297 39.2311 37.9751 37.9961C39.2305 36.7513 38.9215 34.4849 38.9215 32.8919C36.9215 30.8789 39.3617 29.9533 40.7953 28.5197C42.9279 26.3873 43.9941 25.3209 43.9941 23.9961C43.9941 22.6711 42.9279 21.6049 40.7953 19.4724C39.3619 18.0388 38.9215 17.1133 38.9215 15.1002C38.9215 13.5073 39.2305 11.241 37.9753 9.99609C36.7299 8.76103 34.4727 9.06861 32.8899 9.06861C31.0651 9.06861 29.7971 8.47423 28.5177 7.19483C26.3853 5.06233 25.3191 3.99609 23.9941 3.99609C22.6692 3.99609 21.603 5.06227 19.4706 7.19464L19.4704 7.19483C18.1908 8.47449 16.9227 9.06861 15.0983 9.06861C11.5053 9.06861 9.239 8.75965 7.99414 10.015C6.75912 11.2604 9.0667 13.5174 9.0667 15.1002C9.0667 16.9247 8.47254 18.1927 7.19284 19.4724L7.19275 19.4725C5.06035 21.6049 3.99416 22.6711 3.99414 23.9961C3.99418 25.3209 5.06042 26.3873 7.1929 28.5197C8.62646 29.9533 7.0667 30.8789 7.0667 32.8919C7.0667 34.4849 8.75776 36.7513 10.0131 37.9961C11.2585 39.2311 13.5155 38.9235 15.0983 38.9235C17.0411 38.9235 17.9767 39.3035 19.3633 40.6901C20.5439 41.8709 22.1267 43.9961 23.9941 43.9961C25.8615 43.9961 27.4443 41.8709 28.6249 40.6901C30.0115 39.3035 30.9471 38.9235 32.8899 38.9235Z"
      fill="#54C1CB"
    />
    <Path
      d="M29.4802 17.9986C30.0312 17.7116 30.7107 17.9253 30.9978 18.4761C31.2848 19.0271 31.0711 19.7066 30.5203 19.9937C28.3767 21.1101 26.4052 23.4154 24.9275 25.5704C24.2022 26.6281 23.6208 27.6123 23.221 28.3316C23.0214 28.6906 22.8682 28.9825 22.7654 29.1827C22.714 29.2827 22.675 29.3601 22.6497 29.4112C22.6371 29.4366 22.6277 29.4562 22.6218 29.4683L22.6145 29.483C22.4372 29.8524 22.0729 30.0955 21.6638 30.1187C21.2548 30.1419 20.8651 29.9413 20.6472 29.5943C20.1528 28.8073 19.3773 28.1009 18.6741 27.5713C18.3304 27.3125 18.0199 27.1077 17.7981 26.9693C17.6879 26.9006 17.6 26.8492 17.5418 26.8155C17.5126 26.7986 17.4907 26.7864 17.4773 26.7789C17.4711 26.7754 17.4666 26.7729 17.4641 26.7715L17.4627 26.7701C16.9173 26.4734 16.7152 25.7909 17.0115 25.2452C17.308 24.6992 17.9919 24.4974 18.5379 24.794H18.5393L18.5422 24.7955C18.5445 24.7967 18.5477 24.7995 18.551 24.8013C18.5577 24.805 18.5666 24.8099 18.5774 24.816C18.5998 24.8285 18.6309 24.8462 18.6697 24.8687C18.7472 24.9136 18.8562 24.9777 18.989 25.0606C19.2547 25.2264 19.6213 25.4681 20.0276 25.774C20.4504 26.0924 20.9353 26.4975 21.4046 26.9737C21.8202 26.2403 22.3847 25.3012 23.073 24.2974C24.5952 22.0776 26.824 19.3822 29.4802 17.9986Z"
      fill="#FFFFFF"
    />
  </Svg>
);

export const WhatsAppIcon = ({ size = 38, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 38 38" fill="none" style={style}>
    <Path
      d="M0 19C0 29.4934 8.50659 38 19 38C29.4934 38 38 29.4934 38 19C38 8.50659 29.4934 0 19 0C8.50659 0 0 8.50659 0 19Z"
      fill="#25D366"
    />
    <Path
      d="M25.65 12.2313C23.8688 10.45 21.4937 9.5 19 9.5C13.775 9.5 9.5 13.775 9.5 19C9.5 20.6625 9.97501 22.325 10.8063 23.75L9.5 28.5L14.4875 27.1938C15.9125 27.9062 17.4563 28.3813 19 28.3813C24.225 28.3813 28.5 24.1062 28.5 18.8812C28.5 16.3875 27.4313 14.0125 25.65 12.2313ZM19 26.8375C17.575 26.8375 16.15 26.4813 14.9625 25.7688L14.725 25.65L11.7562 26.4812L12.5875 23.6312L12.35 23.275C11.5187 21.9688 11.1625 20.5438 11.1625 19.1188C11.1625 14.8438 14.725 11.2812 19 11.2812C21.1375 11.2812 23.0375 12.1125 24.5813 13.5375C26.125 15.0812 26.8375 16.9813 26.8375 19.1188C26.8375 23.275 23.3938 26.8375 19 26.8375ZM23.275 20.9C23.0375 20.7812 21.85 20.1875 21.6125 20.1875C21.375 20.0688 21.2562 20.0688 21.1375 20.3063C21.0187 20.5438 20.5438 21.0187 20.425 21.2562C20.3063 21.375 20.1875 21.375 19.95 21.375C19.7125 21.2563 19 21.0188 18.05 20.1875C17.3375 19.5938 16.8625 18.7625 16.7438 18.525C16.625 18.2875 16.7438 18.1687 16.8625 18.05C16.9813 17.9312 17.1 17.8125 17.2188 17.6937C17.3375 17.575 17.3375 17.4563 17.4563 17.3375C17.575 17.2188 17.4563 17.1 17.4563 16.9813C17.4563 16.8625 16.9813 15.675 16.7438 15.2C16.625 14.8438 16.3875 14.8438 16.2688 14.8438C16.15 14.8438 16.0312 14.8438 15.7937 14.8438C15.675 14.8438 15.4375 14.8438 15.2 15.0812C14.9625 15.3187 14.3688 15.9125 14.3688 17.1C14.3688 18.2875 15.2 19.3562 15.3187 19.5938C15.4375 19.7125 16.9812 22.2063 19.3562 23.1562C21.375 23.9875 21.7313 23.75 22.2063 23.75C22.6813 23.75 23.6313 23.1562 23.75 22.6813C23.9875 22.0875 23.9875 21.6125 23.8688 21.6125C23.75 21.0188 23.5125 21.0188 23.275 20.9Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#FFFFFF"
    />
  </Svg>
);


export const SaveTemplateIcon = ({ color = '#0F4761', size = 28, strokeWidth = 1.5, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 32 32" fill="none" style={style}>
    <Path
      d="M6.66675 22.5687V17.192C6.66675 13.4874 6.66675 11.6351 7.74069 10.4842C8.81463 9.33333 10.5431 9.33333 14.0001 9.33333C17.457 9.33333 19.1855 9.33333 20.2595 10.4842C21.3334 11.6351 21.3334 13.4874 21.3334 17.192V22.5687C21.3334 24.9198 21.3334 26.0953 20.625 26.5161C19.2531 27.3308 16.6797 24.6124 15.4576 23.7938C14.7488 23.3191 14.3944 23.0817 14.0001 23.0817C13.6057 23.0817 13.2513 23.3191 12.5426 23.7938C11.3205 24.6124 8.7471 27.3308 7.37519 26.5161C6.66675 26.0953 6.66675 24.9198 6.66675 22.5687Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 5.33333H14.2222C19.46 5.33333 22.079 5.33333 23.7061 6.7978C25.3333 8.26226 25.3333 10.6193 25.3333 15.3333V21.3333"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const OneRxIcon = ({ width = 40, height = 44, size, color = '#020202', fill, style, ...props }) => {
  const iconColor = fill || color;
  const w = size ? scale(size) : width;
  const h = size ? scale(size * (44 / 40)) : height;
  return (
    <Svg width={w} height={h} viewBox="0 0 40 44" fill="none" style={style} {...props}>
      <Path
        d="M33.4309 26.7337V26.8006C33.4309 27.3747 33.3957 27.9381 33.3255 28.4945C33.1639 29.7975 32.8162 31.0406 32.3069 32.2028C29.209 32.9106 25.3805 33.3297 21.3307 33.4071C20.8706 33.4177 20.4069 33.4212 19.9398 33.4212C19.4727 33.4212 19.0512 33.4177 18.6121 33.4071C14.5694 33.3332 10.7409 32.9176 7.63943 32.2168C7.13014 31.0512 6.7789 29.7975 6.61733 28.4875C6.54708 27.9346 6.51196 27.3711 6.51196 26.8006V26.7267C2.51135 27.2162 0 28.1142 0 29.713C0 31.5935 3.46321 33.2557 8.73881 34.2382C11.5874 34.77 14.9663 35.1045 18.6121 35.1679C19.0512 35.1785 19.4937 35.182 19.9398 35.182C20.3859 35.182 20.8706 35.1785 21.3307 35.1679C24.9836 35.101 28.3625 34.7594 31.211 34.2242C36.448 33.2416 39.8831 31.5865 39.8831 29.713C39.8831 28.1212 37.3963 27.2232 33.4309 26.7337Z"
        fill={iconColor}
      />
      <Path
        d="M18.6118 25.3482C13.7928 25.232 9.585 24.4784 6.95071 23.3691C5.13832 22.6084 4.07056 21.6787 4.07056 20.6786C4.07056 19.2418 6.2658 18.4635 9.71847 18.0585C9.19512 18.6748 8.72446 19.3404 8.32054 20.0447C8.01145 20.5729 7.741 21.1258 7.50918 21.6963C8.10277 21.9534 8.8755 22.2281 9.87301 22.4852C12.3036 23.1226 15.3664 23.5064 18.6118 23.5874H19.2335L20.7087 23.5945L21.3304 23.5874C24.5548 23.4994 27.593 23.1155 30.0095 22.4852C31.0351 22.2175 31.8254 21.9393 32.4225 21.6717C32.1942 21.1117 31.9273 20.5729 31.6287 20.0553C31.2213 19.3509 30.7541 18.6854 30.2308 18.0691C33.6448 18.4741 35.812 19.2488 35.812 20.6786C35.812 21.6682 34.7653 22.5908 32.9845 23.3479C30.3678 24.4608 26.1599 25.225 21.3304 25.3447C20.8738 25.3588 20.4102 25.3658 19.9395 25.3658C19.4934 25.3658 19.0474 25.3588 18.6118 25.3482Z"
        fill={iconColor}
      />
      <Path
        d="M20.9796 18.8965L20.7091 23.5943C20.3473 23.6 19.5749 23.592 19.2339 23.5873L18.9775 19.0198L18.8054 17.583C18.7703 17.2872 18.707 17.0019 18.6122 16.7272C18.4612 16.2835 18.2399 15.8715 17.9554 15.5088C17.4882 14.9066 16.8595 14.4382 16.1325 14.1635C15.8269 14.0473 15.5002 13.9663 15.1631 13.9276L14.6924 13.8712L7.29883 13.4592V12.1421L13.4455 11.8005L15.1631 11.5963C15.4195 11.5646 15.6653 11.5118 15.9042 11.4378C17.1756 11.0434 18.1872 10.0573 18.6122 8.79661C18.707 8.52193 18.7703 8.23668 18.8054 7.94086L18.9248 6.93017L19.3147 0.0313721H20.6283L21.0041 6.82804L21.1376 7.94086C21.1727 8.2402 21.2395 8.52897 21.3343 8.80718C21.7663 10.0609 22.7709 11.0434 24.0388 11.4378C24.2777 11.5118 24.5271 11.5646 24.78 11.5963L26.5221 11.804L32.6442 12.1421V13.4592L25.2787 13.8677L24.78 13.9276C24.4463 13.9663 24.1196 14.0473 23.8141 14.1635C23.087 14.4347 22.4583 14.9066 21.9911 15.5088C21.7101 15.868 21.4853 16.2765 21.3343 16.7167C21.2254 17.3576 21.113 18.0443 21.0006 18.7275L20.9796 18.8965Z"
        fill={iconColor}
      />
      <Path
        d="M28.9986 36.8122C28.3453 37.4074 27.6323 37.9356 26.8736 38.3899C24.854 39.6013 22.4937 40.2986 19.9718 40.2986C17.4499 40.2986 15.0825 39.6013 13.0629 38.3864C12.3007 37.9321 11.5877 37.4003 10.9344 36.8087C7.86109 37.1644 5.9082 37.8511 5.9082 39.1259C5.9082 41.4185 12.1919 43.2744 19.9402 43.2744C27.6885 43.2744 33.9757 41.4185 33.9757 39.1259C33.9757 37.8546 32.0438 37.1714 28.9986 36.8122Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export const DocumentCopyIcon = ({ color = '#020202', size = 20, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M16 8V6C16 4.89543 15.1046 4 14 4H7C5.89543 4 5 4.89543 5 6V14C5 15.1046 5.89543 16 7 16H8"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="8"
      y="8"
      width="11"
      height="12"
      rx="2.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 11.5H16M11 14.5H14.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PillsMedicineIcon = ({ color = '#020202', size = 16, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 16 16" fill="none" style={style}>
    <Path
      d="M13.4628 8.66599C14.5674 10.5792 13.9119 13.0255 11.9987 14.1301C10.0855 15.2347 7.63918 14.5792 6.53461 12.666M13.4628 8.66599C12.3583 6.75286 9.91192 6.09736 7.99872 7.20193C6.08554 8.30653 5.43004 10.7529 6.53461 12.666M13.4628 8.66599L6.53461 12.666"
      stroke={color}
      strokeWidth="1.3"
    />
    <Path
      d="M4.33333 10.6667C3.53304 10.5787 2.78333 10.1142 2.35005 9.34613C1.62943 8.06873 2.05709 6.43529 3.30523 5.69777L6.6952 3.69468L10.0852 1.69159C11.3333 0.954074 12.9293 1.39175 13.6499 2.66917C14.2289 3.69543 14.0667 4.95146 13.3333 5.78813M6.6952 3.69468L7.66667 5.33333"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const StethoscopeDiagIcon = ({ color = '#020202', size = 16, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 16 16" fill="none" style={style}>
    <Path
      d="M4.33398 2.33333H3.00065C2.63246 2.33333 2.33398 2.63181 2.33398 2.99999V5.33333C2.33398 7.35839 3.9756 8.99999 6.00065 8.99999C8.02572 8.99999 9.66732 7.35839 9.66732 5.33333V2.99999C9.66732 2.63181 9.36885 2.33333 9.00065 2.33333H7.66732"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.3333 10.3333V11.1667C12.3333 12.9156 10.9156 14.3333 9.16667 14.3333C7.41773 14.3333 6 12.9156 6 11.1667V9"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.66602 1.66667V3.00001"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.33398 1.66667V3.00001"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.6667 9.00001C13.6667 9.73641 13.0697 10.3333 12.3333 10.3333C11.5969 10.3333 11 9.73641 11 9.00001C11 8.26361 11.5969 7.66667 12.3333 7.66667C13.0697 7.66667 13.6667 8.26361 13.6667 9.00001Z"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BookmarkOutlineIcon = ({ color = '#FFFFFF', size = 18, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M17.5 20.5L12 16.5L6.5 20.5V5.5C6.5 4.67157 7.17157 4 8 4H16C16.8284 4 17.5 4.67157 17.5 5.5V20.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DocTemplateIcon = ({ color = '#FFFFFF', size = 22, strokeWidth = 1.5, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M14.4999 17.5V7.5H7.50004C5.14304 7.5 3.96454 7.5 3.23231 8.23222C2.50007 8.96445 2.50006 10.1429 2.50004 12.5L2.5 16.5C2.49998 18.857 2.49997 20.0355 3.2322 20.7678C3.96444 21.5 5.14296 21.5 7.5 21.5H10.4999C12.3855 21.5 13.3283 21.5 13.9141 20.9142C14.4999 20.3284 14.4999 19.3856 14.4999 17.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.4998 16.5H16.4998C18.8568 16.5 20.0354 16.5 20.7676 15.7678C21.4998 15.0355 21.4998 13.857 21.4998 11.5V7.5C21.4998 5.14298 21.4998 3.96447 20.7676 3.23223C20.0354 2.5 18.8568 2.5 16.4998 2.5H9.5L9.50014 7.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.5 12.5H9M5.5 16.5H11.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 2.5L14.5 7.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const HospitalClinicIcon = ({ color = '#020202', size = 22, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M2 22H22"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 2H7C4 2 3 3.79 3 6V22H21V6C21 3.79 20 2 17 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.0602 15H9.93022C9.42022 15 8.99023 15.42 8.99023 15.94V22H14.9902V15.94C15.0002 15.42 14.5802 15 14.0602 15Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 6V11"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 8.5H14.5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Search Icon matching src/assets/images/Search Icon.svg exactly
 */
export const SearchIconSvg = ({ color = '#020202', size = 20, style }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 28 28" fill="none" style={style}>
    <Path
      d="M19.8335 19.8333L24.5002 24.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22.1667 12.8333C22.1667 7.67867 17.988 3.5 12.8333 3.5C7.67867 3.5 3.5 7.67867 3.5 12.8333C3.5 17.988 7.67867 22.1667 12.8333 22.1667C17.988 22.1667 22.1667 17.988 22.1667 12.8333Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


