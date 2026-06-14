import React from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { MapPin, Compass, Landmark } from 'lucide-react';

interface AboutSectionProps {
  language: Language;
}

export default function AboutSection({ language }: AboutSectionProps) {
  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  // Srisailam Gateway Uma Maheswaram authentic coordinates
  const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=16.3688,78.8988(Sri+Umamaheswara+Devasthanam)";

  return (
    <section id="about" className="py-16 bg-[#FCFBF7] px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Ribbon */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 border-2 border-dashed border-[#E29524]">
              <Landmark className="text-[#7A1E1E] h-6 w-6" />
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#7A1E1E] tracking-tight">
            {t('aboutTitle')}
          </h2>
          <div className="mt-2 text-stone-500 font-sans text-xs uppercase tracking-widest">
            {language === 'EN' ? 'Celestial Haven' : 'దివ్య క్షేత్ర ఘనత'}
          </div>
          <div className="mx-auto mt-3 h-0.5 w-24 bg-amber-400" />
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Historical text description panel */}
          <div className="lg:col-span-7 space-y-6">
            <p className="font-sans text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
              {t('aboutPara1')}
            </p>
            <p className="font-sans text-base text-stone-600 leading-relaxed font-light">
              {t('aboutPara2')}
            </p>

            {/* Quick Spiritual Attributes Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="flex items-start space-x-3 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                <Compass className="text-[#E29524] h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#7A1E1E]">
                    {language === 'EN' ? "Veda Pathashala" : "నిత్య వేద పారాయణం"}
                  </h4>
                  <p className="text-xs text-stone-600 leading-normal">
                    {language === 'EN' ? "Nurturing young minds in Vedic mantras & wisdom." : "వేద మంత్రోచ్చారణల పెంపకం."}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                <span className="text-[#E29524] text-base font-bold shrink-0">🐄</span>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#7A1E1E]">
                    {language === 'EN' ? "Gosala Shelter" : "గోసంరక్షణ శాల"}
                  </h4>
                  <p className="text-xs text-stone-600 leading-normal">
                    {language === 'EN' ? "Providing feed & medical support to pure-breed cows." : "గోవుల నిత్య సంరక్షణ."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tap-To-Navigate Maps Card on Left Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF6F0] to-[#FCFBF7] border border-amber-100 hover:border-amber-400 p-6 md:p-8 rounded-2xl shadow-lg transition-all duration-300">
            <h3 className="font-serif text-lg md:text-xl font-extrabold text-[#7A1E1E] mb-3">
              {language === 'EN' ? "Physical Location & Coordinates" : "భౌగోళిక స్థానం & మ్యాప్స్"}
            </h3>
            
            <p className="font-sans text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
              {t('addressText')}
            </p>

            {/* Simulated Live Compass Graphic */}
            <div className="relative h-40 bg-stone-100 rounded-xl mb-6 flex flex-col items-center justify-center border border-dashed border-stone-300 overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400')" }} />
              <MapPin className="text-[#7A1E1E] h-10 w-10 animate-bounce cursor-pointer group-hover:scale-110 transition-transform" />
              <div className="font-mono text-[11px] text-stone-500 mt-2">
                LAT: 16.3688° N | LONG: 78.8988° E
              </div>
              <div className="text-[10px] text-amber-600 font-sans tracking-wide uppercase mt-1">
                {language === 'EN' ? "Nallamala Srisailam Entrance" : "నల్లమల అరణ్య ముఖద్వారం"}
              </div>
            </div>

            {/* Tap-to-Navigate CTA Shortcut */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="flex items-center justify-center space-x-2 w-full py-3.5 bg-[#7A1E1E] text-[#FCFBF7] hover:bg-[#5E1414] active:scale-95 font-sans font-bold text-sm tracking-wide rounded-xl shadow-md transition-all cursor-pointer"
            >
              <MapPin size={16} />
              <span>{t('mapsButton')}</span>
            </a>
            
            <p className="text-[10px] sm:text-xs text-center text-stone-500 font-normal mt-3 leading-tight">
              ⚡ {t('mapsDesc')}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
