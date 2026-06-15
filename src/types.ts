export interface EventItem {
  id: string;
  titleEN: string;
  titleTE: string;
  date: string; // YYYY-MM-DD format
  time: string;
  descriptionEN: string;
  descriptionTE: string;
  locationEN: string;
  locationTE: string;
  imageUrl?: string;
}

export type MediaItemType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  type: MediaItemType;
  titleEN: string;
  titleTE: string;
  url: string; // Direct image data (data URI / unsplash) or YouTube ID
  addedAt: string;
}

export interface DonorRecord {
  id: string;
  nameEN: string;
  nameTE: string;
  amount: number;
  date: string; // YYYY-MM-DD
  purposeEN: string;
  purposeTE: string;
  isAnonymous: boolean;
}

export interface CommitteeMember {
  id: string;
  nameEN: string;
  nameTE: string;
  roleEN: string;
  roleTE: string;
  phone: string;
  email: string;
  imageUrl?: string;
  passcode: string;
  username?: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  role: string;
  username: string;
  passcode: string;
  phone: string;
  email: string;
  lastLogin?: string;
}

export interface Announcement {
  id: string;
  textEN: string;
  textTE: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AdminLog {
  id: string;
  action: string;
  timestamp: string;
  category: 'cleaning' | 'edit' | 'security' | 'gallery';
}

export interface YearlyStat {
  year: string;
  totalAmount: number;
  achievementEN: string;
  achievementTE: string;
}

export interface TempleEmblemSlot {
  id: number; // 1 to 5
  nameEN: string;
  nameTE: string;
  url: string;
}

export interface PanchangamDetails {
  date: string;
  // ── Panchangam context header ─────────────────────────────────────────────
  samvatsaraEN: string;
  samvatsaraTE: string;
  ayanamEN: string;
  ayanamTE: string;
  rutvuEN: string;
  rutvuTE: string;
  maasamEN: string;
  maasamTE: string;
  pakshamEN: string;
  pakshamTE: string;
  // ── The five limbs (Pancha Anga) ─────────────────────────────────────────
  tithiEN: string;
  tithiTE: string;
  tithiEndTime?: string;       // e.g. "9:15 AM" — when current tithi ends
  tithiNextEN?: string;        // next tithi name after transition
  tithiNextTE?: string;
  nakshatramEN: string;
  nakshatramTE: string;
  nakshatramEndTime?: string;
  nakshatramNextEN?: string;
  nakshatramNextTE?: string;
  yogamEN: string;
  yogamTE: string;
  yogamEndTime?: string;
  yogamNextEN?: string;
  yogamNextTE?: string;
  karanamEN: string;
  karanamTE: string;
  karanamEndTime?: string;
  karanamNextEN?: string;
  karanamNextTE?: string;
  // ── Rashi ─────────────────────────────────────────────────────────────────
  suryaRashiEN: string;
  suryaRashiTE: string;
  chandraRashiEN: string;
  chandraRashiTE: string;
  // ── Inauspicious / restricted times ──────────────────────────────────────
  rahuKalam: string;
  yamagandam: string;
  gulikaKalam: string;
  durmuhurtham: string;        // may have two slots separated by "\n"
  varjyam: string;
  // ── Auspicious times ──────────────────────────────────────────────────────
  amritakalam: string;
  // ── Sun / Moon times ──────────────────────────────────────────────────────
  sunrise: string;
  sunset: string;
  // ── Special observance (optional) ────────────────────────────────────────
  specialDayEN?: string;
  specialDayTE?: string;
}
