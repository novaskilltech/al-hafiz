import React from 'react';
import { Surah, Reciter } from '../types';

interface StickyAudioPlayerProps {
  surah: Surah;
  activeAyah: number | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  lang?: 'fr' | 'ar' | 'en';
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onOpenJumpModal: () => void;
  reciters: Reciter[];
  selectedReciter: Reciter;
  onReciterChange: (reciter: Reciter) => void;
}

const StickyAudioPlayer: React.FC<StickyAudioPlayerProps> = ({
  surah,
  activeAyah,
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  lang = 'fr',
  fontSize,
  onFontSizeChange,
  onOpenJumpModal,
  reciters,
  selectedReciter,
  onReciterChange
}) => {
  if (activeAyah === null) return null;

  const isRtl = lang === 'ar';
  const translations = {
    fr: {
      ayah: "Verset",
      fontSizeLabel: "Taille",
      jumpBtn: "Aller au v.",
    },
    en: {
      ayah: "Ayah",
      fontSizeLabel: "Size",
      jumpBtn: "Jump to a.",
    },
    ar: {
      ayah: "الآية",
      fontSizeLabel: "الحجم",
      jumpBtn: "ذهاب للآية",
    }
  };

  const t = translations[lang];

  // Font size presets
  const FONT_PRESETS = [
    { label: 'SM', value: 24 },
    { label: 'MD', value: 32 },
    { label: 'LG', value: 40 },
    { label: 'XL', value: 48 }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#073642] text-white border-t border-[#002b36] py-4 px-6 shadow-2xl z-40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-in slide-in-from-bottom duration-500">
      
      {/* Verse info */}
      <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <span className="bg-[#b58900] text-white font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
          {surah.number}
        </span>
        <div className={`flex flex-col ${isRtl ? 'items-end' : 'items-start'}`}>
          <h4 className="text-xs font-bold text-slate-300">{isRtl ? surah.name : surah.englishName}</h4>
          <p className="text-[10px] font-black text-[#b58900] uppercase tracking-wider">
            {t.ayah} {activeAyah}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-2xl border border-[#586e75]/20 self-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#b58900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <select
          value={selectedReciter.id}
          onChange={(e) => {
            const rec = reciters.find(r => r.id === e.target.value);
            if (rec) onReciterChange(rec);
          }}
          className="bg-transparent text-[10px] font-black text-slate-200 uppercase tracking-widest outline-none border-none cursor-pointer pr-2"
        >
          {reciters.map(r => (
            <option key={r.id} value={r.id} className="bg-[#073642] text-white font-bold">
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Audio controls */}
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={onPrev} 
          className="p-2.5 bg-black/20 hover:bg-black/40 rounded-full active:scale-90 transition-all text-[#b58900]"
          title="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={onPlayPause} 
          className="p-4 bg-[#b58900] hover:bg-[#859900] text-white rounded-full active:scale-95 transition-all shadow-md"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button 
          onClick={onNext} 
          className="p-2.5 bg-black/20 hover:bg-black/40 rounded-full active:scale-90 transition-all text-[#b58900]"
          title="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Font sizes & Jump button */}
      <div className={`flex items-center justify-center gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-full">
          {FONT_PRESETS.map(preset => (
            <button
              key={preset.value}
              onClick={() => onFontSizeChange(preset.value)}
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${fontSize === preset.value ? 'bg-[#b58900] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button 
          onClick={onOpenJumpModal} 
          className="px-4 py-2 bg-black/30 hover:bg-black/50 text-[#b58900] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#b58900]/30 transition-all active:scale-95 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {t.jumpBtn}
        </button>
      </div>

    </div>
  );
};

export default StickyAudioPlayer;
