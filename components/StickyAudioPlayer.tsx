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
    <div className="fixed bottom-0 left-0 right-0 bg-[#073642]/95 backdrop-blur-md text-white border-t border-[#002b36] px-3.5 pt-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] sm:py-3.5 sm:px-6 shadow-2xl z-40 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6">
        
        {/* Row 1 on mobile: Verse info, Reciter, and Controls */}
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          {/* Verse info & Reciter */}
          <div className={`flex items-center gap-2 min-w-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="bg-[#b58900] text-white font-black px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest shrink-0 shadow-sm">
              {surah.number}:{activeAyah}
            </span>
            <div className={`flex flex-col min-w-0 ${isRtl ? 'items-end' : 'items-start'}`}>
              <h4 className="text-[11px] font-bold text-slate-300 truncate max-w-[90px] sm:max-w-[120px]">
                {isRtl ? surah.name : surah.englishName}
              </h4>
            </div>

            <div className="flex items-center gap-1 bg-black/25 px-2 py-1 rounded-xl border border-[#586e75]/20 max-w-[120px] sm:max-w-[160px] truncate">
              <select
                value={selectedReciter.id}
                onChange={(e) => {
                  const rec = reciters.find(r => r.id === e.target.value);
                  if (rec) onReciterChange(rec);
                }}
                className="bg-transparent text-[9px] font-black text-slate-200 uppercase tracking-wider outline-none border-none cursor-pointer w-full truncate"
              >
                {reciters.map(r => (
                  <option key={r.id} value={r.id} className="bg-[#073642] text-white font-bold">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Audio controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button 
              onClick={onPrev} 
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full active:scale-90 transition-all text-[#b58900]"
              title="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button 
              onClick={onPlayPause} 
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-[#b58900] hover:bg-[#859900] text-white rounded-full active:scale-95 transition-all shadow-md"
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
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full active:scale-90 transition-all text-[#b58900]"
              title="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2 on mobile / Right block on desktop: Font sizes & Jump button */}
        <div className={`flex items-center justify-between sm:justify-end gap-2.5 pt-1.5 border-t border-white/10 sm:border-0 sm:pt-0 w-full sm:w-auto ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-full">
            {FONT_PRESETS.map(preset => (
              <button
                key={preset.value}
                onClick={() => onFontSizeChange(preset.value)}
                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase transition-all min-w-[28px] text-center ${fontSize === preset.value ? 'bg-[#b58900] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button 
            onClick={onOpenJumpModal} 
            className="px-3.5 py-1.5 bg-black/30 hover:bg-black/50 text-[#b58900] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#b58900]/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t.jumpBtn}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StickyAudioPlayer;
