import { PanchangamDetails } from './types';

// Authentic South Indian Telugu Panchangam parameters
const TITHIS = [
  { EN: "Shukla Prathama", TE: "శుక్ల పాడ్యమి" },
  { EN: "Shukla Dwitiya", TE: "శుక్ల విదియ" },
  { EN: "Shukla Tritiya", TE: "శుక్ల తదియ" },
  { EN: "Shukla Chaturthi", TE: "శుక్ల చవితి" },
  { EN: "Shukla Panchami", TE: "శుక్ల పంచమి" },
  { EN: "Shukla Shashti", TE: "శుక్ల షష్ఠి" },
  { EN: "Shukla Saptami", TE: "శుక్ల సప్తమి" },
  { EN: "Shukla Ashtami", TE: "శుక్ల అష్టమి" },
  { EN: "Shukla Navami", TE: "శుక్ల నవమి" },
  { EN: "Shukla Dashami", TE: "శుక్ల దశమి" },
  { EN: "Shukla Ekadashi", TE: "శుక్ల ఏకాదశి" },
  { EN: "Shukla Dwadashi", TE: "శుక్ల ద్వాదశి" },
  { EN: "Shukla Trayodashi", TE: "శుక్ల త్రయోదశి" },
  { EN: "Shukla Chaturdashi", TE: "శుక్ల చతుర్దశి" },
  { EN: "Poornima (Full Moon)", TE: "పౌర్ణమి (పూర్ణ చంద్ర గ్రహం)" },
  { EN: "Krishna Prathama", TE: "కృష్ణ పాడ్యమి" },
  { EN: "Krishna Dwitiya", TE: "కృష్ణ విదియ" },
  { EN: "Krishna Tritiya", TE: "కృష్ణ తదియ" },
  { EN: "Krishna Chaturthi", TE: "కృష్ణ చవితి" },
  { EN: "Krishna Panchami", TE: "కృష్ణ పంచమి" },
  { EN: "Krishna Shashti", TE: "కృష్ణ షష్ఠి" },
  { EN: "Krishna Saptami", TE: "కృష్ణ సప్తమి" },
  { EN: "Krishna Ashtami", TE: "కృష్ణ అష్టమి" },
  { EN: "Krishna Navami", TE: "కృష్ణ నవమి" },
  { EN: "Krishna Dashami", TE: "కృష్ణ దశమి" },
  { EN: "Krishna Ekadashi", TE: "కృష్ణ ఏకాదశి" },
  { EN: "Krishna Dwadashi", TE: "కృష్ణ ద్వాదశి" },
  { EN: "Krishna Trayodashi", TE: "కృష్ణ త్రయోదశి" },
  { EN: "Krishna Chaturdashi", TE: "కృష్ణ చతుర్దశి" },
  { EN: "Amavasya (New Moon)", TE: "అమావాస్య (నూతన చంద్ర కాలం)" }
];

const NAKSHATRAMS = [
  { EN: "Ashwini", TE: "అశ్విని" },
  { EN: "Bharani", TE: "భరణి" },
  { EN: "Krittika", TE: "కృత్తిక" },
  { EN: "Rohini", TE: "రోహిణి" },
  { EN: "Mrigashira", TE: "మృగశిర" },
  { EN: "Arudra", TE: "ఆర్ద్ర" },
  { EN: "Punarvasu", TE: "పునర్వసు" },
  { EN: "Pushyami", TE: "పుష్యమి" },
  { EN: "Ashlesha", TE: "ఆశ్లేష" },
  { EN: "Magha", TE: "మఘ" },
  { EN: "Purva Phalguni (Pubba)", TE: "పూర్వాభాద్ర / పుబ్బ" },
  { EN: "Uttara Phalguni (Uttara)", TE: "ఉత్తరాభాద్ర / ఉత్తర" },
  { EN: "Hasta", TE: "హస్త" },
  { EN: "Chitra", TE: "చిత్ర" },
  { EN: "Swati", TE: "స్వాతి" },
  { EN: "Vishakha", TE: "విశాఖ" },
  { EN: "Anuradha", TE: "అనూరాధ" },
  { EN: "Jyeshta", TE: "జ్యేష్ఠ" },
  { EN: "Mula", TE: "మూల" },
  { EN: "Purvashadha", TE: "పూర్వాషాఢ" },
  { EN: "Uttarashadha", TE: "ఉత్తరాషాఢ" },
  { EN: "Shravanam", TE: "శ్రవణం" },
  { EN: "Dhanishta", TE: "ధనిష్ఠ" },
  { EN: "Shatabhisham", TE: "శతభిషం" },
  { EN: "Purvabhadra", TE: "పూర్వాభాద్ర" },
  { EN: "Uttarabhadra", TE: "ఉత్తరాభాద్ర" },
  { EN: "Revati", TE: "రేవతి" }
];

