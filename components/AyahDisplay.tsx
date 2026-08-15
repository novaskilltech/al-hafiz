
import React, { useState } from 'react';
import { Ayah } from '../types';
import { getAyahGifUrl } from '../services/quranService';

interface AyahDisplayProps {
  ayah: Ayah;
  surahNumber: number;
  useImageOnly?: boolean;
  fontSize?: number;
}

const AyahDisplay: React.FC<AyahDisplayProps> = ({ ayah, surahNumber, useImageOnly, fontSize = 36 }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageUrl = getAyahGifUrl(surahNumber, ayah.numberInSurah);

  // Si on force l'image ou si le texte est vide (échec API), on affiche l'image de calligraphie
  if (useImageOnly || !ayah.text) {
    return (
      <div className="flex flex-col items-end py-4 min-h-[60px] relative">
        {isLoading && !imgError && (
          <div className="absolute inset-0 flex items-center justify-end pr-8">
            <div className="w-5 h-5 border-2 border-[#b58900]/20 border-t-[#b58900] rounded-full animate-spin"></div>
          </div>
        )}
        
        <img 
          src={imageUrl} 
          alt={`Ayah ${ayah.numberInSurah}`}
          className={`w-auto object-contain mix-blend-multiply transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ height: `${fontSize * 2.5}px`, maxHeight: '180px' }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgError(true);
            setIsLoading(false);
          }}
        />
        
        {imgError && (
          <div className="text-right">
            <p className="text-[10px] font-black text-[#dc322f] uppercase tracking-widest">Image indisponible</p>
            {ayah.text && <p className="lateef-font text-2xl mt-2">{ayah.text}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <p 
      className="lateef-font text-right text-slate-800 leading-loose"
      style={{ fontSize: `${fontSize}px` }}
    >
      {ayah.text}
    </p>
  );
};

export default AyahDisplay;
