import React from 'react';
import { View, Image } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

/* ────────────────────────────────────────────────────────────
 * TIER GEMS (match Figma: apex art differs from side milestone art)
 *   emerging       apex: green emerald cut          side: PNG
 *   established    apex: tall orange hexagon        side: PNG
 *   senior         apex: blue heart                 side: blue "L" bevel (PNG)
 *   distinguished  apex: purple brilliant diamond   side: tilted purple diamond
 * ──────────────────────────────────────────────────────────── */

/** Senior apex: faceted blue heart */
export const SeniorHeartGem = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 50 50" fill="none">
    <Polygon points="8,22 18,12 24.5,19 31,12 40.5,21 24.5,38" fill="#8CCBEA" />
    <Polygon points="8,22 18,12 24.5,19 15,22" fill="#A6D6EE" />
    <Polygon points="31,12 40.5,21 34,22 24.5,19" fill="#B9DDF0" />
    <Polygon points="8,22 15,22 24.5,31 24.5,38" fill="#6AB5DE" />
    <Polygon points="40.5,21 34,22 24.5,31 24.5,38" fill="#BFE0F1" />
    <Polygon points="15,22 19,16.5 24.5,22.5 30,16.5 34,22 24.5,31" fill="#4AA3D5" />
    <Path
      d="M19 16.5L24.5 22.5L30 16.5"
      stroke="rgba(255,255,255,0.55)"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Official Distinguished Diamond Gem from src/assets/images/distinguished icon.svg
 */
export const DistinguishedDiamondGem = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 2.93 32 32" fill="none">
    <Path d="M1 13.6074L16 30.8552L31 13.6074H1Z" fill="#E5B6FF" />
    <Path d="M10 13.6074L16.0023 30.8552L22.0984 13.6074H10Z" fill="#FFFFFF" />
    <Path d="M11.0007 13.6074L16.0023 30.8552L21.2507 13.6074H11.0007Z" fill="#A676C0" />
    <Path d="M5.50627 7L1 13.6056H31L26.4937 7H5.50627Z" fill="#E5B6FF" />
    <Path d="M22.0984 13.6056L16.0023 7L10.0004 13.6056H22.0984Z" fill="#A676C0" />
    <Path d="M26.4935 7L22.0958 13.6056H30.9997L26.4935 7Z" fill="#A676C0" />
    <Path d="M5.50627 7L9.90391 13.6056H1L5.50627 7Z" fill="#A676C0" />
  </Svg>
);

/** Distinguished side (milestone) gem: tilted purple diamond */
export const DistinguishedSideGem = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 50 50" fill="none">
    <Polygon points="14,17 22,15 37,27 35,35 16,37" fill="#C592EA" />
    <Polygon points="14,17 22,15 21,25 16,37" fill="#D4A6F3" />
    <Polygon points="22,15 37,27 35,28 26,22" fill="#E0B8F8" />
    <Polygon points="21,25 26,22 35,28 35,35 16,37" fill="#A872CC" />
    <Polygon points="35,28 37,27 35,35" fill="#D9A8F5" />
    <Path
      d="M22 15L21 25L16 37M21 25L35 28"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * TierGemIcon
 * isApex = true  -> centre gem art
 * isApex = false -> small side milestone gem art
 */
