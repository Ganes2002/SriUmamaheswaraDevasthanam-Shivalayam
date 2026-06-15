// Calls the Supabase Edge Function which proxies Prokerala API.
// Maps English names from Prokerala → bilingual PanchangamDetails using lookup tables.

import { supabase } from '../supabase';
import { PanchangamDetails } from '../types';

// ── English → Telugu name lookup tables ──────────────────────────────────────
// Prokerala returns English names; we map them to Telugu for bilingual display.
// Multiple English spellings are listed to handle Prokerala's variant spellings.

const TITHI_TE: Record<string, string> = {
  Prathama: 'పాడ్యమి', Pratipada: 'పాడ్యమి',
  Dwitiya: 'విదియ', Dvitiya: 'విదియ', Dwiteeya: 'విదియ',
  Tritiya: 'తదియ', Trutiya: 'తదియ',
  Chaturthi: 'చవితి',
  Panchami: 'పంచమి',
  Shashti: 'షష్ఠి', Shasthi: 'షష్ఠి', Shashthi: 'షష్ఠి',
  Saptami: 'సప్తమి',
  Ashtami: 'అష్టమి', Ashtmi: 'అష్టమి',
  Navami: 'నవమి',
  Dashami: 'దశమి', Dasami: 'దశమి',
  Ekadashi: 'ఏకాదశి', Ekadasi: 'ఏకాదశి',
  Dwadashi: 'ద్వాదశి', Dvadashi: 'ద్వాదశి', Dwaadashi: 'ద్వాదశి',
  Trayodashi: 'త్రయోదశి', Trayodasi: 'త్రయోదశి',
  Chaturdashi: 'చతుర్దశి', Chaturdasi: 'చతుర్దశి',
  Purnima: 'పౌర్ణమి', Poornima: 'పౌర్ణమి', Pournima: 'పౌర్ణమి', Purnami: 'పౌర్ణమి',
  Amavasya: 'అమావాస్య', Amaavasyaa: 'అమావాస్య',
};

const NAKSHATRA_TE: Record<string, string> = {
  Ashwini: 'అశ్విని', Aswini: 'అశ్విని', Ashvini: 'అశ్విని',
  Bharani: 'భరణి',
  Krittika: 'కృత్తిక', Krithika: 'కృత్తిక', Kritthika: 'కృత్తిక',
  Rohini: 'రోహిణి',
  Mrigashira: 'మృగశిర', Mrigashirsha: 'మృగశిర', Mrigsira: 'మృగశిర', Mrigasira: 'మృగశిర',
  Ardra: 'ఆర్ద్ర', Arudra: 'ఆర్ద్ర', Aadra: 'ఆర్ద్ర',
  Punarvasu: 'పునర్వసు',
  Pushyami: 'పుష్యమి', Pushya: 'పుష్యమి', Pushmi: 'పుష్యమి',
  Ashlesha: 'ఆశ్లేష', Aslesha: 'ఆశ్లేష', Aaslesha: 'ఆశ్లేష',
  Magha: 'మఘ', Makha: 'మఘ',
  'Purva Phalguni': 'పుబ్బ', Pubba: 'పుబ్బ', PurvaPhalguni: 'పుబ్బ',
  'Uttara Phalguni': 'ఉత్తర', Uttara: 'ఉత్తర', UttaraPhalguni: 'ఉత్తర',
  Hasta: 'హస్త',
  Chitra: 'చిత్ర',
  Swati: 'స్వాతి', Svati: 'స్వాతి',
  Vishakha: 'విశాఖ', Visakha: 'విశాఖ', Vishaka: 'విశాఖ',
  Anuradha: 'అనూరాధ', Anuraadha: 'అనూరాధ',
  Jyeshtha: 'జ్యేష్ఠ', Jyeshta: 'జ్యేష్ఠ', Jyestha: 'జ్యేష్ఠ',
  Mula: 'మూల', Moola: 'మూల', Moolam: 'మూల',
  Purvashadha: 'పూర్వాషాఢ', 'Purva Ashadha': 'పూర్వాషాఢ', PurvaAshadha: 'పూర్వాషాఢ',
  Uttarashadha: 'ఉత్తరాషాఢ', 'Uttara Ashadha': 'ఉత్తరాషాఢ', UttaraAshadha: 'ఉత్తరాషాఢ',
  Shravana: 'శ్రవణం', Shravan: 'శ్రవణం', Sravana: 'శ్రవణం',
  Dhanishtha: 'ధనిష్ఠ', Dhanishta: 'ధనిష్ఠ', Dhanistha: 'ధనిష్ఠ',
  Shatabhisha: 'శతభిషం', Shatabhishak: 'శతభిషం', Shathabhisha: 'శతభిషం',
  'Purva Bhadrapada': 'పూర్వాభాద్ర', Purvabhadra: 'పూర్వాభాద్ర', PurvaBhadrapada: 'పూర్వాభాద్ర',
  'Uttara Bhadrapada': 'ఉత్తరాభాద్ర', Uttarabhadra: 'ఉత్తరాభాద్ర', UttaraBhadrapada: 'ఉత్తరాభాద్ర',
  Revati: 'రేవతి',
};

