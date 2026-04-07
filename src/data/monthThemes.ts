import { MonthTheme } from '@/types';
import { HERO_IMAGES } from './heroImages';

const FALLBACK_THEMES: MonthTheme[] = [
  { primary: '#A8D8EA', secondary: '#AA96DA', accent: '#FCBAD3', bg: '#0f172a', text: '#f8fafc', heroUrl: HERO_IMAGES[0].url },
  { primary: '#FFB7B2', secondary: '#FFDAC1', accent: '#E2F0CB', bg: '#1a1025', text: '#f8fafc', heroUrl: HERO_IMAGES[1].url },
  { primary: '#98D8C8', secondary: '#F7DC6F', accent: '#BB8FCE', bg: '#0d1f0d', text: '#f8fafc', heroUrl: HERO_IMAGES[2].url },
  { primary: '#F9A8D4', secondary: '#A78BFA', accent: '#6EE7B7', bg: '#1a0a20', text: '#f8fafc', heroUrl: HERO_IMAGES[3].url },
  { primary: '#6EE7B7', secondary: '#FCD34D', accent: '#F472B6', bg: '#0a1a0a', text: '#f8fafc', heroUrl: HERO_IMAGES[4].url },
  { primary: '#38BDF8', secondary: '#FB923C', accent: '#FACC15', bg: '#0c1929', text: '#f8fafc', heroUrl: HERO_IMAGES[5].url },
  { primary: '#FB923C', secondary: '#F43F5E', accent: '#FBBF24', bg: '#1a0f05', text: '#f8fafc', heroUrl: HERO_IMAGES[6].url },
  { primary: '#FBBF24', secondary: '#F97316', accent: '#A78BFA', bg: '#1a1505', text: '#f8fafc', heroUrl: HERO_IMAGES[7].url },
  { primary: '#F59E0B', secondary: '#DC2626', accent: '#92400E', bg: '#1a0f05', text: '#f8fafc', heroUrl: HERO_IMAGES[8].url },
  { primary: '#DC2626', secondary: '#F97316', accent: '#FBBF24', bg: '#1a0505', text: '#f8fafc', heroUrl: HERO_IMAGES[9].url },
  { primary: '#92400E', secondary: '#B45309', accent: '#78350F', bg: '#1a0f0a', text: '#f8fafc', heroUrl: HERO_IMAGES[10].url },
  { primary: '#60A5FA', secondary: '#C4B5FD', accent: '#F9A8D4', bg: '#0a0f29', text: '#f8fafc', heroUrl: HERO_IMAGES[11].url },
];

export function getMonthTheme(month: number): MonthTheme {
  return FALLBACK_THEMES[month] || FALLBACK_THEMES[0];
}
