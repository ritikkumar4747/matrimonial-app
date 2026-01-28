/**
 * Advanced Color Theory Utilities
 * Includes split-complementary generation, luminance calculations, and WCAG contrast checking
 */

/**
 * Modulo function that handles negative numbers correctly
 */
const mod = (n, m) => ((n % m) + m) % m;

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance for WCAG contrast ratio
 * Uses sRGB gamma correction
 */
export function relativeLuminance({ r, g, b }) {
  // Normalize RGB values to 0-1 range and apply gamma correction
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 
      ? v / 12.92 
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  // Standard luminance coefficients (ITU-R BT.709)
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * Returns ratio (1-21) where higher is more contrast
 */
export function contrastRatio(color1, color2) {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG AA standard
 * @param {Object} foreground - RGB color object {r, g, b}
 * @param {Object} background - RGB color object {r, g, b}
 * @param {string} size - 'normal' or 'large' text
 * @returns {Object} - {passes: boolean, ratio: number, level: string}
 */
export function checkWCAG(foreground, background, size = 'normal') {
  const ratio = contrastRatio(foreground, background);
  
  // WCAG 2.1 requirements
  const normalAA = 4.5;
  const normalAAA = 7.0;
  const largeAA = 3.0;
  const largeAAA = 4.5;
  
  const threshold = size === 'large' ? largeAA : normalAA;
  const aaa = size === 'large' ? largeAAA : normalAAA;
  
  let level = 'Fail';
  if (ratio >= aaa) level = 'AAA';
  else if (ratio >= threshold) level = 'AA';
  
  return {
    passes: ratio >= threshold,
    ratio: ratio.toFixed(2),
    level
  };
}

/**
 * Generate split-complementary color scheme
 * @param {number} baseHue - Base hue (0-360)
 * @param {number} sat - Saturation (0-100)
 * @param {number} lit - Lightness (0-100)
 * @param {number} count - Number of colors to generate
 * @param {number} drift - Angle offset from 180° (default: 15)
 * @returns {Array} - Array of {h, s, l} color objects
 */
export function splitComplementary(baseHue, sat, lit, count = 3, drift = 15) {
  // Define angles: Base (0), and two opposites offset by 'drift'
  const angles = [0, 180 - drift, 180 + drift];
  
  return Array.from({ length: count }, (_, i) => ({
    // Use modulo 360 to keep the hue within the circle
    h: mod(baseHue + angles[i % 3], 360),
    s: sat,
    l: lit,
  }));
}

/**
 * Generate analogous color scheme
 * @param {number} baseHue - Base hue (0-360)
 * @param {number} sat - Saturation (0-100)
 * @param {number} lit - Lightness (0-100)
 * @param {number} count - Number of colors
 * @param {number} angle - Angle between colors (default: 30)
 */
export function analogous(baseHue, sat, lit, count = 3, angle = 30) {
  return Array.from({ length: count }, (_, i) => ({
    h: mod(baseHue + (i - Math.floor(count / 2)) * angle, 360),
    s: sat,
    l: lit,
  }));
}

/**
 * Generate triadic color scheme
 * @param {number} baseHue - Base hue (0-360)
 * @param {number} sat - Saturation (0-100)
 * @param {number} lit - Lightness (0-100)
 */
export function triadic(baseHue, sat, lit) {
  return [0, 120, 240].map(offset => ({
    h: mod(baseHue + offset, 360),
    s: sat,
    l: lit,
  }));
}

/**
 * Generate monochromatic color scheme with varying lightness
 * @param {number} baseHue - Base hue (0-360)
 * @param {number} sat - Saturation (0-100)
 * @param {number} count - Number of shades
 */
export function monochromatic(baseHue, sat, count = 5) {
  const minLight = 20;
  const maxLight = 90;
  const step = (maxLight - minLight) / (count - 1);
  
  return Array.from({ length: count }, (_, i) => ({
    h: baseHue,
    s: sat,
    l: minLight + (i * step),
  }));
}

/**
 * Convert HSL color object to CSS string
 */
export function hslToString({ h, s, l }) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

/**
 * Get best text color (black or white) for a background
 * @param {Object} bgColor - RGB color object
 * @returns {string} - '#000000' or '#FFFFFF'
 */
export function getBestTextColor(bgColor) {
  const whiteContrast = contrastRatio(bgColor, { r: 255, g: 255, b: 255 });
  const blackContrast = contrastRatio(bgColor, { r: 0, g: 0, b: 0 });
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

/**
 * Generate accessible color palette from base color
 * Ensures all combinations meet WCAG AA standards
 */
export function generateAccessiblePalette(baseHex) {
  const rgb = hexToRgb(baseHex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  
  const onWhiteCheck = checkWCAG(rgb, white);
  const onBlackCheck = checkWCAG(rgb, black);
  
  return {
    color: baseHex,
    onWhite: {
      passes: onWhiteCheck.passes,
      ratio: onWhiteCheck.ratio,
      level: onWhiteCheck.level,
      recommendation: onWhiteCheck.passes ? 'Safe to use' : 'Adjust lightness'
    },
    onBlack: {
      passes: onBlackCheck.passes,
      ratio: onBlackCheck.ratio,
      level: onBlackCheck.level,
      recommendation: onBlackCheck.passes ? 'Safe to use' : 'Adjust lightness'
    },
    bestTextColor: getBestTextColor(rgb)
  };
}

export default {
  mod,
  hslToRgb,
  hexToRgb,
  rgbToHex,
  relativeLuminance,
  contrastRatio,
  checkWCAG,
  splitComplementary,
  analogous,
  triadic,
  monochromatic,
  hslToString,
  getBestTextColor,
  generateAccessiblePalette
};
