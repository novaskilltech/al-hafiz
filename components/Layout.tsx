import React from 'react';
import { SIGNATURE, DEDICATION } from '../constants';
import { ThemeType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  onLanding?: () => void;
  theme?: ThemeType;
  lang?: 'fr' | 'ar' | 'en';
  onLangChange?: (l: 'fr' | 'ar' | 'en') => void;
}

const THEME_CLASSES: Record<ThemeType, { body: string, header: string, footer: string, text: string }> = {
  emerald: { body: 'bg-[#fcfaf2]', header: 'bg-white', footer: 'bg-[#5d4037]', text: 'text-[#5d4037]' },
  indigo: { body: 'bg-slate-900', header: 'bg-slate-800', footer: 'bg-indigo-950', text: 'text-indigo-50' },
  amber: { body: 'bg-[#fdf6e3]', header: 'bg-[#eee8d5]', footer: 'bg-[#073642]', text: 'text-[#586e75]' },
  rose: { body: 'bg-[#fff5f5]', header: 'bg-white', footer: 'bg-rose-900', text: 'text-rose-950' },
};

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, onLanding, theme = 'amber', lang = 'fr', onLangChange }) => {
  const tc = THEME_CLASSES[theme];
  const isRtl = lang === 'ar';

  const dedication = isRtl ? "هذا صدقة جارية لي ولوالدي ولوالدتي ولجميع عائلتي." : DEDICATION;
  const signature = isRtl ? "أبو سليمان صلاح الدين أحمد" : SIGNATURE;
  const rights = isRtl ? "© ٢٠٢٦ alhafiz.fr • جميع الحقوق محفوظة" : "© 2026 alhafiz.fr • Tous droits réservés";
  const homeText = isRtl ? "الرئيسية" : "Accueil";

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col transition-colors duration-500 ${tc.body} ${tc.text} ${isRtl ? 'font-sans' : ''}`}
    >
      <header className={`sticky top-0 z-50 ${tc.header} backdrop-blur-md border-b border-[#d3ccb8]/50 shadow-sm px-3 py-2.5 sm:px-8 sm:py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2 sm:gap-4">
          {onBack && (
            <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors active:scale-95 text-[#b58900] ${isRtl ? 'rotate-180' : ''}`} aria-label="Retour">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <img 
              src="/images/quran_logo_icon.png" 
              alt="Al-Hafiz Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight">{title}</h1>
              <span className="text-[9px] sm:text-[10px] text-[#b58900] font-black tracking-[0.2em] uppercase opacity-70">alhafiz.fr</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language selector in Header */}
          {onLangChange && (
            <div className="flex bg-black/5 rounded-full p-1 border border-[#d3ccb8]/50 gap-0.5">
              <button 
                onClick={() => onLangChange('fr')} 
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all min-w-[28px] text-center ${lang === 'fr' ? 'bg-[#b58900] text-white shadow-sm' : 'opacity-50 text-[#586e75] hover:opacity-80'}`}
              >
                FR
              </button>
              <button 
                onClick={() => onLangChange('ar')} 
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all min-w-[28px] text-center ${lang === 'ar' ? 'bg-[#b58900] text-white shadow-sm' : 'opacity-50 text-[#586e75] hover:opacity-80'}`}
              >
                AR
              </button>
              <button 
                onClick={() => onLangChange('en')} 
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all min-w-[28px] text-center ${lang === 'en' ? 'bg-[#b58900] text-white shadow-sm' : 'opacity-50 text-[#586e75] hover:opacity-80'}`}
              >
                EN
              </button>
            </div>
          )}

          {onLanding && (
            <button 
              onClick={onLanding} 
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-[#d3ccb8]/50 text-[#b58900] rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">{homeText}</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full p-4 sm:p-8">
        {children}
      </main>

      <footer className={`${tc.footer} text-white py-16 px-6 mt-auto`}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-sm font-medium opacity-80 leading-relaxed italic px-4 max-w-2xl mx-auto">
            "{dedication}"
          </p>
          <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-4">
            <p className="text-[11px] font-black uppercase tracking-[0.4em]">{signature}</p>
            <div className="flex items-center gap-4 opacity-40 text-[9px] font-black tracking-widest">
              <span>ALHAFIZ.FR</span>
              <span className="w-1.5 h-1.5 bg-[#b58900] rounded-full"></span>
              <span>EVERYAYAH.COM</span>
            </div>
            <div className="mt-4 opacity-25 text-[8px] font-bold tracking-[0.2em] uppercase">
              {rights}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
