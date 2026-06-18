import React, { useState, useEffect, useCallback } from 'react';
import {
  getGlobalSettings,
  saveWhatsappLink,
  saveTempleHours,
  saveDefaultEventImage,
  saveDefaultProfileIcons,
  getAnnouncement,
  saveAnnouncement,
  getCommittee,
  saveCommittee,
  getEvents,
  saveEvents,
  getGallery,
  saveGallery,
  getDonors,
  saveDonors,
  setLifetimeCounter,
  setCurrentYearCounter,
  getYearlyStats,
  saveYearlyStats,
  saveAdminAccounts,
  addLog,
  saveTempleEmblem,
  getTempleEmblemLibrary,
  saveTempleEmblemLibrary,
  bustAllCache,
} from './db';
import { ArrowUp } from 'lucide-react';
import { Language, TRANSLATIONS } from './translations';
import {
  Announcement,
  EventItem,
  GalleryItem,
  DonorRecord,
  CommitteeMember,
  YearlyStat,
  AdminAccount,
  TempleEmblemSlot,
} from './types';

// Import UI Components
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import PanchangamSection from './components/PanchangamSection';
import EventsSection from './components/EventsSection';
import GallerySection from './components/GallerySection';
import WelfareLedgerSection from './components/WelfareLedgerSection';
import FooterContact from './components/FooterContact';
import AdminPanel from './components/AdminPanel';
import QuickNavigator from './components/QuickNavigator';
import Toast, { showToast } from './components/Toast';

export default function App() {
  // Global States
  const [language, setLanguage] = useState<Language>('TE');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('um_dev_logged_in_admin');
    } catch {
      return false;
    }
  });

  // Database States
  const [templeEmblem, setTempleEmblem] = useState<string>('');
  const [templeEmblemLibrary, setTempleEmblemLibrary] = useState<TempleEmblemSlot[]>([]);
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [templeOpenTime, setTempleOpenTime] = useState<string>('6:00 AM');
  const [templeCloseTime, setTempleCloseTime] = useState<string>('8:30 PM');
  const [defaultEventImage, setDefaultEventImage] = useState<string>('https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=600');
  const [defaultProfileMale, setDefaultProfileMale] = useState<string>('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200');
  const [defaultProfileFemale, setDefaultProfileFemale] = useState<string>('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');
  const [announcement, setAnnouncement] = useState<Announcement>({
    id: '',
    textEN: '',
    textTE: '',
    isActive: false,
    updatedAt: '',
  });
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [donorsList, setDonorsList] = useState<DonorRecord[]>([]);
  const [committeeList, setCommitteeList] = useState<CommitteeMember[]>([]);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [yearlyStatsList, setYearlyStatsList] = useState<YearlyStat[]>([]);
  const [lifetimeTotal, setLifetimeTotal] = useState(2852500);
  const [currentYearTotal, setCurrentYearTotal] = useState(685420);

  // Load all data from Supabase — 8 parallel queries (was 11).
  // Extracted as useCallback so refreshAllData can call it without re-mounting.
  const loadAllData = useCallback(async () => {
    try {
      // Always bust the cache before the initial load so stale empty data
      // (cached before Supabase was fully set up) never blocks a fresh fetch.
      bustAllCache();

      const [
        globalSettings,
        emblemLib,
        ann,
        events,
        gallery,
        donors,
        committee,
        yearlyStats,
      ] = await Promise.all([
        getGlobalSettings(),          // single query for emblem + lifetime counter
        getTempleEmblemLibrary(),
        getAnnouncement(),
        getEvents(),
        getGallery(),
        getDonors(),
        getCommittee(),
        getYearlyStats(),
      ]);

      setTempleEmblem(globalSettings.templeEmblem);
      setLifetimeTotal(globalSettings.lifetimeCounter);
      setWhatsappLink(globalSettings.whatsappLink);
      setTempleOpenTime(globalSettings.templeOpenTime);
      setTempleCloseTime(globalSettings.templeCloseTime);
      setDefaultEventImage(globalSettings.defaultEventImage);
      setDefaultProfileMale(globalSettings.defaultProfileMale);
      setDefaultProfileFemale(globalSettings.defaultProfileFemale);
      setTempleEmblemLibrary(emblemLib);
      setAnnouncement(ann);
      setEventsList(events);
      setGalleryList(gallery);
      setDonorsList(donors);
      setCommitteeList(committee);

      // Derive admin accounts from committee — no extra DB call
      setAdminAccounts(committee.map((m) => ({
        id: m.id,
        name: m.nameEN,
        role: m.roleEN,
        username: m.username || '',
        passcode: m.passcode,
        phone: m.phone,
        email: m.email,
      })));

      setYearlyStatsList(yearlyStats);

      // Derive current year total from already-fetched yearly stats — no extra DB call
      const currYear = new Date().getFullYear().toString();
      const currStat = yearlyStats.find((s) => s.year === currYear);
      if (currStat) setCurrentYearTotal(currStat.totalAmount);
    } catch (err) {
      console.error('[App] loadAllData failed:', err);
    }
  }, []);

  // Clears all localStorage cache keys then re-fetches everything from Supabase.
  const refreshAllData = useCallback(async () => {
    bustAllCache();
    await loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Monitor scroll position — multi-source, robust on iOS/Android tablet
  useEffect(() => {
    const getScrollY = () =>
      Math.max(
        window.scrollY || 0,
        window.pageYOffset || 0,
        document.documentElement?.scrollTop || 0,
        document.body?.scrollTop || 0
      );

    const handleScroll = () => {
      setShowScrollTop(getScrollY() > 80);
    };

    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener('scroll', handleScroll, opts);
    document.addEventListener('scroll', handleScroll, opts);
    document.documentElement.addEventListener('scroll', handleScroll, opts);
    window.addEventListener('touchmove', handleScroll, opts);
    window.addEventListener('touchend', handleScroll, opts);

    // Interval fallback for browsers that miss events during momentum scroll
    const intervalId = setInterval(handleScroll, 150);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      document.removeEventListener('scroll', handleScroll, { capture: true });
      document.documentElement.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('touchmove', handleScroll, { capture: true });
      window.removeEventListener('touchend', handleScroll, { capture: true });
      clearInterval(intervalId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  // ─── State update handlers (save to Supabase then update React state) ────────

  const handleUpdateWhatsappLink = async (link: string) => {
    await saveWhatsappLink(link);
    setWhatsappLink(link);
  };

  const handleUpdateTempleHours = async (openTime: string, closeTime: string) => {
    await saveTempleHours(openTime, closeTime);
    setTempleOpenTime(openTime);
    setTempleCloseTime(closeTime);
  };

  const handleUpdateDefaultEventImage = async (url: string) => {
    await saveDefaultEventImage(url);
    setDefaultEventImage(url);
  };

  const handleUpdateDefaultProfileIcons = async (maleUrl: string, femaleUrl: string) => {
    await saveDefaultProfileIcons(maleUrl, femaleUrl);
    setDefaultProfileMale(maleUrl);
    setDefaultProfileFemale(femaleUrl);
  };

  const handleUpdateTempleEmblem = async (url: string) => {
    await saveTempleEmblem(url);
    setTempleEmblem(url);
  };

  const handleUpdateTempleEmblemLibrary = async (list: TempleEmblemSlot[]) => {
    await saveTempleEmblemLibrary(list);
    setTempleEmblemLibrary(list);
  };

  const handleUpdateAnnouncement = async (ann: Announcement) => {
    await saveAnnouncement(ann);
    setAnnouncement(ann);
  };

  const handleUpdateEvents = async (list: EventItem[]) => {
    await saveEvents(list);
    setEventsList(list);
  };

  const handleUpdateGallery = async (list: GalleryItem[]): Promise<boolean> => {
    const success = await saveGallery(list);
    if (success) {
      const refreshed = await getGallery();
      setGalleryList(refreshed);
    }
    return success;
  };

  const handleUpdateDonors = async (list: DonorRecord[]) => {
    await saveDonors(list);
    setDonorsList(list);
  };

  const handleUpdateYearlyStats = async (list: YearlyStat[]) => {
    await saveYearlyStats(list);
    setYearlyStatsList(list);
    const currYear = list.find((s) => s.year === new Date().getFullYear().toString());
    if (currYear) setCurrentYearTotal(currYear.totalAmount);
  };

  const handleUpdateLifetimeCounter = async (val: number) => {
    await setLifetimeCounter(val);
    setLifetimeTotal(val);
  };

  const handleUpdateCurrentYearValue = async (val: number) => {
    await setCurrentYearCounter(val);
    setCurrentYearTotal(val);
  };

  const handleUpdateCommittee = async (list: CommitteeMember[]) => {
    await saveCommittee(list);
    setCommitteeList(list);
    // Keep admin accounts in sync — they're derived from committee
    setAdminAccounts(list.map((m) => ({
      id: m.id,
      name: m.nameEN,
      role: m.roleEN,
      username: m.username || '',
      passcode: m.passcode,
      phone: m.phone,
      email: m.email,
    })));
  };

  const handleUpdateAdminAccounts = async (list: AdminAccount[]) => {
    await saveAdminAccounts(list);
    setAdminAccounts(list);
    // Reflect passcode/username changes back into the committee list
    setCommitteeList((prev) =>
      prev.map((m) => {
        const acc = list.find((a) => a.id === m.id);
        return acc ? { ...m, passcode: acc.passcode, username: acc.username } : m;
      })
    );
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminOpen(false);
    localStorage.removeItem('um_dev_logged_in_admin');
    addLog('Administrator signed out securely.', 'security');
    showToast(
      language === 'EN'
        ? 'Signed out securely. Namaste! 🙏'
        : 'నమస్తే! విజయవంతంగా నిష్క్రమించారు. 🙏',
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-stone-850 selection:bg-amber-100 selection:text-stone-900 flex flex-col justify-between w-full">

      {/* Sticky Composite Header */}
      <div className="sticky top-0 z-50 w-full flex flex-col shrink-0 shadow-md">

        {/* Topmost Spiritual Chant Ribbon */}
        <div className="bg-[#7A1E1E] text-amber-100 py-1.5 px-3 text-center font-serif italic text-[11px] sm:text-[12px] tracking-widest uppercase flex flex-wrap items-center justify-center gap-y-0.5 gap-x-1.5 sm:gap-2 shrink-0 w-full overflow-hidden shadow-inner">
          <span>ॐ नमः शिवाय</span>
          <span className="text-[8px] opacity-40">•</span>
          <span className="whitespace-normal sm:whitespace-nowrap">హర హర శంకర జయ జయ శంకర</span>
          <span className="text-[8px] opacity-40">•</span>
          <span className="whitespace-normal sm:whitespace-nowrap">శివ శివ శంకర హర హర శంకర</span>
        </div>

        {/* Dynamic Navigation Header */}
        <NavBar
          language={language}
          setLanguage={setLanguage}
          announcement={announcement}
          onAdminClick={() => setIsAdminOpen(true)}
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content — overflow-x:clip avoids breaking position:fixed on iOS unlike overflow:hidden */}
      <main className="flex-1 overflow-x-clip">
        <HeroSection language={language} templeEmblemLibrary={templeEmblemLibrary} whatsappLink={whatsappLink} templeOpenTime={templeOpenTime} templeCloseTime={templeCloseTime} />
        <AboutSection language={language} />
        <PanchangamSection language={language} />
        <EventsSection language={language} eventsList={eventsList} defaultEventImage={defaultEventImage} />
        <GallerySection language={language} galleryList={galleryList} />
        <WelfareLedgerSection
          language={language}
          donorsList={donorsList}
          yearlyStats={yearlyStatsList}
          lifetimeCounter={lifetimeTotal}
          currentYearCounter={currentYearTotal}
        />
      </main>

      {/* Footer */}
      <FooterContact language={language} committeeList={committeeList} defaultProfileMale={defaultProfileMale} defaultProfileFemale={defaultProfileFemale} />

      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel
          language={language}
          onClose={() => setIsAdminOpen(false)}
          onRefreshAllData={refreshAllData}
          templeEmblem={templeEmblem}
          onUpdateTempleEmblem={handleUpdateTempleEmblem}
          templeEmblemLibrary={templeEmblemLibrary}
          onUpdateTempleEmblemLibrary={handleUpdateTempleEmblemLibrary}
          whatsappLink={whatsappLink}
          onUpdateWhatsappLink={handleUpdateWhatsappLink}
          templeOpenTime={templeOpenTime}
          templeCloseTime={templeCloseTime}
          onUpdateTempleHours={handleUpdateTempleHours}
          defaultEventImage={defaultEventImage}
          onUpdateDefaultEventImage={handleUpdateDefaultEventImage}
          defaultProfileMale={defaultProfileMale}
          defaultProfileFemale={defaultProfileFemale}
          onUpdateDefaultProfileIcons={handleUpdateDefaultProfileIcons}
          announcement={announcement}
          onUpdateAnnouncement={handleUpdateAnnouncement}
          eventsList={eventsList}
          onUpdateEvents={handleUpdateEvents}
          galleryList={galleryList}
          onUpdateGallery={handleUpdateGallery}
          donorsList={donorsList}
          onUpdateDonors={handleUpdateDonors}
          yearlyStats={yearlyStatsList}
          onUpdateYearlyStats={handleUpdateYearlyStats}
          lifetimeCounter={lifetimeTotal}
          onUpdateLifetimeCounter={handleUpdateLifetimeCounter}
          currentYearCounter={currentYearTotal}
          onUpdateCurrentYearCounter={handleUpdateCurrentYearValue}
          committeeList={committeeList}
          onUpdateCommittee={handleUpdateCommittee}
          adminAccounts={adminAccounts}
          onUpdateAdminAccounts={handleUpdateAdminAccounts}
          isAdminLoggedIn={isAdminLoggedIn}
          setIsAdminLoggedIn={setIsAdminLoggedIn}
        />
      )}

      {/* Floating Speed-Dial Navigator */}
      <QuickNavigator language={language} />

      {/* Global toast notification container */}
      <Toast />

      {/* Scroll-to-Top Button — always in DOM, opacity-controlled so iOS never misses a render cycle */}
      <button
        onClick={scrollToTop}
        aria-hidden={!showScrollTop}
        className="fixed right-6 z-[9999] h-10 w-10 flex items-center justify-center rounded-full bg-[#E29524] hover:bg-[#F2AF4D] text-black shadow-lg shadow-[#7A1E1E]/25 hover:shadow-xl focus:outline-none ring-2 ring-white/20 cursor-pointer transition-opacity duration-300 will-change-transform"
        style={{
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          opacity: showScrollTop ? 1 : 0,
          pointerEvents: showScrollTop ? 'auto' : 'none',
          visibility: showScrollTop ? 'visible' : 'hidden',
        }}
        title="Scroll back to Top"
      >
        <ArrowUp size={16} className="stroke-[2.5]" />
      </button>

    </div>
  );
}
