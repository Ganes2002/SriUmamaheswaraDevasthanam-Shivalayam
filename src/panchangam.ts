import { PanchangamDetails } from './types';

// ── Lookup tables ─────────────────────────────────────────────────────────────

const TITHIS = [
  { EN: "Shukla Prathama",    TE: "శుక్ల పాడ్యమి" },
  { EN: "Shukla Dwitiya",     TE: "శుక్ల విదియ" },
  { EN: "Shukla Tritiya",     TE: "శుక్ల తదియ" },
  { EN: "Shukla Chaturthi",   TE: "శుక్ల చవితి" },
  { EN: "Shukla Panchami",    TE: "శుక్ల పంచమి" },
  { EN: "Shukla Shashti",     TE: "శుక్ల షష్ఠి" },
  { EN: "Shukla Saptami",     TE: "శుక్ల సప్తమి" },
  { EN: "Shukla Ashtami",     TE: "శుక్ల అష్టమి" },
  { EN: "Shukla Navami",      TE: "శుక్ల నవమి" },
  { EN: "Shukla Dashami",     TE: "శుక్ల దశమి" },
  { EN: "Shukla Ekadashi",    TE: "శుక్ల ఏకాదశి" },
  { EN: "Shukla Dwadashi",    TE: "శుక్ల ద్వాదశి" },
  { EN: "Shukla Trayodashi",  TE: "శుక్ల త్రయోదశి" },
  { EN: "Shukla Chaturdashi", TE: "శుక్ల చతుర్దశి" },
  { EN: "Pournami",           TE: "పౌర్ణమి" },
  { EN: "Krishna Prathama",   TE: "కృష్ణ పాడ్యమి" },
  { EN: "Krishna Dwitiya",    TE: "కృష్ణ విదియ" },
  { EN: "Krishna Tritiya",    TE: "కృష్ణ తదియ" },
  { EN: "Krishna Chaturthi",  TE: "కృష్ణ చవితి" },
  { EN: "Krishna Panchami",   TE: "కృష్ణ పంచమి" },
  { EN: "Krishna Shashti",    TE: "కృష్ణ షష్ఠి" },
  { EN: "Krishna Saptami",    TE: "కృష్ణ సప్తమి" },
  { EN: "Krishna Ashtami",    TE: "కృష్ణ అష్టమి" },
  { EN: "Krishna Navami",     TE: "కృష్ణ నవమి" },
  { EN: "Krishna Dashami",    TE: "కృష్ణ దశమి" },
  { EN: "Krishna Ekadashi",   TE: "కృష్ణ ఏకాదశి" },
  { EN: "Krishna Dwadashi",   TE: "కృష్ణ ద్వాదశి" },
  { EN: "Krishna Trayodashi", TE: "కృష్ణ త్రయోదశి" },
  { EN: "Krishna Chaturdashi",TE: "కృష్ణ చతుర్దశి" },
  { EN: "Amavasya",           TE: "అమావాస్య" },
];

