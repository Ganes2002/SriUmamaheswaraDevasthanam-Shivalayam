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
  tithiEN: string;
  tithiTE: string;
  nakshatramEN: string;
  nakshatramTE: string;
  rahuKalam: string;
  yamagandam: string;
  gulikaKalam: string;
  durmuhurtham: string;
  sunrise: string;
  sunset: string;
  varjyam: string;
}
