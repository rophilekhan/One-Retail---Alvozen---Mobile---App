import React from 'react';
import { StyleSheet } from 'react-native';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { AppText } from '../global/index.js';
import { useTheme } from '../../theme/index.js';

/**
 * HighlightedText - Exact OneRx Search Substring Highlighting
 * Highlights matched query substrings using colors.brand.accent (#fb6b03).
 *
 * @param {Object} props
 * @param {string} [props.text]
 * @param {string} [props.medicineName]
 * @param {string} [props.name]
 * @param {string} [props.searchQuery]
 * @param {string} [props.highlight]
 * @param {Object} [props.style]
 * @param {string} [props.highlightColor]
 */
export const HighlightedText = ({
  text,
  medicineName,
  name,
  searchQuery = '',
  highlight = '',
  style,
  highlightColor,
}) => {
  const { colors } = useTheme();
  const fullText = text || medicineName || name || '';
  const query = (searchQuery || highlight || '').trim();
  const effectiveHighlight = highlightColor || colors.brand.accent;

  if (!query || !fullText) {
    return <AppText style={style}>{fullText}</AppText>;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = fullText.split(regex);

  return (
    <AppText style={style}>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();
        if (isMatch) {
          return (
            <AppText
              key={index}
              style={[
                style,
                styles.matchedSpan,
                {
                  backgroundColor: effectiveHighlight,
                  color: colors.cta.sliderKnob,
                },
              ]}
            >
              {part}
            </AppText>
          );
        }
        return (
          <AppText key={index} style={style}>
            {part}
          </AppText>
        );
      })}
    </AppText>
  );
};

const styles = StyleSheet.create({
  matchedSpan: {
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    borderRadius: radii.xs,
    overflow: 'hidden',
  },
});

export default HighlightedText;