const YOGA_TE: Record<string, string> = {
  Vishkamba: 'విష్కంభ', Vishkambha: 'విష్కంభ',
  Priti: 'ప్రీతి', Preeti: 'ప్రీతి',
  Ayushman: 'ఆయుష్మాన్', Ayusman: 'ఆయుష్మాన్',
  Saubhagya: 'సౌభాగ్య',
  Shobhana: 'శోభన', Sobhana: 'శోభన',
  Atiganda: 'అతిగండ', Atigand: 'అతిగండ',
  Sukarma: 'సుకర్మ', Sukharma: 'సుకర్మ',
  Dhriti: 'ధృతి', Dhrutha: 'ధృతి',
  Shoola: 'శూలం', Shula: 'శూలం', Soola: 'శూలం',
  Ganda: 'గండం', Gand: 'గండం',
  Vriddhi: 'వృద్ధి', Vridhi: 'వృద్ధి',
  Dhruva: 'ధ్రువ', Dhurva: 'ధ్రువ',
  Vyaghata: 'వ్యాఘాత', Vyagatha: 'వ్యాఘాత',
  Harshana: 'హర్షణ', Harshna: 'హర్షణ',
  Vajra: 'వజ్ర',
  Siddhi: 'సిద్ధి',
  Vyatipata: 'వ్యతీపాత', Vyatipaat: 'వ్యతీపాత',
  Variyan: 'వరీయాన్', Variyaan: 'వరీయాన్',
  Parigha: 'పరిఘ',
  Shiva: 'శివ',
  Siddha: 'సిద్ధ',
  Sadhya: 'సాధ్య',
  Shubha: 'శుభ', Subha: 'శుభ',
  Shukla: 'శుక్ల', Sukla: 'శుక్ల',
  Brahma: 'బ్రహ్మ',
  Indra: 'ఇంద్ర',
  Vaidhriti: 'వైధృతి', Vaidhruthi: 'వైధృతి',
};

const KARANA_TE: Record<string, string> = {
  Bava: 'బవ',
  Balava: 'బాలవ', Bhalava: 'బాలవ',
  Kaulava: 'కౌలవ',
  Taitila: 'తైతిల',
  Gara: 'గర',
  Vanija: 'వణిజ',
  Vishti: 'విష్టి', Bhadra: 'విష్టి',
  Shakuni: 'శకుని',
  Chatushpada: 'చతుష్పద', Chatushpad: 'చతుష్పద',
  Naga: 'నాగవం', Naag: 'నాగవం',
  Kimstughna: 'కిమ్స్తుఘ్నం', Kinstughna: 'కిమ్స్తుఘ్నం', Kimstugna: 'కిమ్స్తుఘ్నం',
};

// Flexible lookup: exact → case-insensitive → prefix-match
function lookupTE(map: Record<string, string>, name: string): string {
  if (!name) return '';
  if (map[name]) return map[name];
  const lo = name.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (k.toLowerCase() === lo) return v;
  }
  for (const [k, v] of Object.entries(map)) {
    if (lo.startsWith(k.toLowerCase()) || k.toLowerCase().startsWith(lo)) return v;
  }
  return name; // fallback: show English
}

function tithiTE(name: string, paksha: string): string {
  const base = lookupTE(TITHI_TE, name);
  if (name === 'Amavasya' || name === 'Amaavasyaa') return 'అమావాస్య';
  if (/purnima|poornima|pournima/i.test(name)) return 'పౌర్ణమి';
  const prefix = (paksha || '').toLowerCase().includes('shukla') ? 'శుక్ల' : 'కృష్ణ';
  return `${prefix} ${base}`;
}

// ── Prokerala Edge Function response type ─────────────────────────────────────
interface ProkeralaFnResponse {
  sunrise: string; sunset: string;
  tithiName: string; tithiId: number; tithiEnd: string;
  tithiNextName: string; tithiNextId: number;
  pakshaName: string; tithiNextPakshaName: string;
  nakshatramName: string; nakshatramId: number; nakshatramEnd: string;
  nakshatramNextName: string; nakshatramNextId: number;
  yogamName: string; yogamId: number; yogamEnd: string;
  yogamNextName: string; yogamNextId: number;
  karanamName: string; karanamId: number; karanamEnd: string;
  karanamNextName: string; karanamNextId: number;
  rahuKalam: string; yamagandam: string; gulikaKalam: string;
  durmuhurtham: string; varjyam: string; amritakalam: string;
  error?: string;
}

