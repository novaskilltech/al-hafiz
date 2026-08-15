import React, { useState, useEffect, useRef } from 'react';
import { RECITERS } from '../constants';
import { QuranVersion, ThemeType } from '../types';
import { getAudioUrl, checkAudioExists } from '../services/quranService';

interface QuickAudioPlayerProps {
  compact?: boolean;
  theme?: ThemeType;
  lang?: 'fr' | 'ar' | 'en';
}

const SURAH_VERSES: Record<number, number> = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 5, 112: 4, 113: 5, 114: 6
};

const QuickAudioPlayer: React.FC<QuickAudioPlayerProps> = ({ compact, theme = 'emerald', lang = 'fr' }) => {
  const [version, setVersion] = useState<QuranVersion>('Hafs');
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [surahNum, setSurahNum] = useState(1);
  const [ayahNum, setAyahNum] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const translations = {
    fr: {
      playerTitle: "Lecteur Audio",
      qariLabel: "Qari (Récitateur)",
      surahLabel: "Sourate",
      ayahLabel: "Verset",
      listenBtn: "Écouter",
      pauseBtn: "Pause",
      unavailable: "Indisponible",
      errorMsg: "Erreur"
    },
    ar: {
      playerTitle: "قارئ الصوت",
      qariLabel: "القارئ (المقرئ)",
      surahLabel: "السورة",
      ayahLabel: "الآية",
      listenBtn: "استماع",
      pauseBtn: "إيقاف مؤقت",
      unavailable: "غير متوفر",
      errorMsg: "خطأ"
    },
    en: {
      playerTitle: "Audio Player",
      qariLabel: "Qari (Reciter)",
      surahLabel: "Surah",
      ayahLabel: "Ayah",
      listenBtn: "Listen",
      pauseBtn: "Pause",
      unavailable: "Unavailable",
      errorMsg: "Error"
    }
  };

  const t = translations[lang];

  const themeConfig = {
    emerald: 'bg-emerald-900 border-emerald-800 text-emerald-50',
    indigo: 'bg-indigo-800 border-indigo-700 text-indigo-50',
    amber: 'bg-[#073642] border-[#002b36] text-[#93a1a1]',
    rose: 'bg-rose-900 border-rose-800 text-rose-50'
  }[theme];

  const buttonAccent = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-[#b58900]',
    rose: 'bg-rose-500'
  }[theme];

  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  const handlePlay = async () => {
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); return; }
    setLoading(true); setError(null);
    const url = getAudioUrl(reciterId, surahNum, ayahNum);
    const exists = await checkAudioExists(url);
    if (!exists) { setError(t.unavailable); setLoading(false); return; }
    if (!audioRef.current) audioRef.current = new Audio(url); else audioRef.current.src = url;
    audioRef.current.play().then(() => { setIsPlaying(true); setLoading(false); }).catch(() => { setError(t.errorMsg); setLoading(false); });
    audioRef.current.onended = () => setIsPlaying(false);
  };

  const handleSurahChange = (valStr: string) => {
    let num = parseInt(valStr) || 1;
    if (num < 1) num = 1;
    if (num > 114) num = 114;
    setSurahNum(num);
    
    const maxVerses = SURAH_VERSES[num] || 7;
    if (ayahNum > maxVerses) {
      setAyahNum(maxVerses);
    }
  };

  const handleAyahChange = (valStr: string) => {
    let num = parseInt(valStr) || 1;
    const maxVerses = SURAH_VERSES[surahNum] || 7;
    if (num < 1) num = 1;
    if (num > maxVerses) num = maxVerses;
    setAyahNum(num);
  };

  return (
    <div className={`${themeConfig} h-full rounded-[2.5rem] p-8 shadow-xl border flex flex-col justify-between gap-6`}>
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t.playerTitle}</h3>
        <div className="flex gap-1.5 p-1 bg-black/20 rounded-full">
          {['Hafs', 'Warsh'].map(v => (
            <button
              key={v}
              onClick={() => {
                setVersion(v as QuranVersion);
                setReciterId(RECITERS.find(r => r.version === v)?.id || RECITERS[0].id);
              }}
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${version === v ? 'bg-white text-black' : 'opacity-40 text-white'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[8px] opacity-40 uppercase font-black tracking-widest">{t.qariLabel}</label>
          <select 
            value={reciterId}
            onChange={(e) => setReciterId(e.target.value)}
            className="w-full bg-black/10 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-1 outline-none appearance-none cursor-pointer"
          >
            {RECITERS.filter(r => r.version === version).map(r => <option key={r.id} value={r.id} className="text-black">{r.name}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] opacity-40 uppercase font-black tracking-widest">{t.surahLabel}</label>
            <input 
              type="number" min="1" max="114" value={surahNum}
              onChange={(e) => handleSurahChange(e.target.value)}
              onBlur={() => handleSurahChange(surahNum.toString())}
              className="w-full bg-black/10 border-none rounded-xl px-4 py-3 text-sm font-black focus:ring-1 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] opacity-40 uppercase font-black tracking-widest">{t.ayahLabel}</label>
            <input 
              type="number" min="1" max={SURAH_VERSES[surahNum] || 7} value={ayahNum}
              onChange={(e) => handleAyahChange(e.target.value)}
              onBlur={() => handleAyahChange(ayahNum.toString())}
              className="w-full bg-black/10 border-none rounded-xl px-4 py-3 text-sm font-black focus:ring-1 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handlePlay}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${isPlaying ? 'bg-white text-black' : `${buttonAccent} text-white shadow-lg`}`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isPlaying ? (
          <><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{t.pauseBtn}</>
        ) : (
          <><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>{t.listenBtn}</>
        )}
      </button>
      
      {error && <p className="text-[9px] text-red-300 font-bold italic text-center uppercase">{error}</p>}
    </div>
  );
};

export default QuickAudioPlayer;
