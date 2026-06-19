import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { CalendarRange, ChevronLeft, ChevronRight, Eye, Clock } from 'lucide-react';
import { TempleEmblemSlot } from '../types';

interface HeroSectionProps {
  language: Language;
  templeEmblemLibrary: TempleEmblemSlot[];
  whatsappLink?: string;
  templeOpenTime?: string;
  templeCloseTime?: string;
  templeOpenTime2?: string;
  templeCloseTime2?: string;
}

const DEFAULT_PRESETS = [
  {
    id: 1,
    nameEN: "Majestic Gopuram Vimana",
    nameTE: "దివ్య రాజగోపురం దర్బార్",
    url: "https://images.unsplash.com/photo-1600100397759-db2427a810f6?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    nameEN: "Adorned Holy Shiva Lingam",
    nameTE: "దివ్య మంగళాకార లింగం",
    url: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    nameEN: "Lord Ganesha Vigneshwara",
    nameTE: "శ్రీ విఘ్నేశ్వర ప్రసాదం",
    url: "https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    nameEN: "Sacred Brass Aarti Bell",
    nameTE: "గర్భాలయ ఘంటా రావము",
    url: "https://images.unsplash.com/photo-1608976328267-e6730f70067a?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    nameEN: "Vedic Fire Homa Kundam",
    nameTE: "దేవస్థాన హోమ గుండము",
    url: "https://images.unsplash.com/photo-1618090584126-129cd84357ae?auto=format&fit=crop&q=80&w=400",
  }
];

