import React, { useState } from 'react';
import { Ayah } from '../types';
import { getAyahGifUrl } from '../services/quranService';

interface AyahDisplayProps {
  ayah: Ayah;
  surahNumber: number;
  useImageOnly?: boolean;
  fontSize?: number;
}

const AyahDisplay: React.FC<AyahDisplayProps> = ({ ayah, surahNumber, useImageOnly = false, fontSize = 36 }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageUrl = getAyahGifUrl(surahNumber, ayah.numberInSurah);

  React.useEffect(() => {
    setIsLoading(true);
    setImgError(false);
  }, [imageUrl]);

  // Si l'utilisateur choisit explicitement le mode image ou si le texte est absent
  if (useImageOnly || !ayah.text) {
    const widthPercent = Math.min(100, Math.max(70, Math.round((fontSize / 38) * 100)));

    return (
      <div className="flex flex-col items-end justify-center py-2 sm:py-4 min-h-[70px] w-full relative">
        {isLoading && !imgError && (
          <div className="w-full flex items-center justify-end py-6 pr-6">
            <div className="w-6 h-6 border-2 border-[#b58900]/20 border-t-[#b58900] rounded-full animate-spin"></div>
          </div>
        )}
        
        {!imgError ? (
          <div 
            className="w-full flex justify-end transition-all duration-300"
            style={{ width: `${widthPercent}%`, maxWidth: '100%' }}
          >
            <img 
              src={imageUrl} 
              alt={`Sourate ${surahNumber}, Verset ${ayah.numberInSurah}`}
              className={`w-full h-auto object-contain mix-blend-multiply transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setImgError(true);
                setIsLoading(false);
              }}
            />
          </div>
        ) : (
          <div className="w-full text-right p-4 bg-[#fdf6e3] rounded-2xl border border-[#eee8d5]">
            <p className="text-[10px] font-black text-[#dc322f] uppercase tracking-widest mb-1">Calligraphie en cours de synchronisation</p>
            {ayah.text && (
              <p className="quran-font text-3xl text-slate-800 leading-relaxed font-bold" dir="rtl">
                {ayah.text}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // MODE TEXTE VECTORIEL HD CERTIFIÉ UTHMANI (Grand, fluide, ultra-lisible sur mobile)
  // Mapping généreux des tailles pour une lisibilité optimale sur smartphone :
  // SM: 26px | MD: 34px | LG: 42px | XL: 52px
  const computedFontSize = fontSize >= 48 ? 52 : fontSize >= 40 ? 42 : fontSize >= 32 ? 34 : 26;

  // Numéro de verset en chiffres arabes orientaux (Ex: ١, ٢, ٣, ٤)
  const arabicAyahNumber = ayah.numberInSurah.toLocaleString('ar-EG');

  return (
    <div className="w-full py-2 sm:py-4 flex flex-col justify-center">
      <p 
        className="quran-font text-[#073642] text-right font-normal select-text transition-all duration-200"
        dir="rtl"
        style={{ 
          fontSize: `${computedFontSize}px`,
          lineHeight: computedFontSize >= 42 ? 2.4 : 2.2
        }}
      >
        {ayah.text}
        <span 
          className="inline-flex items-center justify-center text-[#b58900] mx-2 font-normal select-none"
          style={{ fontSize: '0.85em' }}
          title={`Verset ${ayah.numberInSurah}`}
        >
          <span className="opacity-90">۝</span>
          <span className="text-[0.65em] font-bold text-[#b58900] -mr-[1.15em] mb-[0.1em]">{arabicAyahNumber}</span>
        </span>
      </p>
    </div>
  );
};

export default AyahDisplay;
