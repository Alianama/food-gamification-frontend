/**
 * Warna utama diambil dari logo kamera:
 * Primary Orange : #FF821D
 * Dark Orange    : #F26200
 * Light Orange   : #FF915B
 */

import { Platform } from 'react-native';

// Brand colors — extracted from camera logo
export const Brand = {
  primary:   '#FF821D',  // orange utama
  dark:      '#F26200',  // orange gelap (gradient end)
  light:     '#FF915B',  // orange muda (accent)
  pale:      '#FFF3E8',  // orange sangat muda (background tint)
  gradient:  ['#FF821D', '#F26200'] as [string, string],
  gradientLight: ['#FF915B', '#FF821D'] as [string, string],
};

const tintColorLight = Brand.primary;
const tintColorDark  = Brand.primary;

export const Colors = {
  light: {
    text:                '#11181C',
    background:          '#fff',
    secondaryBackground: '#FF821D',
    tint:                tintColorLight,
    icon:                '#687076',
    tabIconDefault:      '#687076',
    tabIconSelected:     tintColorLight,
  },
  dark: {
    text:                '#11181C',
    background:          '#ffffffff',
    secondaryBackground: '#F26200',
    tint:                tintColorDark,
    icon:                '#687076',
    tabIconDefault:      '#687076',
    tabIconSelected:     tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
