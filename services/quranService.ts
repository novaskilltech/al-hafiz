
import { Surah, Ayah, QuranVersion } from '../types';

const API_BASE = 'https://api.alquran.cloud/v1';

export const fetchSurahs = async (): Promise<Surah[]> => {
  const response = await fetch(`${API_BASE}/surah`);
  const data = await response.json();
  return data.data;
};

/**
 * Récupère les versets d'une sourate selon la riwaya choisie.
 * Hafs utilise 'quran-uthmani'
 * Warsh utilise 'quran-warsh'
 */
export const fetchSurahDetails = async (surahNumber: number, version: QuranVersion = 'Hafs'): Promise<Ayah[]> => {
  const edition = version === 'Hafs' ? 'quran-uthmani' : 'quran-warsh';
  try {
    const response = await fetch(`${API_BASE}/surah/${surahNumber}/${edition}`);
    if (!response.ok) throw new Error("Edition non supportée");
    const data = await response.json();
    return data.data.ayahs;
  } catch (err) {
    console.warn(`Fallback: Impossible de charger le texte JSON pour ${version}, utilisation du mode image.`);
    // On retourne une structure vide avec juste les numéros pour forcer le fallback PNG dans l'UI
    const basicInfo = await fetch(`${API_BASE}/surah/${surahNumber}`);
    const basicData = await basicInfo.json();
    return basicData.data.ayahs.map((a: any) => ({ ...a, text: '' }));
  }
};

export const getAudioUrl = (reciterId: string, surahNumber: number, ayahNumberInSurah: number): string => {
  const s = surahNumber.toString().padStart(3, '0');
  const a = ayahNumberInSurah.toString().padStart(3, '0');
  return `https://www.everyayah.com/data/${reciterId}/${s}${a}.mp3`;
};

export const getAyahGifUrl = (surahNumber: number, ayahNumberInSurah: number): string => {
  // Utilisation des PNG de EveryAyah (plus stables que les anciens GIFs)
  // Format: https://everyayah.com/data/quranpngs/{surahNo}_{ayahNo}.png
  return `https://everyayah.com/data/quranpngs/${surahNumber}_${ayahNumberInSurah}.png`;
};

export const checkAudioExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (e) {
    return false;
  }
};