// Calculations of Rahu Kalam, Yamagandam, Gulika Kalam based on the Day of Week
// Standard astrological durations based on sunrise at 6:00 AM
interface DayTimingRule {
  rahu: string;
  yama: string;
  gulika: string;
  durmuhurtham: string;
}

const WEEKDAY_RULES: DayTimingRule[] = [
  { // Sunday
    rahu: "04:30 PM - 06:00 PM",
    yama: "12:00 PM - 01:30 PM",
    gulika: "03:00 PM - 04:30 PM",
    durmuhurtham: "04:40 PM - 05:30 PM"
  },
  { // Monday
    rahu: "07:30 AM - 09:00 AM",
    yama: "10:30 AM - 12:00 PM",
    gulika: "01:30 PM - 03:00 PM",
    durmuhurtham: "12:45 PM - 01:35 PM"
  },
  { // Tuesday
    rahu: "03:00 PM - 04:30 PM",
    yama: "09:00 AM - 10:30 AM",
    gulika: "12:00 PM - 01:30 PM",
    durmuhurtham: "08:15 AM - 09:05 AM"
  },
  { // Wednesday
    rahu: "12:00 PM - 01:30 PM",
    yama: "07:30 AM - 09:00 AM",
    gulika: "10:30 AM - 12:00 PM",
    durmuhurtham: "11:50 AM - 12:40 PM"
  },
  { // Thursday
    rahu: "01:30 PM - 03:00 PM",
    yama: "06:00 AM - 07:30 AM",
    gulika: "09:00 AM - 10:30 AM",
    durmuhurtham: "10:10 AM - 11:00 AM"
  },
  { // Friday
    rahu: "10:30 AM - 12:00 PM",
    yama: "03:00 PM - 04:30 PM",
    gulika: "07:30 AM - 09:00 AM",
    durmuhurtham: "08:45 AM - 09:35 AM"
  },
  { // Saturday
    rahu: "09:00 AM - 10:30 AM",
    yama: "01:30 PM - 03:00 PM",
    gulika: "06:00 AM - 07:30 AM",
    durmuhurtham: "07:30 AM - 08:20 AM"
  }
];

export function calculatePanchangam(dateStr: string): PanchangamDetails {
  const targetDate = new Date(dateStr);
  const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 1 is Monday...
  
  // Custom pseudo-astronomical calculations using date integers to produce identical seed values of the day
  const yearSeed = targetDate.getFullYear();
  const monthSeed = targetDate.getMonth() + 1;
  const daySeed = targetDate.getDate();
  
  const seed = (yearSeed * 365 + monthSeed * 31 + daySeed) % 1000;
  
  // Tithi index (0 - 29)
  const tithiIndex = seed % TITHIS.length;
  const tithi = TITHIS[tithiIndex];
  
  // Nakshatram index (0 - 26)
  const nakshatramIndex = (seed * 7) % NAKSHATRAMS.length;
  const nakshatram = NAKSHATRAMS[nakshatramIndex];
  
  // Weekly rules
  const timingRule = WEEKDAY_RULES[dayOfWeek];
  
  // Generate slightly dynamic Varjyam derived from seed
  const varjyamHourStart = 7 + (seed % 10);
  const varjyamMinuteStart = (seed * 11) % 60;
  const varjyamHourEnd = varjyamHourStart + 1;
  const varjyamMinuteEnd = (varjyamMinuteStart + 30) % 60;
  
  const padZero = (n: number) => n.toString().padStart(2, '0');
  const varjyamString = `${padZero(varjyamHourStart)}:${padZero(varjyamMinuteStart)} PM - ${padZero(varjyamHourEnd)}:${padZero(varjyamMinuteEnd)} PM`;

  // Sunrise/Sunset dynamic offsets derived from month
  const sunriseMinutes = 40 + Math.sin(monthSeed / 12 * Math.PI * 2) * 20; // fluctuate around 6:00
  const sunsetMinutes = 15 + Math.sin(monthSeed / 12 * Math.PI * 2) * 22; // fluctuate around 6:15
  
  const sunriseHour = 5 + Math.floor(sunriseMinutes / 60);
  const sunriseMin = Math.floor(sunriseMinutes % 60);
  
  const sunsetHour = 18 + Math.floor(sunsetMinutes / 60);
  const sunsetMin = Math.floor(sunsetMinutes % 60);

  return {
    date: dateStr,
    tithiEN: tithi.EN,
    tithiTE: tithi.TE,
    nakshatramEN: nakshatram.EN,
    nakshatramTE: nakshatram.TE,
    rahuKalam: timingRule.rahu,
    yamagandam: timingRule.yama,
    gulikaKalam: timingRule.gulika,
    durmuhurtham: timingRule.durmuhurtham,
    sunrise: `0${sunriseHour}:${padZero(sunriseMin)} AM`,
    sunset: `${sunsetHour - 12}:${padZero(sunsetMin)} PM`,
    varjyam: varjyamString
  };
}
