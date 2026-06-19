import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { calculatePanchangam } from '../panchangam';
import { PanchangamDetails } from '../types';
import { Calendar, AlertCircle, Printer, Download, Eye, X, Sun, Moon, Clock, Sparkles } from 'lucide-react';
import { showToast } from './Toast';

interface PanchangamSectionProps {
  language: Language;
  isAdminLoggedIn?: boolean;
}

// Show tithi / nakshatram / yogam / karanam with optional transition time
function TransitionBadge({ endTime, nextEN, nextTE, lang }: { endTime?: string; nextEN?: string; nextTE?: string; lang: Language }) {
  if (!endTime) return null;
  const nextLabel = lang === 'EN' ? nextEN : nextTE;
  return (
    <p className="text-[10px] text-stone-400 mt-1 leading-snug">
      <span className="text-amber-600 font-semibold">
        {lang === 'EN' ? `Until ${endTime}` : `${endTime} వరకు`}
      </span>
      {nextLabel && (
        <span className="text-stone-400">
          {lang === 'EN' ? `, then ` : `, తదుపరి `}
          <span className="text-stone-600 font-semibold">{nextLabel}</span>
        </span>
      )}
    </p>
  );
}

export default function PanchangamSection({ language, isAdminLoggedIn = false }: PanchangamSectionProps) {
  // Default to today's date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [details, setDetails] = useState<PanchangamDetails | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [simulationError, setSimulationError] = useState(false);

  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await calculatePanchangam(selectedDate);
        if (!cancelled) setDetails(result);
      } catch (err) {
        console.error('Panchangam calculation failed', err);
        if (!cancelled) setDetails(null);
      }
    }
    if (selectedDate) load();
    return () => { cancelled = true; };
  }, [selectedDate]);

  return (
    <section id="panchangam" className="py-16 bg-[#FAF6F0] px-4 sm:px-6 relative">
      <div className="mx-auto max-w-5xl">

        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 border-2 border-dashed border-[#E29524]">
              <Calendar className="text-[#7A1E1E] h-6 w-6 animate-pulse" />
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#7A1E1E] tracking-tight">
            {t('panchangamTitle')}
          </h2>
          <p className="mt-2 text-stone-600 font-sans text-sm max-w-2xl mx-auto leading-relaxed">
            {t('panchangamSubtitle')}
          </p>
          <div className="mx-auto mt-3 h-0.5 w-24 bg-amber-400" />
        </div>

        {/* Developer simulation toggle — admin only */}
        {isAdminLoggedIn && (
          <div className="flex justify-end mb-6 text-xs text-stone-500 font-medium space-x-2">
            <span>{language === 'EN' ? "Simulation Options (Admin Audits):" : "సిమ్యులేషన్ ఆప్షన్స్:"}</span>
            <button
              type="button"
              onClick={() => setSimulationError(!simulationError)}
              className={`px-2 py-0.5 rounded transition ${simulationError ? 'bg-red-200 text-red-800 font-bold' : 'bg-stone-200 hover:bg-stone-300'}`}
            >
              {simulationError
                ? (language === 'EN' ? "[ON] Force Calc Error" : "[ON] బలవంతపు లోపం")
                : (language === 'EN' ? "[OFF] Force Calc Error" : "[OFF] బలవంతపు లోపం")}
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white border border-amber-100 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">

          {simulationError ? (
            <div className="text-center py-10 px-4 animate-fade-in">
              <div className="flex justify-center mb-4">
                <AlertCircle className="text-red-500 h-16 w-16 animate-bounce" />
              </div>
              <h3 className="font-serif text-xl font-bold text-red-800 mb-2">
                {language === 'EN' ? "Panchangam Live Lookup Disabled" : "పంచాంగ గణన లోపం"}
              </h3>
              <p className="font-sans text-sm text-stone-600 max-w-lg mx-auto mb-8 leading-relaxed">
                {t('calcErrorText')}
              </p>
              <button
                type="button"
                onClick={() => setIsPdfOpen(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-[#E29524] hover:from-amber-400 hover:to-amber-500 text-black py-4 px-8 rounded-full font-sans font-bold text-sm tracking-wide shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Eye size={16} />
                <span>{t('pdfFallbackButton')}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Date picker row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-6">
                <div className="flex items-center space-x-3">
                  <Clock className="text-[#E29524] h-5 w-5" />
                  <label htmlFor="panDate" className="font-serif font-bold text-stone-800 text-base">
                    {t('selectDate')}
                  </label>
                  <input
                    id="panDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 focus:border-[#7A1E1E] focus:outline-none focus:ring-1 focus:ring-[#7A1E1E] bg-[#FCFBF7]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsPdfOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 border border-[#7A1E1E] text-[#7A1E1E] hover:bg-[#7A1E1E] hover:text-white px-4 py-2 rounded-lg font-sans text-xs font-semibold tracking-wide transition-all"
                >
                  <Eye size={14} />
                  <span>{t('pdfFallbackButton')}</span>
                </button>
              </div>

              {details && (
                <div className="space-y-6 animate-fade-in">

                  {/* ── Context Header Band ─────────────────────────────────── */}
                  <div className="bg-gradient-to-r from-[#7A1E1E]/5 via-amber-50 to-[#7A1E1E]/5 border border-amber-200 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-[#7A1E1E] uppercase tracking-widest mb-3 text-center">
                      {language === 'EN' ? "Sri Parabha Nama Samvatsaram — Panchangam Context" : "శ్రీ పంచాంగ విశేష సందర్భం"}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
                      {[
                        {
                          label: language === 'EN' ? "Samvatsara" : "సంవత్సరం",
                          value: language === 'EN' ? details.samvatsaraEN : details.samvatsaraTE,
                        },
                        {
                          label: language === 'EN' ? "Ayanam" : "అయనం",
                          value: language === 'EN' ? details.ayanamEN : details.ayanamTE,
                        },
                        {
                          label: language === 'EN' ? "Rutvu" : "ఋతువు",
                          value: language === 'EN' ? details.rutvuEN : details.rutvuTE,
                        },
                        {
                          label: language === 'EN' ? "Maasam" : "మాసం",
                          value: language === 'EN' ? details.maasamEN : details.maasamTE,
                        },
                        {
                          label: language === 'EN' ? "Paksham" : "పక్షం",
                          value: language === 'EN' ? details.pakshamEN : details.pakshamTE,
                        },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white/70 rounded-xl p-2.5 border border-amber-100">
                          <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="font-serif text-[11px] sm:text-xs font-bold text-[#7A1E1E] leading-tight">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Special Day Banner ─────────────────────────────────── */}
                  {details.specialDayTE && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-3.5 shadow-sm">
                      <Sparkles className="text-amber-500 h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">
                          {language === 'EN' ? "Today's Special Observance" : "నేటి విశేషం"}
                        </p>
                        <p className="font-serif text-sm font-bold text-stone-800">
                          {language === 'EN' ? details.specialDayEN : details.specialDayTE}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── Sunrise / Sunset row ───────────────────────────────── */}
                  <div className="bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] border border-amber-100 p-4 rounded-xl flex items-center justify-around text-center">
                    <div className="flex items-center space-x-2">
                      <Sun className="text-amber-500 h-6 w-6 animate-pulse" />
                      <div>
                        <p className="text-[10px] uppercase font-sans text-stone-500 font-bold tracking-wider">{t('sunrise')}</p>
                        <p className="text-lg font-serif font-bold text-stone-800">{details.sunrise}</p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-stone-200" />
                    <div className="flex items-center space-x-2">
                      <Moon className="text-indigo-400 h-6 w-6 animate-pulse" />
                      <div>
                        <p className="text-[10px] uppercase font-sans text-stone-500 font-bold tracking-wider">{t('sunset')}</p>
                        <p className="text-lg font-serif font-bold text-stone-800">{details.sunset}</p>
                      </div>
                    </div>
                  </div>

                  {/* ── Rashi row ─────────────────────────────────────────── */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-amber-50/40 to-white">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                        ☀️ {language === 'EN' ? "Surya Rashi" : "సూర్య రాశి"}
                      </span>
                      <h4 className="font-serif text-base font-extrabold text-stone-800">
                        {language === 'EN' ? details.suryaRashiEN : details.suryaRashiTE}
                      </h4>
                      <p className="font-sans text-[10px] text-stone-400 mt-1">
                        {language === 'EN' ? "Sun's zodiac position" : "సూర్యుడి రాశి స్థానం"}
                      </p>
                    </div>
                    <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/40 to-white">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">
                        🌙 {language === 'EN' ? "Chandra Rashi" : "చంద్ర రాశి"}
                      </span>
                      <h4 className="font-serif text-base font-extrabold text-stone-800">
                        {language === 'EN' ? details.chandraRashiEN : details.chandraRashiTE}
                      </h4>
                      <p className="font-sans text-[10px] text-stone-400 mt-1">
                        {language === 'EN' ? "Moon's zodiac position" : "చంద్రుడి రాశి స్థానం"}
                      </p>
                    </div>
                  </div>

                  {/* ── Pancha Anga Grid (5 limbs) ────────────────────────── */}
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                      {language === 'EN' ? "Pancha Anga — Five Limbs of the Day" : "పంచాంగం — నాటి పంచ అంగాలు"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                      {/* Tithi */}
                      <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-[#E29524] uppercase tracking-wider block mb-1">{t('tithi')}</span>
                        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E]">
                          {language === 'EN' ? details.tithiEN : details.tithiTE}
                        </h4>
                        <TransitionBadge
                          endTime={details.tithiEndTime}
                          nextEN={details.tithiNextEN}
                          nextTE={details.tithiNextTE}
                          lang={language}
                        />
                        <p className="font-sans text-[10px] text-stone-400 mt-2 leading-tight">
                          {language === 'EN' ? "Lunar day phase" : "చంద్ర తిథి కాలం"}
                        </p>
                      </div>

                      {/* Nakshatram */}
                      <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-[#E29524] uppercase tracking-wider block mb-1">{t('nakshatram')}</span>
                        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E]">
                          {language === 'EN' ? details.nakshatramEN : details.nakshatramTE}
                        </h4>
                        <TransitionBadge
                          endTime={details.nakshatramEndTime}
                          nextEN={details.nakshatramNextEN}
                          nextTE={details.nakshatramNextTE}
                          lang={language}
                        />
                        <p className="font-sans text-[10px] text-stone-400 mt-2 leading-tight">
                          {language === 'EN' ? "Lunar mansion" : "నక్షత్ర కూటమి"}
                        </p>
                      </div>

                      {/* Yogam */}
                      <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-[#E29524] uppercase tracking-wider block mb-1">
                          {language === 'EN' ? "Yogam" : "యోగం"}
                        </span>
                        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E]">
                          {language === 'EN' ? details.yogamEN : details.yogamTE}
                        </h4>
                        <TransitionBadge
                          endTime={details.yogamEndTime}
                          nextEN={details.yogamNextEN}
                          nextTE={details.yogamNextTE}
                          lang={language}
                        />
                        <p className="font-sans text-[10px] text-stone-400 mt-2 leading-tight">
                          {language === 'EN' ? "Sun + Moon combined longitude" : "సూర్య చంద్ర కలిత యోగ కాలం"}
                        </p>
                      </div>

                      {/* Karanam */}
                      <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-[#E29524] uppercase tracking-wider block mb-1">
                          {language === 'EN' ? "Karanam" : "కరణం"}
                        </span>
                        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E]">
                          {language === 'EN' ? details.karanamEN : details.karanamTE}
                        </h4>
                        <TransitionBadge
                          endTime={details.karanamEndTime}
                          nextEN={details.karanamNextEN}
                          nextTE={details.karanamNextTE}
                          lang={language}
                        />
                        <p className="font-sans text-[10px] text-stone-400 mt-2 leading-tight">
                          {language === 'EN' ? "Half-tithi period" : "అర్ధ తిథి కాలం"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ── Inauspicious times ────────────────────────────────── */}
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                      {language === 'EN' ? "Avoid Starting New Activities — Restricted Periods" : "వర్జ్య / నిషిద్ధ కాలాలు — శుభ కార్యాలకు నిషేధం"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div className="border border-red-100 p-4 rounded-2xl bg-red-50/30 hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">⚠️ {t('rahuKalam')}</span>
                        <h4 className="font-serif text-base font-extrabold text-stone-800">{details.rahuKalam}</h4>
                        <p className="font-sans text-[10px] text-stone-400 mt-1">
                          {language === 'EN' ? "Avoid starting positive or new ventures" : "కొత్త కార్యాలు ప్రారంభించడానికి అనుకూలం కాదు"}
                        </p>
                      </div>

                      <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">{t('yamagandam')}</span>
                        <h4 className="font-serif text-base font-extrabold text-stone-800">{details.yamagandam}</h4>
                        <p className="font-sans text-[10px] text-stone-400 mt-1">
                          {language === 'EN' ? "Avoid travel and financial contracts" : "ప్రయాణాలు, ఆర్థిక లావాదేవీలకు నిషేధం"}
                        </p>
                      </div>

                      <div className="border border-stone-100 p-4 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">{t('gulikaKalam')}</span>
                        <h4 className="font-serif text-base font-extrabold text-stone-800">{details.gulikaKalam}</h4>
                        <p className="font-sans text-[10px] text-stone-400 mt-1">
                          {language === 'EN' ? "Auspicious for administrative work" : "పరిపాలన వ్యవహారాలకు అనుకూలమైనది"}
                        </p>
                      </div>

                      <div className="border border-red-100 p-4 rounded-2xl bg-red-50/30 hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">⚠️ {t('durmuhurtham')}</span>
                        {details.durmuhurtham.split('\n').map((slot, i) => (
                          <h4 key={i} className="font-serif text-base font-extrabold text-stone-800 leading-tight">{slot}</h4>
                        ))}
                        <p className="font-sans text-[10px] text-stone-400 mt-1">
                          {language === 'EN' ? "Inauspicious periods; avoid major activities" : "దుర్ముహూర్త కాలాలు; శుభ కార్యాలకు నిషిద్ధం"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ── Auspicious times ──────────────────────────────────── */}
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                      {language === 'EN' ? "Auspicious & Caution Periods" : "శుభ కాలాలు & జాగ్రత్త కాలాలు"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div className="border border-emerald-100 p-4 rounded-2xl bg-emerald-50/30 hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                          ✨ {language === 'EN' ? "Amritakalam" : "అమృతకాలం"}
                        </span>
                        <h4 className="font-serif text-base font-extrabold text-stone-800">
                          {details.amritakalam || <span className="text-stone-400 font-sans text-xs font-normal">—</span>}
                        </h4>
                        <p className="font-sans text-[10px] text-stone-400 mt-1">
                          {details.amritakalam
                            ? (language === 'EN' ? "Most auspicious time of the day for pujas and new beginnings" : "పూజలకు, శుభ కార్యాలకు అత్యంత అనుకూలమైన కాలం")
                            : (language === 'EN' ? "Available with Prokerala live data — not calculated in self-calc mode" : "Prokerala డేటా ద్వారా అందుబాటులో ఉంటుంది")}
                        </p>
                      </div>

                      <div className="border border-orange-100 p-4 rounded-2xl bg-orange-50/20 hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">
                          ⚡ {t('varjyam')}
                        </span>
                        <h4 className="font-serif text-base font-extrabold text-stone-800">{details.varjyam}</h4>
                        <p className="font-sans text-[10px] text-stone-400 mt-1">
                          {language === 'EN' ? "Detrimental period; critical planetary configuration" : "వర్జ్య కాల గడియలు; ప్రతికూల మానస తరంగాలని నిరోధించాలి"}
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ── PDF / Print Reference Modal ─────────────────────────────────────── */}
      {isPdfOpen && (
        <div id="pdfModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400 max-h-[90vh] flex flex-col">

            <div className="bg-gradient-to-r from-[#7A1E1E] to-[#5E1414] p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Printer size={24} className="text-amber-300" />
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    {language === 'EN' ? "Sri Umamaheswara Devasthanam — Panchangam Reference" : "ఆలయ అధికారిక పంచాంగ పత్రం"}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-amber-200">
                    {language === 'EN' ? "Astronomical Timing Chart — Certified Reference" : "సిద్ధాంతి గారి ద్వారా ప్రమాణీకరించబడిన కాలపట్టిక"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsPdfOpen(false)} className="rounded-full hover:bg-white/10 p-2 text-white transition-all cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FCFBF7] font-sans" id="pdfPrintable">

              <div className="text-center border-b-2 border-amber-300 pb-6 mb-6">
                <div className="text-[#7A1E1E] font-serif text-2xl font-black mb-1">{t('appName')}</div>
                <div className="text-[#E29524] font-sans text-xs uppercase tracking-widest font-extrabold">
                  {language === 'EN' ? "Central Panchangam & Muhurtham Board" : "వైదిక సిద్ధాంత పంచాంగ బోర్డు"}
                </div>
                {details && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2 text-[10px]">
                    {[
                      { label: language === 'EN' ? "Samvatsara" : "సంవత్సరం", value: language === 'EN' ? details.samvatsaraEN : details.samvatsaraTE },
                      { label: language === 'EN' ? "Ayanam" : "అయనం", value: language === 'EN' ? details.ayanamEN : details.ayanamTE },
                      { label: language === 'EN' ? "Rutvu" : "ఋతువు", value: language === 'EN' ? details.rutvuEN : details.rutvuTE },
                      { label: language === 'EN' ? "Maasam" : "మాసం", value: language === 'EN' ? details.maasamEN : details.maasamTE },
                      { label: language === 'EN' ? "Paksham" : "పక్షం", value: language === 'EN' ? details.pakshamEN : details.pakshamTE },
                    ].map(({ label, value }) => (
                      <span key={label} className="bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 font-semibold text-stone-700">
                        {label}: <span className="text-[#7A1E1E]">{value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {details?.specialDayTE && (
                <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-amber-700">
                    ✨ {language === 'EN' ? "Special Observance: " : "నేటి విశేషం: "}
                    {language === 'EN' ? details.specialDayEN : details.specialDayTE}
                  </p>
                </div>
              )}

              <div className="border border-stone-300 rounded-xl overflow-hidden bg-white shadow-sm mb-6">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase font-sans font-bold text-[10px] border-b border-stone-300">
                    <tr>
                      <th className="py-3 px-4">{language === 'EN' ? "Panchangam Term" : "విభాగము"}</th>
                      <th className="py-3 px-4">{language === 'EN' ? "Value" : "వివరం"}</th>
                      <th className="py-3 px-4">{language === 'EN' ? "Guidance" : "నిర్ణయం"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-800">
                    {[
                      {
                        term: "Tithi (తిథి)",
                        value: `${details?.tithiEN || "—"} / ${details?.tithiTE || "—"}${details?.tithiEndTime ? ` → ${details.tithiNextEN}` : ""}`,
                        note: language === 'EN' ? "Lunar day phase" : "చంద్ర తిథి కాలం",
                        color: "",
                      },
                      {
                        term: "Nakshatram (నక్షత్రం)",
                        value: `${details?.nakshatramEN || "—"} / ${details?.nakshatramTE || "—"}${details?.nakshatramEndTime ? ` → ${details.nakshatramNextEN}` : ""}`,
                        note: language === 'EN' ? "Lunar mansion governing the day" : "నక్షత్ర శాంతి హోమములు ఆచరించవచ్చును",
                        color: "",
                      },
                      {
                        term: "Yogam (యోగం)",
                        value: `${details?.yogamEN || "—"} / ${details?.yogamTE || "—"}${details?.yogamEndTime ? ` → ${details.yogamNextEN}` : ""}`,
                        note: language === 'EN' ? "Combined Sun-Moon longitude period" : "సూర్య చంద్ర యోగ కాలం",
                        color: "",
                      },
                      {
                        term: "Karanam (కరణం)",
                        value: `${details?.karanamEN || "—"} / ${details?.karanamTE || "—"}${details?.karanamEndTime ? ` → ${details.karanamNextEN}` : ""}`,
                        note: language === 'EN' ? "Half-tithi astrological period" : "అర్ధ తిథి కాలం",
                        color: "",
                      },
                      {
                        term: "Surya Rashi (సూర్య రాశి)",
                        value: `${details?.suryaRashiEN || "—"} / ${details?.suryaRashiTE || "—"}`,
                        note: language === 'EN' ? "Sun's zodiac sign" : "సూర్యుడి రాశి స్థానం",
                        color: "",
                      },
                      {
                        term: "Chandra Rashi (చంద్ర రాశి)",
                        value: `${details?.chandraRashiEN || "—"} / ${details?.chandraRashiTE || "—"}`,
                        note: language === 'EN' ? "Moon's zodiac sign" : "చంద్రుడి రాశి స్థానం",
                        color: "",
                      },
                      {
                        term: "Rahu Kalam (రాహుకాలం)",
                        value: details?.rahuKalam || "—",
                        note: language === 'EN' ? "❌ Avoid starting new deeds" : "శుభకార్యాలు తలపెట్టరాదు",
                        color: "text-red-600",
                      },
                      {
                        term: "Yamagandam (యమగండం)",
                        value: details?.yamagandam || "—",
                        note: language === 'EN' ? "❌ Avoid financial contracts" : "ఆర్థిక లావాదేవీలు నిలిపివేయండి",
                        color: "",
                      },
                      {
                        term: "Gulika Kalam (గుళికాకాలం)",
                        value: details?.gulikaKalam || "—",
                        note: language === 'EN' ? "✅ Auspicious for administration" : "స్థిరాస్తి సేకరణకు అత్యంత యోగ్యమైనది",
                        color: "text-emerald-700",
                      },
                      {
                        term: "Durmuhurtham (దుర్ముహూర్తం)",
                        value: details?.durmuhurtham.replace('\n', ' | ') || "—",
                        note: language === 'EN' ? "⚠️ Inauspicious; avoid major activities" : "దుర్ముహూర్త కాలాలు; శుభ కార్యాలకు నిషిద్ధం",
                        color: "text-red-600",
                      },
                      {
                        term: "Amritakalam (అమృతకాలం)",
                        value: details?.amritakalam || "—",
                        note: language === 'EN' ? "✨ Most auspicious for pujas" : "పూజలకు అత్యంత అనుకూలమైన కాలం",
                        color: "text-emerald-700",
                      },
                      {
                        term: "Varjyam (వర్జ్యం)",
                        value: details?.varjyam || "—",
                        note: language === 'EN' ? "⚡ Detrimental planetary period" : "వర్జ్య కాల గడియలు",
                        color: "text-orange-600",
                      },
                      {
                        term: "Sunrise (సూర్యోదయం)",
                        value: details?.sunrise || "—",
                        note: language === 'EN' ? "Pratah Sandhyavandanam time" : "ఉషః కాల దైవ తర్పణ సేవ",
                        color: "",
                      },
                      {
                        term: "Sunset (సూర్యాస్తమయం)",
                        value: details?.sunset || "—",
                        note: language === 'EN' ? "Deeparadhana — lighting of lamps" : "నిత్య దీప ప్రజ్వలన సమయం",
                        color: "",
                      },
                    ].map(({ term, value, note, color }) => (
                      <tr key={term}>
                        <td className={`py-2.5 px-4 font-bold text-[#7A1E1E] text-[11px] ${color}`}>{term}</td>
                        <td className={`py-2.5 px-4 font-medium font-mono text-[11px] ${color}`}>{value}</td>
                        <td className={`py-2.5 px-4 text-[11px] text-stone-500 ${color}`}>{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-medium bg-stone-100 p-4 rounded-lg">
                <div className="flex items-center space-x-1.5 mb-2 sm:mb-0">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Verified Reference &copy; 2026 Sri Umamaheswara Devasthanam (Shivalayam)</span>
                </div>
                <div className="font-mono text-center sm:text-right">CERT ID: SUD-PAN-2026-A1</div>
              </div>

            </div>

            <div className="bg-stone-50 border-t border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-end gap-3">
              <span className="text-xs text-stone-500 font-sans italic mr-auto">
                * {language === 'EN' ? "Optimized for home printing and tablets" : "ఇళ్లకు ప్రింట్ చేసుకోవడానికి అనుకూలం"}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-sans text-xs font-bold py-2 px-4 rounded-lg transition"
              >
                <Printer size={14} />
                <span>{language === 'EN' ? "Print PDF" : "ప్రింట్ వేయండి"}</span>
              </button>
              <button
                type="button"
                onClick={() => showToast(
                  language === 'EN'
                    ? "Panchangam PDF export coming soon. Use browser's Print → Save as PDF for now."
                    : 'పంచాంగం PDF ఎగుమతి తొందరలో వస్తుంది. ప్రస్తుతం బ్రౌజర్ Print → Save as PDF ఉపయోగించండి.',
                  'info'
                )}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-[#7A1E1E] text-white hover:bg-[#5E1414] font-sans text-xs font-bold py-2 px-4 rounded-lg transition"
              >
                <Download size={14} />
                <span>{language === 'EN' ? "Download PDF Report" : "పీడీఎఫ్ డౌన్‌లోడ్"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
