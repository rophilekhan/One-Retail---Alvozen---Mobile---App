import React from 'react';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';
import { useTheme } from '../../theme/index.js';

/**
 * HighlightedText
 * Exact 1:1 port of OneRx HighlightedText with live search text highlighting.
 *
 * @param {Object} props
 * @param {string} [props.text]
 * @param {string} [props.searchQuery]
 * @param {Object} [props.style]
 * @param {string} [props.highlightColor]
 */
export const HighlightedText = ({
  text = '',
  searchQuery = '',
  style,
  highlightColor,
}) => {
  const { colors, isDark } = useTheme();
  const query = (searchQuery || '').trim();
  const effectiveHighlight =
    highlightColor || (isDark ? 'rgba(251, 107, 3, 0.38)' : 'rgba(251, 107, 3, 0.22)');

  if (!query || !text) {
    return <AppText style={style}>{text}</AppText>;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

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
                {
                  backgroundColor: effectiveHighlight,
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  fontFamily: fontFamilies.primaryBold,
                  fontWeight: '700',
                  borderRadius: 2,
                  overflow: 'hidden',
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

export default HighlightedText;
