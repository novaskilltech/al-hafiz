import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import SurahCard from './components/SurahCard';
import Reader from './components/Reader';
import QuickAudioPlayer from './components/QuickAudioPlayer';
import LandingPage from './components/LandingPage';
import { Surah, Bookmark } from './types';
import { fetchSurahs } from './services/quranService';

const App: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'meccan' | 'medinan'>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [lastPos, setLastPos] = useState<{surahNumber: number, ayahNumber: number} | null>(null);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isExploringAll, setIsExploringAll] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
  const [showLanding, setShowLanding] = useState(true);
  const [surahPositions, setSurahPositions] = useState<Record<number, number>>({});
  const [lang, setLang] = useState<'fr' | 'ar' | 'en'>(() => {
    return (localStorage.getItem('alhafiz_lang') as 'fr' | 'ar' | 'en') || 'fr';
  });
  
  const surahListRef = useRef<HTMLDivElement>(null);

  const TOTAL_VERSES = 6236;

  const translations = {
    fr: {
      title: "Al-Hafiz",
      studyTitle: "Mémorisation & Récitation",
      studySubtitle: "Votre espace personnel sur alhafiz.fr",
      masteredTitle: "État d'avancement",
      masteredVerses: "Versets maîtrisés",
      continueReading: "Continuer ma lecture",
      startStudy: "Commencer l'étude",
      myChantiers: "Mes Chantiers de Mémorisation",
      lastActivity: "Dernière activité : Verset",
      readBtn: "Lire",
      evalBtn: "S'évaluer",
      searchPlaceholder: "Chercher une Sourate...",
      recentConsulted: "Récemment consultées",
      allSurahs: "Toutes les Sourates",
      resultsFor: 'Résultats pour',
      accessCompleteList: "Accéder à la liste complète",
      loading: "Chargement...",
      allFilter: "Toutes",
      meccanFilter: "Méquoises",
      medinanFilter: "Médinoises",
      bookmarksTitle: "Mes Marque-pages",
      noBookmarks: "Aucun marque-page enregistré pour le moment.",
      closeBtn: "Fermer"
    },
    ar: {
      title: "الحافظ",
      studyTitle: "الحفظ والتلاوة",
      studySubtitle: "مساحتك الشخصية على alhafiz.fr",
      masteredTitle: "حالة التقدم",
      masteredVerses: "آيات محفوظة",
      continueReading: "متابعة القراءة",
      startStudy: "بدء الحفظ والدراسة",
      myChantiers: "مشاريع الحفظ الجارية",
      lastActivity: "آخر نشاط: الآية",
      readBtn: "قراءة",
      evalBtn: "سجّل وتقيّم",
      searchPlaceholder: "ابحث عن سورة...",
      recentConsulted: "المنتقاة حديثاً",
      allSurahs: "جميع السور",
      resultsFor: 'نتائج البحث عن',
      accessCompleteList: "الذهاب إلى القائمة الكاملة للسور",
      loading: "جاري التحميل...",
      allFilter: "الكل",
      meccanFilter: "مكية",
      medinanFilter: "مدنية",
      bookmarksTitle: "المحفوظات والآيات",
      noBookmarks: "لا توجد آيات محفوظة حالياً.",
      closeBtn: "إغلاق"
    },
    en: {
      title: "Al-Hafiz",
      studyTitle: "Memorization & Recitation",
      studySubtitle: "Your personal space on alhafiz.fr",
      masteredTitle: "Progress Status",
      masteredVerses: "Mastered verses",
      continueReading: "Continue reading",
      startStudy: "Start study",
      myChantiers: "My Memorization Projects",
      lastActivity: "Last activity: Verse",
      readBtn: "Read",
      evalBtn: "Evaluate",
      searchPlaceholder: "Search a Surah...",
      recentConsulted: "Recently viewed",
      allSurahs: "All Surahs",
      resultsFor: 'Results for',
      accessCompleteList: "Access complete list",
      loading: "Loading...",
      allFilter: "All",
      meccanFilter: "Meccan",
      medinanFilter: "Medinan",
      bookmarksTitle: "My Bookmarks",
      noBookmarks: "No bookmarks saved yet.",
      closeBtn: "Close"
    }
  };

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const handleLangChange = (newLang: 'fr' | 'ar' | 'en') => {
    setLang(newLang);
    localStorage.setItem('alhafiz_lang', newLang);
  };

  const updateStats = useCallback(() => {
    const mastered = JSON.parse(localStorage.getItem('alhafiz_mastered') || '[]');
    setMasteredCount(mastered.length);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('mode') === 'all') {
          setIsExploringAll(true);
        }

        const data = await fetchSurahs();
        setSurahs(data);
        setBookmarks(JSON.parse(localStorage.getItem('alhafiz_bookmarks') || '[]'));
        setLastPos(JSON.parse(localStorage.getItem('alhafiz_last_pos') || 'null'));
        setRecentlyViewed(JSON.parse(localStorage.getItem('alhafiz_recent_surahs') || '[]'));
        setSurahPositions(JSON.parse(localStorage.getItem('alhafiz_surah_positions') || '{}'));
        updateStats();

        const visited = localStorage.getItem('alhafiz_visited') === 'true';
        const hasHistory = localStorage.getItem('alhafiz_last_pos') !== null || JSON.parse(localStorage.getItem('alhafiz_bookmarks') || '[]').length > 0;
        if (visited || hasHistory || params.get('app') === 'true') {
          setShowLanding(false);
        }
      } catch (err) {
        console.error('Erreur lors du chargement', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.addEventListener('storage_update', updateStats);
    return () => window.removeEventListener('storage_update', updateStats);
  }, [updateStats]);

  useEffect(() => {
    if (!selectedSurah) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedSurah]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    const newRecent = [surah.number, ...recentlyViewed.filter(n => n !== surah.number)].slice(0, 5);
    setRecentlyViewed(newRecent);
    localStorage.setItem('alhafiz_recent_surahs', JSON.stringify(newRecent));
  };

  const handleStartStudy = () => {
    setIsExploringAll(true);
    setTimeout(() => {
      surahListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    if (!window.location.href.startsWith('blob:')) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('mode', 'all');
        window.open(url.toString(), '_blank');
      } catch (e) {
        console.warn("Impossible d'ouvrir un nouvel onglet, affichage local uniquement.");
      }
    }
  };

  const filteredSurahs = surahs.filter(s => {
    const matchesSearch = s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.number.toString() === searchQuery;
    if (!matchesSearch) return false;
    
    if (revelationFilter === 'meccan') return s.revelationType === 'Meccan';
    if (revelationFilter === 'medinan') return s.revelationType === 'Medinan';
    return true;
  });

  const effectiveIsExploring = isExploringAll || searchQuery.length > 0;
  const recentSurahsList = surahs.filter(s => recentlyViewed.includes(s.number))
    .sort((a, b) => recentlyViewed.indexOf(a.number) - recentlyViewed.indexOf(b.number));

  const masteryPercent = (masteredCount / TOTAL_VERSES) * 100;

  const getSavedVerseForSurah = (surahNum: number) => {
    const bookmark = bookmarks.find(b => b.surahNumber === surahNum);
    if (bookmark) return bookmark.ayahNumber;
    return surahPositions[surahNum] || undefined;
  };

  if (showLanding) {
    return (
      <LandingPage 
        onEnter={() => {
          localStorage.setItem('alhafiz_visited', 'true');
          setShowLanding(false);
          // Sync language from localStorage when entering the app
          setLang((localStorage.getItem('alhafiz_lang') as 'fr' | 'ar' | 'en') || 'fr');
        }} 
      />
    );
  }

  return (
    <Layout 
      title={selectedSurah ? (isRtl ? selectedSurah.name : selectedSurah.englishName) : t.title} 
      onBack={selectedSurah ? () => setSelectedSurah(null) : undefined}
      onLanding={() => {
        setShowLanding(true);
      }}
      theme="amber"
      lang={lang}
      onLangChange={handleLangChange}
    >
      {selectedSurah ? (
        <Reader surah={selectedSurah} lang={lang} />
      ) : (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              <div className="bg-[#eee8d5] rounded-[2.5rem] p-8 shadow-sm border border-[#d3ccb8] flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className={`text-center ${isRtl ? 'sm:text-right' : 'sm:text-left'} space-y-1`}>
                  <h2 className="text-3xl font-black text-[#586e75]">{t.studyTitle}</h2>
                  <p className="text-[#839496] text-[10px] font-black uppercase tracking-[0.2em]">{t.studySubtitle}</p>
                </div>
                <div className="hidden sm:block">
                  <svg className="w-12 h-12 text-[#b58900] opacity-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6l9-4.91V17h2V9L12 3zM5 13.18v2.81l7 3.82l7-3.82v-2.81l-7 3.82l-7-3.82z"/>
                  </svg>
                </div>
              </div>

              <div className="bg-[#b58900] text-white rounded-[2.5rem] p-8 shadow-xl shadow-[#b58900]/20 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{t.masteredTitle}</p>
                        <h3 className="text-4xl font-bold">{masteredCount} <span className="text-lg font-medium opacity-50">{t.masteredVerses}</span></h3>
                      </div>
                      <div className="text-5xl font-black opacity-20 tracking-tighter">
                        {masteryPercent.toFixed(1)}%
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden">
                         <div className={`h-full bg-white rounded-full transition-all duration-1000 ease-out`} style={{ width: `${masteryPercent}%` }}></div>
                      </div>
                      
                      <div className="flex gap-4">
                         {lastPos ? (
                           <button onClick={() => {
                             const s = surahs.find(sur => sur.number === lastPos.surahNumber);
                             if (s) handleSurahSelect(s);
                           }} className="px-8 py-3 bg-white text-[#b58900] rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                             {t.continueReading}
                           </button>
                         ) : (
                           <button onClick={handleStartStudy} className="px-8 py-3 bg-[#8d6e63] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#795548] transition-all active:scale-95">
                             {t.startStudy}
                           </button>
                         )}
                      </div>
                   </div>
                </div>
                <div className={`absolute bottom-[-10%] opacity-10 pointer-events-none ${isRtl ? 'left-[-10%]' : 'right-[-10%]'}`}>
                  <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0L61.22 38.77L100 50L61.22 61.22L50 100L38.77 61.22L0 50L38.77 38.77L50 0Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <QuickAudioPlayer theme="amber" lang={lang} />
            </div>
          </div>

          {/* Dashboard Mes Chantiers en Cours */}
          {(() => {
            const activeSurahs = Object.keys(surahPositions)
              .map(Number)
              .map(num => surahs.find(s => s.number === num))
              .filter((s): s is Surah => !!s)
              .slice(0, 3);
            
            if (activeSurahs.length === 0) return null;

            return (
              <div className="space-y-6">
                <div className={`flex justify-between items-center px-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#93a1a1]">
                    {t.myChantiers}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeSurahs.map(surah => {
                    const lastAyah = surahPositions[surah.number];
                    return (
                      <div key={surah.number} className="bg-white rounded-[2rem] p-6 border border-[#eee8d5] shadow-sm flex flex-col justify-between hover:border-[#b58900]/30 transition-all group">
                        <div className="space-y-2">
                          <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-[#b58900] font-black bg-[#fdf6e3] px-3 py-1 rounded-full text-[9px] border border-[#eee8d5]">
                              {surah.number}
                            </span>
                            <span className="arabic-font text-2xl text-[#073642]">{surah.name}</span>
                          </div>
                          <h4 className={`text-base font-black text-[#073642] ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? surah.name : surah.englishName}</h4>
                          <p className={`text-[10px] text-[#b58900] font-black uppercase tracking-wider opacity-60 ${isRtl ? 'text-right' : 'text-left'}`}>
                            {t.lastActivity} {lastAyah}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-6 pt-4 border-t border-[#fdf6e3]">
                          <button 
                            onClick={() => {
                              localStorage.setItem('alhafiz_last_pos', JSON.stringify({ surahNumber: surah.number, ayahNumber: lastAyah }));
                              handleSurahSelect(surah);
                            }}
                            className="flex-1 py-3 bg-[#eee8d5] text-[#586e75] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#e4ddc3] transition-all active:scale-95"
                          >
                            {t.readBtn}
                          </button>
                          <button 
                            onClick={() => {
                              localStorage.setItem('alhafiz_last_pos', JSON.stringify({ surahNumber: surah.number, ayahNumber: lastAyah }));
                              localStorage.setItem('alhafiz_force_exam', 'true');
                              handleSurahSelect(surah);
                            }}
                            className="flex-1 py-3 bg-[#268bd2] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2aa198] transition-all shadow-md shadow-[#268bd2]/10 active:scale-95"
                          >
                            {t.evalBtn}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div className="max-w-2xl mx-auto pt-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center" ref={surahListRef}>
              <div className="relative flex-1 w-full">
                 <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-7' : 'left-0 pl-7'} flex items-center pointer-events-none`}>
                    <svg className="h-6 w-6 text-[#b58900] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder={t.searchPlaceholder} 
                    className={`block w-full ${isRtl ? 'pr-16 pl-8' : 'pl-16 pr-8'} py-5 bg-white border-2 border-[#eee8d5] rounded-[2.5rem] shadow-xl shadow-[#b58900]/5 focus:ring-8 focus:ring-[#b58900]/5 focus:border-[#b58900] outline-none transition-all text-lg font-semibold text-[#586e75] placeholder-[#93a1a1]/50 ${isRtl ? 'text-right' : 'text-left'}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
              <button 
                onClick={() => setShowBookmarksModal(true)} 
                className="px-6 py-5 bg-[#b58900] text-white rounded-[2.5rem] hover:bg-[#859900] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#b58900]/10 font-bold active:scale-95 whitespace-nowrap text-base w-full sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{isRtl ? "المحفوظات" : "Favoris"}</span>
              </button>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              {[
                { id: 'all', label: t.allFilter },
                { id: 'meccan', label: t.meccanFilter },
                { id: 'medinan', label: t.medinanFilter }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setRevelationFilter(filter.id as any)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border active:scale-95 ${revelationFilter === filter.id ? 'bg-[#b58900] text-white border-[#b58900] shadow-md' : 'bg-white text-[#586e75] border-[#eee8d5] hover:border-[#b58900]/30'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {!effectiveIsExploring && recentSurahsList.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#93a1a1] border-b border-[#eee8d5] pb-2 px-8">{t.recentConsulted}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentSurahsList.map(surah => (
                    <SurahCard key={surah.number} surah={surah} onClick={handleSurahSelect} bookmarkVerseNumber={getSavedVerseForSurah(surah.number)} />
                  ))}
                </div>
              </div>
            )}

            {effectiveIsExploring ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                <div className={`flex justify-between items-center px-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#93a1a1]">
                    {searchQuery ? `${t.resultsFor} "${searchQuery}"` : t.allSurahs}
                  </h3>
                  {!searchQuery && (
                    <button onClick={() => setIsExploringAll(false)} className="p-2 text-[#93a1a1] hover:text-[#586e75] transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredSurahs.map(surah => (
                    <SurahCard key={surah.number} surah={surah} onClick={handleSurahSelect} bookmarkVerseNumber={getSavedVerseForSurah(surah.number)} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <button 
                  onClick={handleStartStudy}
                  className="px-12 py-5 bg-[#eee8d5] text-[#586e75] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-[#e4ddc3] hover:text-[#b58900] border border-[#d3ccb8] transition-all active:scale-95"
                >
                  {t.accessCompleteList}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showScrollTop && !selectedSurah && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="fixed bottom-6 right-6 p-4 bg-[#b58900] text-white rounded-full shadow-2xl hover:bg-[#859900] transition-all duration-300 active:scale-95 z-50 flex items-center justify-center border border-white/20 animate-in zoom-in-50"
          title="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {showBookmarksModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#fdf6e3] rounded-[2.5rem] border border-[#d3ccb8] w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-[#eee8d5]">
              <h3 className="text-xl font-black text-[#073642] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#b58900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {t.bookmarksTitle}
              </h3>
              <button 
                onClick={() => setShowBookmarksModal(false)} 
                className="p-2 text-[#93a1a1] hover:text-[#586e75] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh] space-y-3">
              {bookmarks.length === 0 ? (
                <p className="text-[#93a1a1] text-center py-8 text-sm font-semibold">{t.noBookmarks}</p>
              ) : (
                bookmarks.map((bookmark, idx) => {
                  const matchingSurah = surahs.find(s => s.number === bookmark.surahNumber);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setShowBookmarksModal(false);
                        if (matchingSurah) {
                          localStorage.setItem('alhafiz_last_pos', JSON.stringify({ surahNumber: bookmark.surahNumber, ayahNumber: bookmark.ayahNumber }));
                          handleSurahSelect(matchingSurah);
                        }
                      }}
                      className="bg-white p-4 rounded-2xl border border-[#eee8d5] shadow-sm hover:border-[#b58900] transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-[#073642] group-hover:text-[#b58900] transition-colors">{matchingSurah ? (isRtl ? matchingSurah.name : matchingSurah.englishName) : bookmark.surahName}</h4>
                        <p className="text-[10px] font-black text-[#b58900] uppercase tracking-wider">Verset / Ayah {bookmark.ayahNumber}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#fdf6e3] border border-[#eee8d5] text-[#b58900] flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform">
                        {bookmark.surahNumber}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <button 
              onClick={() => setShowBookmarksModal(false)}
              className="w-full py-4 bg-[#eee8d5] text-[#586e75] hover:bg-[#e4ddc3] rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