const NAKSHATRAMS = [
  { EN: "Ashwini",          TE: "అశ్విని" },
  { EN: "Bharani",          TE: "భరణి" },
  { EN: "Krittika",         TE: "కృత్తిక" },
  { EN: "Rohini",           TE: "రోహిణి" },
  { EN: "Mrigashira",       TE: "మృగశిర" },
  { EN: "Arudra",           TE: "ఆర్ద్ర" },
  { EN: "Punarvasu",        TE: "పునర్వసు" },
  { EN: "Pushyami",         TE: "పుష్యమి" },
  { EN: "Ashlesha",         TE: "ఆశ్లేష" },
  { EN: "Magha",            TE: "మఘ" },
  { EN: "Purva Phalguni",   TE: "పుబ్బ" },
  { EN: "Uttara Phalguni",  TE: "ఉత్తర" },
  { EN: "Hasta",            TE: "హస్త" },
  { EN: "Chitra",           TE: "చిత్ర" },
  { EN: "Swati",            TE: "స్వాతి" },
  { EN: "Vishakha",         TE: "విశాఖ" },
  { EN: "Anuradha",         TE: "అనూరాధ" },
  { EN: "Jyeshta",          TE: "జ్యేష్ఠ" },
  { EN: "Mula",             TE: "మూల" },
  { EN: "Purvashadha",      TE: "పూర్వాషాఢ" },
  { EN: "Uttarashadha",     TE: "ఉత్తరాషాఢ" },
  { EN: "Shravana",         TE: "శ్రవణం" },
  { EN: "Dhanishta",        TE: "ధనిష్ఠ" },
  { EN: "Shatabhisham",     TE: "శతభిషం" },
  { EN: "Purvabhadra",      TE: "పూర్వాభాద్ర" },
  { EN: "Uttarabhadra",     TE: "ఉత్తరాభాద్ర" },
  { EN: "Revati",           TE: "రేవతి" },
];

const YOGAMS = [
  { EN: "Vishkamba",   TE: "విష్కంభ" },
  { EN: "Priti",       TE: "ప్రీతి" },
  { EN: "Ayushman",    TE: "ఆయుష్మాన్" },
  { EN: "Saubhagya",   TE: "సౌభాగ్య" },
  { EN: "Shobhana",    TE: "శోభన" },
  { EN: "Atiganda",    TE: "అతిగండ" },
  { EN: "Sukarma",     TE: "సుకర్మ" },
  { EN: "Dhriti",      TE: "ధృతి" },
  { EN: "Shoola",      TE: "శూలం" },
  { EN: "Ganda",       TE: "గండం" },
  { EN: "Vriddhi",     TE: "వృద్ధి" },
  { EN: "Dhruva",      TE: "ధ్రువ" },
  { EN: "Vyaghata",    TE: "వ్యాఘాత" },
  { EN: "Harshana",    TE: "హర్షణ" },
  { EN: "Vajra",       TE: "వజ్ర" },
  { EN: "Siddhi",      TE: "సిద్ధి" },
  { EN: "Vyatipata",   TE: "వ్యతీపాత" },
  { EN: "Variyan",     TE: "వరీయాన్" },
  { EN: "Parigha",     TE: "పరిఘ" },
  { EN: "Shiva",       TE: "శివ" },
  { EN: "Siddha",      TE: "సిద్ధ" },
  { EN: "Sadhya",      TE: "సాధ్య" },
  { EN: "Shubha",      TE: "శుభ" },
  { EN: "Shukla",      TE: "శుక్ల" },
  { EN: "Brahma",      TE: "బ్రహ్మ" },
  { EN: "Indra",       TE: "ఇంద్ర" },
  { EN: "Vaidhriti",   TE: "వైధృతి" },
];

// Index order: Bava(0)…Vishti(6) = repeating, Shakuni(7), Chatushpada(8), Naga(9), Kimstughna(10)
const KARANAS = [
  { EN: "Bava",         TE: "బవ" },
  { EN: "Balava",       TE: "బాలవ" },
  { EN: "Kaulava",      TE: "కౌలవ" },
  { EN: "Taitila",      TE: "తైతిల" },
  { EN: "Gara",         TE: "గర" },
  { EN: "Vanija",       TE: "వణిజ" },
  { EN: "Vishti",       TE: "విష్టి" },
  { EN: "Shakuni",      TE: "శకుని" },
  { EN: "Chatushpada",  TE: "చతుష్పద" },
  { EN: "Naga",         TE: "నాగవం" },
  { EN: "Kimstughna",   TE: "కిమ్స్తుఘ్నం" },
];

