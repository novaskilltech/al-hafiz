import { Type } from '@google/genai';
import React, { useState, useRef } from 'react';
import { Ayah, QuranVersion } from '../types';
import AyahDisplay from './AyahDisplay';

interface WordReport {
  word_ref: string;
  status: 'OK' | 'WRONG' | 'UNCERTAIN';
  issue: string; // Format: "Arabe / Français"
}

interface TajweedCheck {
  check: string; // Format: "Arabe / Français"
  status: 'PASSED' | 'FAILED' | 'UNCERTAIN';
  why: string; // Format: "Arabe / Français"
}

interface StrictReport {
  verdict: 'CORRECT' | 'INCORRECT' | 'NEEDS_REVIEW';
  confidence: number;
  word_by_word: WordReport[];
  tajweed_checks: TajweedCheck[];
  final_feedback: {
    max_2_fixes: string[]; // Format: "Arabe / Français"
    don_t_overcorrect_notes: string[]; 
  };
}

interface HifzValidatorProps {
  ayah: Ayah;
  surahName: string;
  riwaya: QuranVersion;
  surahNumber: number;
  useImageOnly?: boolean;
  fontSize?: number;
  lang?: 'fr' | 'ar' | 'en';
}

const HifzValidator: React.FC<HifzValidatorProps> = ({ ayah, surahName, riwaya, surahNumber, useImageOnly, fontSize, lang = 'fr' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<StrictReport | null>(null);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRtl = lang === 'ar';

  const translations = {
    fr: {
      iaExaminer: "Examinateur IA",
      subTitle: "Validation Tajwīd & Hifz",
      micError: "Microphone inaccessible.",
      connError: "Analyse impossible. Vérifiez votre microphone et connexion.",
      pressToAnalyze: "Appuyez pour analyser",
      analyzing: "Analyse en cours...",
      touchToRecite: "Touchez pour réciter",
      reciteAgain: "Réciter à nouveau",
      correctVerdict: "CORRECT / ممتاز",
      revisionVerdict: "RÉVISION / تحتاج مراجعة",
      precision: "PRÉCISION",
      wordAnalysis: "Analyse des mots / تحليل الكلمات",
      tajweedTitle: "Tajwid / أحكام التجويد",
      feedbackTitle: "Conseils / نصائح الحفظ والتجويد",
      tapWordForDetails: "Touchez un mot coloré pour voir l'explication",
      closeDetails: "Fermer l'explication"
    },
    ar: {
      iaExaminer: "المصحح الذكي",
      subTitle: "تأكيد التجويد والحفظ",
      micError: "الميكروفون غير متاح.",
      connError: "فشل التحليل. تحقق من الميكروفون والاتصال بالإنترنت.",
      pressToAnalyze: "اضغط لتحليل التلاوة",
      analyzing: "جاري التحليل...",
      touchToRecite: "اضغط هنا لبدء التلاوة",
      reciteAgain: "إعادة التلاوة",
      correctVerdict: "ممتاز / CORRECT",
      revisionVerdict: "تحتاج مراجعة / RÉVISION",
      precision: "الدقة",
      wordAnalysis: "تحليل الكلمات / Analyse des mots",
      tajweedTitle: "أحكام التجويد / Tajwid",
      feedbackTitle: "نصائح الحفظ والتجويد / Conseils",
      tapWordForDetails: "اضغط على الكلمة الملونة للاطلاع على تفاصيل الخطأ",
      closeDetails: "إغلاق التفاصيل"
    },
    en: {
      iaExaminer: "AI Examiner",
      subTitle: "Tajwīd & Hifz Validation",
      micError: "Microphone inaccessible.",
      connError: "Analysis failed. Check your microphone and connection.",
      pressToAnalyze: "Press to analyze",
      analyzing: "Analyzing...",
      touchToRecite: "Touch to recite",
      reciteAgain: "Recite again",
      correctVerdict: "CORRECT / ممتاز",
      revisionVerdict: "REVISION / تحتاج مراجعة",
      precision: "PRECISION",
      wordAnalysis: "Word Analysis",
      tajweedTitle: "Tajwid Rules",
      feedbackTitle: "Advice & Tips",
      tapWordForDetails: "Tap a highlighted word to view error details",
      closeDetails: "Close details"
    }
  };

  const t = translations[lang];

  const startRecording = async () => {
    try {
      setError(null);
      setReport(null);
      setSelectedWordIdx(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        analyzeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(t.micError);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const saveMastery = () => {
    const mastered = JSON.parse(localStorage.getItem('alhafiz_mastered') || '[]');
    const key = `${surahName}:${ayah.numberInSurah}`;
    if (!mastered.includes(key)) {
      mastered.push(key);
      localStorage.setItem('alhafiz_mastered', JSON.stringify(mastered));
      window.dispatchEvent(new Event('storage_update'));
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      const base64Audio = await blobToBase64(audioBlob);
      const targetLangName = lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'Français';
      const systemInstruction = `
        أنت خبير في مراجعة حفظ القرآن الكريم والتجويد.
        الرواية: ${riwaya}.
        الآية المتوقعة: "${ayah.text}".
        
        القواعد الصارمة:
        1. قارن التلاوة الصوتية بالنص العربي الأصلي.
        2. يجب أن تكون جميع الردود النصية وتفسيرات الأخطاء وأحكام التجويد (التي تشمل حقول: issue, check, why, max_2_fixes, don_t_overcorrect_notes) مكتوبة باللغة المحددة فقط وهي: ${targetLangName}. لا تخلط اللغات ولا تضع ترجمات متعددة.
        3. ركز على مخارج الحروف وأحكام التجويد (مثل الغنة، الإخفاء، القلقلة).
        4. الرد يجب أن يكون بتنسيق JSON حصراً.
      `;

      const apiKey = process.env.API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [
              { text: systemInstruction }, 
              { inlineData: { mimeType: 'audio/webm', data: base64Audio } }
            ] 
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                verdict: { type: Type.STRING, description: 'CORRECT, INCORRECT, or NEEDS_REVIEW' },
                confidence: { type: Type.NUMBER },
                word_by_word: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT, 
                    properties: { 
                      word_ref: { type: Type.STRING, description: 'الكلمة من الآية' }, 
                      status: { type: Type.STRING }, 
                      issue: { type: Type.STRING, description: `وصف الخطأ باللغة ${targetLangName}` } 
                    } 
                  } 
                },
                tajweed_checks: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT, 
                    properties: { 
                      check: { type: Type.STRING, description: `اسم الحكم باللغة ${targetLangName}` }, 
                      status: { type: Type.STRING }, 
                      why: { type: Type.STRING, description: `الشرح باللغة ${targetLangName}` } 
                    } 
                  } 
                },
                final_feedback: { 
                  type: Type.OBJECT, 
                  properties: { 
                    max_2_fixes: { type: Type.ARRAY, items: { type: Type.STRING }, description: `نصائح باللغة ${targetLangName}` },
                    don_t_overcorrect_notes: { type: Type.ARRAY, items: { type: Type.STRING } } 
                  } 
                }
              }
            }
          }
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const resJson = await res.json();
      const jsonStr = resJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const parsedReport = JSON.parse(jsonStr || '{}') as StrictReport;
      setReport(parsedReport);
      
      if (parsedReport.verdict?.toUpperCase() === 'CORRECT') {
        saveMastery();
      }
    } catch (err: any) {
      console.error(err);
      setError(t.connError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    const v = verdict?.toUpperCase();
    switch (v) {
      case 'CORRECT': return 'bg-[#859900] text-white border-transparent';
      case 'INCORRECT': return 'bg-[#dc322f] text-white border-transparent';
      default: return 'bg-[#b58900] text-white border-transparent';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'text-[#859900]';
      case 'WRONG': return 'text-[#dc322f]';
      default: return 'text-[#b58900]';
    }
  };

  const renderBilingualText = (text: string, isTitle = false) => {
    if (!text) return null;
    const parts = text.split(' / ');
    return (
      <div className="flex flex-col gap-1">
        <span className={`lateef-font ${isTitle ? 'text-2xl' : 'text-xl'} leading-tight`}>{parts[0]}</span>
        {parts[1] && <span className={`text-[#586e75] font-semibold italic ${isTitle ? 'text-xs' : 'text-[10px]'} uppercase tracking-wider`}>{parts[1]}</span>}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-[#eee8d5] shadow-lg text-center space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#073642]">{t.iaExaminer}</h2>
          <p className="text-[10px] text-[#93a1a1] font-black uppercase tracking-[0.4em]">{t.subTitle}</p>
        </div>

        {/* Verse Display Area (Directly annotated with words if report exists) */}
        <div className="bg-[#fdf6e3] rounded-[2rem] p-6 sm:p-8 border border-[#eee8d5] shadow-inner flex flex-col justify-center items-center min-h-[140px] relative transition-all">
          {!report ? (
            <AyahDisplay ayah={ayah} surahNumber={surahNumber} useImageOnly={useImageOnly} fontSize={fontSize} />
          ) : (
            <div className="w-full space-y-5 animate-in fade-in duration-300">
              {/* Verdict header banner */}
              <div className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-black tracking-wider uppercase shadow-sm ${getVerdictColor(report.verdict)}`}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  {report.verdict === 'CORRECT' ? t.correctVerdict : t.revisionVerdict}
                </span>
                <span>{t.precision}: {(report.confidence * 100).toFixed(0)}%</span>
              </div>

              {/* Interactive Ayah Words */}
              <div 
                dir="rtl" 
                className="flex flex-wrap gap-x-2.5 gap-y-3 justify-center items-center py-2"
              >
                {report.word_by_word.map((item, idx) => {
                  const isSelected = selectedWordIdx === idx;
                  const isWrong = item.status === 'WRONG';
                  const isUncertain = item.status === 'UNCERTAIN';
                  const isOk = item.status === 'OK';

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedWordIdx(isSelected ? null : idx)}
                      className={`
                        group relative px-3 py-1 rounded-2xl transition-all duration-200 active:scale-95 flex flex-col items-center cursor-pointer
                        ${isOk ? 'bg-[#859900]/10 hover:bg-[#859900]/20 text-[#859900] border border-[#859900]/30' : ''}
                        ${isUncertain ? 'bg-[#b58900]/15 hover:bg-[#b58900]/25 text-[#b58900] border-2 border-dashed border-[#b58900] shadow-sm' : ''}
                        ${isWrong ? 'bg-[#dc322f]/15 hover:bg-[#dc322f]/25 text-[#dc322f] border-2 border-[#dc322f] shadow-sm' : ''}
                        ${isSelected ? 'ring-4 ring-[#b58900]/40 scale-105 shadow-md' : ''}
                      `}
                    >
                      <span className="lateef-font text-3xl sm:text-4xl font-bold leading-normal">
                        {item.word_ref}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isOk ? 'bg-[#859900]' : isUncertain ? 'bg-[#b58900]' : 'bg-[#dc322f]'}`}></span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Word Details Card (Popover) */}
              {selectedWordIdx !== null && report.word_by_word[selectedWordIdx] && (
                <div className="bg-white rounded-2xl p-4 border border-[#eee8d5] shadow-xl animate-in zoom-in-95 duration-200 text-center space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#93a1a1] pb-1 border-b border-[#eee8d5]">
                    <span>{t.wordAnalysis}</span>
                    <button 
                      type="button"
                      onClick={() => setSelectedWordIdx(null)}
                      className="text-[#dc322f] hover:underline cursor-pointer"
                    >
                      {t.closeDetails} ✕
                    </button>
                  </div>
                  <div className="lateef-font text-3xl text-[#073642] font-bold">
                    {report.word_by_word[selectedWordIdx].word_ref}
                  </div>
                  <div className="text-xs font-semibold text-[#586e75]">
                    {report.word_by_word[selectedWordIdx].issue ? (
                      renderBilingualText(report.word_by_word[selectedWordIdx].issue)
                    ) : (
                      <span className="text-[#859900] font-bold">✓ Prononciation et mémorisation conformes</span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-[#93a1a1] font-black uppercase tracking-wider text-center">
                {t.tapWordForDetails}
              </p>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
            className={`
              relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95
              ${isRecording 
                ? 'bg-[#dc322f] animate-pulse ring-[12px] ring-[#dc322f]/10' 
                : 'bg-[#073642] hover:bg-[#002b36] shadow-[#073642]/20'
              }
              ${isAnalyzing ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {isAnalyzing ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <rect x="6" y="6" width="8" height="8" rx="1.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          
          <div className="space-y-0.5">
            <p className="text-[11px] font-black text-[#b58900] uppercase tracking-[0.25em]">
              {isRecording ? t.pressToAnalyze : isAnalyzing ? t.analyzing : report ? t.reciteAgain : t.touchToRecite}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-[#dc322f]/5 border border-[#dc322f]/20 text-[#dc322f] p-4 rounded-[1.5rem] text-[11px] font-bold flex items-center gap-3 animate-in shake">
          {error}
        </div>
      )}

      {/* Tajweed checks and Advice Cards */}
      {report && (
        <div className="space-y-5 animate-in slide-in-from-bottom-6 duration-500">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#eee8d5] shadow-lg space-y-6">
            {report.tajweed_checks && report.tajweed_checks.length > 0 && (
              <div className="space-y-3">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] text-[#93a1a1] ${isRtl ? 'text-right' : 'text-left'}`}>{t.tajweedTitle}</h3>
                <div className="space-y-2.5" dir={isRtl ? 'rtl' : 'ltr'}>
                  {report.tajweed_checks.map((check, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-4 bg-[#fdf6e3]/60 rounded-2xl border border-[#eee8d5] ${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${check.status === 'PASSED' ? 'bg-[#859900]' : 'bg-[#dc322f]'}`} />
                      <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {renderBilingualText(check.check, true)}
                        <div className="mt-1 opacity-80 text-xs">
                          {renderBilingualText(check.why)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.final_feedback?.max_2_fixes && report.final_feedback.max_2_fixes.length > 0 && (
              <div className="bg-[#859900] text-white rounded-2xl p-6 space-y-4 shadow-md shadow-[#859900]/15" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className={`flex items-center gap-2.5 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <svg className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="lateef-font text-2xl font-bold">{t.feedbackTitle}</h3>
                </div>
                <div className="space-y-2.5">
                  {report.final_feedback.max_2_fixes.map((fix, idx) => (
                    <div key={idx} className={`bg-white/10 p-3.5 rounded-xl text-xs font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>
                      {renderBilingualText(fix.includes(' / ') ? fix : `${fix} / Conseil`)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HifzValidator;
