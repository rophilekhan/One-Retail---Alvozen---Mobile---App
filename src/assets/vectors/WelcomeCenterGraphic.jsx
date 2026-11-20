import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale } from '../../theme/responsive.js';
import { GlassSurface } from '../../components/core/index.js';

// Main SVG ka viewBox (neeche Svg mein bhi yehi use hota hai)
const VB = { x: 10, y: 120, w: 382, h: 190 };
const R = 22; // badge radius (viewBox units)

const PRESCRIPTION_PATHS = [
  'M44.0959 219.602C41.3806 219.602 40.023 219.602 39.1795 218.759C38.3359 217.915 38.3359 216.557 38.3359 213.842V206.162C38.3359 203.447 38.3359 202.089 39.1795 201.246C40.023 200.402 41.3806 200.402 44.0959 200.402H47.9359C50.6511 200.402 52.0087 200.402 52.8523 201.246C53.6958 202.089 53.6958 203.447 53.6958 206.162V207.89',
  'M42.1758 205.199H49.8557',
  'M42.3672 208.848H45.8232',
  'M51.3755 218.946L55.344 214.977C55.7642 214.557 56.0002 213.987 56.0002 213.393C56.0002 212.155 54.9972 211.152 53.7597 211.152C53.1655 211.152 52.5956 211.388 52.1755 211.809L48.207 215.777C47.7868 216.197 47.5508 216.767 47.5508 217.361C47.5508 218.599 48.5538 219.602 49.7913 219.602C50.3855 219.602 50.9554 219.366 51.3755 218.946Z',
  'M50.1895 213.791L53.358 216.96',
];

const CALENDAR_PATHS = [
  'M348 257.002V261.002M340 257.002V261.002',
  'M345 258.998H343C339.229 258.998 337.343 258.998 336.172 260.17C335 261.341 335 263.227 335 266.998V268.998C335 272.769 335 274.655 336.172 275.826C337.343 276.998 339.229 276.998 343 276.998H345C348.771 276.998 350.657 276.998 351.828 275.826C353 274.655 353 272.769 353 268.998V266.998C353 263.227 353 261.341 351.828 260.17C350.657 258.998 348.771 258.998 345 258.998Z',
  'M335 264.998H353',
  'M343 270.002H348M340 270.002H340.009',
];

/**
 * Floating glass icon badge.
 * Glass look GlassSurface se aata hai (welcome badge wala hi), icon uske andar chhota SVG hai.
 */
