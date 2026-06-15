# Functional Requirement Document (FRD) — Sri Umamaheswara Devasthanam Web Portal

**Architecture**: Single Page Application (SPA) with integrated secure modular Admin Dashboard
**Backend**: Supabase (PostgreSQL) — all data persisted in the cloud, not in the browser

---

## 1. Technical Architecture & Tech Stack

```
[ React 19 + Vite 6 SPA (TypeScript) ]
          |
          v  (Supabase JS client — 8 parallel queries on mount)
[ Supabase / PostgreSQL — 9 tables ]
          |
          +---> gallery images ---------> [ Supabase Storage bucket ]
          +---> YouTube video links ----> streamed zero-bandwidth from YouTube
          +---> Automated cron ----------> pg_cron midnight janitor (see database_janitor_cron.md)
```

- **Frontend**: React 19, Vite 6, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Supabase Storage, pg_cron)
- **Auth**: App-level passcode matching against `committee_roster` — no Supabase Auth, no RLS
- **Styling**: Tailwind utility classes with `sm:` / `md:` / `lg:` / `xl:` responsive prefixes
- **Notifications**: Custom Toast system (slide-in from top-right, 4 types, auto-dismiss 5s)

---

## 2. User Roles & Access Control

### 2.1 Public Visitors (Devotees)
- Zero-gate access to all public sections
- Read-only: announcements, events, gallery, donor ledger, yearly audits, committee contacts

### 2.2 Admin Users (Authorized Temple Committee Members)
- Access via the Admin button in the NavBar → passcode entry form
- Passcode matched case-insensitively against live `committee_roster` records from Supabase
- Fallback hardcoded check for the 4 original passcodes if Supabase is unreachable
- Default operator credentials:
  - `DEV1008` — Siddhanthi Sri Somshekara Sastry *(Chief Priest)*
  - `PRES1008` — Dr. K. Radhakrishna Murthy *(President / Chairman)*
  - `SECY567` — Sri S. V. Mallikarjuna Rao *(General Secretary)*
  - `TEMP123` — Smt. T. Uma Maheswari *(Treasurer)*
  - `SEVA789` — Sri B. Ranganath *(Welfare & Logistics Coordinator)*
- On successful login: operator name, role, and passcode key displayed in dashboard header; session stored in `localStorage` so page refresh does not force re-login
- On failed login: inline error message + security log entry written to `security_audit_logs`

---

## 3. Public-Facing Sections

### 3.1 NavBar (sticky)
- Spiritual chant ribbon at the top (Sanskrit + Telugu, maroon background)
- Temple name + logo, bilingual toggle (EN ↔ TE)
- Scrolling announcement ticker — text from `announcements` table, shown only when `is_active = TRUE`
- Admin button (opens panel modal); when logged in, shows Logout button instead
- Logout: clears session, shows success Toast in active language

### 3.2 Home / Hero — Slideshow Carousel
- Full-width, screen-fitting rectangular carousel (no rounded corners, no slide counter numbers)
- Exactly 5 image slots, sourced from `temple_carousel_slides` table
- Auto-advances every 5 seconds; manual left/right chevrons and dot indicators
- Each slide shows bilingual title caption
- Admins can replace slot images and titles from the Admin Panel

### 3.3 About Section
- Static temple history and description — no database dependency
- **Tap-to-Navigate Maps**: button that opens Google Maps / Apple Maps with the temple coordinates pre-loaded

### 3.4 Panchangam Section
- Displays Telugu Panchangam (auspicious timings: Tithi, Nakshatram, Rahu Kalam, Yamagandam, Gulika) computed client-side
- PDF download button: shows 'info' Toast — "Panchangam PDF export is coming soon. Use your browser's Print → Save as PDF."

### 3.5 Events Section
- Upcoming puja ceremonies and festivals from the `events` table
- Cards show bilingual title, date, time, location, description, and optional banner image
- Sorted chronologically
- **WhatsApp Share**: each event card has a share button that opens WhatsApp with a pre-filled bilingual invitation message (event title, date, time, venue, temple name)

### 3.6 Gallery Section
- Images and YouTube videos from `gallery_assets` table
- Images displayed as thumbnails; YouTube entries as embedded iframe players
- Hard cap: maximum 20 images (enforced in admin UI and documented in schema)
- No cap on video count

### 3.7 Welfare Ledger Section
- **Donor Ledger**: individual records from `donor_ledger` (2025–2026 only; older records swept by nightly cron into yearly totals)
- Anonymous donors show as "Anonymous Devotee / గుప్తదాత"
- **Yearly Audit Cards**: totals and milestone text from `yearly_audits` (2020–2026)
- **Lifetime Counter**: all-time total from `global_settings` key `lifetime_counter`
- **Current Year Counter**: derived from `yearly_audits` row matching the current calendar year
- "Request Records" button: 'info' Toast directing visitors to the temple office
- PDF download button: 'info' Toast — feature noted as coming soon

### 3.8 Footer / Committee Directory
- Lists all active committee members from `committee_roster`
- Shows name, role, phone (tap-to-call), and email (tap-to-email)

### 3.9 Quick Navigator (floating speed-dial)
- Fixed bottom-left; expands into section jump links on hover/tap
- Bilingual labels; top-offset accounts for sticky header height

### 3.10 Toast Notification System
- Slide-in notifications from top-right corner (z-index 99999, above all modals)
- Four types: `success` (emerald), `error` (dark red), `warning` (amber), `info` (blue)
- Structure per notification: gradient header strip + icon + label → message body → animated progress bar
- Auto-dismisses after 5 seconds; X button for manual dismiss
- Newest toast appears on top when stacked
- Module-level singleton: `showToast(message, type)` callable from any component — no prop drilling
- Used for every user-facing feedback event: saves, validations, login/logout, cleanup, errors

