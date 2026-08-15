
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio: string;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export type QuranVersion = 'Hafs' | 'Warsh';

export interface Reciter {
  id: string;
  name: string;
  version: QuranVersion;
}

export type AppMode = 'browse' | 'read' | 'memorize';

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

export type ThemeType = 'emerald' | 'indigo' | 'amber' | 'rose';

export interface AppTheme {
  id: ThemeType;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  card: string;
  text: string;
}