const RAASHIS = [
  { EN: "Mesha (Aries)",         TE: "మేషం" },
  { EN: "Vrishabha (Taurus)",    TE: "వృషభం" },
  { EN: "Mithuna (Gemini)",      TE: "మిథునం" },
  { EN: "Karkataka (Cancer)",    TE: "కర్కాటకం" },
  { EN: "Simha (Leo)",           TE: "సింహం" },
  { EN: "Kanya (Virgo)",         TE: "కన్య" },
  { EN: "Tula (Libra)",          TE: "తులం" },
  { EN: "Vrischika (Scorpio)",   TE: "వృశ్చికం" },
  { EN: "Dhanu (Sagittarius)",   TE: "ధనుస్సు" },
  { EN: "Makara (Capricorn)",    TE: "మకరం" },
  { EN: "Kumbha (Aquarius)",     TE: "కుంభం" },
  { EN: "Meena (Pisces)",        TE: "మీనం" },
];

const MAASAMS = [
  { EN: "Chaitra",     TE: "చైత్రం" },
  { EN: "Vaishakha",   TE: "వైశాఖం" },
  { EN: "Jyeshtha",    TE: "జ్యేష్ఠం" },
  { EN: "Ashadha",     TE: "ఆషాఢం" },
  { EN: "Shravana",    TE: "శ్రావణం" },
  { EN: "Bhadrapada",  TE: "భాద్రపదం" },
  { EN: "Ashwina",     TE: "ఆశ్వయుజం" },
  { EN: "Kartika",     TE: "కార్తీకం" },
  { EN: "Margashira",  TE: "మార్గశీర్షం" },
  { EN: "Pushya",      TE: "పుష్యం" },
  { EN: "Magha",       TE: "మాఘం" },
  { EN: "Phalguna",    TE: "ఫాల్గుణం" },
];

const RUTVUS = [
  { EN: "Vasanta (Spring)",  TE: "వసంత ఋతువు" },
  { EN: "Greeshma (Summer)", TE: "గ్రీష్మ ఋతువు" },
  { EN: "Varsha (Monsoon)",  TE: "వర్ష ఋతువు" },
  { EN: "Sharath (Autumn)",  TE: "శరత్ ఋతువు" },
  { EN: "Hemanta (Winter)",  TE: "హేమంత ఋతువు" },
  { EN: "Shishira (Dewy)",   TE: "శిశిర ఋతువు" },
];

const SAMVATSARA_UGADI: Array<{ from: string; EN: string; TE: string }> = [
  { from: "2023-03-22", EN: "Shobhakritu",  TE: "శోభకృత్" },
  { from: "2024-04-09", EN: "Krodhi",       TE: "క్రోధి" },
  { from: "2025-03-30", EN: "Vishwavasu",   TE: "విశ్వావసు" },
  { from: "2026-03-19", EN: "Parabhava",    TE: "పరాభవ" },
  { from: "2027-04-07", EN: "Plavanga",     TE: "ప్లవంగ" },
  { from: "2028-03-27", EN: "Keelaka",      TE: "కీలక" },
];

// Weekday-based inauspicious times (0 = Sunday … 6 = Saturday)
// Rahu Kalam and Gulika are recomputed from actual sunrise in the Meeus path;
// durmuhurtham is kept as fixed weekday values (complex to compute from scratch).
const WEEKDAY_RULES = [
  { durmuhurtham: "04:40 PM - 05:30 PM" },
  { durmuhurtham: "12:26 PM - 01:18 PM\n03:02 PM - 03:54 PM" },
  { durmuhurtham: "08:15 AM - 09:05 AM" },
  { durmuhurtham: "11:50 AM - 12:40 PM" },
  { durmuhurtham: "10:10 AM - 11:00 AM" },
  { durmuhurtham: "08:45 AM - 09:35 AM\n10:58 AM - 11:50 AM" },
  { durmuhurtham: "07:30 AM - 08:20 AM" },
];

// ── Hardcoded priest-verified data (always takes priority) ────────────────────
const ACCURATE_PANCHANGAM: Record<string, PanchangamDetails> = {
  "2026-06-15": {
    date: "2026-06-15",
    samvatsaraEN: "Parabhava",    samvatsaraTE: "పరాభవ నామ సంవత్సరం",
    ayanamEN: "Uttarayanam",      ayanamTE: "ఉత్తరాయణం",
    rutvuEN: "Greeshma (Summer)", rutvuTE: "గ్రీష్మ ఋతువు",
    maasamEN: "Adhika Jyeshtha",  maasamTE: "అధిక జ్యేష్ట మాసం",
    pakshamEN: "Krishna (Bahula) Paksham", pakshamTE: "బహుళ పక్షం",
    tithiEN: "Amavasya",          tithiTE: "అమావాస్య",
    tithiEndTime: "9:15 AM",
    tithiNextEN: "Shukla Prathama", tithiNextTE: "శుక్ల పాడ్యమి",
    nakshatramEN: "Mrigashira",   nakshatramTE: "మృగశిర",
    nakshatramEndTime: "9:09 PM",
    nakshatramNextEN: "Arudra",   nakshatramNextTE: "ఆర్ద్ర",
    yogamEN: "Shoola",            yogamTE: "శూలం",
    yogamEndTime: "10:37 AM",
    yogamNextEN: "Ganda",         yogamNextTE: "గండం",
    karanamEN: "Naga",            karanamTE: "నాగవం",
    karanamEndTime: "9:15 AM",
    karanamNextEN: "Kimstughna",  karanamNextTE: "కిమ్స్తుఘ్నం",
    suryaRashiEN: "Vrishabha (Taurus)", suryaRashiTE: "వృషభం",
    chandraRashiEN: "Vrishabha (Taurus)", chandraRashiTE: "వృషభం",
    rahuKalam:    "07:30 AM - 09:00 AM",
    yamagandam:   "10:30 AM - 12:00 PM",
    gulikaKalam:  "01:30 PM - 03:00 PM",
    durmuhurtham: "12:26 PM - 01:18 PM\n03:02 PM - 03:54 PM",
    varjyam:      "4:58 PM onwards",
    amritakalam:  "12:57 PM - 02:26 PM",
    sunrise: "5:28 AM",
    sunset:  "6:30 PM",
    specialDayEN: "Mithuna Sankramanam — Sun enters Gemini at 8:16 PM",
    specialDayTE: "మిథున సంక్రమణం — సూర్యుడు మిథున రాశిలో ప్రవేశం రా 8:16",
  },
};

// ── Context helpers (calendar fields not from Meeus) ─────────────────────────

function getSamvatsara(dateStr: string): { EN: string; TE: string } {
  let result = { EN: "Parabhava", TE: "పరాభవ" };
  for (const row of SAMVATSARA_UGADI) {
    if (dateStr >= row.from) result = { EN: row.EN, TE: row.TE };
    else break;
  }
  return result;
}

function getAyanam(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1, d = date.getDate();
  const uttara = (m > 1 && m < 7) || (m === 1 && d >= 14) || (m === 7 && d < 16);
  return uttara
    ? { EN: "Uttarayanam", TE: "ఉత్తరాయణం" }
    : { EN: "Dakshinayanam", TE: "దక్షిణాయణం" };
}

function getRutvu(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1, d = date.getDate();
  if ((m === 3 && d >= 14) || m === 4 || (m === 5 && d < 14))  return RUTVUS[0];
  if ((m === 5 && d >= 14) || m === 6 || (m === 7 && d < 16))  return RUTVUS[1];
  if ((m === 7 && d >= 16) || m === 8 || (m === 9 && d < 17))  return RUTVUS[2];
  if ((m === 9 && d >= 17) || m === 10 || (m === 11 && d < 17)) return RUTVUS[3];
  if ((m === 11 && d >= 17) || m === 12 || (m === 1 && d < 14)) return RUTVUS[4];
  return RUTVUS[5];
}

function getMaasam(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1, d = date.getDate();
  if ((m === 4 && d >= 14) || (m === 5 && d < 14))  return MAASAMS[0];
  if ((m === 5 && d >= 14) || (m === 6 && d < 15))  return MAASAMS[1];
  if ((m === 6 && d >= 15) || (m === 7 && d < 16))  return MAASAMS[2];
  if ((m === 7 && d >= 16) || (m === 8 && d < 17))  return MAASAMS[3];
  if ((m === 8 && d >= 17) || (m === 9 && d < 17))  return MAASAMS[4];
  if ((m === 9 && d >= 17) || (m === 10 && d < 17)) return MAASAMS[5];
  if ((m === 10 && d >= 17) || (m === 11 && d < 16)) return MAASAMS[6];
  if ((m === 11 && d >= 16) || (m === 12 && d < 16)) return MAASAMS[7];
  if ((m === 12 && d >= 16) || (m === 1 && d < 14))  return MAASAMS[8];
  if ((m === 1 && d >= 14) || (m === 2 && d < 13))   return MAASAMS[9];
  if ((m === 2 && d >= 13) || (m === 3 && d < 14))   return MAASAMS[10];
  return MAASAMS[11];
}

function getSuryaRashi(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1, d = date.getDate();
  if ((m === 4 && d >= 14) || (m === 5 && d < 14))  return RAASHIS[0];
  if ((m === 5 && d >= 14) || (m === 6 && d < 15))  return RAASHIS[1];
  if ((m === 6 && d >= 15) || (m === 7 && d < 16))  return RAASHIS[2];
  if ((m === 7 && d >= 16) || (m === 8 && d < 17))  return RAASHIS[3];
  if ((m === 8 && d >= 17) || (m === 9 && d < 17))  return RAASHIS[4];
  if ((m === 9 && d >= 17) || (m === 10 && d < 17)) return RAASHIS[5];
  if ((m === 10 && d >= 17) || (m === 11 && d < 16)) return RAASHIS[6];
  if ((m === 11 && d >= 16) || (m === 12 && d < 16)) return RAASHIS[7];
  if ((m === 12 && d >= 16) || (m === 1 && d < 14))  return RAASHIS[8];
  if ((m === 1 && d >= 14) || (m === 2 && d < 12))   return RAASHIS[9];
  if ((m === 2 && d >= 12) || (m === 3 && d < 14))   return RAASHIS[10];
  return RAASHIS[11];
}

// ── Meeus astronomical calculation ───────────────────────────────────────────
// Replaces the old seed/hash approach with real planetary formulas.
// Accuracy: tithi/nakshatra/yoga/karana within ~30 min of transitions.

function _r(d: number) { return d * Math.PI / 180; }
function _d(r: number) { return r * 180 / Math.PI; }
function _m(n: number) { return ((n % 360) + 360) % 360; }

// Julian Day Number for "YYYY-MM-DD" at 6 AM IST (= 00:30 UTC)
function _jd(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  let Y = y, M = m;
  if (M <= 2) { Y--; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + 0.5 / 24 + B - 1524.5;
}

// Sun's tropical longitude (degrees)
function _sunLon(jd: number): number {
  const T  = (jd - 2451545.0) / 36525;
  const L0 = _m(280.46646 + 36000.76983 * T);
  const M  = _r(_m(357.52911 + 35999.05029 * T));
  const C  = (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  return _m(L0 + C);
}

// Moon's tropical longitude — 10-term Meeus approximation (~0.3° error)
function _moonLon(jd: number): number {
  const T  = (jd - 2451545.0) / 36525;
  const Lp = _m(218.3164477 + 481267.88123421 * T);
  const D  = _r(_m(297.8501921 + 445267.1114034 * T));
  const M  = _r(_m(357.5291092 + 35999.0502909  * T));
  const Mp = _r(_m(134.9633964 + 477198.8675055  * T));
  const F  = _r(_m(93.2720950  + 483202.0175233  * T));
  return _m(
    Lp
    + 6.2888 * Math.sin(Mp)
    + 1.2740 * Math.sin(2 * D - Mp)
    + 0.6583 * Math.sin(2 * D)
    + 0.2136 * Math.sin(2 * Mp)
    - 0.1851 * Math.sin(M)
    - 0.1143 * Math.sin(2 * F)
    + 0.0588 * Math.sin(2 * D - 2 * Mp)
    + 0.0572 * Math.sin(2 * D - M - Mp)
    + 0.0533 * Math.sin(2 * D + Mp)
  );
}

// Lahiri ayanamsa: 23.853° at J2000.0, precessing ~50.3"/year
function _ayan(jd: number): number {
  return 23.853 + (jd - 2451545.0) * 50.3 / (3600 * 365.25);
}

// Sunrise and sunset in decimal IST hours
function _sunriseSunset(jd: number, lat: number, lng: number): { riseH: number; setH: number } {
  const T   = (jd - 2451545.0) / 36525;
  const L0  = _m(280.46646 + 36000.76983 * T);
  const M   = _r(_m(357.52911 + 35999.05029 * T));
  const C   = 1.914602 * Math.sin(M) + 0.019993 * Math.sin(2 * M);
  const sl  = _r(_m(L0 + C));
  const eps = _r(23.4393 - 0.0130 * T);
  const dec = Math.asin(Math.sin(eps) * Math.sin(sl));
  const cosH = (Math.sin(_r(-0.8333)) - Math.sin(_r(lat)) * Math.sin(dec))
             / (Math.cos(_r(lat)) * Math.cos(dec));
  if (Math.abs(cosH) > 1) return { riseH: 6.0, setH: 18.0 };
  const H = _d(Math.acos(cosH));
  const y = Math.tan(eps / 2) ** 2;
  const eqTime = 4 * _d(
    y * Math.sin(2 * sl)
    - 2 * 0.016708634 * Math.sin(M)
    + 4 * 0.016708634 * y * Math.sin(M) * Math.cos(2 * sl)
    - 0.5 * y * y * Math.sin(4 * sl)
    - 1.25 * 0.016708634 * 0.016708634 * Math.sin(2 * M)
  );
  const noon = 12 - lng / 15 - eqTime / 60; // UTC solar noon
  return { riseH: noon - H / 15 + 5.5, setH: noon + H / 15 + 5.5 }; // IST
}

// Format decimal IST hours as "H:MM AM/PM"
function _fmtH(h: number): string {
  const totalMin = Math.round(((h % 24) + 24) % 24 * 60);
  const hh = Math.floor(totalMin / 60) % 24;
  const mm = totalMin % 60;
  return `${hh % 12 || 12}:${mm.toString().padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
}

function _fmtRng(a: number, b: number): string { return `${_fmtH(a)} - ${_fmtH(b)}`; }

// Map elongation-based karana index 0–59 → KARANAS array index
function _karIdx(i60: number): number {
  if (i60 === 0)  return 10; // Kimstughna
  if (i60 === 57) return 7;  // Shakuni
  if (i60 === 58) return 8;  // Chatushpada
  if (i60 === 59) return 9;  // Naga
  return (i60 - 1) % 7;      // cycles Bava…Vishti
}

// Part-of-day slot indices for Rahu Kalam / Yamagandam / Gulika (0=Sun … 6=Sat)
const RAHU_SLOT   = [7, 1, 6, 4, 5, 3, 2];
const YAMA_SLOT   = [4, 3, 2, 1, 0, 6, 5];
const GULIKA_SLOT = [6, 5, 4, 3, 2, 1, 0];

// ── Core Meeus calculation — returns all Pancha Anga values ──────────────────
function meeusCalc(dateStr: string): Omit<PanchangamDetails,
  'date' | 'samvatsaraEN' | 'samvatsaraTE' | 'ayanamEN' | 'ayanamTE' |
  'rutvuEN' | 'rutvuTE' | 'maasamEN' | 'maasamTE' | 'suryaRashiEN' | 'suryaRashiTE'
> {
  const lat = parseFloat(import.meta.env.VITE_TEMPLE_LATITUDE  || '16.5062');
  const lng = parseFloat(import.meta.env.VITE_TEMPLE_LONGITUDE || '80.6480');

  const jd    = _jd(dateStr);
  const ayan  = _ayan(jd);
  const sunT  = _sunLon(jd);
  const moonT = _moonLon(jd);
  const sunS  = _m(sunT  - ayan); // sidereal
  const moonS = _m(moonT - ayan); // sidereal

  // ── Tithi ─────────────────────────────────────────────────────────────────
  const elong = _m(moonT - sunT);
  const tIdx  = Math.floor(elong / 12) % 30;
  const nTIdx = (tIdx + 1) % 30;
  const paksha = tIdx < 15
    ? { EN: "Shukla Paksham", TE: "శుక్ల పక్షం" }
    : { EN: "Krishna (Bahula) Paksham", TE: "బహుళ పక్షం" };
  const tithiEndH = 6 + ((12 - elong % 12) / 13.2) * 24;

  // ── Nakshatra ─────────────────────────────────────────────────────────────
  const nakD  = 360 / 27;
  const nIdx  = Math.floor(moonS / nakD) % 27;
  const nNIdx = (nIdx + 1) % 27;
  const nakEndH = 6 + ((nakD - moonS % nakD) / 13.2) * 24;

  // ── Yoga ──────────────────────────────────────────────────────────────────
  const ySum  = _m(sunS + moonS);
  const yIdx  = Math.floor(ySum / nakD) % 27;
  const nYIdx = (yIdx + 1) % 27;
  const yogaEndH = 6 + ((nakD - ySum % nakD) / 15.0) * 24;

  // ── Karana ────────────────────────────────────────────────────────────────
  const kIdx  = Math.floor(elong / 6) % 60;
  const nKIdx = (kIdx + 1) % 60;
  const karEndH = 6 + ((6 - elong % 6) / 13.2) * 24;

  // ── Chandra Rashi (from Moon's sidereal longitude) ────────────────────────
  const chandraRashi = RAASHIS[Math.floor(moonS / 30) % 12];

  // ── Sunrise / Sunset ──────────────────────────────────────────────────────
  const { riseH, setH } = _sunriseSunset(jd, lat, lng);
  const part = (setH - riseH) / 8;

  // ── Weekday (0=Sun … 6=Sat) ───────────────────────────────────────────────
  const wday = Math.floor(jd + 1.5) % 7;

  const rahuS   = riseH + RAHU_SLOT[wday]   * part;
  const yamaS   = riseH + YAMA_SLOT[wday]   * part;
  const gulikaS = riseH + GULIKA_SLOT[wday] * part;

  const cap = (h: number) => _fmtH(Math.min(h, 23.99));

  return {
    pakshamEN: paksha.EN,          pakshamTE: paksha.TE,
    tithiEN:   TITHIS[tIdx].EN,    tithiTE:   TITHIS[tIdx].TE,
    tithiEndTime: cap(tithiEndH),
    tithiNextEN: TITHIS[nTIdx].EN, tithiNextTE: TITHIS[nTIdx].TE,
    nakshatramEN:   NAKSHATRAMS[nIdx].EN,  nakshatramTE:   NAKSHATRAMS[nIdx].TE,
    nakshatramEndTime: cap(nakEndH),
    nakshatramNextEN: NAKSHATRAMS[nNIdx].EN, nakshatramNextTE: NAKSHATRAMS[nNIdx].TE,
    yogamEN:  YOGAMS[yIdx].EN,  yogamTE:  YOGAMS[yIdx].TE,
    yogamEndTime: cap(yogaEndH),
    yogamNextEN: YOGAMS[nYIdx].EN, yogamNextTE: YOGAMS[nYIdx].TE,
    karanamEN:  KARANAS[_karIdx(kIdx)].EN,  karanamTE:  KARANAS[_karIdx(kIdx)].TE,
    karanamEndTime: cap(karEndH),
    karanamNextEN: KARANAS[_karIdx(nKIdx)].EN, karanamNextTE: KARANAS[_karIdx(nKIdx)].TE,
    chandraRashiEN: chandraRashi.EN,  chandraRashiTE: chandraRashi.TE,
    sunrise: _fmtH(riseH),
    sunset:  _fmtH(setH),
    rahuKalam:    _fmtRng(rahuS,   rahuS   + part),
    yamagandam:   _fmtRng(yamaS,   yamaS   + part),
    gulikaKalam:  _fmtRng(gulikaS, gulikaS + part),
    durmuhurtham: WEEKDAY_RULES[wday].durmuhurtham,
    varjyam:      '',
    amritakalam:  '',
  };
}

// ── Public: synchronous estimation ───────────────────────────────────────────
// Used as the final client-side fallback when both Prokerala and the Edge Function
// are unreachable. Now powered by Meeus formulas instead of a seed/hash.
export function estimatePanchangam(dateStr: string): PanchangamDetails {
  if (ACCURATE_PANCHANGAM[dateStr]) return ACCURATE_PANCHANGAM[dateStr];

  const targetDate  = new Date(dateStr);
  const samvatsara  = getSamvatsara(dateStr);
  const ayanam      = getAyanam(targetDate);
  const rutvu       = getRutvu(targetDate);
  const maasam      = getMaasam(targetDate);
  const suryaRashi  = getSuryaRashi(targetDate);

  const astro = meeusCalc(dateStr);

  return {
    date: dateStr,
    samvatsaraEN: samvatsara.EN,          samvatsaraTE: samvatsara.TE + ' నామ సంవత్సరం',
    ayanamEN:     ayanam.EN,              ayanamTE:     ayanam.TE,
    rutvuEN:      rutvu.EN,               rutvuTE:      rutvu.TE,
    maasamEN:     maasam.EN + ' Masam',   maasamTE:     maasam.TE,
    suryaRashiEN: suryaRashi.EN,          suryaRashiTE: suryaRashi.TE,
    ...astro,
  };
}

// ── Session-level in-memory cache to prevent redundant fetches ───────────────
// Cleared automatically when the page is closed/refreshed.
const _sessionCache = new Map<string, PanchangamDetails>();

// ── Public: async entry point ─────────────────────────────────────────────────
// Priority order:
//   1. In-memory session cache      (same date already fetched this session)
//   2. DB-cached Prokerala data     (served by Edge Function, X-Cache: HIT)
//   3. Live Prokerala API           (Edge Function calls Prokerala, X-Cache: MISS)
//   4. Edge Function Meeus fallback (when Prokerala credits exhausted, X-Cache: SELF-CALC)
//   5. Client-side Meeus estimate   (when Edge Function itself is unreachable)
export async function calculatePanchangam(dateStr: string): Promise<PanchangamDetails> {
  if (_sessionCache.has(dateStr)) return _sessionCache.get(dateStr)!;

  const estimated = estimatePanchangam(dateStr);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('your-project-id')) {
    try {
      const { fetchFromProkerala } = await import('./lib/panchangamApi');
      const live = await fetchFromProkerala(dateStr, estimated);
      if (live) {
        _sessionCache.set(dateStr, live);
        return live;
      }
    } catch (err) {
      console.warn('[Panchangam] Edge Function unreachable, using Meeus client estimate:', err);
    }
  }

  _sessionCache.set(dateStr, estimated);
  return estimated;
}