// ── Main fetch function ───────────────────────────────────────────────────────
// `estimated` is the full estimation-based PanchangamDetails used as fallback
// for any fields the live API doesn't return (Samvatsara, Rutvu, Rashi, etc.).
export async function fetchFromProkerala(
  dateStr: string,
  estimated: PanchangamDetails
): Promise<PanchangamDetails | null> {
  try {
    const lat = import.meta.env.VITE_TEMPLE_LATITUDE  || '16.5062'
    const lng = import.meta.env.VITE_TEMPLE_LONGITUDE || '80.6480'

    const { data, error } = await supabase.functions.invoke<ProkeralaFnResponse>('panchangam', {
      body: { date: dateStr, lat, lng },
    })

    if (error || !data || data.error) {
      console.warn('[Panchangam] Edge Function error:', error ?? data?.error)
      return null
    }

    const p = data

    // Paksha display
    const pakshamEN = p.pakshaName?.toLowerCase().includes('shukla')
      ? 'Shukla Paksham' : 'Krishna (Bahula) Paksham'
    const pakshamTE = p.pakshaName?.toLowerCase().includes('shukla')
      ? 'శుక్ల పక్షం' : 'బహుళ పక్షం'

    return {
      date: dateStr,
      // Context fields from estimation (Samvatsara, Ayanam, Rutvu, Maasam, Rashi)
      samvatsaraEN: estimated.samvatsaraEN, samvatsaraTE: estimated.samvatsaraTE,
      ayanamEN:     estimated.ayanamEN,     ayanamTE:     estimated.ayanamTE,
      rutvuEN:      estimated.rutvuEN,       rutvuTE:      estimated.rutvuTE,
      maasamEN:     estimated.maasamEN,      maasamTE:     estimated.maasamTE,
      suryaRashiEN:   estimated.suryaRashiEN,   suryaRashiTE:   estimated.suryaRashiTE,
      chandraRashiEN: estimated.chandraRashiEN, chandraRashiTE: estimated.chandraRashiTE,
      specialDayEN: estimated.specialDayEN,
      specialDayTE: estimated.specialDayTE,
      // Paksham overridden by live data
      pakshamEN,
      pakshamTE,
      // ── Tithi ─────────────────────────────────────────────────────────
      tithiEN: `${p.pakshaName} ${p.tithiName}`.trim() || p.tithiName,
      tithiTE: tithiTE(p.tithiName, p.pakshaName),
      tithiEndTime: p.tithiEnd || undefined,
      tithiNextEN: p.tithiNextName
        ? `${p.tithiNextPakshaName} ${p.tithiNextName}`.trim()
        : undefined,
      tithiNextTE: p.tithiNextName
        ? tithiTE(p.tithiNextName, p.tithiNextPakshaName)
        : undefined,
      // ── Nakshatra ──────────────────────────────────────────────────────
      nakshatramEN: p.nakshatramName,
      nakshatramTE: lookupTE(NAKSHATRA_TE, p.nakshatramName),
      nakshatramEndTime: p.nakshatramEnd || undefined,
      nakshatramNextEN: p.nakshatramNextName || undefined,
      nakshatramNextTE: p.nakshatramNextName ? lookupTE(NAKSHATRA_TE, p.nakshatramNextName) : undefined,
      // ── Yoga ──────────────────────────────────────────────────────────
      yogamEN: p.yogamName,
      yogamTE: lookupTE(YOGA_TE, p.yogamName),
      yogamEndTime: p.yogamEnd || undefined,
      yogamNextEN: p.yogamNextName || undefined,
      yogamNextTE: p.yogamNextName ? lookupTE(YOGA_TE, p.yogamNextName) : undefined,
      // ── Karana ────────────────────────────────────────────────────────
      karanamEN: p.karanamName,
      karanamTE: lookupTE(KARANA_TE, p.karanamName),
      karanamEndTime: p.karanamEnd || undefined,
      karanamNextEN: p.karanamNextName || undefined,
      karanamNextTE: p.karanamNextName ? lookupTE(KARANA_TE, p.karanamNextName) : undefined,
      // ── Timing ────────────────────────────────────────────────────────
      rahuKalam:    p.rahuKalam    || estimated.rahuKalam,
      yamagandam:   p.yamagandam   || estimated.yamagandam,
      gulikaKalam:  p.gulikaKalam  || estimated.gulikaKalam,
      durmuhurtham: p.durmuhurtham || estimated.durmuhurtham,
      varjyam:      p.varjyam      || estimated.varjyam,
      amritakalam:  p.amritakalam  || estimated.amritakalam,
      sunrise: p.sunrise || estimated.sunrise,
      sunset:  p.sunset  || estimated.sunset,
    }
  } catch (err) {
    console.warn('[Panchangam] fetchFromProkerala exception:', err)
    return null
  }
}
