# Database Schema — Sri Umamaheswara Devasthanam Web Portal

This document describes the TypeScript entity interfaces and the PostgreSQL DDL for all 9 tables in the Supabase backend.

---

## 1. TypeScript Entity Interfaces

All entities support full bilingual integration (`EN` / `TE`).

### 1.1 Announcements (`announcements`)
```typescript
export interface Announcement {
  id: string;
  textEN: string;      // Ticker text in English
  textTE: string;      // Ticker text in Telugu
  isActive: boolean;   // Whether the ticker is currently visible
  updatedAt: string;   // ISO 8601 timestamp
}
```

### 1.2 Devotional Events (`events`)
```typescript
export interface EventItem {
  id: string;
  titleEN: string;
  titleTE: string;
  date: string;           // YYYY-MM-DD
  time: string;           // Human-readable range e.g. "09:00 AM - 12:00 PM"
  descriptionEN: string;
  descriptionTE: string;
  locationEN: string;
  locationTE: string;
  imageUrl?: string;
}
```

### 1.3 Gallery Catalog (`gallery_assets`)
```typescript
export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  titleEN: string;
  titleTE: string;
  url: string;         // Supabase Storage URL or YouTube URL
  addedAt: string;     // ISO 8601 timestamp
}
```

### 1.4 Donor Ledger (`donor_ledger`)
```typescript
export interface DonorRecord {
  id: string;
  nameEN: string;
  nameTE: string;
  amount: number;       // INR (₹)
  date: string;         // YYYY-MM-DD
  purposeEN: string;
  purposeTE: string;
  isAnonymous: boolean; // Displays "Anonymous Devotee / గుప్తదాత" when true
}
```

### 1.5 Committee Directory (`committee_roster`)
```typescript
export interface CommitteeMember {
  id: string;
  nameEN: string;
  nameTE: string;
  roleEN: string;
  roleTE: string;
  phone: string;
  email: string;
  imageUrl?: string;
  passcode?: string;   // Uppercase, case-insensitive login credential
  username?: string;
}
```

### 1.6 Yearly Audit Milestones (`yearly_audits`)
```typescript
export interface YearlyStat {
  year: string;            // "2020" – "2050"
  totalAmount: number;     // Audited sum in INR (₹)
  achievementEN: string;
  achievementTE: string;
}
```

### 1.7 Security Logs (`security_audit_logs`)
```typescript
export interface AdminLog {
  id: string;
  timestamp: string;       // ISO 8601 timestamp
  action: string;          // Descriptive event text
  category: 'cleaning' | 'security' | 'edit' | 'gallery';
}
```

### 1.8 Carousel Slides (`temple_carousel_slides`)
```typescript
export interface TempleEmblemSlot {
  id: number;     // 1 to 5 (strict constraint)
  nameEN: string;
  nameTE: string;
  url: string;    // Supabase Storage URL or Unsplash URL
}
```

### 1.9 Global Settings (`global_settings`)
```typescript
// Key-value store for singleton settings:
//   "primary_temple_emblem" → string (image URL)
//   "lifetime_counter"      → string (numeric, total INR collected all time)
```

---

## 2. PostgreSQL DDL

Run via `supabase_complete_setup.sql` — it includes `IF NOT EXISTS` guards and is safe to re-run.

