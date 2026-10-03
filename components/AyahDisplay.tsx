
import React, { useState } from 'react';
import { Ayah } from '../types';
import { getAyahGifUrl } from '../services/quranService';

interface AyahDisplayProps {
  ayah: Ayah;
  surahNumber: number;
  useImageOnly?: boolean;
  fontSize?: number;
}

const AyahDisplay: React.FC<AyahDisplayProps> = ({ ayah, surahNumber, useImageOnly = true, fontSize = 36 }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageUrl = getAyahGifUrl(surahNumber, ayah.numberInSurah);

  return (
    <div className="flex flex-col items-end justify-center py-2 sm:py-4 min-h-[70px] w-full relative">
      {isLoading && !imgError && (
        <div className="w-full flex items-center justify-end py-6 pr-6">
          <div className="w-6 h-6 border-2 border-[#b58900]/20 border-t-[#b58900] rounded-full animate-spin"></div>
        </div>
      )}
      
      {!imgError ? (
        <img 
          src={imageUrl} 
          alt={`Sourate ${surahNumber}, Verset ${ayah.numberInSurah}`}
          className={`w-auto max-w-full object-contain mix-blend-multiply transition-opacity duration-300 ${isLoading ? 'opacity-0 h-0' : 'opacity-100'}`}
          style={{ height: `${Math.max(fontSize * 2.4, 60)}px`, maxHeight: '220px' }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgError(true);
            setIsLoading(false);
          }}
        />
      ) : (
        <div className="w-full text-right p-4 bg-[#fdf6e3] rounded-2xl border border-[#eee8d5]">
          <p className="text-[10px] font-black text-[#dc322f] uppercase tracking-widest mb-1">Calligraphie en cours de synchronisation</p>
          {ayah.text && (
            <p className="lateef-font text-3xl text-slate-800 leading-relaxed font-bold" dir="rtl">
              {ayah.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AyahDisplay;
