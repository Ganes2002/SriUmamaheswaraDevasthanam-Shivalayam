# Database Schema Design Document — Production Specifications
**Project Name**: Sri Umamaheswara Devasthanam Web Portal

This document outlines the database schema design, entity relationship rules, and exact data structures utilized by the web application. It specifies the **TypeScript types**, the **LocalStorage persistent JSON mappings**, and provides ready-to-run **SQL DDL schema declarations** (PostgreSQL/Supabase compatible) for scaling up to a relational cloud backend.

---

## 1. Local Storage Schema Mappings (State Persistence)

To maintain a secure, offline-first client sync, the application maps local changes to named coordinate browser storage cells under the `um_dev_*` namespace keys.

| LocalStorage Key | Schema / Array Datatype | Purpose | Default Seed Entries |
| :--- | :--- | :--- | :--- |
| `um_dev_announcement` | `Announcement` (Object Object) | High-contrast scrolled ticker alert | 1 active announcement |
| `um_dev_events` | `EventItem[]` | Chronological puja and festival schedules | 3+ active schedules |
| `um_dev_gallery` | `GalleryItem[]` | Deity photos (Max 20 count) & YouTube streams | 6+ core assets |
| `um_dev_donors` | `DonorRecord[]` | Transparent ledger records (1 year retention) | 10+ high-value donors |
| `um_dev_lifetime` | `number` | Cumulative lifetime trust collection counter | Seedeed ₹28,52,500 base |
| `um_dev_current_year` | `number` | Running collection total for the active year | Synced with 2026 stats |
| `um_dev_committee` | `CommitteeMember[]` | Contact rosters, image links, and passcodes | 4 core admin accounts |
| `um_dev_yearly_stats`| `YearlyStat[]` | Audited financial timeline milestones (2000-2050) | 7 standard stats cards |
| `um_dev_logs` | `AdminLog[]` | Audit trail security logging stack (30-day purge) | Auto-generated events |
| `um_dev_temple_emblem`| `string` | Primary active welcome emblem/image URL | Default high-contrast Unsplash image |
| `um_dev_temple_emblem_library` | `TempleEmblemSlot[]` | 5-item slide list for Home slideshow carousel | 5 sacred preset images |

---

## 2. Entity Specifications & TypeScript Schemas

All entities are engineered to support full bilingual integration (`EN` / `TE`), custom sorting keys, and metadata tracking.

### 2.1 Announcements Table (`announcements`)
Tracks the active rolling notice-board marquee message.
```typescript
export interface Announcement {
  id: string;
  textEN: string;      // Ticker text in English
  textTE: string;      // Ticker text in Telugu
  updatedAt: string;   // ISO 8601 string timestamp
}
```

### 2.2 Devotional Events Table (`events`)
Houses future puja rituals and events.
```typescript
export interface EventItem {
  id: string;
  titleEN: string;
  titleTE: string;
  date: string;          // YYYY-MM-DD
  time: string;          // Human-readable time range (e.g. "09:00 AM - 12:00 PM")
  descriptionEN: string;
  descriptionTE: string;
  locationEN: string;
  locationTE: string;
  imageUrl?: string;     // Custom banner link or fallback defaults
}
```

### 2.3 Deities Gallery Catalog Table (`gallery`)
Catalogs high-resolution photos and YouTube video references.
```typescript
export interface GalleryItem {
  id: string;
  type: 'image' | 'video'; // Media Category
  titleEN: string;
  titleTE: string;
  url: string;             // Base64 compressed string (<1MB limit) OR YouTube URL string
  addedAt: string;         // ISO 8601 string timestamp
}
```

### 2.4 Transparent Contribution Ledger Table (`donors`)
Tracks high-value donations. Supports the 1-year security retention rule (older individual elements get cleaned up and consolidated into the lifetime pool).
```typescript
export interface DonorRecord {
  id: string;
  nameEN: string;
  nameTE: string;
  amount: number;          // Input total in INR (₹)
  date: string;            // YYYY-MM-DD
  purposeEN: string;
  purposeTE: string;
  isAnonymous: boolean;    // Masks user names with "Anonymous Devotee / గుప్తదాత"
}
```

### 2.5 Temple Committee Directory Table (`committee_members`)
Houses profile records, contact metrics, and dashboard access passcodes.
```typescript
export interface CommitteeMember {
  id: string;
  nameEN: string;
  nameTE: string;
  roleEN: string;
  roleTE: string;
  phone: string;          // Tap-to-call mobile structure (e.g. "+91 94405 XXXXX")
  email: string;          // Tap-to-email target (e.g. "volunteer@templettrust.org")
  imageUrl?: string;      // Optional profile picture URL
  passcode?: string;      // Case-insensitive security dashboard access credentials
  username?: string;      // Admin login tag
}
```

### 2.6 Audited Yearly Donation Totals & Milestones Table (`yearly_stats`)
Keeps high-level historical financial summaries across fiscal years. Supports range validation **2000 to 2050**.
```typescript
export interface YearlyStat {
  year: string;           // Key unique index (e.g. "2026")
  totalAmount: number;    // Audited cumulative sum in INR (₹)
  achievementEN: string;  // Landmark achievement text in English
  achievementTE: string;  // Landmark achievement text in Telugu
}
```

### 2.7 Security Logs Table (`admin_logs`)
Tracks user authentication alerts and structural updates.
```typescript
export interface AdminLog {
  id: string;
  timestamp: string;      // ISO 8601 string stamp
  action: string;         // Descriptive event payload
  category: 'cleaning' | 'security' | 'edit' | 'gallery';
}
```

### 2.8 Temple Emblem Slides Table (`temple_emblem_library`)
Stores the 5 high-quality, screen-fitting images displayed in the interactive welcome slideshow carousel.
```typescript
export interface TempleEmblemSlot {
  id: number;             // Primary layout sequence number (1 to 5)
  nameEN: string;         // Slide title/caption in English
  nameTE: string;         // Slide title/caption in Telugu
  url: string;            // Auto-compressed Base64 string or direct Unsplash web URL
}
```

---

## 3. PostgreSQL / Supabase Core DDL Blueprint

When upgrading the application to a relational online cloud infrastructure, the following ready-to-run **SQL DDL script** models the corresponding tables, relationships, and constraint policies.

```sql
-- Create custom extension for UUIDs if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
    id VARCHAR(50) PRIMARY KEY,
    text_en TEXT NOT NULL,
    text_te TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEVOTIONAL EVENTS TABLE
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_te VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(100) NOT NULL,
    description_en TEXT NOT NULL,
    description_te TEXT NOT NULL,
    location_en VARCHAR(255) NOT NULL,
    location_te VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DEITIES GALLERY CATALOG TABLE
CREATE TABLE gallery_assets (
    id VARCHAR(50) PRIMARY KEY,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    title_en VARCHAR(255) NOT NULL,
    title_te VARCHAR(255) NOT NULL,
    media_url TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CONTRIBUTIONS LEDGER TABLE
CREATE TABLE donor_ledger (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL DEFAULT 'Anonymous Devotee',
    name_te VARCHAR(255) NOT NULL DEFAULT 'గుప్తదాత',
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL,
    purpose_en VARCHAR(255) NOT NULL,
    purpose_te VARCHAR(255) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. COMMITTEE & MEMBERS DIRECTORY
CREATE TABLE committee_roster (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    role_en VARCHAR(255) NOT NULL,
    role_te VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    profile_image TEXT,
    passcode VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AUDITED YEARLY STATS & MILESTONES
CREATE TABLE yearly_audits (
    fiscal_year VARCHAR(4) PRIMARY KEY CHECK (fiscal_year BETWEEN '2000' AND '2050'),
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    achievement_en TEXT NOT NULL,
    achievement_te TEXT NOT NULL,
    last_audited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SYSTEM SECURITY & TRANSCRIPTION AUDIT LOG
CREATE TABLE security_audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    action_text TEXT NOT NULL,
    log_category VARCHAR(20) CHECK (log_category IN ('cleaning', 'security', 'edit', 'gallery'))
);

-- 8. TEMPLE HOME CAROUSEL SLIDES (STRICT 5 SLOTS CONSTRAINT)
CREATE TABLE temple_carousel_slides (
    id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 5),
    name_en VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES FOR FAST QUERY RESOLUTION ON BILINGUAL VIEWPORTS
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_donors_date ON donor_ledger(payment_date);
CREATE INDEX idx_logs_timestamp ON security_audit_logs(timestamp);
```

---

## 4. Key Integrity & Referential Rules

1. **The 20-Image Capacity Cap**: 
   * *Rule*: `SELECT COUNT(*) FROM gallery_assets WHERE media_type = 'image';` MUST NOT exceed 20 rows.
   * *Resolution (Trigger-level)*: Enforced primarily inside `AdminGalleryManager.tsx` as a security-budget guard to bypass expensive cloud payload overage billing.
2. **Case-Insensitive Access Matching**:
   * *Rule*: Admins authenticate with trimmed, uppercase passcode keys.
   * *Resolution (Trigger-level)*: `LOWER(typed_passcode) = LOWER(committee_roster.passcode)`.
3. **Daily Rollover Sum Integration**:
   * *Rule*: Whenever the backend scheduler sweeps individual transactions older than 365 days out of `donor_ledger`, it calculates the cumulative sum of purged values and aggregates the calculation into `yearly_audits.total_amount` for that fiscal year, preserving the unified historical ledger without storage waste.
