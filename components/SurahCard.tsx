
import React from 'react';
import { Surah } from '../types';

interface SurahCardProps {
  surah: Surah;
  onClick: (surah: Surah) => void;
  bookmarkVerseNumber?: number;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah, onClick, bookmarkVerseNumber }) => {
  return (
    <button
      onClick={() => onClick(surah)}
      className="group relative bg-white p-6 rounded-3xl border border-[#eee8d5] shadow-sm hover:shadow-xl hover:border-[#b58900]/30 transition-all text-right flex flex-row-reverse items-center gap-6 overflow-hidden"
    >
      {bookmarkVerseNumber && (
        <span className="absolute top-3 left-3 bg-[#b58900]/10 text-[#b58900] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#b58900]/20 z-10">
          V. {bookmarkVerseNumber}
        </span>
      )}

      {/* Numéro de la sourate avec un style ornemental */}
      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-[#fdf6e3] text-[#b58900] rounded-full font-black text-sm border border-[#eee8d5] group-hover:scale-110 transition-transform">
        {surah.number}
      </div>

      <div className="flex-1 min-w-0 flex flex-col items-end">
        {/* Nom en Arabe - Element Principal */}
        <h3 className="arabic-font text-3xl text-[#073642] group-hover:text-[#b58900] transition-colors mb-1">
          {surah.name}
        </h3>
        {/* Infos secondaires en petit */}
        <div className="flex flex-row-reverse items-center gap-2 opacity-60">
          <p className="text-[10px] font-bold text-[#586e75] uppercase tracking-wider">{surah.englishName}</p>
          <span className="w-1 h-1 bg-[#b58900] rounded-full"></span>
          <p className="text-[10px] font-bold text-[#586e75] uppercase tracking-wider">{surah.numberOfAyahs} Ayahs</p>
        </div>
      </div>
      
      {/* Motif décoratif en arrière-plan */}
      <div className="absolute -left-4 -bottom-4 w-20 h-20 text-[#b58900] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <svg viewBox="0 0 100 100" fill="currentColor">
           <path d="M50 0L61.2257 38.7743L100 50L61.2257 61.2257L50 100L38.7743 61.2257L0 50L38.7743 38.7743L50 0Z" />
         </svg>
      </div>
    </button>
  );
};

export default SurahCard;