const IconBadge = ({ cx, cy, ox, oy, paths, layout, iconColor }) => {
  const { s, offX, offY } = layout;
  const size = R * 2 * s;
  const { isDark } = useTheme();

  return (
    <GlassSurface
      width={size}
      height={size}
      borderRadius={size / 2}
      fillOpacity={0}
      sheenScale={1.5}
      blurAmount={0}
      style={{
        position: 'absolute',
        left: offX + (cx - VB.x - R) * s,
        top: offY + (cy - VB.y - R) * s,
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`${ox - R} ${oy - R} ${R * 2} ${R * 2}`}
        fill="none"
      >
        {paths.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </GlassSurface>
  );
};

/**
 * WelcomeCenterGraphic
 * Extracted directly from Figma nodes 55:12880 (Light) and 75:50483 (Dark).
 * Contains the exact central white orb, black emblem paths, and floating icon badges.
 */
export const WelcomeCenterGraphic = ({ width = scale(360), height = scale(200), style }) => {
  const { isDark } = useTheme();

  const strokeSubtle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const iconColor = isDark ? '#FFFFFF' : '#000000'; // Pure solid black for light mode
  const emblemFill = '#020202';

  // viewBox -> pixel mapping (preserveAspectRatio "meet")
  const s = Math.min(width / VB.w, height / VB.h);
  const layout = {
    s,
    offX: (width - VB.w * s) / 2,
    offY: (height - VB.h * s) / 2,
  };

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Svg
        width={width}
        height={height}
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        fill="none"
      >
        {/* Subtle connecting/ambient lines from Figma */}
        <Path
          d="M24.3822 300C48.4431 270.283 79.4851 247.268 114.5 232.855"
          stroke={strokeSubtle}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M406.345 345.651C390.695 312.638 367.315 283.885 338.189 261.829"
          stroke={strokeSubtle}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Outer subtle glow rings behind central orb */}
        <Circle cx="200" cy="216" r="101" fill="white" fillOpacity={isDark ? 0.04 : 0.08} />
        <Circle cx="200" cy="216" r="90" fill="white" fillOpacity={isDark ? 0.08 : 0.25} />

        {/* Central White Orb */}
        <Circle cx="200" cy="216" r="78" fill="white" />

        {/* Central Emblem - Exact Paths 18, 19, 20, 21 directly from Figma (UNCHANGED) */}
        <G>
          <Path
            d="M233.142 225.812V225.974C233.142 227.365 233.057 228.731 232.887 230.08C232.495 233.239 231.652 236.252 230.418 239.069C222.908 240.785 213.627 241.801 203.81 241.989C202.694 242.015 201.57 242.023 200.438 242.023C199.305 242.023 198.284 242.015 197.219 241.989C187.419 241.81 178.138 240.802 170.62 239.103C169.385 236.278 168.534 233.239 168.142 230.063C167.972 228.723 167.887 227.357 167.887 225.974V225.794C158.188 226.981 152.101 229.158 152.101 233.034C152.101 237.592 160.496 241.622 173.285 244.004C180.19 245.293 188.381 246.104 197.219 246.257C198.284 246.283 199.356 246.291 200.438 246.291C201.519 246.291 202.694 246.283 203.81 246.257C212.665 246.095 220.856 245.267 227.761 243.969C240.456 241.588 248.783 237.575 248.783 233.034C248.783 229.175 242.755 226.998 233.142 225.812Z"
            fill={emblemFill}
          />
          <Path
            d="M197.218 222.451C185.536 222.17 175.336 220.343 168.95 217.654C164.556 215.81 161.968 213.556 161.968 211.131C161.968 207.648 167.289 205.762 175.659 204.78C174.391 206.274 173.25 207.887 172.27 209.595C171.521 210.875 170.865 212.216 170.304 213.599C171.742 214.222 173.616 214.888 176.034 215.511C181.926 217.056 189.351 217.986 197.218 218.183H198.725L202.301 218.2L203.808 218.183C211.625 217.969 218.99 217.039 224.848 215.511C227.334 214.862 229.25 214.188 230.697 213.539C230.144 212.181 229.497 210.875 228.773 209.62C227.785 207.913 226.653 206.299 225.384 204.806C233.66 205.787 238.914 207.665 238.914 211.131C238.914 213.53 236.377 215.767 232.06 217.602C225.716 220.3 215.516 222.152 203.808 222.443C202.701 222.477 201.578 222.494 200.437 222.494C199.355 222.494 198.274 222.477 197.218 222.451Z"
            fill={emblemFill}
          />
          <Path
            d="M202.958 206.812L202.302 218.2C201.425 218.214 199.553 218.194 198.726 218.183L198.104 207.11L197.687 203.627C197.602 202.91 197.449 202.219 197.219 201.553C196.853 200.477 196.316 199.478 195.627 198.599C194.494 197.139 192.97 196.004 191.208 195.338C190.467 195.056 189.675 194.86 188.858 194.766L187.717 194.63L169.793 193.631V190.438L184.694 189.61L188.858 189.115C189.479 189.038 190.075 188.91 190.654 188.731C193.736 187.774 196.189 185.384 197.219 182.328C197.449 181.662 197.602 180.971 197.687 180.253L197.977 177.803L198.922 161.08H202.106L203.017 177.556L203.341 180.253C203.426 180.979 203.588 181.679 203.818 182.354C204.865 185.393 207.3 187.774 210.374 188.731C210.953 188.91 211.557 189.038 212.17 189.115L216.394 189.618L231.235 190.438V193.631L213.38 194.621L212.17 194.766C211.362 194.86 210.57 195.056 209.829 195.338C208.066 195.995 206.542 197.139 205.41 198.599C204.729 199.47 204.184 200.46 203.818 201.527C203.554 203.081 203.281 204.746 203.009 206.402L202.958 206.812Z"
            fill={emblemFill}
          />
          <Path
            d="M222.398 250.238C220.814 251.68 219.086 252.961 217.247 254.062C212.351 256.999 206.629 258.689 200.516 258.689C194.402 258.689 188.663 256.999 183.768 254.054C181.92 252.952 180.191 251.663 178.608 250.229C171.157 251.091 166.423 252.756 166.423 255.846C166.423 261.404 181.656 265.903 200.439 265.903C219.222 265.903 234.463 261.404 234.463 255.846C234.463 252.764 229.78 251.108 222.398 250.238Z"
            fill={emblemFill}
          />
        </G>
      </Svg>

      {/* Floating glass badges (GlassSurface = welcome badge jaisa hi glass) */}
      <IconBadge cx={47} cy={160} ox={47} oy={210} paths={PRESCRIPTION_PATHS} layout={layout} iconColor={iconColor} />
      <IconBadge cx={344} cy={290} ox={344} oy={267} paths={CALENDAR_PATHS} layout={layout} iconColor={iconColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeCenterGraphic;