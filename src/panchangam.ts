import { PanchangamDetails } from './types';

// ── Tithis (30 lunar days) ───────────────────────────────────────────────────
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

// ── Nakshatrams (27 lunar mansions) ─────────────────────────────────────────
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

// ── 27 Yogams ────────────────────────────────────────────────────────────────
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

// ── 11 Karanas ───────────────────────────────────────────────────────────────
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

// ── 12 Raashis ───────────────────────────────────────────────────────────────
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

// ── Telugu months (Maasam) ───────────────────────────────────────────────────
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

// ── 6 Seasons (Rutvu) ────────────────────────────────────────────────────────
const RUTVUS = [
  { EN: "Vasanta (Spring)",  TE: "వసంత ఋతువు" },
  { EN: "Greeshma (Summer)", TE: "గ్రీష్మ ఋతువు" },
  { EN: "Varsha (Monsoon)",  TE: "వర్ష ఋతువు" },
  { EN: "Sharath (Autumn)",  TE: "శరత్ ఋతువు" },
  { EN: "Hemanta (Winter)",  TE: "హేమంత ఋతువు" },
  { EN: "Shishira (Dewy)",   TE: "శిశిర ఋతువు" },
];

// ── Samvatsara (60-year cycle): map Ugadi start date → samvatsara name ──────
const SAMVATSARA_UGADI: Array<{ from: string; EN: string; TE: string }> = [
  { from: "2023-03-22", EN: "Shobhakritu",  TE: "శోభకృత్" },
  { from: "2024-04-09", EN: "Krodhi",       TE: "క్రోధి" },
  { from: "2025-03-30", EN: "Vishwavasu",   TE: "విశ్వావసు" },
  { from: "2026-03-19", EN: "Parabhava",    TE: "పరాభవ" },  // confirmed by priest for June 2026
  { from: "2027-04-07", EN: "Plavanga",     TE: "ప్లవంగ" },
  { from: "2028-03-27", EN: "Keelaka",      TE: "కీలక" },
];

// ── Rahu / Yama / Gulika / Durmuhurtham by weekday (0=Sun … 6=Sat) ──────────
const WEEKDAY_RULES = [
  { // Sunday
    rahu:         "04:30 PM - 06:00 PM",
    yama:         "12:00 PM - 01:30 PM",
    gulika:       "03:00 PM - 04:30 PM",
    durmuhurtham: "04:40 PM - 05:30 PM",
  },
  { // Monday
    rahu:         "07:30 AM - 09:00 AM",
    yama:         "10:30 AM - 12:00 PM",
    gulika:       "01:30 PM - 03:00 PM",
    durmuhurtham: "12:26 PM - 01:18 PM\n03:02 PM - 03:54 PM",
  },
  { // Tuesday
    rahu:         "03:00 PM - 04:30 PM",
    yama:         "09:00 AM - 10:30 AM",
    gulika:       "12:00 PM - 01:30 PM",
    durmuhurtham: "08:15 AM - 09:05 AM",
  },
  { // Wednesday
    rahu:         "12:00 PM - 01:30 PM",
    yama:         "07:30 AM - 09:00 AM",
    gulika:       "10:30 AM - 12:00 PM",
    durmuhurtham: "11:50 AM - 12:40 PM",
  },
  { // Thursday
    rahu:         "01:30 PM - 03:00 PM",
    yama:         "06:00 AM - 07:30 AM",
    gulika:       "09:00 AM - 10:30 AM",
    durmuhurtham: "10:10 AM - 11:00 AM",
  },
  { // Friday
    rahu:         "10:30 AM - 12:00 PM",
    yama:         "03:00 PM - 04:30 PM",
    gulika:       "07:30 AM - 09:00 AM",
    durmuhurtham: "08:45 AM - 09:35 AM\n10:58 AM - 11:50 AM",
  },
  { // Saturday
    rahu:         "09:00 AM - 10:30 AM",
    yama:         "01:30 PM - 03:00 PM",
    gulika:       "06:00 AM - 07:30 AM",
    durmuhurtham: "07:30 AM - 08:20 AM",
  },
];

// ── Hardcoded accurate data (verified from priest / Drik Panchang) ────────────
// Add more dates here as the priest shares them — these always take priority.
const ACCURATE_PANCHANGAM: Record<string, PanchangamDetails> = {
  "2026-06-15": {
    date: "2026-06-15",
    // Context
    samvatsaraEN: "Parabhava",    samvatsaraTE: "పరాభవ నామ సంవత్సరం",
    ayanamEN: "Uttarayanam",      ayanamTE: "ఉత్తరాయణం",
    rutvuEN: "Greeshma (Summer)", rutvuTE: "గ్రీష్మ ఋతువు",
    maasamEN: "Adhika Jyeshtha",  maasamTE: "అధిక జ్యేష్ట మాసం",
    pakshamEN: "Krishna (Bahula) Paksham", pakshamTE: "బహుళ పక్షం",
    // Tithi (Amavasya until 9:15 AM, then Shukla Prathama)
    tithiEN: "Amavasya",          tithiTE: "అమావాస్య",
    tithiEndTime: "9:15 AM",
    tithiNextEN: "Shukla Prathama", tithiNextTE: "శుక్ల పాడ్యమి",
    // Nakshatram (Mrigashira until 9:09 PM, then Ardra)
    nakshatramEN: "Mrigashira",   nakshatramTE: "మృగశిర",
    nakshatramEndTime: "9:09 PM",
    nakshatramNextEN: "Arudra",   nakshatramNextTE: "ఆర్ద్ర",
    // Yogam (Shoola until 10:37 AM, then Ganda)
    yogamEN: "Shoola",            yogamTE: "శూలం",
    yogamEndTime: "10:37 AM",
    yogamNextEN: "Ganda",         yogamNextTE: "గండం",
    // Karanam (Naga until 9:15 AM, then Kimstughna until 8:00 PM)
    karanamEN: "Naga",            karanamTE: "నాగవం",
    karanamEndTime: "9:15 AM",
    karanamNextEN: "Kimstughna",  karanamNextTE: "కిమ్స్తుఘ్నం",
    // Rashi
    suryaRashiEN: "Vrishabha (Taurus)", suryaRashiTE: "వృషభం",
    chandraRashiEN: "Vrishabha (Taurus)", chandraRashiTE: "వృషభం",
    // Inauspicious times
    rahuKalam:    "07:30 AM - 09:00 AM",
    yamagandam:   "10:30 AM - 12:00 PM",
    gulikaKalam:  "01:30 PM - 03:00 PM",
    durmuhurtham: "12:26 PM - 01:18 PM\n03:02 PM - 03:54 PM",
    varjyam:      "4:58 PM onwards",
    // Auspicious
    amritakalam:  "12:57 PM - 02:26 PM",
    // Sun times
    sunrise: "5:28 AM",
    sunset:  "6:30 PM",
    // Special event
    specialDayEN: "Mithuna Sankramanam — Sun enters Gemini at 8:16 PM",
    specialDayTE: "మిథున సంక్రమణం — సూర్యుడు మిథున రాశిలో ప్రవేశం రా 8:16",
  },
};

// ── Helper: samvatsara for a date ─────────────────────────────────────────────
function getSamvatsara(dateStr: string): { EN: string; TE: string } {
  const fallback = { EN: "Parabhava", TE: "పరాభవ" };
  let result = fallback;
  for (const row of SAMVATSARA_UGADI) {
    if (dateStr >= row.from) result = { EN: row.EN, TE: row.TE };
    else break;
  }
  return result;
}

// ── Helper: Ayanam ────────────────────────────────────────────────────────────
// Uttarayanam: Jan 14 – Jul 16 | Dakshinayanam: Jul 16 – Jan 14
function getAyanam(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();
  const uttara = (m > 1 && m < 7) || (m === 1 && d >= 14) || (m === 7 && d < 16);
  return uttara
    ? { EN: "Uttarayanam", TE: "ఉత్తరాయణం" }
    : { EN: "Dakshinayanam", TE: "దక్షిణాయణం" };
}

// ── Helper: Rutvu (season) ────────────────────────────────────────────────────
// Each season ≈ 2 solar months. Boundaries are approximate.
function getRutvu(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Vasanta: Mar 14 – May 14
  if ((m === 3 && d >= 14) || m === 4 || (m === 5 && d < 14)) return RUTVUS[0];
  // Greeshma: May 14 – Jul 16
  if ((m === 5 && d >= 14) || m === 6 || (m === 7 && d < 16)) return RUTVUS[1];
  // Varsha: Jul 16 – Sep 17
  if ((m === 7 && d >= 16) || m === 8 || (m === 9 && d < 17)) return RUTVUS[2];
  // Sharath: Sep 17 – Nov 17
  if ((m === 9 && d >= 17) || m === 10 || (m === 11 && d < 17)) return RUTVUS[3];
  // Hemanta: Nov 17 – Jan 14
  if ((m === 11 && d >= 17) || m === 12 || (m === 1 && d < 14)) return RUTVUS[4];
  // Shishira: Jan 14 – Mar 14
  return RUTVUS[5];
}

// ── Helper: Maasam (Telugu month, approximate solar alignment) ─────────────
function getMaasam(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Approximate boundaries (solar sankramanam dates)
  if ((m === 4 && d >= 14) || (m === 5 && d < 14)) return MAASAMS[0]; // Chaitra
  if ((m === 5 && d >= 14) || (m === 6 && d < 15)) return MAASAMS[1]; // Vaishakha
  if ((m === 6 && d >= 15) || (m === 7 && d < 16)) return MAASAMS[2]; // Jyeshtha
  if ((m === 7 && d >= 16) || (m === 8 && d < 17)) return MAASAMS[3]; // Ashadha
  if ((m === 8 && d >= 17) || (m === 9 && d < 17)) return MAASAMS[4]; // Shravana
  if ((m === 9 && d >= 17) || (m === 10 && d < 17)) return MAASAMS[5];// Bhadrapada
  if ((m === 10 && d >= 17) || (m === 11 && d < 16)) return MAASAMS[6];// Ashwina
  if ((m === 11 && d >= 16) || (m === 12 && d < 16)) return MAASAMS[7];// Kartika
  if ((m === 12 && d >= 16) || (m === 1 && d < 14)) return MAASAMS[8]; // Margashira
  if ((m === 1 && d >= 14) || (m === 2 && d < 13)) return MAASAMS[9];  // Pushya
  if ((m === 2 && d >= 13) || (m === 3 && d < 14)) return MAASAMS[10]; // Magha
  return MAASAMS[11]; // Phalguna
}

// ── Helper: Surya Rashi (approximate — exact date shifts year-to-year) ───────
function getSuryaRashi(date: Date): { EN: string; TE: string } {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 4 && d >= 14) || (m === 5 && d < 14)) return RAASHIS[0]; // Mesha
  if ((m === 5 && d >= 14) || (m === 6 && d < 15)) return RAASHIS[1]; // Vrishabha
  if ((m === 6 && d >= 15) || (m === 7 && d < 16)) return RAASHIS[2]; // Mithuna
  if ((m === 7 && d >= 16) || (m === 8 && d < 17)) return RAASHIS[3]; // Karkataka
  if ((m === 8 && d >= 17) || (m === 9 && d < 17)) return RAASHIS[4]; // Simha
  if ((m === 9 && d >= 17) || (m === 10 && d < 17)) return RAASHIS[5]; // Kanya
  if ((m === 10 && d >= 17) || (m === 11 && d < 16)) return RAASHIS[6]; // Tula
  if ((m === 11 && d >= 16) || (m === 12 && d < 16)) return RAASHIS[7]; // Vrischika
  if ((m === 12 && d >= 16) || (m === 1 && d < 14)) return RAASHIS[8]; // Dhanu
  if ((m === 1 && d >= 14) || (m === 2 && d < 12)) return RAASHIS[9];  // Makara
  if ((m === 2 && d >= 12) || (m === 3 && d < 14)) return RAASHIS[10]; // Kumbha
  return RAASHIS[11]; // Meena
}

// ── Synchronous estimation (used as fallback when API is unavailable) ─────────
export function estimatePanchangam(dateStr: string): PanchangamDetails {
  // Always prefer priest-verified accurate data
  if (ACCURATE_PANCHANGAM[dateStr]) return ACCURATE_PANCHANGAM[dateStr];

  const targetDate = new Date(dateStr);
  const dayOfWeek  = targetDate.getDay(); // 0 = Sunday

  const yearSeed  = targetDate.getFullYear();
  const monthSeed = targetDate.getMonth() + 1;
  const daySeed   = targetDate.getDate();
  const seed      = (yearSeed * 365 + monthSeed * 31 + daySeed) % 1000;

  // ── Pancha Anga estimation ─────────────────────────────────────────────────
  const tithiIndex     = seed % TITHIS.length;
  const tithi          = TITHIS[tithiIndex];
  const nakshatramIndex= (seed * 7) % NAKSHATRAMS.length;
  const nakshatram     = NAKSHATRAMS[nakshatramIndex];
  const yogamIndex     = (seed * 3 + dayOfWeek * 4) % YOGAMS.length;
  const yogam          = YOGAMS[yogamIndex];
  const karanamIndex   = (seed * 5) % KARANAS.length;
  const karanam        = KARANAS[karanamIndex];

  // Paksham from tithi
  const paksham = tithiIndex < 15
    ? { EN: "Shukla Paksham",           TE: "శుక్ల పక్షం" }
    : { EN: "Krishna (Bahula) Paksham", TE: "బహుళ పక్షం" };

  // ── Weekday timing rules ───────────────────────────────────────────────────
  const timingRule = WEEKDAY_RULES[dayOfWeek];

  // ── Varjyam (estimated) ────────────────────────────────────────────────────
  const varjyamH  = 7 + (seed % 10);
  const varjyamM  = (seed * 11) % 60;
  const varjyamH2 = varjyamH + 1;
  const varjyamM2 = (varjyamM + 30) % 60;
  const p0 = (n: number) => n.toString().padStart(2, '0');
  const varjyam = `${p0(varjyamH)}:${p0(varjyamM)} PM - ${p0(varjyamH2)}:${p0(varjyamM2)} PM`;

  // ── Amritakalam (estimated) ────────────────────────────────────────────────
  const amritaH  = 10 + (seed % 6);
  const amritaM  = (seed * 7) % 60;
  const amritaH2 = amritaH + 1;
  const amritaM2 = (amritaM + 36) % 60;
  const amritakalam = `${p0(amritaH)}:${p0(amritaM)} AM - ${p0(amritaH2)}:${p0(amritaM2)} AM`;

  // ── Sunrise / Sunset (estimated from month) ───────────────────────────────
  const sunriseMinutes = 28 + Math.sin((monthSeed / 12) * Math.PI * 2) * 14;
  const sunriseHour    = 5  + Math.floor(sunriseMinutes / 60);
  const sunriseMin     = Math.floor(Math.abs(sunriseMinutes) % 60);
  const sunsetMinutes  = 30 + Math.sin((monthSeed / 12) * Math.PI * 2) * 20;
  const sunsetHour     = 18 + Math.floor(sunsetMinutes / 60);
  const sunsetMin      = Math.floor(Math.abs(sunsetMinutes) % 60);

  // ── Context fields ────────────────────────────────────────────────────────
  const samvatsara = getSamvatsara(dateStr);
  const ayanam     = getAyanam(targetDate);
  const rutvu      = getRutvu(targetDate);
  const maasam     = getMaasam(targetDate);
  const suryaRashi = getSuryaRashi(targetDate);
  // Chandra Rashi changes every ~2.25 days — estimated from seed
  const chandraRashi = RAASHIS[(seed * 2 + dayOfWeek) % RAASHIS.length];

  return {
    date: dateStr,
    samvatsaraEN: samvatsara.EN,   samvatsaraTE: samvatsara.TE + " నామ సంవత్సరం",
    ayanamEN: ayanam.EN,           ayanamTE: ayanam.TE,
    rutvuEN: rutvu.EN,             rutvuTE: rutvu.TE,
    maasamEN: maasam.EN + " Masam",maasamTE: maasam.TE,
    pakshamEN: paksham.EN,         pakshamTE: paksham.TE,
    tithiEN: tithi.EN,             tithiTE: tithi.TE,
    nakshatramEN: nakshatram.EN,   nakshatramTE: nakshatram.TE,
    yogamEN: yogam.EN,             yogamTE: yogam.TE,
    karanamEN: karanam.EN,         karanamTE: karanam.TE,
    suryaRashiEN: suryaRashi.EN,   suryaRashiTE: suryaRashi.TE,
    chandraRashiEN: chandraRashi.EN, chandraRashiTE: chandraRashi.TE,
    rahuKalam:    timingRule.rahu,
    yamagandam:   timingRule.yama,
    gulikaKalam:  timingRule.gulika,
    durmuhurtham: timingRule.durmuhurtham,
    varjyam,
    amritakalam,
    sunrise: `${p0(sunriseHour)}:${p0(sunriseMin)} AM`,
    sunset:  `${sunsetHour - 12}:${p0(sunsetMin)} PM`,
  };
}

// ── Public async entry point ──────────────────────────────────────────────────
// Priority: 1. Live Prokerala API (via Supabase Edge Function)
//           2. Priest-verified hardcoded data (ACCURATE_PANCHANGAM)
//           3. Estimation algorithm
//
// The estimation always runs first to build context fields (Samvatsara, Ayanam,
// Rutvu, Maasam, Rashi) that the Prokerala API doesn't return — these are merged
// with the live timing data from the API.
export async function calculatePanchangam(dateStr: string): Promise<PanchangamDetails> {
  // Step 1: build the estimation baseline (also serves as fallback)
  const estimated = estimatePanchangam(dateStr);

  // Step 2: if Supabase URL is configured, try the live API
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('your-project-id')) {
    try {
      // Lazy-import so the API module is not loaded when API is not configured
      const { fetchFromProkerala } = await import('./lib/panchangamApi');
      const live = await fetchFromProkerala(dateStr, estimated);
      if (live) return live;
    } catch (err) {
      console.warn('[Panchangam] Live API unavailable, using estimate:', err);
    }
  }

  // Fallback: estimation (includes hardcoded data for specific dates)
  return estimated;
}
