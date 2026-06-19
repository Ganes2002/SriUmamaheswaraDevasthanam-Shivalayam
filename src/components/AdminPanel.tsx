import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { EventItem, GalleryItem, DonorRecord, AdminLog, Announcement, YearlyStat, CommitteeMember, AdminAccount, TempleEmblemSlot } from '../types';
import {
  addLog,
  runMidnightJanitorSimulation,
  getLogs,
  getDonors,
  getEvents,
  getLifetimeCounter,
} from '../db';
import {
  ShieldCheck,
  Lock,
  Activity,
  RefreshCw,
  X
} from 'lucide-react';
import { showToast } from './Toast';

// Import extracted sub-components
import AdminAnnouncementForm from './admin/AdminAnnouncementForm';
import AdminDonationForm from './admin/AdminDonationForm';
import AdminYearlyAuditForm from './admin/AdminYearlyAuditForm';
import AdminGalleryManager from './admin/AdminGalleryManager';
import AdminEventsManager from './admin/AdminEventsManager';
import AdminCommitteeManager from './admin/AdminCommitteeManager';
import AdminLogsViewer from './admin/AdminLogsViewer';
import AdminTempleEmblemForm from './admin/AdminTempleEmblemForm';
import AdminPanchangamEditor from './admin/AdminPanchangamEditor';
import AdminDefaultAssetsForm from './admin/AdminDefaultAssetsForm';

