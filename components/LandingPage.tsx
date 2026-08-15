import React, { useState } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

type LangType = 'fr' | 'ar' | 'en';

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [selectedSection, setSelectedSection] = useState<'recitation' | 'ia' | 'audio' | null>(null);
  const [lang, setLang] = useState<LangType>(() => {
    return (localStorage.getItem('alhafiz_lang') as LangType) || 'fr';
  });

  const handleLangSelect = (newLang: LangType) => {
    setLang(newLang);
    localStorage.setItem('alhafiz_lang', newLang);
  };

  const translations = {
    fr: {
      appWeb: "App Web",
      heroBadge: "Validation Vocale par IA",
      heroTitlePrefix: "Mémorisez le ",
      heroTitleHighlight: "Coran",
      heroTitleSuffix: " à votre rythme",
      heroDesc: "Une expérience spirituelle et technologique unique pour lire, écouter et valider la récitation de vos sourates en temps réel grâce à notre examinateur intelligent.",
      heroBtn: "Commencer l'Étude",
      featuresTitle: "Fonctionnalités Clés",
      featuresSubtitle: "Conçu pour votre cheminement",
      discoverBtn: "Découvrir →",
      footerSadaqa: "Ceci est une sadaqa jariah (aumône perpétuelle)",
      footerRights: "© 2026 alhafiz.fr • Tous droits réservés",
      modalBack: "Retour",
      modalEnter: "Accéder à l'application",
      features: {
        recitation: {
          title: "Double Récitation",
          desc: "Alternez facilement entre les riwayats Hafs et Warsh pour étudier selon les différentes lectures de manière fluide."
        },
        ia: {
          title: "Examinateur IA",
          desc: "Récitez dans votre micro et obtenez une correction instantanée mot à mot sur la mémorisation et les règles du Tajwid."
        },
        audio: {
          title: "Audio & Calligraphie",
          desc: "Écoutez les plus grands récitateurs avec un alignement audio mot à mot et la calligraphie originale du Coran."
        }
      }
    },
    en: {
      appWeb: "Web App",
      heroBadge: "AI Voice Validation",
      heroTitlePrefix: "Memorize the ",
      heroTitleHighlight: "Quran",
      heroTitleSuffix: " at your own pace",
      heroDesc: "A unique spiritual and technological experience to read, listen, and validate the recitation of your surahs in real time using our intelligent examiner.",
      heroBtn: "Start Study",
      featuresTitle: "Key Features",
      featuresSubtitle: "Designed for your journey",
      discoverBtn: "Discover →",
      footerSadaqa: "This is a sadaqa jariah (ongoing charity)",
      footerRights: "© 2026 alhafiz.fr • All rights reserved",
      modalBack: "Back",
      modalEnter: "Go to Application",
      features: {
        recitation: {
          title: "Dual Recitation",
          desc: "Easily switch between Hafs and Warsh riwayas to study according to different readings smoothly."
        },
        ia: {
          title: "AI Examiner",
          desc: "Recite in your microphone and get instant word-by-word feedback on memorization and Tajwid rules."
        },
        audio: {
          title: "Audio & Calligraphy",
          desc: "Listen to the greatest reciters with word-by-word audio alignment and the original Quranic calligraphy."
        }
      }
    },
    ar: {
      appWeb: "تطبيق الويب",
      heroBadge: "تأكيد صوتي بالذكاء الاصطناعي",
      heroTitlePrefix: "احفظ ",
      heroTitleHighlight: "القرآن الكريم",
      heroTitleSuffix: " وتدبره حسب وتيرتك",
      heroDesc: "تجربة روحية وتقنية فريدة لقراءة واستماع وتأكيد تlaوة السور في الوقت الفعلي بفضل المقيّم الذكي بالذكاء الاصطناعي.",
      heroBtn: "ابدأ الدراسة الآن",
      featuresTitle: "الميزات الرئيسية",
      featuresSubtitle: "مصمم لرحلتك التعليمية وحفظك",
      discoverBtn: "اكتشف ←",
      footerSadaqa: "هذه صدقة جارية (نسألكم الدعاء)",
      footerRights: "© ٢٠٢٦ alhafiz.fr • جميع الحقوق محفوظة",
      modalBack: "عودة",
      modalEnter: "الذهاب إلى التطبيق",
      features: {
        recitation: {
          title: "قراءة مزدوجة",
          desc: "تنقل بسهولة بين روايتي حفص وورش للدراسة وفق القراءات المختلفة بكل سلاسة."
        },
        ia: {
          title: "المصحح بالذكاء الاصطناعي",
          desc: "رتل في الميكروفون واحصل على تصحيح فوري كلمة بكلمة للحفظ وقواعد التجويد."
        },
        audio: {
          title: "الصوت والخط العربي",
          desc: "استمع إلى كبار القراء مع محاذاة صوتية كلمة بكلمة والخط العثماني الأصلي للمصحف."
        }
      }
    }
  };

  const sectionsData = {
    recitation: {
      fr: {
        title: "Double Récitation & Riwayats",
        subtitle: "Hafs & Warsh",
        description: "Notre application intègre les deux modes de lecture (riwayats) les plus répandus pour vous accompagner au mieux dans votre étude.",
        details: [
          {
            label: "Riwaya Hafs (حفص عن عاصم)",
            text: "Cette lecture, originaire de Kufa, est aujourd'hui la plus répandue et lue dans la grande majorité du monde musulman."
          },
          {
            label: "Riwaya Warsh (ورش عن نافع)",
            text: "Cette lecture, originaire de Médine, est principalement lue et enseignée en Afrique du Nord (Maroc, Algérie, Tunisie) et dans plusieurs pays d'Afrique de l'Ouest."
          },
          {
            label: "Comment basculer de l'un à l'autre ?",
            text: "Dans le lecteur, utilisez simplement l'interrupteur 'HAFS / WARSH' situé en haut à droite. L'application met immédiatement à jour les textes arabes, les images de calligraphie originelles et charge la liste des récitateurs compatibles."
          }
        ]
      },
      en: {
        title: "Dual Recitation & Riwayats",
        subtitle: "Hafs & Warsh",
        description: "Our application integrates the two most widely read modes of recitation (riwayats) to best support your studies.",
        details: [
          {
            label: "Riwaya Hafs (حفص عن عاصم)",
            text: "This reading, originating from Kufa, is the most widely spread and recited in the majority of the Muslim world today."
          },
          {
            label: "Riwaya Warsh (ورش عن نافع)",
            text: "This reading, originating from Medina, is primarily recited and taught in North Africa (Morocco, Algeria, Tunisia) and several West African countries."
          },
          {
            label: "How to switch between them?",
            text: "In the reader, simply use the 'HAFS / WARSH' switch at the top right. The application instantly updates the Arabic texts, original calligraphy images, and loads the compatible reciters list."
          }
        ]
      },
      ar: {
        title: "القراءة المزدوجة والروايات",
        subtitle: "حفص وورش",
        description: "يدعم تطبيقنا روايتي حفص عن عاصم وورش عن نافع الأكثر انتشارًا لمساعدتك على الحفظ والتدبر.",
        details: [
          {
            label: "رواية حفص عن عاصم",
            text: "هذه الرواية، التي تعود أصولها إلى الكوفة، هي الأكثر انتشاراً وقراءة في معظم أنحاء العالم الإسلامي اليوم."
          },
          {
            label: "رواية ورش عن نافع",
            text: "هذه الرواية، التي تعود أصولها إلى المدينة المنورة، تُقرأ وتُدرّس بشكل أساسي في شمال إفريقيا (المغرب، الجزائر، تونس) وغربها."
          },
          {
            label: "كيفية الانتقال بين الروايتين؟",
            text: "في القارئ، استخدم ببساطة زر التبديل \"HAFS / WARSH\" الموجود في أعلى اليمين. يقوم التطبيق فوراً بتحديث النصوص العربية وصور الخط الأصلي وقائمة القراء المتوافقين."
          }
        ]
      }
    },
    ia: {
      fr: {
        title: "Examinateur Intelligent (IA)",
        subtitle: "Reconnaissance vocale et correction mot à mot",
        description: "Validez votre apprentissage de manière autonome grâce à notre modèle d'intelligence artificielle conçu spécifiquement pour la récitation.",
        details: [
          {
            label: "Activation de l'évaluation",
            text: "Sur n'importe quel verset du Coran, cliquez sur le bouton 'Examen'. L'application passera alors en mode écoute."
          },
          {
            label: "Récitation orale",
            text: "Autorisez l'accès à votre microphone et récitez le verset à voix haute. Notre IA traite votre voix en temps réel."
          },
          {
            label: "Analyse mot à mot",
            text: "Chaque mot prononcé correctement s'affiche en vert. En cas d'oubli, de mauvaise prononciation ou d'hésitation, l'IA colore les segments concernés en rouge ou en orange, vous permettant de cibler exactement vos axes d'amélioration."
          }
        ]
      },
      en: {
        title: "Intelligent Examiner (AI)",
        subtitle: "Speech Recognition & Word-by-Word Correction",
        description: "Validate your memorization independently thanks to our artificial intelligence model designed specifically for recitation.",
        details: [
          {
            label: "Activating Evaluation",
            text: "On any verse of the Quran, click the 'Exam' button. The application will then switch to listening mode."
          },
          {
            label: "Oral Recitation",
            text: "Allow microphone access and recite the verse out loud. Our AI processes your voice in real time."
          },
          {
            label: "Word-by-word Analysis",
            text: "Each word pronounced correctly turns green. In case of an omission, mispronunciation, or hesitation, the AI highlights the words in red or orange, targeting your exact improvement areas."
          }
        ]
      },
      ar: {
        title: "المصحح الذكي (الذكاء الاصطناعي)",
        subtitle: "التعرف على الصوت والتصحيح كلمة بكلمة",
        description: "تحقق من حفظك بشكل مستقل بفضل نموذج الذكاء الاصطناعي المطور خصيصاً لمتابعة التلاوة والتحقق منها.",
        details: [
          {
            label: "تفعيل التقييم",
            text: "في أي آية من القرآن الكريم، اضغط على زر \"Examen\". سينتقل التطبيق بعد ذلك إلى وضع الاستماع والمتابعة."
          },
          {
            label: "التلاوة الشفهية",
            text: "اسمح بالوصول إلى الميكروفون الخاص بك ورتل الآية بصوت واضح. يقوم الذكاء الاصطناعي بمعالجة صوتك في الوقت الفعلي."
          },
          {
            label: "التحليل كلمة بكلمة",
            text: "تظهر كل كلمة تنطقها بشكل صحيح باللون الأخضر. في حالة النسيان أو الخطأ، يلون الذكاء الاصطناعي الكلمات باللون الأحمر أو البرتقالي لمساعدتك على تحديد مواضع التحسين بدقة."
          }
        ]
      }
    },
    audio: {
      fr: {
        title: "Audio Multilingue & Calligraphie",
        subtitle: "Écoute immersive et conformité visuelle",
        description: "Associez l'écoute des plus grands récitateurs avec l'écriture originelle pour une immersion sensorielle complète.",
        details: [
          {
            label: "Grandes voix de la récitation",
            text: "Écoutez les cheikhs de référence (Al-Hussary, Alafasy, Minshawi, et d'autres) selon la version choisie (Hafs ou Warsh)."
          },
          {
            label: "Calligraphie Originale (Mushaf)",
            text: "Pour chaque verset, vous pouvez activer la calligraphie originale tirée du Mushaf de Médine. Cela vous aide à lier l'audio à la forme écrite classique du texte."
          },
          {
            label: "Contrôles de vitesse et de répétition",
            text: "Configurez des boucles de lecture pour répéter un verset ou un groupe de versets plusieurs fois afin de faciliter la mémorisation passive."
          }
        ]
      },
      en: {
        title: "Immersive Audio & Calligraphy",
        subtitle: "Immersive listening and visual compliance",
        description: "Combine listening to the greatest reciters with the original script for a complete sensory immersion.",
        details: [
          {
            label: "Great voices of recitation",
            text: "Listen to referencing Sheikhs (Al-Hussary, Alafasy, Minshawi, and others) according to your chosen version (Hafs or Warsh)."
          },
          {
            label: "Original Calligraphy (Mushaf)",
            text: "For each verse, you can enable the original calligraphy from the Medina Mushaf. This helps link the audio to the classic written script."
          },
          {
            label: "Speed and Repetition Controls",
            text: "Set up playback loops to repeat a verse or a group of verses multiple times to facilitate passive memorization."
          }
        ]
      },
      ar: {
        title: "الصوت والخط العربي للمصحف",
        subtitle: "استماع غامر ومطابقة بصرية للآيات",
        description: "اجمع بين الاستماع لكبار القراء والخط الأصلي للمصحف الشريف لتجربة تعليمية كاملة وحسية.",
        details: [
          {
            label: "أصوات تلاوة عذبة",
            text: "استمع إلى القراء المتميزين (الحصري، العفاسي، المنشاوي وغيرهم) حسب الرواية المختارة (حفص أو ورش)."
          },
          {
            label: "الخط الأصلي (رسم المصحف)",
            text: "لكل آية، يمكنك تفعيل الخط الأصلي المأخوذ من مصحف المدينة المنورة. يساعدك هذا على ربط الصوت بالرسم العثماني للقرآن."
          },
          {
            label: "التحكم في السرعة والتكرار",
            text: "قم بإعداد حلقات التكرار لإعادة آية أو مجموعة آيات عدة مرات لتسهيل الحفظ الممنهج والتلقائي."
          }
        ]
      }
    }
  };

  const t = translations[lang];
  const isRtl = lang === 'ar';

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-gradient-to-br from-[#002b36] via-[#073642] to-[#002b36] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#b58900] selection:text-white relative ${isRtl ? 'font-sans' : ''}`}
    >
      {/* Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <img 
            src="/images/quran_logo_icon.png" 
            alt="Al-Hafiz Logo" 
            className="w-12 h-12 object-contain filter drop-shadow-[0_0_10px_rgba(181,137,0,0.3)]"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-[#b58900]">AL-HAFIZ</span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#93a1a1]">alhafiz.fr</span>
          </div>
        </div>
        
        {/* Language selector + enter button */}
        <div className="flex items-center gap-4">
          <div className="flex bg-black/20 rounded-full p-1 border border-[#586e75]/20">
            <button 
              onClick={() => handleLangSelect('fr')} 
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${lang === 'fr' ? 'bg-white text-black' : 'opacity-40 text-white'}`}
            >
              FR
            </button>
            <button 
              onClick={() => handleLangSelect('ar')} 
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${lang === 'ar' ? 'bg-white text-black' : 'opacity-40 text-white'}`}
            >
              AR
            </button>
            <button 
              onClick={() => handleLangSelect('en')} 
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${lang === 'en' ? 'bg-white text-black' : 'opacity-40 text-white'}`}
            >
              EN
            </button>
          </div>
          <button 
            onClick={onEnter}
            className="px-6 py-2.5 bg-[#b58900] hover:bg-[#cb4b16] text-white rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg shadow-[#b58900]/20"
          >
            {t.appWeb}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
        <div className={`lg:col-span-6 space-y-8 text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'} z-10`}>
          <div className="inline-flex items-center gap-2 bg-[#073642]/60 border border-[#586e75]/30 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-[#859900] animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#93a1a1]">{t.heroBadge}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
            {t.heroTitlePrefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58900] to-[#cb4b16]">
              {t.heroTitleHighlight}
            </span>
            {t.heroTitleSuffix}
          </h1>
          <p className="text-base sm:text-lg text-[#93a1a1] leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t.heroDesc}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-start'}`}>
            <button 
              onClick={onEnter}
              className="px-10 py-5 bg-gradient-to-r from-[#b58900] to-[#cb4b16] hover:from-[#cb4b16] hover:to-[#b58900] text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-xl shadow-[#b58900]/20 hover:shadow-2xl hover:shadow-[#b58900]/30"
            >
              {t.heroBtn}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-center z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#b58900]/10 rounded-full blur-[100px] group-hover:bg-[#b58900]/15 transition-colors duration-500"></div>
            <img 
              src="/images/quran_3d_render.png" 
              alt="Coran 3D Rendu" 
              className="max-w-md w-full h-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-[#073642]/40 border-t border-[#586e75]/20 backdrop-blur-sm py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#b58900]">{t.featuresTitle}</h2>
            <p className="text-3xl font-black">{t.featuresSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={() => setSelectedSection('recitation')}
              className="bg-[#002b36]/60 border border-[#586e75]/30 p-8 rounded-[2rem] space-y-4 hover:border-[#b58900]/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#b58900]/10 flex items-center justify-center text-[#b58900]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-black flex justify-between items-center">
                {t.features.recitation.title}
                <span className="text-[10px] uppercase font-black tracking-wider text-[#b58900] bg-[#b58900]/10 px-2 py-0.5 rounded-md">
                  {t.discoverBtn}
                </span>
              </h3>
              <p className="text-[#93a1a1] text-sm leading-relaxed">
                {t.features.recitation.desc}
              </p>
            </div>

            <div 
              onClick={() => setSelectedSection('ia')}
              className="bg-[#002b36]/60 border border-[#586e75]/30 p-8 rounded-[2rem] space-y-4 hover:border-[#b58900]/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#859900]/10 flex items-center justify-center text-[#859900]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-black flex justify-between items-center">
                {t.features.ia.title}
                <span className="text-[10px] uppercase font-black tracking-wider text-[#859900] bg-[#859900]/10 px-2 py-0.5 rounded-md">
                  {t.discoverBtn}
                </span>
              </h3>
              <p className="text-[#93a1a1] text-sm leading-relaxed">
                {t.features.ia.desc}
              </p>
            </div>

            <div 
              onClick={() => setSelectedSection('audio')}
              className="bg-[#002b36]/60 border border-[#586e75]/30 p-8 rounded-[2rem] space-y-4 hover:border-[#b58900]/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#268bd2]/10 flex items-center justify-center text-[#268bd2]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-lg font-black flex justify-between items-center">
                {t.features.audio.title}
                <span className="text-[10px] uppercase font-black tracking-wider text-[#268bd2] bg-[#268bd2]/10 px-2 py-0.5 rounded-md">
                  {t.discoverBtn}
                </span>
              </h3>
              <p className="text-[#93a1a1] text-sm leading-relaxed">
                {t.features.audio.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financing & Ethical Model Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-[#586e75]/20">
        <div className="bg-[#073642]/60 rounded-[2rem] border border-[#b58900]/20 p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className={`space-y-4 max-w-2xl text-center ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
            <h3 className="text-[#b58900] text-xs font-black uppercase tracking-[0.3em]">
              {lang === 'ar' ? 'نموذج تمويل أخلاقي' : lang === 'en' ? 'Ethical Funding Model' : 'Modèle de Financement Éthique'}
            </h3>
            <h4 className="text-2xl sm:text-3xl font-black">
              {lang === 'ar' ? 'تطبيق غير ربحي، تمويل شفاف' : lang === 'en' ? 'Non-Profit App, Transparent Costs' : 'Une application non-lucrative, un coût transparent'}
            </h4>
            <p className="text-[#93a1a1] text-xs leading-relaxed">
              {lang === 'ar' 
                ? 'هدفنا ليس جني أرباح مالية في هذه الدنيا. نوفر تقييم التلاوة مجاناً بحدود معينة. ولكن كل عملية تصحيح تكلف المطور تكلفة حقيقية لدى خادم الذكاء الاصطناعي (حوالي 0.0004 € لكل طلب). لمساعدتنا في تغطية هذه الرسوم وضمان استمرارية الخدمة، يمكنك دعمنا.'
                : lang === 'en'
                ? 'Our goal is not financial gain in this worldly life. AI correction is provided for free within daily limits. However, each correction request costs real fees to the developer (around €0.0004 per request). To help us cover these costs and support the project, you can subscribe to an annual plan.'
                : 'Notre but n’est pas de faire du bénéfice financier ici-bas. Nous offrons la correction IA gratuitement dans la limite des quotas quotidiens. Cependant, chaque requête de correction représente un coût réel facturé par le fournisseur d’IA au développeur (environ 0,0004 € par requête). Pour nous aider à couvrir ces coûts et pérenniser le projet, vous pouvez opter pour un forfait.'
              }
            </p>
            <p className="text-[#93a1a1] text-[10px] italic">
              {lang === 'ar'
                ? '* الفائض أو الاشتراكات غير المستهلكة بالكامل تذهب لدعم وتطوير مشاريع برمجية أخرى نافعة.'
                : lang === 'en'
                ? '* Unused quotas or surplus contributions go directly to funding other helpful non-profit software projects.'
                : '* Les excédents ou les quotas non consommés servent intégralement à financer d’autres projets de logiciels libres et éthiques.'
              }
            </p>
          </div>
          <div className="flex flex-col items-center bg-[#002b36] p-6 rounded-2xl border border-[#586e75]/30 min-w-[250px] text-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#93a1a1]">
              {lang === 'ar' ? 'الاشتراك السنوي' : lang === 'en' ? 'Annual Support' : 'Soutien Annuel'}
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black text-[#b58900]">3 €</span>
              <span className="text-[#93a1a1] text-xs">/ {lang === 'ar' ? 'سنة' : lang === 'en' ? 'year' : 'an'}</span>
            </div>
            <button
              onClick={onEnter}
              className="w-full py-3 bg-[#b58900] hover:bg-[#cb4b16] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-md"
            >
              {lang === 'ar' ? 'ادعم المشروع' : lang === 'en' ? 'Support Project' : 'Soutenir le projet'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002b36] border-t border-[#586e75]/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-xs text-[#586e75] font-black uppercase tracking-[0.3em]">
            {t.footerSadaqa}
          </p>
          <div className="flex justify-center items-center gap-4 text-[#93a1a1] text-[10px] font-black tracking-widest">
            <span>ALHAFIZ.FR</span>
            <span className="w-1.5 h-1.5 bg-[#b58900] rounded-full"></span>
            <span>EVERYAYAH.COM</span>
          </div>
          <p className="text-[9px] text-[#586e75] font-semibold tracking-wider">
            {t.footerRights}
          </p>
        </div>
      </footer>

      {/* Modal Overlay / Explanatory Page */}
      {selectedSection && (() => {
        const data = sectionsData[selectedSection][lang];
        const rawIcon = sectionsData[selectedSection].fr.icon; // Use the same raw JSX icon regardless of lang
        return (
          <div className="fixed inset-0 z-50 bg-[#002b36]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
            <div className="bg-[#073642] border border-[#586e75]/40 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
              
              {/* Header */}
              <div className="p-8 border-b border-[#586e75]/20 flex justify-between items-start gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-black/20 flex items-center justify-center">
                    {selectedSection === 'recitation' ? (
                      <svg className="w-10 h-10 text-[#b58900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ) : selectedSection === 'ia' ? (
                      <svg className="w-10 h-10 text-[#859900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-[#268bd2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">{data.title}</h2>
                    <p className="text-[#93a1a1] text-xs font-bold uppercase tracking-wider">{data.subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSection(null)}
                  className="p-2 bg-black/10 hover:bg-black/30 rounded-full transition-colors active:scale-90"
                  aria-label="Fermer"
                >
                  <svg className="w-6 h-6 text-[#93a1a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6 flex-1">
                <p className="text-[#93a1a1] text-sm leading-relaxed italic">
                  "{data.description}"
                </p>

                <div className="space-y-4">
                  {data.details.map((detail, index) => (
                    <div key={index} className="bg-black/10 border border-[#586e75]/10 p-5 rounded-2xl space-y-2">
                      <h4 className="text-[#b58900] text-xs uppercase font-black tracking-widest">
                        {index + 1}. {detail.label}
                      </h4>
                      <p className="text-[#93a1a1] text-xs font-semibold leading-relaxed">
                        {detail.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div className="p-8 border-t border-[#586e75]/20 bg-black/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button 
                  onClick={() => setSelectedSection(null)}
                  className="w-full sm:w-auto px-6 py-3 border border-[#586e75]/30 hover:border-[#93a1a1] rounded-xl text-xs font-bold uppercase tracking-widest transition-colors active:scale-95"
                >
                  {t.modalBack}
                </button>
                <button 
                  onClick={() => {
                    setSelectedSection(null);
                    onEnter();
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-[#b58900] hover:bg-[#cb4b16] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg active:scale-95"
                >
                  {t.modalEnter}
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default LandingPage;