```sql
-- 1. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id         VARCHAR(50) PRIMARY KEY,
    text_en    TEXT NOT NULL,
    text_te    TEXT NOT NULL,
    is_active  BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id             VARCHAR(50) PRIMARY KEY,
    title_en       VARCHAR(255) NOT NULL,
    title_te       VARCHAR(255) NOT NULL,
    event_date     DATE NOT NULL,
    event_time     VARCHAR(100) NOT NULL,
    description_en TEXT NOT NULL,
    description_te TEXT NOT NULL,
    location_en    VARCHAR(255) NOT NULL,
    location_te    VARCHAR(255) NOT NULL,
    image_url      TEXT,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GALLERY ASSETS
CREATE TABLE IF NOT EXISTS gallery_assets (
    id         VARCHAR(50) PRIMARY KEY,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    title_en   VARCHAR(255) NOT NULL,
    title_te   VARCHAR(255) NOT NULL,
    media_url  TEXT NOT NULL,
    added_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DONOR LEDGER
CREATE TABLE IF NOT EXISTS donor_ledger (
    id           VARCHAR(50) PRIMARY KEY,
    name_en      VARCHAR(255) NOT NULL DEFAULT 'Anonymous Devotee',
    name_te      VARCHAR(255) NOT NULL DEFAULT 'గుప్తదాత',
    amount       DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL,
    purpose_en   VARCHAR(255) NOT NULL,
    purpose_te   VARCHAR(255) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. COMMITTEE ROSTER
CREATE TABLE IF NOT EXISTS committee_roster (
    id            VARCHAR(50) PRIMARY KEY,
    name_en       VARCHAR(255) NOT NULL,
    name_te       VARCHAR(255) NOT NULL,
    role_en       VARCHAR(255) NOT NULL,
    role_te       VARCHAR(255) NOT NULL,
    phone         VARCHAR(30) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    profile_image TEXT,
    passcode      VARCHAR(50) NOT NULL UNIQUE,
    username      VARCHAR(100) UNIQUE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. YEARLY AUDITS
CREATE TABLE IF NOT EXISTS yearly_audits (
    fiscal_year     VARCHAR(4) PRIMARY KEY CHECK (fiscal_year BETWEEN '2000' AND '2050'),
    total_amount    DECIMAL(15,2) NOT NULL DEFAULT 0,
    achievement_en  TEXT NOT NULL,
    achievement_te  TEXT NOT NULL,
    last_audited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SECURITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id           VARCHAR(50) PRIMARY KEY,
    timestamp    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    action_text  TEXT NOT NULL,
    log_category VARCHAR(20) CHECK (log_category IN ('cleaning', 'security', 'edit', 'gallery'))
);

-- 8. HERO CAROUSEL SLIDES (exactly 5 slots)
CREATE TABLE IF NOT EXISTS temple_carousel_slides (
    id         INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 5),
    name_en    VARCHAR(255) NOT NULL,
    name_te    VARCHAR(255) NOT NULL,
    image_url  TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. GLOBAL SETTINGS (key-value store)
CREATE TABLE IF NOT EXISTS global_settings (
    key        VARCHAR(100) PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_date    ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_donors_date    ON donor_ledger(payment_date);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON security_audit_logs(timestamp);
```

---

## 3. Supabase Permissions (CRITICAL)

RLS is disabled on all tables (app uses passcode auth at the application layer). PostgreSQL GRANTs must be issued separately — disabling RLS alone is not sufficient.

```sql
-- Disable RLS on every table
ALTER TABLE announcements           DISABLE ROW LEVEL SECURITY;
ALTER TABLE events                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_assets          DISABLE ROW LEVEL SECURITY;
ALTER TABLE donor_ledger            DISABLE ROW LEVEL SECURITY;
ALTER TABLE committee_roster        DISABLE ROW LEVEL SECURITY;
ALTER TABLE yearly_audits           DISABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs     DISABLE ROW LEVEL SECURITY;
ALTER TABLE temple_carousel_slides  DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings         DISABLE ROW LEVEL SECURITY;

-- Grant table-level access to the anon role (used by Supabase JS client)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
```

---

## 4. Key Business Rules

1. **20-image gallery cap** — enforced in `AdminGalleryManager.tsx`. `SELECT COUNT(*) FROM gallery_assets WHERE media_type = 'image'` must not exceed 20.

2. **Passcode matching** — case-insensitive: `UPPER(typed) = UPPER(committee_roster.passcode)`.

3. **Donor retention** — the midnight cron sweeps `donor_ledger` rows older than 365 days, accumulates their total into `yearly_audits.total_amount` for that year, then deletes them. Only 2025–2026 records live in the ledger at any given time.

4. **Announcement toggle** — `is_active = FALSE` hides the ticker without deleting the row, so drafts can be kept.
