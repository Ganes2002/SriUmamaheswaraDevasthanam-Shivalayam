import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { 
  Compass, 
  Home, 
  Info, 
  BookOpen, 
  Calendar, 
  Image as ImageIcon, 
  Heart, 
  Users,
  X
} from 'lucide-react';

interface QuickNavigatorProps {
  language: Language;
}

export default function QuickNavigator({ language }: QuickNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  // Detect coarse pointer (touchscreen device) dynamically
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Force repaint on scroll frames to bypass tablet Webkit fixed-element rendering lag
  const [scrollTick, setScrollTick] = useState(0);
  useEffect(() => {
    const handleRepaint = () => {
      setScrollTick(prev => (prev + 1) % 1000);
    };
    window.addEventListener('scroll', handleRepaint, { passive: true, capture: true });
    window.addEventListener('touchmove', handleRepaint, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleRepaint, { capture: true });
      window.removeEventListener('touchmove', handleRepaint, { capture: true });
    };
  }, []);

  // Handle clicking outside to auto-collapse the menu
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'home', label: t('navHomeCorrect'), icon: Home },
    { id: 'about', label: t('navAbout'), icon: Info },
    { id: 'panchangam', label: t('navPanchangam'), icon: BookOpen },
    { id: 'events', label: t('navEvents'), icon: Calendar },
    { id: 'gallery', label: t('navGallery'), icon: ImageIcon },
    { id: 'donations', label: t('navDonations'), icon: Heart },
    { id: 'committee', label: t('navContact'), icon: Users },
  ];

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsOpen(false);
      // Clean smooth scrolling calculation to perfectly account for navbar heights + chant ribbon + marquee
      const offset = 150; // approximate total height of our persistent sticky header stack
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      ref={containerRef}
      data-scroll-tick={scrollTick}
      className="fixed right-6 z-[9999] flex flex-col items-end will-change-transform"
      style={{
        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        isolation: 'isolate',
      }}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Expanded Menu Options Stack */}
      <div 
        className={`flex flex-col items-end space-y-2 mb-3 transition-all duration-300 origin-bottom ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {navItems.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="flex items-center space-x-2 group cursor-pointer focus:outline-none"
              style={{
                transitionDelay: isOpen ? `${idx * 40}ms` : '0ms'
              }}
            >
              {/* Text Label on the Side */}
              <span className="bg-stone-900/90 text-amber-100 text-[10.5px] font-serif font-bold px-2.5 py-1 rounded-lg shadow-md border border-amber-300/20 whitespace-nowrap transform group-hover:scale-105 transition-all">
                {item.label}
              </span>
              
              {/* Circular Icon Button */}
              <div className="h-9 w-9 rounded-full bg-white border border-amber-300/35 flex items-center justify-center text-[#7A1E1E] shadow-md group-hover:bg-[#FCFBF7] group-hover:text-amber-600 transform group-hover:-translate-y-0.5 transition-all">
                <IconComponent size={14} className="stroke-[2.5]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Trigger Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => { if (!isTouchDevice) setIsOpen(true); }}
        className={`h-11 w-11 rounded-full flex items-center justify-center bg-[#7A1E1E] text-amber-100 shadow-lg shadow-[#7A1E1E]/20 hover:shadow-xl hover:bg-[#922626] border border-amber-300/35 hover:-translate-y-1 transition-all focus:outline-none ring-2 ring-white/20 cursor-pointer ${
          isOpen ? 'rotate-180 bg-[#922626]' : ''
        }`}
        style={{
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        title={language === 'EN' ? 'Quick Section Navigation' : 'విభాగానికి త్వరిత నావిగేషన్'}
      >
        {isOpen ? (
          <X size={18} className="stroke-[2.5]" />
        ) : (
          <Compass size={18} className="stroke-[2] animate-pulse" />
        )}
      </button>
    </div>
  );
}
