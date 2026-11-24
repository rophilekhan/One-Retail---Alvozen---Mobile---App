import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { shadows } from '../../theme/shadows.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../global/index.js';

export const WarningTooltip = memo(({
  visible = false,
  text = '',
  arrowSide = 'right',
  offsetTop = -8,
  offsetSide = 28,
  width = 180,
}) => {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  // ── Theme-resolved values ──────────────────────────────────────────────────
  const bubbleBg = colors.surface.tooltip || (isDark ? '#262626' : '#000000');
  const textColor = colors.text.inverse || '#FFFFFF';
  const shadow = isDark ? (shadows.dark?.tooltip || shadows.card) : (shadows.light?.tooltip || shadows.card);

  // ── Dynamic positioning ────────────────────────────────────────────────────
  const bubblePositionStyle = arrowSide === 'left'
    ? { left: scale(offsetSide), top: verticalScale(offsetTop) }
    : { right: scale(offsetSide), top: verticalScale(offsetTop) };

  // ── Arrow (CSS border-trick triangle) ─────────────────────────────────────
  const arrowPositionStyle = arrowSide === 'left'
    ? {
      left: -scale(8),
      borderRightWidth: scale(8),
      borderRightColor: bubbleBg,
      borderLeftWidth: 0,
      borderLeftColor: 'transparent',
    }
    : {
      right: -scale(8),
      borderLeftWidth: scale(8),
      borderLeftColor: bubbleBg,
      borderRightWidth: 0,
      borderRightColor: 'transparent',
    };

  return (
    <View
      style={[
        styles.bubble,
        shadow,
        bubblePositionStyle,
        { backgroundColor: bubbleBg, width: scale(width) },
      ]}
    >
      <AppText
        variant="bodySmall"
        style={[styles.text, { color: textColor }]}
      >
        {text}
      </AppText>

      {/* CSS border-trick triangle arrow */}
      <View style={[styles.arrowBase, arrowPositionStyle]} />
    </View>
  );
});

WarningTooltip.displayName = 'WarningTooltip';

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    zIndex: 100,
  },
  text: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
  },
  arrowBase: {
    position: 'absolute',
    top: '50%',
    marginTop: -scale(6),
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: scale(6),
    borderBottomWidth: scale(6),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});

export default WarningTooltip;