interface AdminPanelProps {
  language: Language;
  onClose: () => void;
  onRefreshAllData?: () => Promise<void>;
  templeEmblem: string;
  onUpdateTempleEmblem: (url: string) => void;
  templeEmblemLibrary: TempleEmblemSlot[];
  onUpdateTempleEmblemLibrary: (list: TempleEmblemSlot[]) => void;
  whatsappLink: string;
  onUpdateWhatsappLink: (link: string) => void;
  templeOpenTime: string;
  templeCloseTime: string;
  onUpdateTempleHours: (open: string, close: string) => void;
  templeOpenTime2: string;
  templeCloseTime2: string;
  onUpdateTempleHours2: (open2: string, close2: string) => void;
  defaultEventImage: string;
  onUpdateDefaultEventImage: (url: string) => void;
  defaultProfileMale: string;
  defaultProfileFemale: string;
  onUpdateDefaultProfileIcons: (maleUrl: string, femaleUrl: string) => void;
  announcement: Announcement;
  onUpdateAnnouncement: (ann: Announcement) => void;
  eventsList: EventItem[];
  onUpdateEvents: (list: EventItem[]) => void;
  galleryList: GalleryItem[];
  onUpdateGallery: (list: GalleryItem[]) => Promise<boolean>;
  donorsList: DonorRecord[];
  onUpdateDonors: (list: DonorRecord[]) => void;
  yearlyStats?: YearlyStat[];
  onUpdateYearlyStats?: (list: YearlyStat[]) => void;
  lifetimeCounter: number;
  onUpdateLifetimeCounter: (val: number) => void;
  currentYearCounter: number;
  onUpdateCurrentYearCounter: (val: number) => void;
  committeeList?: CommitteeMember[];
  onUpdateCommittee?: (list: CommitteeMember[]) => void;
  adminAccounts?: AdminAccount[];
  onUpdateAdminAccounts?: (list: AdminAccount[]) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

export default function AdminPanel({
  language,
  onClose,
  onRefreshAllData,
  templeEmblem,
  onUpdateTempleEmblem,
  templeEmblemLibrary,
  onUpdateTempleEmblemLibrary,
  whatsappLink,
  onUpdateWhatsappLink,
  templeOpenTime,
  templeCloseTime,
  onUpdateTempleHours,
  templeOpenTime2,
  templeCloseTime2,
  onUpdateTempleHours2,
  defaultEventImage,
  onUpdateDefaultEventImage,
  defaultProfileMale,
  defaultProfileFemale,
  onUpdateDefaultProfileIcons,
  announcement,
  onUpdateAnnouncement,
  eventsList,
  onUpdateEvents,
  galleryList,
  onUpdateGallery,
  donorsList,
  onUpdateDonors,
  yearlyStats = [],
  onUpdateYearlyStats,
  lifetimeCounter,
  onUpdateLifetimeCounter,
  currentYearCounter,
  onUpdateCurrentYearCounter,
  committeeList = [],
  onUpdateCommittee,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}: AdminPanelProps) {
  // Login State
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Schedulers simulation outcome audit state
  const [sweepOutcome, setSweepOutcome] = useState<string | null>(null);

  // Force-refresh loading state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active Authenticated Admin account state
  const [loggedInAdmin, setLoggedInAdmin] = useState<CommitteeMember | null>(() => {
    const saved = localStorage.getItem('um_dev_logged_in_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // Refresh System Logs List
  const [systemLogs, setSystemLogs] = useState<AdminLog[]>([]);

  useEffect(() => {
    getLogs().then(setSystemLogs);
  }, []);

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const typedPass = passcode.trim();
    const typedPassUpper = typedPass.toUpperCase();

    // Check custom temple committee list first for passcode match (case-insensitive and trimmed)
    let authenticatedUser = committeeList.find(acc => acc.passcode && (acc.passcode.trim() === typedPass || acc.passcode.trim().toUpperCase() === typedPassUpper));

    // Fallback: If not found in the custom committee list (due to stale localStorage), search default templates
    if (!authenticatedUser) {
      if (typedPassUpper === "DEV1008") {
        authenticatedUser = {
          id: "mem-1",
          nameEN: "Siddhanthi Sri Somshekara Sastry",
          nameTE: "సిద్ధాంతి శ్రీ సోమశేఖర శాస్త్రి",
          roleEN: "Chief Priest & Spiritual Advisor",
          roleTE: "ప్రధాన అర్చకులు & आध्यात्मिक సలహాదారు",
          phone: "+91 94405 11223",
          email: "shastri@umamaheswaradevasthanam.org",
          passcode: "DEV1008",
          username: "shastri"
        };
      } else if (typedPassUpper === "PRES1008") {
        authenticatedUser = {
          id: "mem-2",
          nameEN: "Dr. K. Radhakrishna Murthy",
          nameTE: "డా. కె. రాధాకృష్ణ మూర్తి",
          roleEN: "Temple Committee President / Chairman",
          roleTE: "ఆలయ కమిటీ అధ్యక్షులు / చైర్మన్",
          phone: "+91 98480 34567",
          email: "president@umamaheswaradevasthanam.org",
          passcode: "PRES1008",
          username: "president"
        };
      } else if (typedPassUpper === "SECY567") {
        authenticatedUser = {
          id: "mem-3",
          nameEN: "Sri S. V. Mallikarjuna Rao",
          nameTE: "శ్రీ ఎస్. వి. మల్లికార్జున రావు",
          roleEN: "General Secretary",
          roleTE: "ప్రధాన కార్యదర్శి",
          phone: "+91 99630 88990",
          email: "secretary@umamaheswaradevasthanam.org",
          passcode: "SECY567",
          username: "secretary"
        };
      } else if (typedPassUpper === "TEMP123") {
        authenticatedUser = {
          id: "mem-4",
          nameEN: "Smt. T. Uma Maheswari",
          nameTE: "శ్రీమతి టి. ఉమా మహేశ్వరి",
          roleEN: "Treasurer & Financial Auditor",
          roleTE: "కోశాధికారి & ఆర్థిక తనిఖీదారు",
          phone: "+91 73820 54321",
          email: "treasury@umamaheswaradevasthanam.org",
          passcode: "TEMP123",
          username: "treasurer"
        };
      }
    }

    if (authenticatedUser) {
      setIsAdminLoggedIn(true);
      setLoggedInAdmin(authenticatedUser);
      localStorage.setItem('um_dev_logged_in_admin', JSON.stringify(authenticatedUser));
      setLoginError('');
      const displayName = language === 'EN' ? authenticatedUser.nameEN : authenticatedUser.nameTE;
      const displayRole = language === 'EN' ? authenticatedUser.roleEN : authenticatedUser.roleTE;
      addLog(`${displayName} (${displayRole}) authenticated successfully.`, "security");
      showToast(language === 'EN' ? `Welcome back, ${displayName}!` : `స్వాగతం, ${displayName}!`, 'success');
    } else {
      setLoginError(t('errorWrongPassword'));
      addLog("Failed administrative entrance attempt blocked.", "security");
    }
  };

  const handleRefreshAllData = async () => {
    if (!onRefreshAllData) return;
    setIsRefreshing(true);
    await onRefreshAllData();
    setIsRefreshing(false);
    showToast(language === 'EN' ? 'All data refreshed from Supabase!' : 'సుపాబేస్ నుండి డేటా తాజాగా లోడ్ అయింది!', 'success');
  };

  // Trigger Midnight Cleanup Schedulers (calls Supabase RPC)
  const handleMidnightSimulator = async () => {
    if (confirm(language === 'EN' ? "Launch automated midnight cleanup sweeps?" : "అర్ధరాత్రి క్లీనింగ్ సిమ్యులేషన్ రన్ చేయాలా?")) {
      try {
        await runMidnightJanitorSimulation();

        // Re-fetch fresh data from Supabase after the server-side sweep
        const [freshDonors, freshEvents, freshLifetime] = await Promise.all([
          getDonors(),
          getEvents(),
          getLifetimeCounter(),
        ]);

        onUpdateDonors(freshDonors);
        onUpdateEvents(freshEvents);
        onUpdateLifetimeCounter(freshLifetime);

        const msg =
`✅ Scheduler Executed via Supabase!
• Obsolete events (>365 days old) purged server-side.
• Old donor records (>365 days old) purged & rolled into lifetime pool.
• Historical logs older than 30 days cleared.
• Check the Audit Logs section below for the full sweep report.`;

        setSweepOutcome(msg);
        showToast(t('systemCleanSuccess'), 'success');
      } catch (err) {
        console.error('Janitor error:', err);
        showToast(
          language === 'EN'
            ? 'Cleanup failed — open browser console (F12) to see the full Supabase error.'
            : 'డేటా క్లీనింగ్ విఫలమైంది — F12 నొక్కి కన్సోల్‌లో దోష వివరాలు చూడండి.',
          'error'
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Banner header of admin panel */}
        <div className="bg-gradient-to-r from-[#7A1E1E] via-[#5E1414] to-stone-900 p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <Lock size={20} className="text-amber-300 animate-pulse" />
            <div className="text-left">
              <h3 className="font-serif text-lg md:text-xl font-extrabold tracking-wide text-white">
                {t('adminTitle')}
              </h3>
              {isAdminLoggedIn && loggedInAdmin && (
                <p className="text-[10px] text-amber-200 uppercase tracking-widest font-bold font-sans">
                  {language === 'EN' ? "Authorized Session Active" : "అధికారిక లాగిన్ యాక్టివ్"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end space-x-4">
            {isAdminLoggedIn && loggedInAdmin && (
              <div className="flex items-center space-x-2 bg-black/45 px-3 py-1.5 rounded-full border border-amber-400/30 font-sans text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-stone-300 text-[11px] whitespace-nowrap">{language === 'EN' ? "Operator:" : "సిబ్బంది:"}</span>
                <span 
                  className="font-bold text-amber-300 truncate max-w-[164px]" 
                  title={`${language === 'EN' ? loggedInAdmin.nameEN : loggedInAdmin.nameTE} (${language === 'EN' ? loggedInAdmin.roleEN : loggedInAdmin.roleTE})`}
                >
                  {language === 'EN' ? loggedInAdmin.nameEN : loggedInAdmin.nameTE}
                </span>
              </div>
            )}
            <button 
              type="button"
              onClick={onClose}
              className="rounded-full hover:bg-white/15 p-2 text-white/80 hover:text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Content body toggle */}
        {!isAdminLoggedIn ? (
          /* Authentication Gate lock view */
          <div className="p-8 sm:p-12 text-center flex-1 overflow-y-auto bg-[#FCFBF7] flex flex-col items-center justify-center">
            <div className="bg-amber-50 p-4 rounded-full border border-amber-200 mb-6">
              <ShieldCheck className="text-[#7A1E1E] h-12 w-12 animate-pulse" />
            </div>
            
            <h4 className="font-serif text-xl font-bold text-stone-800 mb-2">
              {language === 'EN' ? "Administrative Security Shield" : "సురక్షిత అడ్మిన్ లాగిన్"}
            </h4>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">
              {language === 'EN' 
                ? "This dashboard is exclusively for authorised temple committee members. Demo passcode: " 
                : "ఈ విభాగం కేవలం ఆలయ ట్రస్ట్ కమిటీ సభ్యులకు మాత్రమే. డెమో పాస్‌కోడ్: "} 
              <span className="font-mono bg-amber-100 text-[#7A1E1E] px-1.5 py-0.5 rounded font-bold">DEV1008</span>
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <div>
                <label htmlFor="masterCode" className="block text-left text-xs text-stone-600 font-bold mb-1">{t('password')}</label>
                <input
                  id="masterCode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. DEV1008"
                  className="w-full font-mono rounded-xl border border-stone-300 px-4 py-3 text-center sm:text-sm font-semibold text-[#7A1E1E] focus:outline-none focus:border-[#7A1E1E] bg-white"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-red-600 text-xs font-bold leading-relaxed">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#7A1E1E] text-white hover:bg-[#5E1414] font-sans font-bold text-sm tracking-wide rounded-xl shadow-md transition cursor-pointer"
              >
                {t('submit')}
              </button>
            </form>
          </div>
        ) : (
          /* Full Authenticated panel view */
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12 bg-[#FAF6F0] font-sans">
            
            {/* Operator greeting banner */}
            {loggedInAdmin && (
              <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-lg shadow-inner shrink-0">
                    {loggedInAdmin.imageUrl ? (
                      <img src={loggedInAdmin.imageUrl} alt={loggedInAdmin.nameEN} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="font-serif text-[#7A1E1E] font-bold">ॐ</span>
                    )}
                  </div>
                  <div className="text-left font-sans">
                    <h4 className="text-sm font-black text-stone-900 font-serif">
                      {language === 'EN' ? "Active Administrator Session" : "అధికారిక నిర్వాహక సెషన్"}
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {language === 'EN' ? "Operator:" : "సిబ్బంది / ఆపరేటర్:"}{" "}
                      <span className="font-bold text-[#7A1E1E]">
                        {language === 'EN' ? loggedInAdmin.nameEN : loggedInAdmin.nameTE}
                      </span>{" "}
                      <span className="text-stone-400 font-normal">
                        ({language === 'EN' ? loggedInAdmin.roleEN : loggedInAdmin.roleTE})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-[11px] font-medium text-[#7A1E1E]">
                  🔑 {language === 'EN' ? "Session Key" : "యాక్సెస్ కీ"}: <span className="font-mono font-bold">{loggedInAdmin.passcode}</span>
                </div>
              </div>
            )}
            
            {/* Quick stats ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 border border-amber-100 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{language === 'EN' ? "Active Events" : "ప్రస్తుత సేవలు"}</span>
                <p className="font-serif text-lg font-black text-[#7A1E1E]">{eventsList.length}</p>
              </div>
              <div className="bg-white p-4 border border-amber-100 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{language === 'EN' ? "Active Images" : "చిత్రాల సంఖ్య"}</span>
                <p className="font-serif text-lg font-black text-[#7A1E1E]">{galleryList.filter(g=>g.type==='image').length} / 20</p>
              </div>
              <div className="bg-white p-4 border border-amber-100 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{language === 'EN' ? "Data Sync" : "డేటా సమకాలీకరణ"}</span>
                <button
                  type="button"
                  onClick={handleRefreshAllData}
                  disabled={isRefreshing}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>{isRefreshing ? (language === 'EN' ? 'Refreshing...' : 'లోడ్ అవుతోంది...') : (language === 'EN' ? 'Force Refresh' : 'తాజా డేటా')}</span>
                </button>
              </div>
            </div>

            {/* Sweep outcomes alert */}
            {sweepOutcome && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 text-xs sm:text-sm relative text-left">
                <button onClick={() => setSweepOutcome(null)} className="absolute top-2 right-2 text-emerald-650 hover:text-black">
                  <X size={14} />
                </button>
                <pre className="font-mono whitespace-pre-wrap leading-relaxed">{sweepOutcome}</pre>
              </div>
            )}

            {/* Simulated Midnight scheduler button row */}
            <div className="bg-gradient-to-r from-amber-400/25 to-amber-500/25 border border-amber-300 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif text-sm sm:text-base font-extrabold text-[#7A1E1E] flex items-center justify-center sm:justify-start space-x-1.5">
                  <span>📊</span>
                  <span>{t('activeLogs')}</span>
                </h4>
                <p className="text-xs text-stone-600 max-w-xl text-left">
                  {language === 'EN' 
                    ? "Simulates the automatic daily backend scheduler: drops obsolete posts (>365 days) and transfers expired individual records safely to the global cumulative trust pools." 
                    : "అర్ధరాత్రి రన్ జరగబోయే ఆటోమేటిక్ డేటా క్లీనింగ్ పద్ధతిని ఇప్పుడే రన్ చేసి చెక్ చేయవచ్చు."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleMidnightSimulator}
                className="shrink-0 flex items-center justify-center space-x-1.5 py-3 px-5 rounded-xl bg-[#7A1E1E] hover:bg-[#5E1414] text-white font-sans font-bold text-xs tracking-wide transition shadow cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>{t('systemCleanBtn')}</span>
              </button>
            </div>

            {/* Sub-component 0: Custom Temple Logo / Emblem Form */}
            <AdminTempleEmblemForm 
              language={language}
              templeEmblem={templeEmblem}
              onUpdateTempleEmblem={onUpdateTempleEmblem}
              templeEmblemLibrary={templeEmblemLibrary}
              onUpdateTempleEmblemLibrary={onUpdateTempleEmblemLibrary}
            />

            {/* Sub-component: Panchangam Editor & Override */}
            <AdminPanchangamEditor language={language} />

            {/* Sub-component 1: Ticker Announcement Text Form + Temple Hours + WhatsApp */}
            <AdminAnnouncementForm
              language={language}
              announcement={announcement}
              onUpdateAnnouncement={onUpdateAnnouncement}
              whatsappLink={whatsappLink}
              onUpdateWhatsappLink={onUpdateWhatsappLink}
              templeOpenTime={templeOpenTime}
              templeCloseTime={templeCloseTime}
              onUpdateTempleHours={onUpdateTempleHours}
              templeOpenTime2={templeOpenTime2}
              templeCloseTime2={templeCloseTime2}
              onUpdateTempleHours2={onUpdateTempleHours2}
              t={t}
            />

            {/* Sub-component: Default Assets — event image + profile icons */}
            <AdminDefaultAssetsForm
              language={language}
              defaultEventImage={defaultEventImage}
              onUpdateDefaultEventImage={onUpdateDefaultEventImage}
              defaultProfileMale={defaultProfileMale}
              defaultProfileFemale={defaultProfileFemale}
              onUpdateDefaultProfileIcons={onUpdateDefaultProfileIcons}
            />

            {/* Sub-component 2: Record trust donations */}
            <AdminDonationForm 
              language={language}
              donorsList={donorsList}
              onUpdateDonors={onUpdateDonors}
              currentYearCounter={currentYearCounter}
              onUpdateCurrentYearCounter={onUpdateCurrentYearCounter}
              t={t}
            />

            {/* Sub-component 3: Audit Yearly Totals & Milestones Customizer */}
            <AdminYearlyAuditForm 
              language={language}
              yearlyStats={yearlyStats}
              onUpdateYearlyStats={onUpdateYearlyStats}
            />

            {/* Sub-component 4: Media Gallery Catalog Manager */}
            <AdminGalleryManager 
              language={language}
              galleryList={galleryList}
              onUpdateGallery={onUpdateGallery}
              t={t}
            />

            {/* Sub-component 5: Devotional Scheduled Events Manager */}
            <AdminEventsManager 
              language={language}
              eventsList={eventsList}
              onUpdateEvents={onUpdateEvents}
              t={t}
            />

            {/* Sub-component 6: Temple Committee Members Roll & Contacts */}
            <AdminCommitteeManager
              language={language}
              committeeList={committeeList}
              onUpdateCommittee={onUpdateCommittee}
              loggedInAdmin={loggedInAdmin}
              setLoggedInAdmin={setLoggedInAdmin}
              defaultProfileMale={defaultProfileMale}
              defaultProfileFemale={defaultProfileFemale}
            />

            {/* Sub-component 7: System Midnight Logs trail viewer */}
            <AdminLogsViewer systemLogs={systemLogs} />

          </div>
        )}

      </div>
    </div>
  );
}
