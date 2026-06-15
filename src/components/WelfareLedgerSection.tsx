import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { DonorRecord, YearlyStat } from '../types';
import { Search, Heart, Landmark, HelpCircle, FileText, AlertTriangle, Info, BookOpen } from 'lucide-react';
import { showToast } from './Toast';

interface WelfareLedgerSectionProps {
  language: Language;
  donorsList: DonorRecord[];
  yearlyStats?: YearlyStat[];
  lifetimeCounter: number;
  currentYearCounter: number;
}

export default function WelfareLedgerSection({ 
  language, 
  donorsList, 
  yearlyStats = [],
  lifetimeCounter,
  currentYearCounter 
}: WelfareLedgerSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  const getYearTotal = (yr: string) => {
    if (yearlyStats.length > 0) {
      const match = yearlyStats.find(s => s.year === yr);
      if (match) return match.totalAmount;
    }
    // Hardcoded fallback if state has not synchronized yet
    if (yr === '2026') return currentYearCounter;
    if (yr === '2025') return 720000;
    if (yr === '2024') return 680000;
    if (yr === '2023') return 615000;
    if (yr === '2022') return 540000;
    if (yr === '2021') return 480000;
    if (yr === '2020') return 350000;
    return 0;
  };

  const getYearAchievement = (yr: string) => {
    if (yearlyStats.length > 0) {
      const match = yearlyStats.find(s => s.year === yr);
      if (match) {
        return language === 'EN' ? match.achievementEN : match.achievementTE;
      }
    }
    // Hardcoded fallback if state has not synchronized yet
    const fallback: Record<string, { EN: string; TE: string }> = {
      '2026': {
        EN: "Current operational year rolling status. Calculated to cover active building maintenance, Vedic wages, and daily feeding programs.",
        TE: "ప్రస్తుత సంవత్సరపు పారదర్శక రికార్డు. ఇది నిత్య అలంకరణలకు, వేద పాఠశాలల వేతనాలకు మరియు సేవా కార్యక్రమాల నిర్వహణ కొరకు సమర్పించబడినది."
      },
      '2025': {
        EN: "Completed inner temple wall stone engravings and Gopuram pristine renovation work.",
        TE: "ఆలయ లోపలి ప్రాంగణ రాతి శిల్ప కళాకృతులు మరియు ప్రధాన గోపుర పునర్నిర్మాణ పనులు ఘనంగా పూర్తయ్యాయి."
      },
      '2024': {
        EN: "Initiated permanent daily free food distribution (Annadanam Trust) facility expansion.",
        TE: "నిత్యాన్నదాన పథకం (అన్నదానం ట్రస్ట్) భవన విస్తరణ కార్యక్రమానికి నాంది పలికిన వైనం."
      },
      '2023': {
        EN: "Acquired modern high-grade brass Pujas utensils and upgraded community gathering mantapam.",
        TE: "ఆలయ అవసరాల కొరకు సువర్ణ కంచు పూజా సామాగ్రి కొనుగోలు మరియు సామాజిక మంటప ఆధునీకరణ."
      },
      '2022': {
        EN: "Constructed the local Vedic library and standard solar pathway lights setup.",
        TE: "ఆధ్యాత్మిక వేద గ్రంథాలయం నిర్మాణం మరియు ఆలయ పరిసరాలలో సోలార్ దీపాల పద్ధతి అమరిక."
      },
      '2021': {
        EN: "Constructed the Gosala shelter extensions and funded rural healthcare campaign.",
        TE: "గోశాల షెడ్ల కొత్త విస్తరణ మరియు గ్రామీణ ఉచిత వైద్య శిబిరాల విజయవంతమైన నిర్వహణ."
      },
      '2020': {
        EN: "Established the main sanctum sanctorum silver archways and main entrance gate.",
        TE: "గర్భాలయ వెండి తోరణాల అమరిక మరియు రజత ప్రధాన సింహద్వార సేవ ప్రస్థానం."
      }
    };
    return language === 'EN' ? fallback[yr]?.EN : fallback[yr]?.TE;
  };

  // Perform filtering based on both search query and selectedYear.
  // CRITICAL REQUIREMENT: Show donor list details for current year (2026) and last year (2025) ONLY.
  // Older donor years list is never shown, only the cumulative totals.
  const filteredDonors = donorsList.filter(don => {
    const donorYear = don.date.split('-')[0];
    
    // Hard security check: Limit online visible listings to 2026 and 2025 ONLY.
    if (donorYear !== '2026' && donorYear !== '2025') {
      return false;
    }

    // Selected year filter (if user selected 2026 or 2025 specifically)
    if (selectedYear !== 'All') {
      if (donorYear !== selectedYear) return false;
    }

    // Search query filter
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    
    const nameMatchEN = don.nameEN.toLowerCase().includes(term);
    const purposeMatchEN = don.purposeEN.toLowerCase().includes(term);
    const nameMatchTE = don.nameTE.toLowerCase().includes(term);
    const purposeMatchTE = don.purposeTE.toLowerCase().includes(term);
    const isAnonymousMatch = don.isAnonymous && t('anonymous').toLowerCase().includes(term);

    return nameMatchEN || purposeMatchEN || nameMatchTE || purposeMatchTE || isAnonymousMatch;
  });

  const isLegacyYear = selectedYear !== 'All' && selectedYear !== '2026' && selectedYear !== '2025';

  return (
    <section id="donations" className="py-16 bg-[#FCFBF7] px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        
        {/* Module Title */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 border-2 border-dashed border-[#E29524]">
              <Landmark className="text-[#7A1E1E] h-5 w-5" />
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#7A1E1E] tracking-tight">
            {t('donationsTitle')}
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-24 bg-amber-400" />
        </div>

        {/* YEAR SELECTION NAVIGATION BUTTONS */}
        <div className="bg-[#FAF6F0] border border-amber-100 p-5 rounded-3xl mb-8">
          <label className="block text-xs font-bold font-sans uppercase tracking-widest text-[#7A1E1E] mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-[#7A1E1E] rounded-full animate-ping"></span>
            <span>{language === 'EN' ? "Select Financial Year to Audit Funds & Achievements:" : "నిధులు & అభివృద్ధి పనుల తనిఖీ కొరకు సంవత్సరాన్ని ఎంచుకోండి:"}</span>
          </label>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide font-serif transition-all transform hover:scale-[1.03] ${
                  selectedYear === yr
                    ? 'bg-[#7A1E1E] text-amber-100 shadow-md ring-2 ring-amber-400'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-[#7A1E1E] hover:bg-stone-50'
                }`}
              >
                {yr === 'All' 
                  ? (language === 'EN' ? '🌌 Lifetime Overview' : '🌌 మొత్తం సమాచారం') 
                  : (yr === '2026' ? (language === 'EN' ? '2026 (Active)' : '2026 (ప్రస్తుత)') : yr)}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Numerical Tally Headers (Bento Grid Style) */}
        {selectedYear === 'All' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Lifetime Counter Box */}
            <div className="bg-gradient-to-br from-[#7A1E1E] to-[#5E1414] p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between border-2 border-amber-300/20 relative overflow-hidden group">
              <div className="opacity-5 absolute right-2 bottom-2 font-serif text-9xl text-white select-none pointer-events-none transform translate-y-12 translate-x-12">
                ॐ
              </div>
              <div>
                <div className="inline-flex items-center space-x-1 bg-amber-300 text-black px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase mb-4 shadow">
                  <span>🔥 {t('lifetimeCounterLabel')}</span>
                </div>
                <p className="font-serif text-3xl sm:text-4xl font-black text-amber-300 tracking-wide mt-2">
                  {t('currencyINR')}{lifetimeCounter.toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-stone-200 mt-4 leading-relaxed font-sans font-light">
                {language === 'EN' 
                  ? "This cumulative amount represents long-term spiritual welfare collections safely invested in public trusts, audited yearly." 
                  : "ఈ భారీ నిధి ఆలయ శాశ్వత అభివృద్ధి మరియు ట్రస్ట్ పనుల కొరకు సురక్షితంగా వేయబడింది."}
              </p>
            </div>

            {/* Current-Year Rolling Tracker Box */}
            <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col justify-between border border-amber-100 relative overflow-hidden group">
              <div>
                <div className="inline-flex items-center space-x-1 bg-[#FAF6F0] border border-[#E29524]/20 text-[#7A1E1E] px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase mb-4 shadow-sm">
                  <span>📊 {t('currentYearCounterLabel')} (2026 Active)</span>
                </div>
                <p className="font-serif text-3xl sm:text-4xl font-black text-[#7A1E1E] tracking-wide mt-2">
                  {t('currencyINR')}{getYearTotal('2026').toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-stone-500 mt-4 leading-relaxed font-sans font-light">
                {language === 'EN' 
                  ? "Current operational year rolling status. Calculated to cover active building maintenance, Vedic wages, and daily feeding programs." 
                  : "ప్రస్తుత సంవత్సరపు పారదర్శక రికార్డు. ఇది నిత్య అలంకరణలకు, వేద పాఠశాలల వేతనాలకు మరియు సేవా కార్యక్రమాల నిర్వహణ కొరకు సమర్పించబడినది."}
              </p>
            </div>

          </div>
        ) : (
          /* YEAR SPECIFIC HIGHLIGHT SPOTLIGHT CARD */
          <div className="bg-gradient-to-br from-[#7A1E1E] to-stone-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl mb-8 border-2 border-amber-300 relative overflow-hidden group transition-all duration-300">
            <div className="opacity-5 absolute right-2 bottom-2 font-serif text-9xl text-white select-none pointer-events-none transform translate-y-12 translate-x-12">
              ॐ
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-amber-400 text-black px-3.5 py-1 rounded-full text-[10px] font-sans font-black tracking-widest uppercase mb-3 shadow">
                  <span>✨ {selectedYear} Year Audit Spotlight</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-amber-200">
                  {language === 'EN' ? `${selectedYear} Total Dedicated Funds` : `${selectedYear} సంవత్సరపు మొత్తం విరాళాల నిధి`}
                </h3>
                <p className="font-serif text-4xl sm:text-5xl font-black text-white tracking-wide mt-3 drop-shadow-sm">
                  {t('currencyINR')}{getYearTotal(selectedYear).toLocaleString()}
                </p>
              </div>
              
              <div className="sm:max-w-md bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 block mb-2 font-sans">
                  📜 {language === 'EN' ? 'Key Achievements & Milestones:' : 'ఆ సంవత్సరం సాధించిన విజయాలు:'}
                </span>
                <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-sans font-medium">
                  {getYearAchievement(selectedYear)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STRICT DESIGN ADVISORY NOTE REGARDING REGISTRY PURPOSES & YEARS LIMITS */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 mb-8 text-stone-850">
          <h4 className="flex items-center space-x-2 text-[#7A1E1E] font-serif font-extrabold text-sm uppercase tracking-wider mb-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0" />
            <span>{language === 'EN' ? "Digital Ledger Regulations & Guidelines" : "డిజిటల్ విరాళాల నియమావళి & మార్గదర్శకాలు"}</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm leading-relaxed">
            <div className="bg-white/80 p-4 border border-amber-100 rounded-2xl flex items-start space-x-3 shadow-xs">
              <span className="text-lg mt-0.5 shrink-0">💎</span>
              <div>
                <p className="font-bold text-stone-900 mb-1">
                  {language === 'EN' ? "Exceeding ₹10,000 offerings only:" : "విరాళాల పరిమితి నియమం:"}
                </p>
                <p className="text-stone-600 font-sans text-xs">
                  {language === 'EN' 
                    ? "Only contributions exceeding ₹10,000 are displayed on this active online public dashboard. Rest assured, all other transaction names are safely recorded in the physical Ledger Book stored in the Temple Maintenance Room." 
                    : "పారదర్శకత కొరకు కేవలం ₹10,000 కి పైబడిన విరాళాలు మాత్రమే ఇక్కడ ఆన్‌లైన్‌లో భద్రపరచబడతాయి. ఇతర భక్తుల విరాళాల వివరములు ఆలయ మేనేజ్‌మెంట్ గదిలోని భౌతిక రికార్డు పుస్తకములో సురక్షితముగా రాయబడతాయి."}
                </p>
              </div>
            </div>

            <div className="bg-white/80 p-4 border border-amber-100 rounded-2xl flex items-start space-x-3 shadow-xs">
              <span className="text-lg mt-0.5 shrink-0">📅</span>
              <div>
                <p className="font-bold text-stone-900 mb-1">
                  {language === 'EN' ? "Active Record Cycle (1-Year Policy):" : "ఆన్‌లైన్ నిల్వ విధానం (1 సంవత్సరం):"}
                </p>
                <p className="text-stone-600 font-sans text-xs">
                  {language === 'EN' 
                    ? "Our online registry retains active individual listings for only 1 year prior to the current year (2026 and 2025). Please do not panic if older listings are not in this portal. Contact any executive committee member who will happily showcase your physical entries." 
                    : "ప్రస్తుతం మనం కేవలం ప్రస్తుత సంవత్సరం (2026) మరియు క్రితం సంవత్సరం (2025) రికార్డులను మాత్రమే ఆన్‌లైన్‌లో ఉంచుతాము. కావున పాత వివరాలు కనిపించనిచో ఆందోళన చెందకండి. ఆలయ కమిటీ సభ్యులను ఎప్పుడైనా సంప్రదించవచ్చు."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Board */}
        <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl flex items-start space-x-4 mb-8">
          <HelpCircle className="text-[#E29524] h-6 w-6 shrink-0 mt-0.5" />
          <p className="font-sans text-xs sm:text-sm text-[#5E1414] leading-relaxed">
            {t('ledgerDisclaimer')}
          </p>
        </div>

        {/* Search Toolbar & Ledger Grid */}
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">
          
          {isLegacyYear ? (
            /* LEDGER ARCHIVED WARNING SIGN FOR OLDER STATISTICAL YEARS */
            <div className="py-12 px-6 text-center border-2 border-dashed border-stone-200 bg-[#FCFBF7] rounded-2xl flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 border border-stone-200">
                <BookOpen className="text-stone-500 h-8 w-8" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800 mb-2">
                {language === 'EN' ? `${selectedYear} Donor Records Encrypted & Archived` : `${selectedYear} సంవత్సరపు దాతల వివరాలు ఆర్కైవ్ చేయబడ్డాయి`}
              </h4>
              <p className="max-w-xl text-xs sm:text-sm text-stone-500 leading-relaxed font-sans mb-6">
                {language === 'EN' 
                  ? `To protect donor confidentiality and support fast site loading, individual records for ${selectedYear} are closed online. The audited final total is verified and the full physical ledger scroll is preserved securely in the Temple Maintenance Office.` 
                  : `${selectedYear} విరాళాల రికార్డుల డిజిటల్ సమర్పణ భద్రతా కారణాల వల్ల ఆన్‌లైన్‌లో ముగించబడింది. ఆ సంవత్సరపు ఆడిట్ నిధులు మరియు రికార్డుల అసలు ప్రతులు ఆలయ కార్యాలయంలో పూర్తి రికార్డు రూపంలో భద్రపరచబడినవి.`}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => showToast(
                    language === 'EN'
                      ? `Request noted for ${selectedYear} records. Visit the Temple Office with a valid ID — a committee member will assist you.`
                      : `${selectedYear} రికార్డుల అభ్యర్థన నమోదైంది. ఒక గుర్తింపు పత్రంతో ఆలయ కార్యాలయానికి వెళ్ళండి.`,
                    'info'
                  )}
                  className="bg-[#7A1E1E] text-white hover:bg-[#5E1414] text-xs font-bold font-sans py-2 px-4 rounded-xl transition"
                >
                  {language === 'EN' ? "Request Certified Physical Extract" : "ధృవీకరించబడిన హార్డ్ కాపీ అభ్యర్థించండి"}
                </button>
                <div className="text-[11px] text-stone-400 font-sans">
                  * {language === 'EN' ? "Requires Committee Verification and Resident ID" : "స్థానిక రికార్డు గుర్తింపు పత్రం అవసరం"}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                {/* Search Input Bar */}
                <div className="relative w-full max-w-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full font-sans rounded-xl border border-stone-300 pl-10 pr-4 py-2.5 text-sm font-medium text-stone-800 bg-[#FCFBF7] focus:border-[#7A1E1E] focus:outline-none focus:ring-1 focus:ring-[#7A1E1E]"
                  />
                </div>
                
                {/* Action Report download option */}
                <button
                  onClick={() => showToast(
                    language === 'EN'
                      ? 'PDF report feature is coming soon. Please contact the committee for the latest certified audit document.'
                      : 'PDF నివేదిక తొందరలో అందుబాటులోకి వస్తుంది. తాజా ఆడిట్ పత్రానికి కమిటీని సంప్రదించండి.',
                    'info'
                  )}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#7A1E1E] text-white hover:bg-[#5E1414] font-sans text-xs font-bold py-2.5 px-4 rounded-xl shadow transition"
                >
                  <FileText size={14} />
                  <span>{t('viewPDFChart')}</span>
                </button>
              </div>

              {/* Ledger Table Layout Grid */}
              <div className="overflow-x-auto rounded-xl border border-stone-100">
                <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
                  <thead className="bg-[#FAF6F0] text-[#7A1E1E] font-serif uppercase tracking-wider font-extrabold text-[10px] border-b border-amber-100/50">
                    <tr>
                      <th className="py-4 px-4">{t('donorName')}</th>
                      <th className="py-4 px-4">{t('amount')}</th>
                      <th className="py-4 px-4">{t('date')}</th>
                      <th className="py-4 px-4">{t('purpose')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredDonors.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-stone-400 font-sans text-xs">
                          {t('noDonors')} (Online registry lists ₹10,000+ donors for 2025-2026 only)
                        </td>
                      </tr>
                    ) : (
                      filteredDonors.map((don) => {
                        const isPrivate = don.isAnonymous;
                        const displayName = isPrivate ? t('anonymous') : (language === 'EN' ? don.nameEN : don.nameTE);
                        const displayPurpose = language === 'EN' ? don.purposeEN : don.purposeTE;

                        return (
                          <tr 
                            key={don.id}
                            id={`donor-${don.id}`}
                            className={`hover:bg-amber-50/20 transition-colors ${isPrivate ? 'bg-stone-50/50 italic text-stone-600' : ''}`}
                          >
                            {/* Name Column */}
                            <td className="py-3 px-4 font-bold flex items-center space-x-2">
                              {isPrivate ? (
                                <span className="text-stone-400 font-normal">{displayName}</span>
                              ) : (
                                <span>{displayName}</span>
                              )}
                            </td>
                            
                            {/* Amount */}
                            <td className="py-3 px-4 font-mono font-extrabold text-[#7A1E1E]">
                              {t('currencyINR')}{don.amount.toLocaleString()}
                            </td>

                            {/* Date */}
                            <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                              {don.date}
                            </td>

                            {/* Purpose */}
                            <td className="py-3 px-4 text-stone-600 max-w-xs truncate" title={displayPurpose}>
                              {displayPurpose}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>

      </div>
    </section>
  );
}