export const TierGemIcon = ({ tier = 'key account', size = 32, isApex = false, style }) => {
  const normTier = String(tier || 'flagship').toLowerCase();
  const box = [
    { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
    style,
  ];

  if (normTier === 'flagship' || normTier === 'distinguished') {
    return (
      <View style={box}>
        {isApex ? (
          <DistinguishedDiamondGem size={size} />
        ) : (
          <DistinguishedSideGem size={size} />
        )}
      </View>
    );
  }

  if ((normTier === 'key account' || normTier === 'senior') && isApex) {
    return (
      <View style={box}>
        <SeniorHeartGem size={size} />
      </View>
    );
  }

  const getImageSource = () => {
    switch (normTier) {
      case 'general trade':
      case 'general':
      case 'emerging':
        return require('../images/Emerging icon.png');
      case 'established':
        return require('../images/Established icon.png');
      case 'key account':
      case 'senior':
      default:
        return require('../images/Diamond heart icon.png');
    }
  };

  return (
    <View style={box}>
      <Image
        source={getImageSource()}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

/**
 * Official Bank Icon from src/assets/images/Bank icon.svg
 */
export const BankOfficialIcon = ({ size = 24, color = '#020202' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12.125 5.75H12M12.25 5.75C12.25 5.88807 12.1381 6 12 6C11.8619 6 11.75 5.88807 11.75 5.75C11.75 5.61193 11.8619 5.5 12 5.5C12.1381 5.5 12.25 5.61193 12.25 5.75Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 9V19M9 9V19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 9V19M19 9V19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21.3518 9H2.64822C2.29022 9 2 8.70651 2 8.34447C2 8.12259 2.11099 7.91577 2.29495 7.79485L8.73007 3.56485C10.3171 2.52162 11.1107 2 12 2C12.8893 2 13.6829 2.52162 15.2699 3.56485L21.7051 7.79485C21.889 7.91577 22 8.12259 22 8.34447C22 8.70651 21.7098 9 21.3518 9Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21.0397 20.2929L20.3519 19.5858C20.0707 19.2968 19.9301 19.1522 19.7514 19.0761C19.5726 19 19.3738 19 18.9762 19H5.02382C4.62621 19 4.4274 19 4.24863 19.0761C4.06987 19.1522 3.92929 19.2968 3.64814 19.5858L2.9603 20.2929C2.25356 21.0194 1.9002 21.3827 2.02456 21.6913C2.14893 22 2.64867 22 3.64814 22H20.3519C21.3513 22 21.8511 22 21.9754 21.6913C22.0998 21.3827 21.7464 21.0194 21.0397 20.2929Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Official Money Coin Icon from src/assets/images/money icon.svg
 */
export const MoneyOfficialIcon = ({ size = 24, color = '#020202' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 6V18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Official Tilted Credit Card Vector
 */
export const CreditCardOfficialIcon = ({ size = 22, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.5 7.5L16.5 4.5C17.6 4.2 18.7 4.9 19 6L21 14C21.3 15.1 20.6 16.2 19.5 16.5L7.5 19.5C6.4 19.8 5.3 19.1 5 18L3 10C2.7 8.9 3.4 7.8 4.5 7.5Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M7 11.5L19 8.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M6 15.5L8 15" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M3 21H21" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

/**
 * Official 3D Points Dual Cyan Coins Graphic from src/assets/images/Points image.svg
 */
export const PointsOfficialGraphic = ({ width = 127, height = 93 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 127 93" fill="none">
      <Defs>
        <LinearGradient id="ptsP0" x1="64.23" y1="42.78" x2="110.19" y2="60.51" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D2FBFF" />
          <Stop offset="1" stopColor="#A8E8EE" />
        </LinearGradient>
        <LinearGradient id="ptsP1" x1="74.25" y1="39.58" x2="104.33" y2="60.69" gradientUnits="userSpaceOnUse">
          <Stop offset="0.26" stopColor="#54C1CB" />
          <Stop offset="1" stopColor="#7ED5DD" />
        </LinearGradient>
        <LinearGradient id="ptsP2" x1="75.77" y1="41.08" x2="104.14" y2="60.77" gradientUnits="userSpaceOnUse">
          <Stop offset="0.26" stopColor="#93DEE5" />
          <Stop offset="1" stopColor="#7ED5DD" />
        </LinearGradient>
        <LinearGradient id="ptsP3" x1="94.07" y1="34.33" x2="82.19" y2="62.04" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#93DEE5" />
          <Stop offset="0.80" stopColor="#2AAEBA" />
        </LinearGradient>
        <LinearGradient id="ptsP4" x1="74.61" y1="44.44" x2="115.04" y2="53.47" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D2FBFF" />
          <Stop offset="1" stopColor="#A8E8EE" />
        </LinearGradient>
        <LinearGradient id="ptsP5" x1="0" y1="44.47" x2="75.45" y2="44.47" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D2FBFF" />
          <Stop offset="1" stopColor="#A8E8EE" />
        </LinearGradient>
        <LinearGradient id="ptsP6" x1="12.56" y1="34.37" x2="67.18" y2="47.95" gradientUnits="userSpaceOnUse">
          <Stop offset="0.26" stopColor="#54C1CB" />
          <Stop offset="1" stopColor="#7ED5DD" />
        </LinearGradient>
        <LinearGradient id="ptsP7" x1="15.56" y1="35.67" x2="66.95" y2="48.18" gradientUnits="userSpaceOnUse">
          <Stop offset="0.26" stopColor="#93DEE5" />
          <Stop offset="1" stopColor="#7ED5DD" />
        </LinearGradient>
        <LinearGradient id="ptsP8" x1="37.98" y1="15.95" x2="36.28" y2="62.09" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#93DEE5" />
          <Stop offset="0.80" stopColor="#2AAEBA" />
        </LinearGradient>
        <LinearGradient id="ptsP9" x1="35.37" y1="25.90" x2="51.07" y2="43.33" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D2FBFF" />
          <Stop offset="1" stopColor="#A8E8EE" />
        </LinearGradient>
      </Defs>

      {/* Back Coin Silhouette & Fills */}
      <Path
        d="M116.316 45.0175C121.371 60.6041 112.634 74.895 99.0775 81.1143C92.9265 83.9365 85.7055 84.7185 79.0543 82.1519C76.518 81.1738 74.1248 79.7226 72.0276 77.8675C69.8711 75.9621 68.4548 75.2279 66.7423 72.8851C65.0023 70.5026 62.9949 66.8851 62.3983 63.9143C62.0543 62.2035 61.8855 60.4645 61.8903 58.7361C61.8993 55.2944 62.5962 51.9264 63.7896 48.8097C66.2861 42.2871 70.8472 36.8307 76.2516 32.9118C78.1647 31.5243 80.2052 30.321 82.345 29.3389C90.5079 25.5912 97.9447 23.8683 104.773 28.5036C109.281 31.5638 114.305 38.8203 116.316 45.0175Z"
        fill="#93DEE5"
      />
      <Path
        d="M112.437 53.522C108.87 69.9438 95.0148 79.0535 81.265 78.6805C67.5152 78.3074 58.0523 67.1592 61.6192 50.7359C65.1841 34.3135 79.4084 23.7816 93.1587 24.1532C106.909 24.5262 116.002 37.0982 112.437 53.522Z"
        fill="url(#ptsP0)"
      />
      <Path
        d="M80.7816 70.7855C74.7285 70.6005 69.7151 68.0431 67.016 63.7674C64.7917 60.2423 64.2483 55.8387 65.4029 50.681C68.4775 36.9488 81.0594 29.7315 91.3356 29.9123L91.6156 29.9177C97.1951 30.0893 101.956 32.6709 104.69 37.0028C107.18 40.9482 107.841 45.9612 106.602 51.5018C103.579 65.0112 91.2726 70.9722 81.1206 70.7932L80.7816 70.7855Z"
        fill="url(#ptsP1)"
      />
      <Path
        d="M81.6302 70.8587C75.9322 70.7028 71.2363 68.2849 68.7447 64.2209C66.745 60.9603 66.2656 56.843 67.3211 51.9822C70.2205 38.6287 82.1817 31.5669 91.9634 31.7041L92.2435 31.7095C97.4567 31.8511 101.896 34.2965 104.425 38.4195C106.698 42.1275 107.294 46.8694 106.152 52.1378C103.316 65.1977 91.6282 71.0006 81.9685 70.8661L81.6318 70.859Z"
        fill="url(#ptsP2)"
      />
      {/* Back Star Sparkle */}
      <Path
        d="M90.9652 39.9466C91.6839 39.3621 93.8245 40.2043 93.5909 42.2143L91.9897 49.5849C91.9398 49.8587 92.0185 50.135 92.2053 50.3413L96.331 54.8696C97.3256 55.7212 96.6711 57.0937 95.7522 56.976L88.0975 55.9958C87.8086 55.9588 87.5123 56.0433 87.2864 56.227L82.1535 60.4921C81.8749 60.7236 81.566 60.9411 81.2038 60.994C80.0033 61.1693 78.7935 60.2685 78.586 59.523C78.5274 59.3123 78.6058 59.0917 78.6877 58.8831L80.8695 53.3215C80.9513 53.1129 81.0191 52.8976 81.1331 52.702C81.3047 52.4074 81.5525 52.0463 81.4194 51.8994L76.4697 46.4329C75.8756 45.7767 75.8536 45.0997 76.7724 45.2173L84.4272 46.1975C84.716 46.2345 85.0123 46.1501 85.2383 45.9663L90.9652 39.9466Z"
        fill="url(#ptsP3)"
      />

      {/* Front Coin Silhouette & Fills */}
      <Path
        d="M75.6675 18.9569C91.4802 38.4442 86.8698 63.6806 70.9251 80.0381C63.6907 87.4607 53.8028 92.5573 42.884 92.5549C38.7207 92.5549 34.5012 91.7999 30.482 90.3046C26.3505 88.7703 23.9219 88.5015 20.1837 86.0974C16.3845 83.6517 11.5224 79.5885 9.03276 75.672C7.59858 73.4169 6.39894 71.025 5.4534 68.5524C3.56966 63.6292 2.70964 58.4325 2.69742 53.3212C2.67054 42.6246 6.18149 32.3141 11.7448 23.7359C13.714 20.6989 15.9667 17.855 18.4832 15.2725C28.0828 5.41885 37.7605 -1.14127 50.072 1.71978C58.2007 3.60841 69.3786 11.2094 75.6675 18.9569Z"
        fill="#93DEE5"
      />
      <Path
        d="M74.8048 33.2485C78.758 58.6803 63.9788 79.333 44.1249 86.3769C24.2711 93.4208 4.60538 82.7047 0.652199 57.2705C-3.30342 31.8387 11.2193 8.95038 31.0731 1.90405C50.9269 -5.13983 70.8492 7.81427 74.8048 33.2485Z"
        fill="url(#ptsP5)"
      />
      <Path
        d="M39.0902 75.3604C30.3385 78.4316 21.7651 77.5398 15.5519 72.9172C10.4309 69.1057 7.2278 63.1124 6.03549 55.1059C2.86171 33.7885 16.864 16.5417 31.6481 11.1372L32.0512 10.9906C40.1188 8.16131 48.3452 9.22657 54.639 13.9103C60.3709 18.1762 64.0773 24.9757 65.36 33.576C68.4849 54.5464 54.1846 69.846 39.5788 75.1845L39.0902 75.3604Z"
        fill="url(#ptsP6)"
      />
      <Path
        d="M40.3419 74.9971C32.1135 77.9143 24.0708 77.0468 18.2708 72.6125C13.6164 69.0551 10.6625 63.4357 9.49221 55.908C6.2769 35.2284 19.4778 18.5459 33.5313 13.3515L33.9345 13.2049C41.4621 10.5344 49.1535 11.5826 55.0392 16.0806C60.3313 20.1266 63.7958 26.5744 65.0663 34.7324C68.2108 54.9576 54.707 69.6904 40.8293 74.8212L40.3443 74.9967Z"
        fill="url(#ptsP7)"
      />
      {/* Front 4-point Star Emblem */}
      <Path
        d="M36.6406 25.6816C37.3455 24.4503 40.8686 24.4742 41.6424 27.4753L43.4159 38.8901C43.4954 39.3088 43.7602 39.6602 44.1408 39.8521L52.5318 44.0495C54.4223 44.7184 54.2433 47.0403 52.8654 47.3785L41.3868 50.196C40.9536 50.3023 40.5768 50.5863 40.3551 50.9734L35.229 60.1502C35.0524 60.4664 34.8399 60.7723 34.5388 60.9813C32.8299 62.1676 30.2483 61.4134 29.6434 60.3311C29.5366 60.14 29.5291 59.9105 29.5304 59.6864L29.5854 50.1785C29.5867 49.9544 29.5661 49.7302 29.5938 49.506C29.6591 48.976 29.8903 48.1754 29.5866 48.0223L19.5011 42.9383C18.2905 42.3281 17.886 41.3727 19.2639 41.0345L30.7425 38.217C31.1757 38.1107 31.5525 37.8267 31.7742 37.4396L36.6406 25.6816Z"
        fill="url(#ptsP8)"
      />
    </Svg>
  );
};

/**
 * Official 3D Invite & Earn Illustration from src/assets/images/Invite & Earn.svg
 */
export const InviteAndEarnGraphic = ({ width = 140, height = 128 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 162 148" fill="none">
      <Defs>
        <LinearGradient id="ieGrad0" x1="89.3" y1="147.5" x2="133.7" y2="45.1" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#A5F3FC" />
          <Stop offset="1" stopColor="#38BDF8" />
        </LinearGradient>
        <LinearGradient id="ieGrad1" x1="24.8" y1="100.8" x2="178.2" y2="84.7" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#0284C7" />
          <Stop offset="1" stopColor="#0369A1" />
        </LinearGradient>
      </Defs>

      <Path
        d="M89.306 147.479L178.237 84.747C180.202 83.2752 180.082 81.0268 177.949 79.3874L133.74 45.1235C131.165 43.1429 126.661 42.7845 123.928 44.3439L24.8211 100.871C22.3122 102.303 22.2275 104.833 24.6297 106.633L79.0146 147.102C81.8278 149.209 86.7531 149.39 89.306 147.479Z"
        fill="url(#ieGrad0)"
      />
      <Path
        d="M89.036 141.114L177.967 78.3818C179.932 76.9099 179.812 74.6615 177.679 73.0222L133.47 38.7583C130.895 36.7776 126.391 36.4193 123.658 37.9787L24.5511 94.506C22.0422 95.9375 21.9574 98.4681 24.3597 100.268L78.7446 140.736C81.5577 142.844 86.4831 143.025 89.036 141.114Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <Path
        d="M88.7699 134.749L177.701 72.0166C179.666 70.5447 179.546 68.2963 177.413 66.6569L133.204 32.3931C130.628 30.4124 126.125 30.054 123.392 31.6135L24.285 88.1407C21.7761 89.5723 21.6913 92.1029 24.0936 93.9023L78.4785 134.371C81.2916 136.479 86.217 136.66 88.7699 134.749Z"
        fill="url(#ieGrad1)"
        opacity="0.85"
      />
    </Svg>
  );
};

/**
 * 3D Stylized Gift Box SVG for Offers & Discounts Section
 */
export const GiftBoxIcon = ({ size = 44, color = '#38BDF8' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="boxFront" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#7DD3FC" />
          <Stop offset="100%" stopColor="#38BDF8" />
        </LinearGradient>
        <LinearGradient id="boxSide" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#BAE6FD" />
          <Stop offset="100%" stopColor="#7DD3FC" />
        </LinearGradient>
        <LinearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#E0F2FE" />
        </LinearGradient>
      </Defs>

      <Rect x="8" y="20" width="32" height="22" rx="4" fill="url(#boxFront)" />
      <Rect x="6" y="14" width="36" height="8" rx="3" fill="url(#boxSide)" />
      <Rect x="21" y="14" width="6" height="28" fill="url(#ribbonGrad)" />
      <Rect x="6" y="17" width="36" height="3" fill="url(#ribbonGrad)" opacity="0.6" />
      <Path
        d="M 18 14 C 14 8, 20 6, 24 13 C 28 6, 34 8, 30 14"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="24" cy="14" r="2.5" fill="#FFFFFF" />
    </Svg>
  );
};

/**
 * Points Star In Circle Icon
 */
export const PointsStarIcon = ({ size = 20, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 6.5L13.6 10.2L17.5 10.6L14.5 13.2L15.4 17.1L12 15.1L8.6 17.1L9.5 13.2L6.5 10.6L10.4 10.2L12 6.5Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Earnings Dollar In Circle Icon (re-uses MoneyOfficialIcon)
 */
export const EarningsDollarIcon = ({ size = 20, color = '#1E293B' }) => (
  <MoneyOfficialIcon size={size} color={color} />
);

/**
 * Official Withdraw Icon from src/assets/images/withdraw Icon.svg
 */
export const WithdrawIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.9349 13.9453L18.2646 10.2968C17.9751 8.72096 17.8303 7.93303 17.257 7.46651C16.6837 7 15.8602 7 14.2132 7H9.78685C8.1398 7 7.31628 7 6.74298 7.46651C6.16968 7.93303 6.02492 8.72096 5.73538 10.2968L5.06506 13.9453C4.46408 17.2162 4.16359 18.8517 5.08889 19.9259C6.01419 21 7.72355 21 11.1423 21H12.8577C16.2765 21 17.9858 21 18.9111 19.9259C19.8364 18.8517 19.5359 17.2162 18.9349 13.9453Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 10.5V17M9.5 15L12 17.5L14.5 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 11C21.1568 10.9209 21.2931 10.8212 21.4142 10.6955C22 10.0875 22 9.10893 22 7.15176C22 5.1946 22 4.21602 21.4142 3.60801C20.8284 3 19.8856 3 18 3H6C4.11438 3 3.17157 3 2.58579 3.60801C2 4.21602 2 5.1946 2 7.15176C2 9.10893 2 10.0875 2.58579 10.6955C2.70688 10.8212 2.84322 10.9209 3 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Refer & Earn User-Plus Icon
 */
export const ReferEarnUserPlusIcon = ({ size = 18, color = '#020202' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="7" r="3.8" stroke={color} strokeWidth="1.6" />
    <Path
      d="M3.5 18.5C3.5 15 6.5 13 10 13C12.2 13 14.2 13.8 15.3 15"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path d="M19 15V21M16 18H22" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

/**
 * Score Circle Chevron Button Icon
 */
export const ScoreChevronRightIcon = ({ size = 13, color = '#9E9E9E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.5 7.5L14 12L9.5 16.5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);