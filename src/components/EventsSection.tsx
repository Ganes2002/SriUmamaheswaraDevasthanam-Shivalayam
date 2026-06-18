import React from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { EventItem } from '../types';
import { Share2, Calendar, Clock, MapPin, Tag, Heart } from 'lucide-react';

interface EventsSectionProps {
  language: Language;
  eventsList: EventItem[];
  defaultEventImage?: string;
}

const DEFAULT_EVENT_IMG = 'https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=600';

export default function EventsSection({ language, eventsList, defaultEventImage = DEFAULT_EVENT_IMG }: EventsSectionProps) {
  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  // Generate structured URL-encoded template to share on WhatsApp
  const handleWhatsAppShare = (evt: EventItem) => {
    const title = language === 'EN' ? evt.titleEN : evt.titleTE;
    const desc = language === 'EN' ? evt.descriptionEN : evt.descriptionTE;
    const space = language === 'EN' ? evt.locationEN : evt.locationTE;
    
    const headerPrefix = t('whatsappTemplateHeader');
    
    const rawTemplate = 
`${headerPrefix}
✨ *${title}* ✨

📅 *${t('eventDate')}* ${evt.date}
⏰ *${t('eventTime')}* ${evt.time}
📍 *${t('eventLocation')}* ${space}

ॐ ${desc}

🌸 _Join us with friends & family to obtain the holy divine blessings of Lord Shiva and Goddess Goddess Uma Devi._
🔗 _View updates or make contributions:_ ${window.location.href}`;

    const encodedText = encodeURIComponent(rawTemplate);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    
    // Safely trigger external navigation
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="events" className="py-16 bg-[#FCFBF7] px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Heading Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 border-2 border-dashed border-[#E29524]">
              <Tag className="text-[#7A1E1E] h-5 w-5" />
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#7A1E1E] tracking-tight">
            {t('eventsTitle')}
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-24 bg-amber-400" />
        </div>

        {/* Dynamic Card Container List */}
        {eventsList.length === 0 ? (
          <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <p className="text-stone-500 font-sans text-sm">
              {language === 'EN' ? "No upcoming festivals or events posted." : "రాబోయే పూజలు లేదా ఉత్సవాలు ఏమీ లేవు."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsList.map((evt) => {
              const displayTitle = language === 'EN' ? evt.titleEN : evt.titleTE;
              const displayDesc = language === 'EN' ? evt.descriptionEN : evt.descriptionTE;
              const displayLocation = language === 'EN' ? evt.locationEN : evt.locationTE;

              return (
                <div 
                  key={evt.id}
                  id={`event-${evt.id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-amber-50 hover:shadow-2xl transition-all duration-350 flex flex-col hover:-translate-y-1 transform group"
                >
                  
                  {/* Event Thumbnail Preview */}
                  <div className="relative h-48 bg-stone-200 overflow-hidden shrink-0">
                    <img 
                      src={evt.imageUrl || defaultEventImage}
                      alt={evt.titleEN}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Golden Saffron Tag overlay */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#E29524] to-amber-500 hover:from-amber-400 text-black px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow">
                      ॐ {language === 'EN' ? 'Divine Fest' : 'ఉత్సవం'}
                    </div>
                  </div>

                  {/* Card Content parameters */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Event Title */}
                      <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#7A1E1E] tracking-tight mb-3">
                        {displayTitle}
                      </h3>
                      
                      {/* Event Attributes metadata list */}
                      <ul className="space-y-2 text-xs text-stone-600 mb-4 font-medium">
                        <li className="flex items-center space-x-2">
                          <Calendar size={13} className="text-[#E29524]" />
                          <span>{t('eventDate')} {evt.date}</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Clock size={13} className="text-[#E29524]" />
                          <span>{t('eventTime')} {evt.time}</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <MapPin size={13} className="text-[#E29524]" />
                          <span className="truncate">{t('eventLocation')} {displayLocation}</span>
                        </li>
                      </ul>

                      {/* Event Brief Text */}
                      <p className="font-sans text-xs sm:text-sm text-stone-500 leading-relaxed mb-6 font-light">
                        {displayDesc}
                      </p>
                    </div>

                    {/* WhatsApp Broadcast CTA option footer of the card */}
                    <div className="border-t border-stone-100 pt-4 mt-auto">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppShare(evt)}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs tracking-wide transition shadow-md hover:shadow-lg cursor-pointer"
                        title="Broadcast event to WhatsApp"
                      >
                        <Share2 size={14} />
                        <span>{t('whatsappShare')}</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Joint Community Appeal Sub-row */}
        <div className="mt-12 bg-amber-50/50 p-5 rounded-3xl border border-amber-100/60 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div className="flex items-center space-x-3 text-[#7A1E1E]">
            <span className="text-xl">🕉️</span>
            <div>
              <h4 className="font-serif text-sm font-bold">
                {language === 'EN' ? "Sponsor a Daily Puja Seva or Annadanam" : "రోజువారీ పూజా సంకల్పం / అన్నదాన సేవ"}
              </h4>
              <p className="text-xs text-stone-600 leading-normal font-light">
                {language === 'EN' ? "Sponsorship contributions list live instantly inside the welfare transparency ledger." : "మీరు అందించే సేవా భాగస్వామ్యాలు వెంటనే పారదర్శక లెడ్జర్ లో అప్‌డేట్ చేయబడతాయి."}
              </p>
            </div>
          </div>
          <a
            href="#donations"
            className="shrink-0 flex items-center space-x-1 border border-[#7A1E1E] text-[#7A1E1E] hover:bg-[#7A1E1E] hover:text-white transition-all text-xs font-bold py-2 px-4 rounded-lg"
          >
            <Heart size={12} className="fill-current" />
            <span>{language === 'EN' ? "Sponsor Now" : "సేవ సమర్పించండి"}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
