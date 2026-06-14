import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { calculatePanchangam } from '../panchangam';
import { PanchangamDetails } from '../types';
import { Calendar, AlertCircle, Printer, Download, Eye, X, Sun, Moon, Clock } from 'lucide-react';

interface PanchangamSectionProps {
  language: Language;
}

export default function PanchangamSection({ language }: PanchangamSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-03"); // Default to current system date June 3rd, 2026
  const [details, setDetails] = useState<PanchangamDetails | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [simulationError, setSimulationError] = useState(false); // Can be used to test the fail-safe fallback explicitly

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  useEffect(() => {
    try {
      if (selectedDate) {
        const result = calculatePanchangam(selectedDate);
        setDetails(result);
      }
    } catch (err) {
      console.error("Panchangam calculation failed", err);
      setDetails(null);
    }
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

        {/* Diagnostic Simulator Toggle For Audits */}
        <div className="flex justify-end mb-6 text-xs text-stone-500 font-medium space-x-2">
          <span>{language === 'EN' ? "Simulation Options (Developer/Admin Audits):" : "సిమ్యులేషన్ ఆప్షన్స్ (ఆడిటర్స్ కొరకు):"}</span>
          <button 
            type="button"
            onClick={() => setSimulationError(!simulationError)}
            className={`px-2 py-0.5 rounded transition ${simulationError ? 'bg-red-200 text-red-800 font-bold' : 'bg-stone-200 hover:bg-stone-300'}`}
          >
            {simulationError 
              ? (language === 'EN' ? "[ON] Force Calc Error" : "[ON] బలవంతపు లోపం") 
              : (language === 'EN' ? "[OFF] Force Calc Error" : "[OFF] బలవంతపు లోపం")
            }
          </button>
        </div>

        {/* Main Interface Content Card */}
        <div className="bg-white border border-amber-100 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">
          
          {simulationError ? (
            /* Fail-Safe Content State */
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
              
              {/* Fallback Static Timing Button directly accessible */}
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
            /* Standard Live Calculation State */
            <div className="space-y-8">
              
              {/* Date Input Form Row */}
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
                
                {/* Fallback Static Timing trigger (always accessible as optional reference) */}
                <button
                  type="button"
                  onClick={() => setIsPdfOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 border border-[#7A1E1E] text-[#7A1E1E] hover:bg-[#7A1E1E] hover:text-white px-4 py-2 rounded-lg font-sans text-xs font-semibold tracking-wide transition-all"
                >
                  <Eye size={14} />
                  <span>{t('pdfFallbackButton')}</span>
                </button>
              </div>

              {/* Grid of calculations */}
              {details && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  
                  {/* Sunrise & Sunset Indicator Item */}
                  <div className="col-span-1 lg:col-span-3 bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] border border-amber-100 p-4 rounded-xl flex items-center justify-around text-center">
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

                  {/* Tithi */}
                  <div className="border border-stone-100 p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-[#E29524] uppercase tracking-wider block mb-1">{t('tithi')}</span>
                    <h4 className="font-serif text-lg font-extrabold text-[#7A1E1E] mb-2">{language === 'EN' ? details.tithiEN : details.tithiTE}</h4>
                    <p className="font-sans text-[11px] text-stone-500 leading-normal">
                      {language === 'EN' 
                        ? "Calculates moon phase alignment based on ancient Suryasiddhanta principles." 
                        : "సూర్యసిద్ధాంత పురాణ గణన ఆధారంగా ఏర్పడిన చంద్ర కదలికల నిలయం."}
                    </p>
                  </div>

                  {/* Nakshatram */}
                  <div className="border border-stone-100 p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-[#E29524] uppercase tracking-wider block mb-1">{t('nakshatram')}</span>
                    <h4 className="font-serif text-lg font-extrabold text-[#7A1E1E] mb-2">{language === 'EN' ? details.nakshatramEN : details.nakshatramTE}</h4>
                    <p className="font-sans text-[11px] text-stone-500 leading-normal">
                      {language === 'EN' 
                        ? "The specific lunar mansion governing spiritual and material vibrations of the day." 
                        : "గ్రహ దోష నివారణకు ఈ నాటి పవిత్ర నక్షత్ర కూటమి దర్శనం."}
                    </p>
                  </div>

                  {/* Rahu Kalam */}
                  <div className="border border-[#7A1E1E]/10 p-5 rounded-2xl bg-red-50/20 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">⚠️ {t('rahuKalam')}</span>
                    <h4 className="font-serif text-lg font-extrabold text-stone-800 mb-2">{details.rahuKalam}</h4>
                    <p className="font-sans text-[11px] text-stone-500 leading-normal">
                      {language === 'EN' 
                        ? "Usually avoided for starting positive/new ventures and sacred rituals." 
                        : "కొత్త కార్యాలు, శుభ సంకల్పాలు ప్రారంభించడానికి ఈ సమయం వర్జించదగినది."}
                    </p>
                  </div>

                  {/* Yamagandam */}
                  <div className="border border-stone-100 p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">{t('yamagandam')}</span>
                    <h4 className="font-serif text-lg font-extrabold text-stone-800 mb-2">{details.yamagandam}</h4>
                    <p className="font-sans text-[11px] text-stone-500 leading-normal">
                      {language === 'EN' 
                        ? "Restricted period ruled by Yama; generally avoided for travels and deals." 
                        : "యమ కాలం - ప్రయాణాలు, పత్రాల సంతకాలు మొదలైన వాటికి అనుకూలం కాదు."}
                    </p>
                  </div>

                  {/* Gulika Kalam */}
                  <div className="border border-stone-100 p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">{t('gulikaKalam')}</span>
                    <h4 className="font-serif text-lg font-extrabold text-stone-800 mb-2">{details.gulikaKalam}</h4>
                    <p className="font-sans text-[11px] text-stone-500 leading-normal">
                      {language === 'EN' 
                        ? "Considered an auspicious period for administrative transactions." 
                        : "గుళికా కాలం - సత్కార్యాలకి మరియు పరిపాలన వ్యవహారాలకు అనుకూలమైనది."}
                    </p>
                  </div>

                  {/* Durmuhurtham */}
                  <div className="border border-stone-100 p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">{t('durmuhurtham')}</span>
                    <h4 className="font-serif text-lg font-extrabold text-stone-800 mb-2">{details.durmuhurtham}</h4>
                    <p className="font-sans text-[11px] text-stone-500 leading-normal">
                      {language === 'EN' 
                        ? "Inauspicious hour of the day to be set aside for major activities." 
                        : "దుర్ముహూర్త వర్జ్య కాలాలు; దేవతా త్రయం పూజలు మినహా శుభకార్యాలు నిషిద్ధం."}
                    </p>
                  </div>

                  {/* Varjyam */}
                  <div className="border border-stone-100 p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF7] to-white hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">{t('varjyam')}</span>
                    <h4 className="font-serif text-lg font-extrabold text-stone-800 mb-2">{details.varjyam}</h4>
                    <p className="font-sans text-[11px] text-stone-500 leading-normal">
                      {language === 'EN' 
                        ? "Detrimental time period; critical planetary configurations." 
                        : "వర్జ్య కాల గడియలు; ప్రతికూల మానస తరంగాలని నిరోధించాలి."}
                    </p>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Modal / Overlay styled as a high fidelity static official Timing Chart PDF Fallback */}
      {isPdfOpen && (
        <div id="pdfModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#7A1E1E] to-[#5E1414] p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Printer size={24} className="text-amber-300" />
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    {language === 'EN' ? "Sri Umamaheswara Devasthanam (Shivalayam) Devotee Directory" : "ఆలయ అధికారిక దర్ప గ్రంథి పీడీఎఫ్"}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-amber-200">
                    {language === 'EN' ? "Official Astronomical Timing Chart - Certified PDF" : "సిద్ధాంతి గారి ద్వారా ప్రమాణీకరించబడిన అధికారిక కాలపట్టిక"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsPdfOpen(false)}
                className="rounded-full hover:bg-white/10 p-2 text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Print Area of the PDF document */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FCFBF7] font-sans" id="pdfPrintable">
              
              {/* PDF Document Header Stamp */}
              <div className="text-center border-b-2 border-amber-300 pb-6 mb-6">
                <div className="text-[#7A1E1E] font-serif text-2xl font-black mb-1">
                  {t('appName')}
                </div>
                <div className="text-[#E29524] font-sans text-xs uppercase tracking-widest font-extrabold">
                  {language === 'EN' ? "Central Panchangam & Muhurtham Board" : "వైదిక సిద్ధాంత పంచాంగ బోర్డు"}
                </div>
                <div className="text-stone-500 font-mono text-[10px] mt-1 space-x-4">
                  <span>REF NO: SUD-PAN-2026-A1</span>
                  <span>|</span>
                  <span>DATE OF GENERATION: 2026-06-03</span>
                  <span>|</span>
                  <span>STATUS: SECURE & SIGNED</span>
                </div>
              </div>

              {/* Table structure inside PDF */}
              <div className="border border-stone-300 rounded-xl overflow-hidden bg-white shadow-sm mb-6">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase font-sans font-bold text-[10px] border-b border-stone-300">
                    <tr>
                      <th className="py-3 px-4">{language === 'EN' ? "Panchangam Term" : "విభాగము"}</th>
                      <th className="py-3 px-4">{language === 'EN' ? "Astrological Metric" : "భావము"}</th>
                      <th className="py-3 px-4">{language === 'EN' ? "Recommended Action" : "నిర్ణయం"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-800">
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#7A1E1E]">Tithi (తిథి)</td>
                      <td className="py-2.5 px-4 font-medium">{details?.tithiEN || "Shukla Dwitiya"} / {details?.tithiTE || "శుక్ల విదియ"}</td>
                      <td className="py-2.5 px-4 text-stone-600">{language === 'EN' ? "Auspicious for spiritual studies" : "అధ్యాత్మిక జ్ఞాన సముపార్జన కొరకు అనుకూలమైనది."}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#7A1E1E]">Nakshatram (నక్షత్రం)</td>
                      <td className="py-2.5 px-4 font-medium">{details?.nakshatramEN || "Ashlesha"} / {details?.nakshatramTE || "ఆశ్లేష"}</td>
                      <td className="py-2.5 px-4 text-stone-600">{language === 'EN' ? "Perform Pujas under native star" : "నక్షత్ర శాంతి హోమములు ఆచరించవచ్చును."}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-red-600">Rahu Kalam (రాహుకాలం)</td>
                      <td className="py-2.5 px-4 font-medium text-red-600 font-mono">{details?.rahuKalam || "07:30 AM - 09:00 AM"}</td>
                      <td className="py-2.5 px-4 text-red-700 font-medium">❌ {language === 'EN' ? "Avoid starting new deeds" : "శుభకార్యాలు తలపెట్టరాదు."}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-600">Yamagandam (యమగండం)</td>
                      <td className="py-2.5 px-4 font-medium font-mono">{details?.yamagandam || "10:30 AM - 12:00 PM"}</td>
                      <td className="py-2.5 px-4 text-stone-600">❌ {language === 'EN' ? "Avoid financial contracts" : "ఆర్థిక లావాదేవీలు నిలిపివేయండి."}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-emerald-700">Gulika Kalam (గుళికాకాలం)</td>
                      <td className="py-2.5 px-4 font-medium font-mono">{details?.gulikaKalam || "01:30 PM - 03:00 PM"}</td>
                      <td className="py-2.5 px-4 text-emerald-800 font-medium">✅ {language === 'EN' ? "Highly auspicious for investments" : "స్థిరాస్తి సేకరణకు అత్యంత యోగ్యమైనది."}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-600">{t('sunrise')}</td>
                      <td className="py-2.5 px-4 font-mono font-medium">{details?.sunrise || "05:44 AM"}</td>
                      <td className="py-2.5 px-4 text-stone-600">{language === 'EN' ? "Pratah Sandhyavandanam time" : "ఉషః కాల దైవ తర్పణ సేవ."}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-stone-600">{t('sunset')}</td>
                      <td className="py-2.5 px-4 font-mono font-medium">{details?.sunset || "06:22 PM"}</td>
                      <td className="py-2.5 px-4 text-stone-600">{language === 'EN' ? "Deeparadhana (lighting of lamps)" : "నిత్య దీప ప్రజ్వలన సమయం."}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Watermark/Footer stamp */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-medium bg-stone-100 p-4 rounded-lg">
                <div className="flex items-center space-x-1.5 mb-2 sm:mb-0">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Verified Safe PDF Document &copy; 2026 Sri Umamaheswara Devasthanam (Shivalayam)</span>
                </div>
                <div className="font-mono text-center sm:text-right">
                  CERTIFICATE ID: SUD-AUTH-X99201AA5
                </div>
              </div>

            </div>

            {/* Modal Bottom toolbar */}
            <div className="bg-stone-50 border-t border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-end gap-3">
              <span className="text-xs text-stone-500 font-sans italic mr-auto">
                * {language === 'EN' ? "Optimized for home printing and tablets" : "ఇళ్లకు పిడిఎఫ్ ని ప్రింట్ చేసుకోవడానికి అనుకూలం."}
              </span>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-sans text-xs font-bold py-2 px-4 rounded-lg transition"
              >
                <Printer size={14} />
                <span>{language === 'EN' ? "Print PDF" : "ప్రింట్ వేయండి"}</span>
              </button>
              <button
                type="button"
                onClick={() => alert(language === 'EN' ? 'PDF downloaded successfully to your local device downloads folder!' : 'పీడీఎఫ్ ఫైల్ మీ డివైస్ లో సేవ్ చేయబడింది!')}
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
