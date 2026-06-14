import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { CommitteeMember } from '../types';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';

interface FooterContactProps {
  language: Language;
  committeeList: CommitteeMember[];
}

export default function FooterContact({ language, committeeList }: FooterContactProps) {
  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  return (
    <footer id="committee" className="bg-stone-900 text-stone-300 pt-16 pb-8 px-4 sm:px-6 relative">
      <div className="mx-auto max-w-6xl">
        
        {/* Committee Roster Grid header */}
        <div className="text-center mb-12 border-b border-stone-850 pb-8">
          <div className="flex justify-center mb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-850 border border-amber-300/35">
              <Shield className="text-amber-300 h-5 w-5 animate-pulse" />
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-tight">
            {t('footerContactsTitle')}
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-16 bg-[#E29524]" />
        </div>

        {/* Board of Members Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {committeeList.map((mem) => {
            const memberName = language === 'EN' ? mem.nameEN : mem.nameTE;
            const memberRole = language === 'EN' ? mem.roleEN : mem.roleTE;
            
            return (
              <div 
                key={mem.id}
                id={`committee-${mem.id}`}
                className="bg-stone-950/75 rounded-xl p-3 border border-stone-850 hover:border-amber-400/40 transition-all hover:bg-stone-950 flex items-center space-x-3.5 shadow-sm"
              >
                {/* Member Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={mem.imageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"}
                    alt={mem.nameEN}
                    className="h-11 w-11 rounded-full object-cover border border-amber-300/35"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-stone-950 text-[8px] font-bold px-1 rounded-full shadow-sm scale-90">
                    ॐ
                  </div>
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between text-left">
                  <div>
                    {/* Name */}
                    <h3 className="font-serif text-xs font-black text-white truncate leading-tight tracking-wide">
                      {memberName}
                    </h3>
                    
                    {/* Role Tag */}
                    <p className="font-sans text-[9px] text-amber-300 font-bold tracking-wider uppercase mt-0.5 truncate leading-snug">
                      {memberRole}
                    </p>
                  </div>

                  {/* Immediate Click-to-Call Linkages */}
                  <div className="mt-1.5 pt-1.5 border-t border-stone-900 flex flex-col space-y-0.5 leading-none">
                    <a
                      href={`tel:${mem.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center space-x-1 text-stone-400 hover:text-white transition text-[9px] font-mono leading-none py-0.5"
                      title="Tap to call committee member"
                    >
                      <Phone size={8} className="text-amber-300 shrink-0" />
                      <span className="truncate">{mem.phone}</span>
                    </a>
                    
                    <a
                      href={`mailto:${mem.email}`}
                      className="text-[#E29524] hover:underline text-[9px] truncate font-sans block leading-none py-0.5"
                      title={mem.email}
                    >
                      {mem.email}
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Global Addresses & Helpline panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-stone-800 text-stone-400 text-sm mb-8">
          
          {/* Temple location & timing brief */}
          <div className="space-y-2">
            <h4 className="font-serif text-amber-300 text-sm font-extrabold uppercase tracking-widest flex items-center space-x-2">
              <MapPin size={14} />
              <span>{t('navAbout')}</span>
            </h4>
            <p className="font-sans text-xs sm:text-sm text-stone-450 leading-relaxed font-light">
              {t('addressText')}
            </p>
          </div>

          {/* Quick contact list */}
          <div className="space-y-2">
            <h4 className="font-serif text-amber-300 text-sm font-extrabold uppercase tracking-widest flex items-center space-x-2">
              <Phone size={14} />
              <span>{language === 'EN' ? "Helpline Contacts" : "సహాయ కేంద్రం"}</span>
            </h4>
            <ul className="text-xs sm:text-sm space-y-1 font-mono font-medium">
              <li className="flex items-center space-x-2">
                <span className="text-stone-500 font-sans">{t('phoneLabel')}</span>
                <a href="tel:18004256677" className="text-white hover:underline">{t('phoneText')}</a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-stone-500 font-sans">{t('emailLabel')}</span>
                <a href="mailto:seva@umamaheswaradevasthanam.org" className="text-[#E29524] hover:underline truncate">{t('emailText')}</a>
              </li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div className="space-y-2">
            <h4 className="font-serif text-amber-300 text-sm font-extrabold uppercase tracking-widest">
              ⏰ {language === 'EN' ? "Routine Operational Hours" : "ఆలయ దర్శన వేళలు"}
            </h4>
            <ul className="text-xs space-y-1 font-sans text-stone-400 leading-snug">
              <li>{language === 'EN' ? "• Morning Abhishekam: 06:15 AM - 07:15 AM" : "• నిత్య అభిషేకం: ఉదయం 06:15 - 07:15"}</li>
              <li>{language === 'EN' ? "• Free Anna-Prasadam: 12:00 PM - 02:00 PM" : "• ఉచిత అన్నప్రసాదాలు: మధ్యాహ్నం 12:00 - 02:00"}</li>
              <li>{language === 'EN' ? "• Evening Archana: 05:30 PM - 07:30 PM" : "• సాయంకాల అర్చన సేవ: 05:30 - 07:30"}</li>
            </ul>
          </div>

        </div>

        {/* Global copyright & technology footnoting */}
        <div className="text-center pt-6 border-t border-stone-850/30 text-[10.5px] text-stone-500 font-medium">
          <p>
            &copy; {new Date().getFullYear()} {language === 'EN' ? "Sri Umamaheswara Devasthanam (Shivalayam) Executive Board. All Rights Reserved." : "శ్రీ ఉమామహేశ్వర దేవస్థానం (శివాలయం) కార్యనిర్వాహక మండలి."}
          </p>
          <p className="mt-1.5 font-mono text-stone-600 uppercase tracking-widest text-[9px]">
            {language === 'EN' ? "Optimized ₹0/yr Serverless Architecture for Devotees" : "సనాతన ధర్మ ప్రచారార్థం స్వీకరించిన ₹0 నిర్వహణ విధానం"}
          </p>
        </div>

      </div>

    </footer>
  );
}
