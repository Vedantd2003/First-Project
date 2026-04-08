import { useState, useEffect, useCallback } from 'react';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  textOnPrimary: string;
  gradient: string;
  glowColor: string;
  surfaceColor: string;
  surfaceColorDark: string;
}

const DEFAULT_THEME: ThemeColors = {
  primary: '#6366f1',
  primaryLight: 'rgba(99, 102, 241, 0.2)',
  primaryDark: '#4338ca',
  accent: '#ec4899',
  accentLight: 'rgba(236, 72, 153, 0.2)',
  textOnPrimary: '#ffffff',
  gradient: 'linear-gradient(135deg, #6366f1, #ec4899)',
  glowColor: 'rgba(99, 102, 241, 0.4)',
  surfaceColor: 'rgba(255, 255, 255, 0.85)',
  surfaceColorDark: 'rgba(30, 30, 46, 0.9)',
};

// Calculate relative luminance for contrast checking
const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
const rgbToHex = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;
const rgbaToString = (r: number, g: number, b: number, a: number) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

// Adjust saturation and lightness
const adjustColor = (r: number, g: number, b: number, factor: number): [number, number, number] => {
  const avg = (r + g + b) / 3;
  return [
    Math.round(Math.min(255, r + (r - avg) * factor)),
    Math.round(Math.min(255, g + (g - avg) * factor)),
    Math.round(Math.min(255, b + (b - avg) * factor)),
  ];
};

const darkenColor = (r: number, g: number, b: number, amount: number): [number, number, number] => [
  Math.round(r * (1 - amount)),
  Math.round(g * (1 - amount)),
  Math.round(b * (1 - amount)),
];

export const useThemeFromImage = (imageSrc: string | null): ThemeColors & { loading: boolean } => {
  const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  const extractColors = useCallback(async (src: string) => {
    setLoading(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = src;
      });

      // Sample pixels from the image using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      const sampleSize = 100;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

      // K-means-like clustering for dominant colors
      const pixels: [number, number, number][] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        // Skip transparent and very dark/light pixels
        if (a > 200 && !(r < 20 && g < 20 && b < 20) && !(r > 240 && g > 240 && b > 240)) {
          pixels.push([r, g, b]);
        }
      }

      if (pixels.length === 0) {
        setTheme(DEFAULT_THEME);
        setLoading(false);
        return;
      }

      // Simple quantization: divide into buckets
      const buckets: Map<string, { sum: [number, number, number]; count: number }> = new Map();
      for (const [r, g, b] of pixels) {
        const key = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
        const existing = buckets.get(key);
        if (existing) {
          existing.sum[0] += r;
          existing.sum[1] += g;
          existing.sum[2] += b;
          existing.count++;
        } else {
          buckets.set(key, { sum: [r, g, b], count: 1 });
        }
      }

      // Sort by frequency and get top colors
      const sorted = [...buckets.values()]
        .sort((a, b) => b.count - a.count)
        .map((b) => [
          Math.round(b.sum[0] / b.count),
          Math.round(b.sum[1] / b.count),
          Math.round(b.sum[2] / b.count),
        ] as [number, number, number]);

      const primaryColor = sorted[0];
      // Find a contrasting accent color
      const accentColor = sorted.find(([r, g, b]) => {
        const dist = Math.sqrt(
          Math.pow(r - primaryColor[0], 2) +
          Math.pow(g - primaryColor[1], 2) +
          Math.pow(b - primaryColor[2], 2)
        );
        return dist > 80; // Minimum color distance
      }) || adjustColor(...primaryColor, 0.5);

      const [pr, pg, pb] = primaryColor;
      const [ar, ag, ab] = accentColor;
      const luminance = getLuminance(pr, pg, pb);
      const textColor = luminance > 0.4 ? '#1a1a2e' : '#ffffff';
      const [dr, dg, db] = darkenColor(pr, pg, pb, 0.3);

      setTheme({
        primary: rgbToHex(pr, pg, pb),
        primaryLight: rgbaToString(pr, pg, pb, 0.2),
        primaryDark: rgbToHex(dr, dg, db),
        accent: rgbToHex(ar, ag, ab),
        accentLight: rgbaToString(ar, ag, ab, 0.2),
        textOnPrimary: textColor,
        gradient: `linear-gradient(135deg, ${rgbToHex(pr, pg, pb)}, ${rgbToHex(ar, ag, ab)})`,
        glowColor: rgbaToString(pr, pg, pb, 0.4),
        surfaceColor: `rgba(255, 255, 255, 0.85)`,
        surfaceColorDark: `rgba(30, 30, 46, 0.9)`,
      });
    } catch {
      setTheme(DEFAULT_THEME);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (imageSrc) {
      extractColors(imageSrc);
    } else {
      setTheme(DEFAULT_THEME);
      setLoading(false);
    }
  }, [imageSrc, extractColors]);

  return { ...theme, loading };
};