---

## 4. Admin Panel Modules

The panel opens as a full-screen modal (`z-index: 100`) with a passcode gate. On authentication, all sub-modules are rendered in a scrollable container.

### 4.1 Dashboard Header & Quick Stats
- Operator greeting card: avatar, name, role, session passcode key
- Three stat cards: Active Events count | Images (N / 20) | Force Refresh button
- Force Refresh: `bustAllCache()` then re-fetches all 8 Supabase tables in parallel → success Toast

### 4.2 Midnight Janitor Simulator
- Button with confirm dialog
- Calls `runMidnightJanitorSimulation()` Supabase RPC
- Re-fetches fresh donors, events, lifetime counter after the sweep
- Displays a plain-text summary of what was purged; success Toast or error Toast with F12 guidance

### 4.3 Temple Emblem & Carousel Manager (`AdminTempleEmblemForm`)
- Update main emblem URL (saves to `global_settings.primary_temple_emblem`)
- Edit all 5 carousel slide titles (EN + TE) and image URLs (saves to `temple_carousel_slides`)
- Images uploaded to Supabase Storage or pasted as direct URLs

### 4.4 Announcement Ticker Editor (`AdminAnnouncementForm`)
- Edit marquee ticker text in both EN and TE
- Saves to `announcements` table → success Toast

### 4.5 Donation Recorder (`AdminDonationForm`)
- Fields: donor name EN, donor name TE, amount (₹), date, purpose EN, purpose TE, Anonymous checkbox
- Validation: both name fields required unless Anonymous is ticked → warning Toast if missing
- On save: inserts into `donor_ledger`, increments current-year total → success Toast with formatted amount (e.g., "₹1,51,116 donation recorded in the public ledger successfully!")

### 4.6 Yearly Audit Editor (`AdminYearlyAuditForm`)
- Year selector spanning 2000–2050 (current year labelled "Active")
- Fields: audited total amount, milestone text EN, milestone text TE
- Saves to `yearly_audits` → success Toast with year name

### 4.7 Gallery Manager (`AdminGalleryManager`)
- Add a new item: title EN, title TE, and one of: upload image file (to Supabase Storage) or paste YouTube URL
- Validation toasts: both titles required | upload must finish before saving | image cap warning if 20 already reached
- Delete button per item with a confirm modal
- Success Toast names the media type: "Photo added to the gallery…" / "Video added to the gallery…"

### 4.8 Events Manager (`AdminEventsManager`)
- Add event: title EN, title TE, date, time slot, description EN, description TE, venue EN, venue TE, optional banner URL
- Validation: both titles required → warning Toast
- Existing events list with delete button (confirm dialog)
- Success Toast includes the event title

### 4.9 Committee Manager (`AdminCommitteeManager`)
- Add a new member with full profile fields and login passcode
- Edit existing members (any field, including passcode); minimum-length guard on passcode → warning Toast
- Profile image: upload to Supabase Storage or paste URL; image > 2 MB shows warning Toast before upload
- Delete any member except the currently logged-in admin → error Toast if self-delete attempted
- Personalized success Toasts (e.g., "Mallikarjuna Rao's details and login credentials updated successfully!")

### 4.10 Audit Logs Viewer (`AdminLogsViewer`)
- Read-only list from `security_audit_logs`
- Shows timestamp, action text, category badge (cleaning / security / edit / gallery)

---

## 5. Backend Behaviour

### 5.1 Data Loading (App Mount)
8 Supabase queries fire in parallel:
`global_settings` | `temple_carousel_slides` | `announcements` | `events` | `gallery_assets` | `donor_ledger` | `committee_roster` | `yearly_audits`

`admin_accounts` and `currentYearTotal` are derived from the already-fetched data — no extra queries.
`bustAllCache()` is called on every mount so stale localStorage-cached data never blocks a fresh fetch.

### 5.2 Caching
Short-lived localStorage cache per Supabase table to avoid duplicate reads within the same session. Busted on Force Refresh and on every app mount.

### 5.3 Midnight Janitor (Supabase cron)
- Runs daily at midnight (pg_cron schedule)
- Sweeps `donor_ledger` rows > 365 days old → totals consolidated into `yearly_audits`, rows deleted
- Sweeps `events` rows > 365 days old
- Clears `security_audit_logs` entries > 30 days old
- Writes a run-summary log entry
- See `database_janitor_cron.md` for full SQL implementation

### 5.4 Permissions
- RLS disabled on all 9 tables — PostgreSQL GRANTs give the `anon` role full DML access
- See `supabase_complete_setup.sql` Part C for exact GRANT statements

---

## 6. Non-Functional Requirements

| Requirement | Implementation |
|---|---|
| Bilingual | Every user-facing string in EN or TE, toggled from NavBar; default language is Telugu (TE) |
| Mobile-first | Tailwind responsive prefixes; `safe-area-inset` padding for iOS home bar; `overflow-x: clip` (not `hidden`) to preserve sticky headers |
| Scroll detection | Multi-source listener (window + document + documentElement + touchmove + interval fallback) for iOS/Android tablet compatibility |
| Image cap | Max 20 images in gallery — enforced in `AdminGalleryManager.tsx` before any Supabase write |
| No `alert()` | All feedback uses Toast system — zero `window.alert()` calls in the codebase |
| Session persistence | Admin login stored in `localStorage` so page refresh does not force re-login |
| Honest placeholders | PDF export and records-request buttons show informative 'info' Toasts rather than fake success messages |
| Scroll-to-top | Fixed bottom-right button, appears after 80 px scroll, smooth scroll on click |
