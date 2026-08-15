import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Ayah, Surah, Reciter, AppMode, QuranVersion, Bookmark } from '../types';
import { fetchSurahDetails, getAudioUrl } from '../services/quranService';
import { RECITERS } from '../constants';
import HifzValidator from './HifzValidator';
import AyahDisplay from './AyahDisplay';
import StickyAudioPlayer from './StickyAudioPlayer';

interface ReaderProps {
  surah: Surah;
  lang?: 'fr' | 'ar' | 'en';
}

const Reader: React.FC<ReaderProps> = ({ surah, lang = 'fr' }) => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  
  const savedSettings = JSON.parse(localStorage.getItem('alhafiz_settings') || '{}');
  const [version, setVersion] = useState<QuranVersion>(savedSettings.version || 'Hafs');
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(
    RECITERS.find(r => r.id === savedSettings.reciterId && r.version === version) || 
    RECITERS.find(r => r.version === version) || 
    RECITERS[0]
  );
  
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  const [mode, setMode] = useState<AppMode>('read');
  const [memorizeTarget, setMemorizeTarget] = useState<Ayah | null>(null);
  const [useImages, setUseImages] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(JSON.parse(localStorage.getItem('alhafiz_bookmarks') || '[]'));
  const [fontSize, setFontSize] = useState<number>(savedSettings.fontSize || 36);
  const [masteredVerses, setMasteredVerses] = useState<string[]>([]);
  
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isRtl = lang === 'ar';

  const translations = {
    fr: {
      loadingText: "Chargement",
      qariLabel: "Récitateur",
      calligraphyLabel: "Calligraphie Originale",
      fontSizeLabel: "Taille du texte",
      backToVerses: "Retour aux versets",
      readTab: "Lecture",
      examTab: "Examen",
      ayahWord: "AYAH",
      memorized: "Mémorisé",
      examAvailable: "Examen disponible",
      favorites: "Favoris"
    },
    ar: {
      loadingText: "جاري التحميل",
      qariLabel: "القارئ",
      calligraphyLabel: "الخط الأصلي (المصحف)",
      fontSizeLabel: "حجم الخط",
      backToVerses: "العودة إلى الآيات",
      readTab: "قراءة",
      examTab: "تسميع واختبار",
      ayahWord: "آية",
      memorized: "تم الحفظ ✓",
      examAvailable: "اختبار متاح",
      favorites: "المفضلة"
    },
    en: {
      loadingText: "Loading",
      qariLabel: "Reciter",
      calligraphyLabel: "Original Calligraphy",
      fontSizeLabel: "Font Size",
      backToVerses: "Back to verses",
      readTab: "Reading",
      examTab: "Exam & Recite",
      ayahWord: "AYAH",
      memorized: "Memorized ✓",
      examAvailable: "Exam Available",
      favorites: "Favorites"
    }
  };

  const t = translations[lang];

  const updateMastered = useCallback(() => {
    setMasteredVerses(JSON.parse(localStorage.getItem('alhafiz_mastered') || '[]'));
  }, []);

  useEffect(() => {
    updateMastered();
    window.addEventListener('storage_update', updateMastered);
    return () => window.removeEventListener('storage_update', updateMastered);
  }, [updateMastered]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchSurahDetails(surah.number, version);
      setAyahs(data);
      setLoading(false);
      
      const lastPos = JSON.parse(localStorage.getItem('alhafiz_last_pos') || '{}');
      let targetAyahNumber: number | null = null;
      if (lastPos.surahNumber === surah.number && lastPos.ayahNumber) {
        targetAyahNumber = lastPos.ayahNumber;
      } else {
        const surahPositions = JSON.parse(localStorage.getItem('alhafiz_surah_positions') || '{}');
        if (surahPositions[surah.number]) {
          targetAyahNumber = surahPositions[surah.number];
        }
      }

      if (targetAyahNumber) {
        setTimeout(() => {
          ayahRefs.current[targetAyahNumber!]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setActiveAyah(targetAyahNumber);

          const forceExam = localStorage.getItem('alhafiz_force_exam') === 'true';
          if (forceExam) {
            const targetAyah = data.find(a => a.numberInSurah === targetAyahNumber);
            if (targetAyah) {
              setMode('memorize');
              setMemorizeTarget(targetAyah);
            }
            localStorage.removeItem('alhafiz_force_exam');
          }
        }, 500);
      }
    };
    load();
  }, [surah, version]);

  useEffect(() => {
    localStorage.setItem('alhafiz_settings', JSON.stringify({ version, reciterId: selectedReciter.id, fontSize }));
  }, [version, selectedReciter, fontSize]);

  const handleVersionChange = (newVersion: QuranVersion) => {
    setVersion(newVersion);
    const firstReciter = RECITERS.find(r => r.version === newVersion);
    if (firstReciter) setSelectedReciter(firstReciter);
  };

  const savePosition = (ayahNumber: number) => {
    localStorage.setItem('alhafiz_last_pos', JSON.stringify({ surahNumber: surah.number, ayahNumber }));
    const positions = JSON.parse(localStorage.getItem('alhafiz_surah_positions') || '{}');
    positions[surah.number] = ayahNumber;
    localStorage.setItem('alhafiz_surah_positions', JSON.stringify(positions));
  };

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const handlePlayAyah = (ayahNumber: number) => {
    const ayah = ayahs.find(a => a.numberInSurah === ayahNumber);
    if (!ayah) return;
    
    if (activeAyah === ayahNumber && currentAudioRef.current) {
      if (isPlaying) {
        currentAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        currentAudioRef.current.play().catch(e => console.error("Audio play failed", e));
        setIsPlaying(true);
      }
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    setActiveAyah(ayahNumber);
    savePosition(ayahNumber);
    
    const audio = new Audio(getAudioUrl(selectedReciter.id, surah.number, ayahNumber));
    currentAudioRef.current = audio;
    setIsPlaying(true);
    
    audio.play().catch(e => {
      console.error("Audio play failed", e);
      setIsPlaying(false);
    });
    
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const navigateAyah = (direction: 'next' | 'prev') => {
    if (activeAyah === null) return;
    const nextVal = direction === 'next' ? activeAyah + 1 : activeAyah - 1;
    if (nextVal >= 1 && nextVal <= ayahs.length) {
      handlePlayAyah(nextVal);
      ayahRefs.current[nextVal]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleBookmark = (ayah: Ayah) => {
    const isBookmarked = bookmarks.some(b => b.surahNumber === surah.number && b.ayahNumber === ayah.numberInSurah);
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(b => !(b.surahNumber === surah.number && b.ayahNumber === ayah.numberInSurah));
    } else {
      const newBookmark: Bookmark = {
        surahNumber: surah.number,
        surahName: surah.englishName,
        ayahNumber: ayah.numberInSurah,
        timestamp: Date.now()
      };
      newBookmarks = [newBookmark, ...bookmarks].slice(0, 20);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('alhafiz_bookmarks', JSON.stringify(newBookmarks));
  };

  const startMemorizing = (ayah: Ayah) => {
    setMemorizeTarget(ayah);
    setMode('memorize');
    savePosition(ayah.numberInSurah);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-4 border-[#b58900] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#586e75] text-sm font-semibold">{t.loadingText} ({version})...</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-32`}>
      {/* Controls Bar - Optimized for Arabic focus */}
      <div className="flex flex-col gap-4 bg-white p-6 sm:p-10 rounded-[2.5rem] border border-[#eee8d5] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col items-start gap-1">
             <div className="flex items-center gap-2">
                <span className="text-[#b58900] font-black bg-[#fdf6e3] px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border border-[#eee8d5]">
                  {surah.number}
                </span>
                <span className="text-[10px] text-[#93a1a1] font-bold uppercase tracking-widest">{surah.revelationType}</span>
             </div>
             <h2 className="arabic-font text-5xl text-[#073642] mt-2">{surah.name}</h2>
             <p className="text-[11px] font-black text-[#b58900] uppercase tracking-[0.3em] opacity-50">{surah.englishName}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3">
             <div className="flex gap-1.5 p-1 bg-[#eee8d5]/30 rounded-full">
              {['Hafs', 'Warsh'].map(v => (
                <button
                  key={v}
                  onClick={() => handleVersionChange(v as QuranVersion)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${version === v ? 'bg-[#b58900] text-white shadow-md' : 'text-[#586e75] hover:bg-[#eee8d5]'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#eee8d5] items-center">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#93a1a1] uppercase tracking-[0.2em]">{t.qariLabel} ({version})</label>
            <select 
              className="w-full bg-[#fdf6e3] border border-[#eee8d5] rounded-xl px-4 py-3 text-xs font-bold text-[#073642] focus:ring-2 focus:ring-[#b58900] outline-none transition-all appearance-none cursor-pointer"
              value={selectedReciter.id}
              onChange={(e) => setSelectedReciter(RECITERS.find(r => r.id === e.target.value) || RECITERS[0])}
            >
              {RECITERS.filter(r => r.version === version).map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 px-1">
            <div className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" id="useImages" checked={useImages} onChange={(e) => setUseImages(e.target.checked)} className="sr-only peer" />
              <div className="w-10 h-6 bg-[#eee8d5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#b58900]"></div>
              <label htmlFor="useImages" className={`text-[10px] font-black text-[#586e75] uppercase tracking-widest cursor-pointer group-hover:text-[#b58900] transition-colors ${isRtl ? 'mr-3' : 'ml-3'}`}>{t.calligraphyLabel}</label>
            </div>
          </div>
          <div className={`flex items-center justify-start md:justify-end gap-4 border-t md:border-t-0 border-[#eee8d5] pt-4 md:pt-0 ${isRtl ? 'md:border-r md:pr-6' : 'md:border-l md:pl-6'}`}>
            <span className="text-[9px] font-black text-[#93a1a1] uppercase tracking-[0.2em]">{t.fontSizeLabel}</span>
            <div className="flex items-center gap-1.5 bg-[#fdf6e3] p-1 rounded-full border border-[#eee8d5]">
              {[
                { label: 'SM', value: 24 },
                { label: 'MD', value: 32 },
                { label: 'LG', value: 40 },
                { label: 'XL', value: 48 }
              ].map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setFontSize(preset.value)}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${fontSize === preset.value ? 'bg-[#b58900] text-white shadow-sm' : 'text-[#586e75] hover:text-[#b58900]'}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {mode === 'memorize' && memorizeTarget ? (
        <div className="space-y-6">
          <button onClick={() => { setMode('memorize'); setMemorizeTarget(null); }} className="flex items-center gap-2 text-[#b58900] font-black text-[10px] uppercase tracking-widest bg-white border border-[#eee8d5] px-6 py-3 rounded-full w-fit hover:bg-[#fdf6e3] transition-colors shadow-sm active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            {t.backToVerses}
          </button>
          <HifzValidator ayah={memorizeTarget} surahName={surah.englishName} riwaya={version} surahNumber={surah.number} useImageOnly={useImages} fontSize={fontSize} lang={lang} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="sticky top-[70px] z-40 -mx-4 px-4 py-3 bg-[#fdf6e3]/80 backdrop-blur-md flex items-center justify-between border-b border-[#eee8d5] sm:relative sm:top-0 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-none">
             <div className="flex gap-1 bg-white p-1 rounded-full border border-[#eee8d5] shadow-sm">
              <button onClick={() => { setMode('read'); setMemorizeTarget(null); }} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full ${mode === 'read' ? 'bg-[#b58900] text-white shadow-md' : 'text-[#93a1a1] hover:text-[#586e75]'}`}>{t.readTab}</button>
              <button onClick={() => {
                setMode('memorize');
                if (activeAyah !== null) {
                  const target = ayahs.find(a => a.numberInSurah === activeAyah);
                  if (target) setMemorizeTarget(target);
                }
              }} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full ${mode === 'memorize' ? 'bg-[#268bd2] text-white shadow-md' : 'text-[#93a1a1] hover:text-[#586e75]'}`}>{t.examTab}</button>
             </div>
             {activeAyah !== null && mode === 'read' && (
                <div className="flex items-center gap-2">
                  <button onClick={() => navigateAyah(isRtl ? 'next' : 'prev')} disabled={isRtl ? activeAyah >= ayahs.length : activeAyah <= 1} className="p-2.5 bg-white border border-[#eee8d5] text-[#b58900] rounded-full disabled:opacity-30 active:scale-90 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-[10px] font-black text-[#b58900] bg-white border border-[#eee8d5] rounded-full px-4 py-2 shadow-sm min-w-[85px] text-center tracking-widest">{t.ayahWord} {activeAyah}</span>
                  <button onClick={() => navigateAyah(isRtl ? 'prev' : 'next')} disabled={isRtl ? activeAyah <= 1 : activeAyah >= ayahs.length} className="p-2.5 bg-white border border-[#eee8d5] text-[#b58900] rounded-full disabled:opacity-30 active:scale-90 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button onClick={() => setShowJumpModal(true)} className="p-2.5 bg-[#fdf6e3] border border-[#eee8d5] text-[#b58900] hover:bg-[#eee8d5] rounded-full transition-all shadow-sm active:scale-90" title="Aller au verset">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
             )}
          </div>

          <div className="space-y-4">
            {ayahs.map((ayah) => {
              const isBookmarked = bookmarks.some(b => b.surahNumber === surah.number && b.ayahNumber === ayah.numberInSurah);
              const isActive = activeAyah === ayah.numberInSurah;
              const isMastered = masteredVerses.includes(`${surah.englishName}:${ayah.numberInSurah}`);
              
              return (
                <div 
                  key={ayah.number}
                  ref={el => { ayahRefs.current[ayah.numberInSurah] = el; }}
                  className={`group rounded-[2rem] p-6 sm:p-10 border transition-all flex flex-col gap-6 
                    ${isActive ? 'ring-4 ring-[#b58900]/10 border-[#b58900] shadow-xl' : 'hover:border-[#b58900]/30 shadow-sm'} 
                    ${isMastered ? 'bg-[#859900]/5 border-[#859900]/30' : 'bg-white border-[#eee8d5]'}
                    ${mode === 'memorize' ? 'cursor-pointer active:scale-[0.99]' : ''}`}
                  onClick={() => {
                    if (mode === 'memorize') {
                      startMemorizing(ayah);
                    } else {
                      setActiveAyah(ayah.numberInSurah);
                      savePosition(ayah.numberInSurah);
                    }
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#fdf6e3] pb-6">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#fdf6e3] text-[#b58900] font-black text-xs border border-[#eee8d5]">{ayah.numberInSurah}</span>
                      {isMastered && (
                        <span className="text-[9px] font-black text-[#859900] uppercase tracking-[0.2em] bg-[#859900]/10 px-3 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          {t.memorized}
                        </span>
                      )}
                      {mode === 'memorize' && !isMastered && (
                        <span className="text-[9px] font-black text-[#268bd2] uppercase tracking-[0.2em] animate-pulse bg-[#268bd2]/5 px-3 py-1 rounded-full">{t.examAvailable}</span>
                      )}
                    </div>
                    {mode === 'read' && (
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(ayah); }} className={`p-3 rounded-full transition-all active:scale-90 ${isBookmarked ? 'bg-amber-100 text-[#b58900]' : 'bg-[#fdf6e3] text-[#93a1a1] hover:text-[#b58900]'}`} title={t.favorites}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handlePlayAyah(ayah.numberInSurah); }} className={`p-3 rounded-full transition-all shadow-md active:scale-90 ${isActive ? 'bg-[#b58900] text-white' : 'bg-[#073642] text-white hover:bg-[#002b36]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <AyahDisplay ayah={ayah} surahNumber={surah.number} useImageOnly={useImages} fontSize={fontSize} />
                  </div>
                  {isActive && mode === 'read' && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#fdf6e3] pt-6 mt-4 gap-3">
                      <span className="text-[10px] font-black text-[#93a1a1] uppercase tracking-[0.2em]">{lang === 'ar' ? 'التحكم السريع' : 'Actions rapides'}</span>
                      <div className="flex gap-2.5 flex-wrap">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handlePlayAyah(ayah.numberInSurah); }} 
                          className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${isPlaying ? 'bg-[#b58900] text-white' : 'bg-[#073642] text-white'}`}
                        >
                          {isPlaying ? (
                            <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg> Pause</>
                          ) : (
                            <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg> Écouter</>
                          )}
                        </button>
                        
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setMode('memorize'); 
                            setMemorizeTarget(ayah); 
                          }} 
                          className="px-5 py-2.5 bg-[#268bd2] hover:bg-[#2aa198] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {lang === 'ar' ? 'سجّل وتسميع' : 'S\'évaluer'}
                        </button>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(ayah); }} 
                          className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${isBookmarked ? 'bg-amber-100 text-[#b58900] border border-[#b58900]/30' : 'bg-white text-[#93a1a1] border border-[#eee8d5] hover:text-[#b58900]'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          {isBookmarked ? (lang === 'ar' ? 'مسجل' : 'Enregistré') : (lang === 'ar' ? 'حفظ العلامة' : 'Favoris')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'read' && activeAyah !== null && (
        <StickyAudioPlayer
          surah={surah}
          activeAyah={activeAyah}
          isPlaying={isPlaying}
          onPlayPause={() => handlePlayAyah(activeAyah)}
          onPrev={() => navigateAyah('prev')}
          onNext={() => navigateAyah('next')}
          lang={lang}
          fontSize={fontSize}
          onFontSizeChange={(size) => setFontSize(size)}
          onOpenJumpModal={() => setShowJumpModal(true)}
          reciters={RECITERS.filter(r => r.version === version)}
          selectedReciter={selectedReciter}
          onReciterChange={(r) => {
            setSelectedReciter(r);
            const settings = JSON.parse(localStorage.getItem('alhafiz_settings') || '{}');
            settings.reciterId = r.id;
            localStorage.setItem('alhafiz_settings', JSON.stringify(settings));
          }}
        />
      )}

      {showJumpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#fdf6e3] rounded-[2.5rem] border border-[#d3ccb8] w-full max-w-sm p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-[#eee8d5]">
              <h3 className="text-lg font-black text-[#073642]">
                {lang === 'ar' ? 'الانتقال إلى آية' : 'Aller au verset'}
              </h3>
              <button 
                onClick={() => { setShowJumpModal(false); setJumpInput(''); }} 
                className="p-2 text-[#93a1a1] hover:text-[#586e75] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max={ayahs.length}
                  value={jumpInput}
                  placeholder={`1 - ${ayahs.length}`}
                  onChange={(e) => setJumpInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-[#eee8d5] rounded-xl text-center font-bold text-sm outline-none focus:ring-2 focus:ring-[#b58900] transition-all"
                />
                <button
                  onClick={() => {
                    const val = parseInt(jumpInput);
                    if (val >= 1 && val <= ayahs.length) {
                      setShowJumpModal(false);
                      setJumpInput('');
                      handlePlayAyah(val);
                      ayahRefs.current[val]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="px-6 py-3 bg-[#b58900] hover:bg-[#859900] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md"
                >
                  {lang === 'ar' ? 'ذهاب' : 'Go'}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#eee8d5]">
                {[25, 50, 75, 100].map(pct => {
                  const targetAyah = Math.min(ayahs.length, Math.max(1, Math.round(ayahs.length * (pct / 100))));
                  return (
                    <button
                      key={pct}
                      onClick={() => {
                        setShowJumpModal(false);
                        setJumpInput('');
                        handlePlayAyah(targetAyah);
                        ayahRefs.current[targetAyah]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="py-2.5 bg-white border border-[#eee8d5] hover:border-[#b58900]/40 text-[#586e75] hover:text-[#b58900] rounded-xl text-[10px] font-black tracking-wider transition-all active:scale-95"
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reader;
