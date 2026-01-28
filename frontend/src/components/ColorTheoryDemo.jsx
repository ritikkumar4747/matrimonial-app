import { useState } from 'react';
import {
  splitComplementary,
  analogous,
  triadic,
  monochromatic,
  hslToString,
  hslToRgb,
  rgbToHex,
  hexToRgb,
  checkWCAG,
  generateAccessiblePalette
} from '../utils/colorTheory';

/**
 * Color Theory Demo Component
 * Demonstrates split-complementary, analogous, triadic, and monochromatic color schemes
 * Includes WCAG accessibility checking
 */
export default function ColorTheoryDemo() {
  const [baseHue, setBaseHue] = useState(220); // Blue
  const [saturation, setSaturation] = useState(80);
  const [lightness, setLightness] = useState(60);
  const [scheme, setScheme] = useState('split');

  // Generate color schemes
  const schemes = {
    split: splitComplementary(baseHue, saturation, lightness, 3),
    analogous: analogous(baseHue, saturation, lightness, 5),
    triadic: triadic(baseHue, saturation, lightness),
    monochromatic: monochromatic(baseHue, saturation, 5)
  };

  const currentColors = schemes[scheme];

  // Convert to hex for display
  const colorSwatches = currentColors.map(hsl => {
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const hex = rgbToHex(rgb);
    return { hsl, rgb, hex };
  });

  // Check accessibility
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{
          background: 'linear-gradient(135deg, var(--c1), var(--c3), var(--c5))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎨 Color Theory Generator
        </h1>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hue: {baseHue}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={baseHue}
                onChange={(e) => setBaseHue(Number(e.target.value))}
                className="w-full"
                style={{
                  accentColor: hslToString({ h: baseHue, s: saturation, l: lightness })
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Saturation: {saturation}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Lightness: {lightness}%
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={lightness}
                onChange={(e) => setLightness(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Scheme Selector */}
          <div className="flex gap-3 flex-wrap">
            {[
              { id: 'split', label: 'Split Complementary', emoji: '🎨' },
              { id: 'analogous', label: 'Analogous', emoji: '🌈' },
              { id: 'triadic', label: 'Triadic', emoji: '🔺' },
              { id: 'monochromatic', label: 'Monochromatic', emoji: '📊' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setScheme(s.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  scheme === s.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorSwatches.map((color, idx) => {
            const wcagWhite = checkWCAG(color.rgb, white, 'normal');
            const wcagBlack = checkWCAG(color.rgb, black, 'normal');

            return (
              <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Color Preview */}
                <div
                  className="h-40 flex items-center justify-center text-4xl font-bold"
                  style={{ backgroundColor: color.hex }}
                >
                  <span style={{ 
                    color: wcagWhite.passes ? '#FFFFFF' : '#000000',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    Color {idx + 1}
                  </span>
                </div>

                {/* Color Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm font-bold text-gray-700">HEX</p>
                    <code className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                      {color.hex}
                    </code>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-bold text-gray-700">RGB</p>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                    </code>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700">HSL</p>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      hsl({Math.round(color.hsl.h)}°, {Math.round(color.hsl.s)}%, {Math.round(color.hsl.l)}%)
                    </code>
                  </div>

                  {/* WCAG Accessibility */}
                  <div className="border-t pt-3">
                    <p className="text-sm font-bold text-gray-700 mb-2">WCAG AA Contrast</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">On White:</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        wcagWhite.passes 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {wcagWhite.level} ({wcagWhite.ratio}:1)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">On Black:</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        wcagBlack.passes 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {wcagBlack.level} ({wcagBlack.ratio}:1)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Accessibility Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">📘 WCAG Contrast Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>AAA:</strong> Contrast ratio ≥ 7:1 (normal text) or ≥ 4.5:1 (large text)</li>
            <li>• <strong>AA:</strong> Contrast ratio ≥ 4.5:1 (normal text) or ≥ 3:1 (large text)</li>
            <li>• <strong>Fail:</strong> Does not meet minimum requirements</li>
          </ul>
        </div>

        {/* Example Usage */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 How to Use in Your App</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import { splitComplementary, hslToString } from './utils/colorTheory';

// Generate colors
const colors = splitComplementary(220, 80, 60, 3);

// Use in JSX
<div style={{ 
  background: \`linear-gradient(135deg, 
    \${hslToString(colors[0])}, 
    \${hslToString(colors[1])}
  )\`
}}>
  Beautiful gradient!
</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
