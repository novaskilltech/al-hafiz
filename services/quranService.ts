
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
  if (version === 'Hafs') {
    try {
      // 1. Source de référence officielle : Quran.com API v4 (Texte Othmani certifié du Complexe du Roi Fahd)
      const quranComRes = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahNumber}`);
      if (quranComRes.ok) {
        const qData = await quranComRes.json();
        if (qData.verses && qData.verses.length > 0) {
          return qData.verses.map((v: any, idx: number) => {
            const numberInSurah = parseInt(v.verse_key?.split(':')[1] || `${idx + 1}`, 10);
            return {
              number: v.id || idx + 1,
              numberInSurah,
              text: v.text_uthmani || '',
              audio: '',
              juz: 1,
              manzil: 1,
              page: 1,
              ruku: 1,
              hizbQuarter: 1,
              sajda: false
            };
          });
        }
      }
    } catch (e) {
      console.warn("Quran.com API v4 indisponible, basculement vers fallback:", e);
    }
  }

  // 2. Fallback / Warsh : AlQuran Cloud
  const edition = version === 'Hafs' ? 'quran-uthmani' : 'quran-warsh';
  try {
    const response = await fetch(`${API_BASE}/surah/${surahNumber}/${edition}`);
    if (!response.ok) throw new Error("Edition non supportée");
    const data = await response.json();
    return data.data.ayahs;
  } catch (err) {
    console.warn(`Fallback: Impossible de charger le texte JSON pour ${version}, utilisation du mode image.`);
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
