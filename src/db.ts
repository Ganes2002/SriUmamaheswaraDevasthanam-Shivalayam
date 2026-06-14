import { supabase } from './supabase';
import {
  EventItem,
  GalleryItem,
  DonorRecord,
  CommitteeMember,
  Announcement,
  AdminLog,
  YearlyStat,
  AdminAccount,
  TempleEmblemSlot,
} from './types';

// ─── Supabase Storage Helpers ─────────────────────────────────────────────────
// Images go to Storage, not the DB column — DB stores only the CDN URL (~100 chars).
// Supabase Storage CDN caches repeated fetches, so they don't count against
// your 5 GB/month egress limit after the first load.

const STORAGE_BUCKET = 'temple-media';

export async function uploadImageToStorage(
  blob: Blob,
  folder: 'gallery' | 'carousel',
  filename: string
): Promise<string | null> {
  const filePath = `${folder}/${filename}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) {
    console.error('Storage upload error:', error.message);
    return null;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

function isStorageUrl(url: string): boolean {
  return url.includes(`/storage/v1/object/public/${STORAGE_BUCKET}/`);
}

async function deleteFromStorage(url: string): Promise<void> {
  if (!isStorageUrl(url)) return;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const filePath = url.slice(url.indexOf(marker) + marker.length);
  await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
}

// ─── LocalStorage Cache (reduces Supabase egress bandwidth) ──────────────────
// Supabase free tier allows unlimited API requests but caps egress at 5 GB/month.
// Base64 gallery images are the primary bandwidth risk — caching prevents
// re-fetching the same heavy data on every page visit within the TTL window.

const CACHE_PREFIX = 'um_cache_';
const TTL = {
  short: 5 * 60 * 1000,    // 5 min  — counters, announcements, donors
  medium: 15 * 60 * 1000,  // 15 min — events, gallery
  long: 60 * 60 * 1000,    // 60 min — committee, yearly stats, emblem library
};

function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { data: T; exp: number };
    if (Date.now() > entry.exp) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function cacheSet<T>(key: string, data: T, ttl: number): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, exp: Date.now() + ttl }));
  } catch {
    // localStorage quota exceeded — skip silently, data will just re-fetch next time
  }
}

function cacheBust(key: string): void {
  try { localStorage.removeItem(CACHE_PREFIX + key); } catch {}
}

// ─── Fallback defaults (used when Supabase returns no data) ───────────────────

const DEFAULT_EMBLEM_URL =
  'https://images.unsplash.com/photo-1600100397759-db2427a810f6?auto=format&fit=crop&q=80&w=600';

const DEFAULT_EMBLEM_LIBRARY: TempleEmblemSlot[] = [
  { id: 1, nameEN: 'Majestic Gopuram Vimana', nameTE: 'దివ్య రాజగోపురం దర్బార్', url: 'https://images.unsplash.com/photo-1600100397759-db2427a810f6?auto=format&fit=crop&q=80&w=400' },
  { id: 2, nameEN: 'Adorned Holy Shiva Lingam', nameTE: 'దివ్య మంగళాకార లింగం', url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=400' },
  { id: 3, nameEN: 'Lord Ganesha Vigneshwara', nameTE: 'శ్రీ విఘ్నేశ్వర ప్రసాదం', url: 'https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=400' },
  { id: 4, nameEN: 'Sacred Brass Aarti Bell', nameTE: 'గర్భాలయ ఘంటా రావము', url: 'https://images.unsplash.com/photo-1608976328267-e6730f70067a?auto=format&fit=crop&q=80&w=400' },
  { id: 5, nameEN: 'Vedic Fire Homa Kundam', nameTE: 'దేవస్థాన హోమ గుండము', url: 'https://images.unsplash.com/photo-1618090584126-129cd84357ae?auto=format&fit=crop&q=80&w=400' },
];

const DEFAULT_ANNOUNCEMENT: Announcement = {
  id: 'ann-1',
  textEN: '⚠️ Note: Temple will close early at 7:00 PM on upcoming Friday due to Chandra Grahanam (Lunar Eclipse). Normal Darshan resumes next morning.',
  textTE: '⚠️ గమనిక: గ్రహణం కారణంగా వచ్చే శుక్రవారం సాయంత్రం 7:00 గంటలకే ఆలయం మూసివేయబడుతుంది. మరుసటి రోజు ఉదయం నుండి మామూలుగా దర్శనాలు లభిస్తాయి.',
  isActive: true,
  updatedAt: new Date().toISOString(),
};

// ─── Global Settings (single query for temple emblem + lifetime counter) ──────
// Replaces two separate global_settings queries with one — saves 1 round trip
// on every page load. Individual getters still work (they use the same cache).

export async function getGlobalSettings(): Promise<{ templeEmblem: string; lifetimeCounter: number }> {
  const cachedEmblem = cacheGet<string>('emblem');
  const cachedLifetime = cacheGet<number>('lifetime');
  if (cachedEmblem !== null && cachedLifetime !== null) {
    return { templeEmblem: cachedEmblem, lifetimeCounter: cachedLifetime };
  }

  const { data } = await supabase.from('global_settings').select('key, value');
  const map = (data || []).reduce<Record<string, string>>((acc, r) => {
    acc[r.key] = r.value;
    return acc;
  }, {});

  const templeEmblem = map['primary_temple_emblem'] || DEFAULT_EMBLEM_URL;
  const lifetimeCounter = Number(map['lifetime_counter']) || 2852500;

  cacheSet('emblem', templeEmblem, TTL.long);
  cacheSet('lifetime', lifetimeCounter, TTL.short);
  return { templeEmblem, lifetimeCounter };
}

// ─── Temple Emblem ────────────────────────────────────────────────────────────

export async function getTempleEmblem(): Promise<string> {
  const cached = cacheGet<string>('emblem');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('global_settings')
    .select('value')
    .eq('key', 'primary_temple_emblem')
    .single();
  const result = data?.value || DEFAULT_EMBLEM_URL;
  cacheSet('emblem', result, TTL.long);
  return result;
}

export async function saveTempleEmblem(url: string): Promise<void> {
  await supabase
    .from('global_settings')
    .update({ value: url, updated_at: new Date().toISOString() })
    .eq('key', 'primary_temple_emblem');
  cacheBust('emblem');
  addLog('Committee updated the active primary Temple Emblem/Logo.', 'edit');
}

export async function getTempleEmblemLibrary(): Promise<TempleEmblemSlot[]> {
  const cached = cacheGet<TempleEmblemSlot[]>('emblib');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('temple_carousel_slides')
    .select('*')
    .order('id', { ascending: true });
  if (!data || data.length === 0) return DEFAULT_EMBLEM_LIBRARY;
  const result = data.map((row) => ({
    id: row.id,
    nameEN: row.name_en,
    nameTE: row.name_te,
    url: row.image_url,
  }));
  cacheSet('emblib', result, TTL.long);
  return result;
}

export async function saveTempleEmblemLibrary(library: TempleEmblemSlot[]): Promise<void> {
  const limited = library.slice(0, 5);
  const presentIds = limited.map((s) => s.id);

  const { data: existing } = await supabase
    .from('temple_carousel_slides')
    .select('id, image_url');
  const existingMap = (existing || []).reduce<Record<number, string>>((acc, r) => {
    acc[r.id] = r.image_url;
    return acc;
  }, {});

  const toDelete = Object.keys(existingMap)
    .map(Number)
    .filter((id) => !presentIds.includes(id));
  if (toDelete.length > 0) {
    await supabase.from('temple_carousel_slides').delete().in('id', toDelete);
    await Promise.all(toDelete.map((id) => deleteFromStorage(existingMap[id])));
  }

  if (limited.length > 0) {
    await supabase.from('temple_carousel_slides').upsert(
      limited.map((s) => ({
        id: s.id,
        name_en: s.nameEN,
        name_te: s.nameTE,
        image_url: s.url,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'id' }
    );
  }
  cacheBust('emblib');
}

// ─── Announcements ────────────────────────────────────────────────────────────

export async function getAnnouncement(): Promise<Announcement> {
  const cached = cacheGet<Announcement>('announcement');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return DEFAULT_ANNOUNCEMENT;
  const result = {
    id: data.id,
    textEN: data.text_en,
    textTE: data.text_te,
    isActive: data.is_active,
    updatedAt: data.updated_at,
  };
  cacheSet('announcement', result, TTL.short);
  return result;
}

export async function saveAnnouncement(ann: Announcement): Promise<void> {
  await supabase.from('announcements').upsert(
    {
      id: ann.id,
      text_en: ann.textEN,
      text_te: ann.textTE,
      is_active: ann.isActive,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  cacheBust('announcement');
  addLog(`Revised scroll announcement text to: "${ann.textEN.substring(0, 40)}..."`, 'edit');
}

// ─── Committee ────────────────────────────────────────────────────────────────

export async function getCommittee(): Promise<CommitteeMember[]> {
  const cached = cacheGet<CommitteeMember[]>('committee');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('committee_roster')
    .select('*')
    .order('created_at', { ascending: true });
  if (!data) return [];
  const result = data.map((row) => ({
    id: row.id,
    nameEN: row.name_en,
    nameTE: row.name_te,
    roleEN: row.role_en,
    roleTE: row.role_te,
    phone: row.phone,
    email: row.email,
    imageUrl: row.profile_image || undefined,
    passcode: row.passcode,
    username: row.username || undefined,
  }));
  cacheSet('committee', result, TTL.long);
  return result;
}

export async function saveCommittee(list: CommitteeMember[]): Promise<void> {
  const { data: existing } = await supabase.from('committee_roster').select('id');
  const existingIds = (existing || []).map((r) => r.id);
  const newIds = list.map((m) => m.id);

  const toDelete = existingIds.filter((id) => !newIds.includes(id));
  if (toDelete.length > 0) {
    await supabase.from('committee_roster').delete().in('id', toDelete);
  }

  if (list.length > 0) {
    await supabase.from('committee_roster').upsert(
      list.map((m) => ({
        id: m.id,
        name_en: m.nameEN,
        name_te: m.nameTE,
        role_en: m.roleEN,
        role_te: m.roleTE,
        phone: m.phone,
        email: m.email,
        profile_image: m.imageUrl || null,
        passcode: m.passcode,
        username: m.username || null,
      })),
      { onConflict: 'id' }
    );
  }
  cacheBust('committee');
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<EventItem[]> {
  const cached = cacheGet<EventItem[]>('events');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });
  if (!data) return [];
  const result = data.map((row) => ({
    id: row.id,
    titleEN: row.title_en,
    titleTE: row.title_te,
    date: row.event_date,
    time: row.event_time,
    descriptionEN: row.description_en,
    descriptionTE: row.description_te,
    locationEN: row.location_en,
    locationTE: row.location_te,
    imageUrl: row.image_url || undefined,
  }));
  cacheSet('events', result, TTL.medium);
  return result;
}

export async function saveEvents(list: EventItem[]): Promise<void> {
  const { data: existing } = await supabase.from('events').select('id');
  const existingIds = (existing || []).map((r) => r.id);
  const newIds = list.map((e) => e.id);

  const toDelete = existingIds.filter((id) => !newIds.includes(id));
  if (toDelete.length > 0) {
    await supabase.from('events').delete().in('id', toDelete);
  }

  if (list.length > 0) {
    await supabase.from('events').upsert(
      list.map((e) => ({
        id: e.id,
        title_en: e.titleEN,
        title_te: e.titleTE,
        event_date: e.date,
        event_time: e.time,
        description_en: e.descriptionEN,
        description_te: e.descriptionTE,
        location_en: e.locationEN,
        location_te: e.locationTE,
        image_url: e.imageUrl || null,
      })),
      { onConflict: 'id' }
    );
  }
  cacheBust('events');
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function getGallery(): Promise<GalleryItem[]> {
  const cached = cacheGet<GalleryItem[]>('gallery');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('gallery_assets')
    .select('*')
    .order('added_at', { ascending: false });
  if (!data) return [];
  const result = data.map((row) => ({
    id: row.id,
    type: row.media_type as 'image' | 'video',
    titleEN: row.title_en,
    titleTE: row.title_te,
    url: row.media_url,
    addedAt: row.added_at,
  }));
  cacheSet('gallery', result, TTL.medium);
  return result;
}

export async function saveGallery(items: GalleryItem[]): Promise<boolean> {
  const imageCount = items.filter((t) => t.type === 'image').length;
  if (imageCount > 20) return false;

  const { data: existing } = await supabase.from('gallery_assets').select('id, media_url');
  const existingMap = (existing || []).reduce<Record<string, string>>((acc, r) => {
    acc[r.id] = r.media_url;
    return acc;
  }, {});
  const newIds = items.map((i) => i.id);
  const toDelete = Object.keys(existingMap).filter((id) => !newIds.includes(id));

  if (toDelete.length > 0) {
    await supabase.from('gallery_assets').delete().in('id', toDelete);
    // Clean up Storage files for deleted images (no-op for external/Unsplash URLs)
    await Promise.all(toDelete.map((id) => deleteFromStorage(existingMap[id])));
  }

  if (items.length > 0) {
    await supabase.from('gallery_assets').upsert(
      items.map((i) => ({
        id: i.id,
        media_type: i.type,
        title_en: i.titleEN,
        title_te: i.titleTE,
        media_url: i.url,
        added_at: i.addedAt,
      })),
      { onConflict: 'id' }
    );
  }
  cacheBust('gallery');
  return true;
}

// ─── Donors ───────────────────────────────────────────────────────────────────

export async function getDonors(): Promise<DonorRecord[]> {
  const cached = cacheGet<DonorRecord[]>('donors');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('donor_ledger')
    .select('*')
    .order('payment_date', { ascending: false });
  if (!data) return [];
  const result = data.map((row) => ({
    id: row.id,
    nameEN: row.name_en,
    nameTE: row.name_te,
    amount: Number(row.amount),
    date: row.payment_date,
    purposeEN: row.purpose_en,
    purposeTE: row.purpose_te,
    isAnonymous: row.is_anonymous,
  }));
  cacheSet('donors', result, TTL.short);
  return result;
}

export async function saveDonors(list: DonorRecord[]): Promise<void> {
  const { data: existing } = await supabase.from('donor_ledger').select('id');
  const existingIds = (existing || []).map((r) => r.id);
  const newIds = list.map((d) => d.id);

  const toDelete = existingIds.filter((id) => !newIds.includes(id));
  if (toDelete.length > 0) {
    await supabase.from('donor_ledger').delete().in('id', toDelete);
  }

  if (list.length > 0) {
    await supabase.from('donor_ledger').upsert(
      list.map((d) => ({
        id: d.id,
        name_en: d.nameEN,
        name_te: d.nameTE,
        amount: d.amount,
        payment_date: d.date,
        purpose_en: d.purposeEN,
        purpose_te: d.purposeTE,
        is_anonymous: d.isAnonymous,
      })),
      { onConflict: 'id' }
    );
  }
  cacheBust('donors');
}

// ─── Counters ─────────────────────────────────────────────────────────────────

export async function getLifetimeCounter(): Promise<number> {
  const cached = cacheGet<number>('lifetime');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('global_settings')
    .select('value')
    .eq('key', 'lifetime_counter')
    .single();
  const result = data ? Number(data.value) : 2852500;
  cacheSet('lifetime', result, TTL.short);
  return result;
}

export async function setLifetimeCounter(amount: number): Promise<void> {
  await supabase
    .from('global_settings')
    .update({ value: amount.toString(), updated_at: new Date().toISOString() })
    .eq('key', 'lifetime_counter');
  cacheBust('lifetime');
}

export async function getCurrentYearCounter(): Promise<number> {
  const cached = cacheGet<number>('currentyear');
  if (cached !== null) return cached;
  const currentYear = new Date().getFullYear().toString();
  const { data } = await supabase
    .from('yearly_audits')
    .select('total_amount')
    .eq('fiscal_year', currentYear)
    .maybeSingle();
  const result = data ? Number(data.total_amount) : 685420;
  cacheSet('currentyear', result, TTL.short);
  return result;
}

export async function setCurrentYearCounter(amount: number): Promise<void> {
  const currentYear = new Date().getFullYear().toString();
  await supabase
    .from('yearly_audits')
    .update({ total_amount: amount, last_audited_at: new Date().toISOString() })
    .eq('fiscal_year', currentYear);
  cacheBust('currentyear');
  cacheBust('yearstats');
}

// ─── Logs ─────────────────────────────────────────────────────────────────────
// Logs are never cached — they must always be fresh when explicitly requested.

export async function getLogs(): Promise<AdminLog[]> {
  const { data } = await supabase
    .from('security_audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);
  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    action: row.action_text,
    timestamp: row.timestamp,
    category: row.log_category as AdminLog['category'],
  }));
}

export async function addLog(
  action: string,
  category: 'cleaning' | 'edit' | 'security' | 'gallery'
): Promise<void> {
  await supabase.from('security_audit_logs').insert({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    action_text: action,
    log_category: category,
    timestamp: new Date().toISOString(),
  });
}

// ─── Yearly Stats ─────────────────────────────────────────────────────────────

export async function getYearlyStats(): Promise<YearlyStat[]> {
  const cached = cacheGet<YearlyStat[]>('yearstats');
  if (cached !== null) return cached;
  const { data } = await supabase
    .from('yearly_audits')
    .select('*')
    .order('fiscal_year', { ascending: false });
  if (!data) return [];
  const result = data.map((row) => ({
    year: row.fiscal_year,
    totalAmount: Number(row.total_amount),
    achievementEN: row.achievement_en,
    achievementTE: row.achievement_te,
  }));
  cacheSet('yearstats', result, TTL.long);
  return result;
}

export async function saveYearlyStats(stats: YearlyStat[]): Promise<void> {
  await supabase.from('yearly_audits').upsert(
    stats.map((s) => ({
      fiscal_year: s.year,
      total_amount: s.totalAmount,
      achievement_en: s.achievementEN,
      achievement_te: s.achievementTE,
      last_audited_at: new Date().toISOString(),
    })),
    { onConflict: 'fiscal_year' }
  );
  cacheBust('yearstats');
  cacheBust('currentyear');
  const currentYear = new Date().getFullYear().toString();
  const curr = stats.find((s) => s.year === currentYear);
  if (curr) await setCurrentYearCounter(curr.totalAmount);
}

// ─── Admin Accounts (derived from committee_roster) ───────────────────────────
// getAdminAccounts() calls getCommittee() which uses the cache — no extra DB hit.

export async function getAdminAccounts(): Promise<AdminAccount[]> {
  const committee = await getCommittee();
  return committee.map((m) => ({
    id: m.id,
    name: m.nameEN,
    role: m.roleEN,
    username: m.username || '',
    passcode: m.passcode,
    phone: m.phone,
    email: m.email,
  }));
}

export async function saveAdminAccounts(list: AdminAccount[]): Promise<void> {
  for (const acc of list) {
    await supabase
      .from('committee_roster')
      .update({ passcode: acc.passcode, username: acc.username })
      .eq('id', acc.id);
  }
  cacheBust('committee');
}

// ─── Midnight Janitor (calls Supabase RPC) ────────────────────────────────────

export async function runMidnightJanitorSimulation(): Promise<{
  purgedEventsCount: number;
  purgedDonorsCount: number;
  rolledOverSum: number;
  purgedLogsCount: number;
}> {
  const { error } = await supabase.rpc('execute_midnight_janitor_sweeps');
  if (error) throw error;
  // Janitor modifies events, donors, lifetime counter — bust all affected caches
  cacheBust('events');
  cacheBust('donors');
  cacheBust('lifetime');
  cacheBust('yearstats');
  cacheBust('currentyear');
  return { purgedEventsCount: 0, purgedDonorsCount: 0, rolledOverSum: 0, purgedLogsCount: 0 };
}
