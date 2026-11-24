import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';

/**
 * Generates a smooth cubic bezier curve string through an array of points
 */
const buildSmoothPath = (points) => {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const cp1x = current.x + (next.x - current.x) * 0.5;
    const cp1y = current.y;
    const cp2x = current.x + (next.x - current.x) * 0.5;
    const cp2y = next.y;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }

  return d;
};

/**
 * RxTrendAreaChart - Smooth Gradient Area & Line Chart
 * Native react-native-svg implementation:
 * - Smooth curved SVG path through 7 daily Rx data points
 * - Vertical LinearGradient fill under curve fading to transparent
 * - Dashed horizontal gridlines
 * - Interactive circles updating hero DMMono-Medium counter
 *
 * @param {Object} props
 * @param {Array<Object>} props.data - Array of { day: string, count: number }
 * @param {number} props.selectedIdx - Currently active day index (0-6)
 * @param {Function} props.onSelectDay - Callback when a day point is tapped
 * @param {string} [props.brandColor] - Custom brand accent color
 */
export const RxTrendAreaChart = ({
  data = [],
  selectedIdx = 4,
  onSelectDay,
  brandColor,
}) => {
  const { colors, isDark } = useTheme();

  const accent = brandColor || (isDark ? '#009BA9' : '#0F4761');
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // Chart coordinate space: 320 width x 90 height
  const SVG_WIDTH = 320;
  const SVG_HEIGHT = 90;
  const PAD_X = 20;
  const PAD_Y_TOP = 14;
  const PAD_Y_BOTTOM = 18;

  const { points, linePath, areaPath } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], linePath: '', areaPath: '' };
    }

    const counts = data.map((d) => d.count);
    const maxVal = Math.max(...counts, 10);
    const minVal = Math.min(...counts, 0);
    const span = Math.max(maxVal - minVal, 1);
    const usableHeight = SVG_HEIGHT - PAD_Y_TOP - PAD_Y_BOTTOM;
    const usableWidth = SVG_WIDTH - PAD_X * 2;
    const stepX = data.length > 1 ? usableWidth / (data.length - 1) : 0;

    const calculatedPoints = data.map((item, idx) => {
      const x = PAD_X + idx * stepX;
      const normalized = (item.count - minVal) / span;
      // Invert y: highest count has smallest y (near top)
      const y = SVG_HEIGHT - PAD_Y_BOTTOM - normalized * usableHeight;
      return { x, y, count: item.count, day: item.day };
    });

    const lPath = buildSmoothPath(calculatedPoints);

    // Close path down to baseline (SVG_HEIGHT - PAD_Y_BOTTOM)
    const first = calculatedPoints[0];
    const last = calculatedPoints[calculatedPoints.length - 1];
    const baselineY = SVG_HEIGHT - PAD_Y_BOTTOM + 8;
    const aPath = `${lPath} L ${last.x.toFixed(1)} ${baselineY} L ${first.x.toFixed(1)} ${baselineY} Z`;

    return { points: calculatedPoints, linePath: lPath, areaPath: aPath };
  }, [data]);

  return (
    <View style={styles.container}>
      {/* SVG Canvas */}
      <View style={styles.chartCanvasWrap}>
        <Svg width="100%" height={verticalScale(100)} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <Defs>
            <SvgLinearGradient id="rxAreaFill" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0%"
                stopColor={accent}
                stopOpacity={isDark ? 0.45 : 0.32}
              />
              <Stop
                offset="60%"
                stopColor={accent}
                stopOpacity={isDark ? 0.15 : 0.08}
              />
              <Stop
                offset="100%"
                stopColor={accent}
                stopOpacity={0}
              />
            </SvgLinearGradient>
          </Defs>

          {/* 3 Dashed Horizontal Gridlines */}
          <Line
            x1={PAD_X}
            y1={PAD_Y_TOP}
            x2={SVG_WIDTH - PAD_X}
            y2={PAD_Y_TOP}
            stroke={gridStroke}
            strokeDasharray="4, 4"
            strokeWidth="1"
          />
          <Line
            x1={PAD_X}
            y1={SVG_HEIGHT / 2}
            x2={SVG_WIDTH - PAD_X}
            y2={SVG_HEIGHT / 2}
            stroke={gridStroke}
            strokeDasharray="4, 4"
            strokeWidth="1"
          />
          <Line
            x1={PAD_X}
            y1={SVG_HEIGHT - PAD_Y_BOTTOM}
            x2={SVG_WIDTH - PAD_X}
            y2={SVG_HEIGHT - PAD_Y_BOTTOM}
            stroke={gridStroke}
            strokeDasharray="4, 4"
            strokeWidth="1"
          />

          {/* Area Fill */}
          {areaPath ? <Path d={areaPath} fill="url(#rxAreaFill)" /> : null}

          {/* Line Stroke */}
          {linePath ? (
            <Path
              d={linePath}
              fill="none"
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isSelected = idx === selectedIdx;
            if (isSelected) {
              return (
                <React.Fragment key={`pt-${idx}`}>
                  {/* Subtle outer halo */}
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8.5"
                    fill={accent}
                    fillOpacity={isDark ? 0.35 : 0.25}
                  />
                  {/* Active disc */}
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill={accent}
                    stroke={isDark ? '#000000' : '#FFFFFF'}
                    strokeWidth="2"
                  />
                </React.Fragment>
              );
            }

            return (
              <Circle
                key={`pt-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill={isDark ? '#FFFFFF' : accent}
                fillOpacity={0.65}
              />
            );
          })}
        </Svg>
      </View>

      {/* Interactive 7-Day Pills Row */}
      <View style={styles.daysRow}>
        {data.map((item, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <TouchableOpacity
              key={item.day}
              onPress={() => onSelectDay && onSelectDay(idx)}
              activeOpacity={0.7}
              style={[
                styles.dayPill,
                isSelected && [
                  styles.dayPillActive,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' },
                ],
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${item.day}: ${item.count} prescriptions`}
            >
              <AppText
                style={[
                  styles.dayLabelText,
                  {
                    color: isSelected
                      ? (isDark ? '#FFFFFF' : '#020202')
                      : (isDark ? '#787878' : '#94A3B8'),
                    fontFamily: isSelected
                      ? fontFamilies.primaryBold
                      : fontFamilies.primaryRegular,
                  },
                ]}
              >
                {item.day}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: verticalScale(6),
  },
  chartCanvasWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    marginTop: verticalScale(4),
  },
  dayPill: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(8),
  },
  dayPillActive: {
    borderRadius: scale(8),
  },
  dayLabelText: {
    fontSize: scaleFont(11.5),
  },
});

export default RxTrendAreaChart;
