import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { Announcement } from '../types';
import { Languages, ShieldCheck, Menu, X, BellRing } from 'lucide-react';

interface NavBarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  announcement: Announcement;
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function NavBar({
  language,
  setLanguage,
  announcement,
  onAdminClick,
  isAdminLoggedIn,
  onLogout
}: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  const navItems = [
    { label: t('navHomeCorrect'), href: '#home' },
    { label: t('navAbout'), href: '#about' },
    { label: t('navPanchangam'), href: '#panchangam' },
    { label: t('navEvents'), href: '#events' },
    { label: t('navGallery'), href: '#gallery' },
    { label: t('navDonations'), href: '#donations' },
    { label: t('navContact'), href: '#committee' },
  ];

  return (
    <header id="navHeader" className="w-full transition-all duration-300">
      {/* Decorative Gradient Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#E29524] to-[#7A1E1E]" />

      {/* Main Navigation Row */}
      <nav className="border-b border-amber-100 bg-[#FCFBF7]/95 px-3 py-2 shadow-md backdrop-blur-md sm:px-4 md:py-3 lg:px-5">
        <div className="mx-auto flex max-w-7xl items-center gap-1 lg:gap-2">

          {/* ── Logo & Temple Branding ─────────────────────────────────────────── */}
          <a
            href="#home"
            className="flex items-center gap-1.5 lg:gap-2 transition hover:opacity-90 shrink-0 min-w-0"
          >
            {/* OM Icon — smaller at lg, normal at xl */}
            <div className="flex h-8 w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 2xl:h-11 2xl:w-11 shrink-0 items-center justify-center rounded-full bg-[#7A1E1E] text-amber-100 shadow-inner">
              <span className="font-serif text-sm xl:text-base font-bold leading-none">ॐ</span>
            </div>

            {/* Temple Name — clamp width at lg to avoid crowding the nav */}
            <div className="min-w-0 shrink-0 max-w-[120px] lg:max-w-[140px] xl:max-w-[220px] 2xl:max-w-none">
              <h1 className="font-serif text-[10px] lg:text-[9.5px] xl:text-[11px] 2xl:text-[13.5px] font-bold leading-tight tracking-tight text-[#7A1E1E] truncate">
                {t('appName')}
              </h1>
              {/* Subtitle hidden at lg to save horizontal space */}
              <p className="hidden xl:block font-sans text-[8px] 2xl:text-[9px] uppercase tracking-widest text-[#E29524] truncate">
                {t('appSubtitle')}
              </p>
            </div>
          </a>

          {/* ── Desktop Navigation Links (lg and above) ───────────────────────── */}
          <div className="hidden lg:flex items-center flex-1 min-w-0 overflow-hidden mx-1 xl:mx-2 2xl:mx-4">
            <div className="flex items-center gap-0 xl:gap-0.5 2xl:gap-1 overflow-hidden w-full">
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="font-sans text-[8px] lg:text-[8px] xl:text-[10px] 2xl:text-[11px] font-semibold tracking-wide text-stone-700 transition hover:text-[#7A1E1E] hover:underline hover:underline-offset-4 whitespace-nowrap px-1 lg:px-1 xl:px-1.5 2xl:px-2 py-1 rounded shrink-0"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Desktop Right Toolbar (lg and above) ──────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-3 shrink-0 ml-auto select-none">

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'TE' : 'EN')}
              className="flex items-center gap-0.5 xl:gap-1 rounded-full border border-amber-200 bg-[#FAF6F0] px-1.5 py-1 lg:px-2 lg:py-1 xl:px-2.5 xl:py-1.5 text-[8px] xl:text-[9.5px] 2xl:text-xs font-bold text-[#7A1E1E] shadow-sm transition hover:bg-[#7A1E1E] hover:text-white whitespace-nowrap cursor-pointer"
              title="Toggle Telugu / English"
            >
              <Languages size={11} className="shrink-0" />
              {/* Short label at lg, full at xl */}
              <span className="lg:hidden xl:inline">{language === 'EN' ? 'తెలుగు (TE)' : 'English (EN)'}</span>
              <span className="hidden lg:inline xl:hidden">{language === 'EN' ? 'TE' : 'EN'}</span>
            </button>

            {/* Admin / Logout buttons */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1 xl:gap-1.5">
                <button
                  onClick={onAdminClick}
                  className="flex items-center gap-0.5 xl:gap-1 rounded-full bg-amber-500 hover:bg-amber-600 px-1.5 py-1 lg:px-2 lg:py-1 xl:px-3 xl:py-1.5 text-[8px] xl:text-[9.5px] 2xl:text-xs font-bold text-white shadow-sm transition whitespace-nowrap cursor-pointer"
                  title="Open Admin Dashboard"
                >
                  <ShieldCheck size={11} className="animate-pulse text-amber-100 shrink-0" />
                  <span className="hidden xl:inline">{language === 'EN' ? 'Admin Panel' : 'అడ్మిన్'}</span>
                  <span className="xl:hidden">Admin</span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-[8px] xl:text-[9.5px] 2xl:text-xs font-bold text-stone-500 hover:text-red-700 transition whitespace-nowrap cursor-pointer px-1"
                  title="Secure Signout"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-0.5 xl:gap-1 rounded-full border border-stone-300 px-1.5 py-1 lg:px-2 lg:py-1 xl:px-2.5 xl:py-1.5 text-[8px] xl:text-[9.5px] 2xl:text-xs font-bold text-stone-700 shadow-sm hover:border-[#7A1E1E] hover:text-[#7A1E1E] transition whitespace-nowrap cursor-pointer"
              >
                <ShieldCheck size={11} className="shrink-0" />
                <span className="hidden xl:inline">{t('adminLogin')}</span>
                <span className="xl:hidden">Admin</span>
              </button>
            )}
          </div>

          {/* ── Mobile / Tablet Right Controls (below lg) ─────────────────────── */}
          <div className="flex items-center gap-1.5 lg:hidden ml-auto">
            {/* Language toggle icon */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'TE' : 'EN')}
              className="rounded-full bg-stone-100 p-2 text-[#7A1E1E] hover:bg-amber-50 cursor-pointer transition shadow-sm"
              title="Toggle Telugu / English"
            >
              <Languages size={16} />
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 cursor-pointer transition flex items-center justify-center border border-stone-100 bg-white"
              aria-label="Open navigation menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Navigation Drawer (below lg) ───────────────────────────────── */}
      {isMenuOpen && (
        <div className="w-full border-b border-amber-100 bg-[#FCFBF7] p-4 shadow-xl lg:hidden animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 font-sans text-sm font-medium text-stone-700 hover:text-[#7A1E1E] hover:bg-amber-50 rounded-lg transition"
              >
                {item.label}
              </a>
            ))}
            <hr className="border-stone-200 my-1" />
            <div className="flex items-center justify-between pt-1 px-1">
              <span className="text-xs text-stone-500 font-medium">
                {language === 'EN' ? 'Administration:' : 'నిర్వాహక విభాగం:'}
              </span>
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setIsMenuOpen(false); onAdminClick(); }}
                    className="flex items-center gap-1 rounded bg-amber-500 hover:bg-amber-600 px-2.5 py-1 text-xs text-white shadow-sm cursor-pointer"
                  >
                    <ShieldCheck size={12} />
                    <span>{language === 'EN' ? 'Panel' : 'డ్యాష్‌బోర్డ్'}</span>
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); onLogout(); }}
                    className="px-2 py-1 text-xs text-stone-600 font-bold hover:text-red-700 transition cursor-pointer"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMenuOpen(false); onAdminClick(); }}
                  className="flex items-center gap-1 rounded border border-stone-300 px-3 py-1 text-xs text-stone-700 hover:border-[#7A1E1E] transition cursor-pointer bg-white"
                >
                  <ShieldCheck size={12} />
                  <span>{t('adminLogin')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Announcement Marquee Ribbon ────────────────────────────────────────── */}
      {announcement && announcement.isActive && (
        <div className="flex w-full items-center border-b border-amber-200 bg-amber-50 py-1.5 text-xs text-[#5E1414] overflow-hidden shadow-sm">
          <div className="z-10 flex shrink-0 items-center gap-1 bg-amber-400 px-2 py-0.5 md:px-4 font-sans font-extrabold tracking-wider text-black uppercase rounded-r-full shadow-md ml-1 md:ml-4 text-[9px] md:text-xs">
            <BellRing size={11} className="animate-pulse shrink-0" />
            <span>{t('announcementLabel')}</span>
          </div>
          <div className="relative flex w-full items-center overflow-hidden">
            <marquee
              className="w-full font-serif text-[11px] md:text-sm font-semibold tracking-wide"
              scrollamount="4"
              behavior="scroll"
              direction="left"
            >
              {language === 'EN' ? announcement.textEN : announcement.textTE}
            </marquee>
          </div>
        </div>
      )}
    </header>
  );
}
