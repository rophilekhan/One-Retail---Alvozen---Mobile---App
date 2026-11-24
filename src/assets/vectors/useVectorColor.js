import { useTheme } from '../../theme/index.js';

/**
 * useVectorColor - Resolves theme-aware color for SVG vectors
 * If explicit color is provided, returns it.
 * Otherwise defaults to #FFFFFF in Dark Mode and colors.brand.primaryDark ('#0F4761') in Light Mode.
 *
 * @param {string} [color]
 * @returns {string}
 */
export const useVectorColor = (color) => {
  const { colors, isDark } = useTheme();
  return color || (isDark ? '#FFFFFF' : (colors?.brand?.primaryDark || '#0F4761'));
};

export default useVectorColor;