export default function HeroSection({ language, templeEmblemLibrary, whatsappLink, templeOpenTime = '6:00 AM', templeCloseTime = '8:30 PM', templeOpenTime2 = '', templeCloseTime2 = '' }: HeroSectionProps) {
  const hasAfternoonBreak = !!(templeOpenTime2 && templeCloseTime2);
  // Use state library, or fall back to high-quality default presets if the library database loading is not ready
  const slides = templeEmblemLibrary && templeEmblemLibrary.length > 0 ? templeEmblemLibrary : DEFAULT_PRESETS;
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  // Auto-rotate every 5 seconds. Resets whenever user manually navigates
  // (currentIndex in deps clears and restarts the timer on every change).
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_PRESETS[0];

  return (
    <section id="home" className="relative bg-stone-900 border-b border-amber-300/10 pb-16 pt-6">
      
      {/* Decorative Golden Spiritual Header Ribbon */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#7A1E1E] via-amber-400 to-[#7A1E1E]" />
      
      {/* Outer wrapper to contain the massive wide screen display carousel */}
      <div className="w-full max-w-7xl mx-auto px-0 md:px-6 lg:px-8 space-y-8">
        
        {/* Massive Screen-Fitting Rectangular Image Slide Frame (Non-Rounded) */}
        <div className="relative w-full h-[65vh] sm:h-[60vh] md:h-[550px] lg:h-[600px] border-y-4 md:border-4 border-amber-400/90 bg-stone-950 flex items-center justify-center shadow-2xl relative z-10 select-none group md:rounded-2xl overflow-hidden">
          
          {/* Active Image Sliding Display */}
          <div className="w-full h-full relative bg-stone-950">
            {/* Blurred background fill — same image, blurred & dimmed, covers any letterbox bars */}
            <img
              src={currentSlide.url}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30 pointer-events-none"
            />
            {/* Main image — always shows the complete uploaded photo without any cropping */}
            <img
              id={`carousel-slide-image-${currentSlide.id}`}
              src={currentSlide.url}
              alt={language === 'EN' ? currentSlide.nameEN : currentSlide.nameTE}
              className="relative w-full h-full object-contain transition-all duration-700 ease-in-out"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Carousel Navigation Button: Extreme Left Edge */}
          <button
            id="carousel-nav-left"
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-stone-950/85 hover:bg-[#7A1E1E] text-amber-100 hover:text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-amber-400/40 shadow-2xl cursor-pointer transition-all active:scale-95 duration-200 z-40 pointer-events-auto"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          {/* Carousel Navigation Button: Extreme Right Edge */}
          <button
            id="carousel-nav-right"
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-stone-950/85 hover:bg-[#7A1E1E] text-amber-100 hover:text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-amber-400/40 shadow-2xl cursor-pointer transition-all active:scale-95 duration-200 z-40 pointer-events-auto"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          {/* High-contrast caption overlay at the bottom margin of the screen fit image */}
          <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 z-30 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-stone-950/80 p-4 sm:p-5 rounded-xl border border-amber-400/20 backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-serif font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Eye size={12} className="text-amber-400 shrink-0" />
                <span>{language === 'EN' ? "Active Alankara Image" : "క్షేత్ర దైవ నిత్య దర్శనము"}</span>
              </span>
              <h3 className="font-serif text-lg sm:text-2xl font-black text-white leading-tight">
                {language === 'EN' ? currentSlide.nameEN : currentSlide.nameTE}
              </h3>
            </div>
            
            {/* Quick slide progress indicators */}
            <div className="flex items-center space-x-2 shrink-0">
              {slides.map((_, slideIdx) => (
                <button
                  key={slideIdx}
                  id={`dot-indicator-${slideIdx}`}
                  type="button"
                  onClick={() => setCurrentIndex(slideIdx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === slideIdx 
                      ? 'w-8 bg-amber-400' 
                      : 'w-2.5 bg-stone-500/75 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to slide ${slideIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation indicator dots style matches current visual slide */}
        </div>

        {/* Content Box beneath the large full screen slideshow (Fonts and gaps kept highly simple/accessible) */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-6 pt-4 px-4">
          
          {/* Simple Devotional Chant */}
          <p className="font-serif italic text-xs sm:text-sm tracking-widest text-amber-500 uppercase select-none">
            ॥ ॐ नमः शिवाय ॥
          </p>
          
          {/* Main welcome titles - highly simplified & balanced spacing */}
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-amber-50">
            {t('heroGreeting')}
          </h2>
          
          {/* Simple description */}
          <p className="font-sans text-xs sm:text-sm md:text-base font-light text-stone-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>

          {/* Simple Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#panchangam"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#E29524] hover:from-amber-400 hover:to-amber-500 font-sans text-xs sm:text-sm font-bold tracking-wider text-black shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center space-x-2"
            >
              <CalendarRange size={15} />
              <span>{t('navPanchangam')} (Telugu Calendar)</span>
            </a>
            <a
              href="#donations"
              className="w-full sm:w-auto px-8 py-3 rounded-xl border border-amber-300/30 hover:border-amber-300/80 bg-white/5 hover:bg-white/10 font-sans text-xs sm:text-sm font-bold tracking-wider text-white transition-all flex items-center justify-center"
            >
              <span>{t('navDonations')}</span>
            </a>
          </div>

          {/* WhatsApp Community Join Button — shown only when a link is configured by admin */}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-sans text-xs sm:text-sm font-bold tracking-wide text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              {/* WhatsApp icon SVG */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>
                {language === 'EN' ? 'Join our WhatsApp Community' : 'మా WhatsApp గ్రూప్‌లో చేరండి'}
              </span>
            </a>
          )}

          {/* Temple Daily Darshan Timings Banner */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 bg-stone-900/70 border border-amber-400/30 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <Clock size={14} className="text-amber-400 shrink-0" />
              <div className="text-center">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest font-sans">
                  {language === 'EN' ? 'Daily Darshan Timings' : 'నిత్య దర్శన వేళలు'}
                </p>
                {hasAfternoonBreak ? (
                  <div className="mt-0.5 space-y-0.5">
                    <p className="text-sm font-serif font-black text-white">
                      {templeOpenTime} &nbsp;—&nbsp; {templeCloseTime}
                    </p>
                    <p className="text-[10px] text-amber-400/80 font-sans font-semibold uppercase tracking-wider">
                      {language === 'EN' ? 'Afternoon Break' : 'మధ్యాహ్న విరామం'}
                    </p>
                    <p className="text-sm font-serif font-black text-white">
                      {templeOpenTime2} &nbsp;—&nbsp; {templeCloseTime2}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-serif font-black text-white mt-0.5">
                    {templeOpenTime} &nbsp;—&nbsp; {templeCloseTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Simple Bottom Ribbon Line */}
          <div className="w-full max-w-md mx-auto border-t border-amber-400/20 pt-4 mt-2">
            <p className="font-serif text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-relaxed">
              {t('tagline')}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
